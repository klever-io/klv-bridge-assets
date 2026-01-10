import { z } from "zod";
import type { KleverAssetData } from "@/types/bridge";
import { formatBalance } from "@/utils/format";
import { env } from "@/config/env";

const KLEVER_API_URL = env.NEXT_PUBLIC_KLEVER_API_URL;
const REQUEST_TIMEOUT = 10_000; // 10 seconds

// Zod schema for API response validation
const KleverAssetSchema = z.object({
  data: z.object({
    asset: z.object({
      assetId: z.string(),
      name: z.string().optional(),
      ticker: z.string().optional(),
      precision: z.number().int().min(0).max(18),
      circulatingSupply: z.number().nonnegative(),
      maxSupply: z.number().nonnegative(),
      initialSupply: z.number().optional(),
      mintedValue: z.number().optional(),
      burnedValue: z.number().optional(),
    }),
  }),
  error: z.string(),
  code: z.string(),
});

// Validate asset ID format (alphanumeric with hyphens)
const ASSET_ID_REGEX = /^[A-Z0-9]+-[A-Z0-9]+$/;

function validateAssetId(assetId: string): void {
  if (!assetId || typeof assetId !== "string") {
    throw new Error("Asset ID is required");
  }
  if (!ASSET_ID_REGEX.test(assetId)) {
    throw new Error(`Invalid asset ID format: ${assetId}`);
  }
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = REQUEST_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch asset data from KleverChain API
 */
export async function fetchKleverAsset(
  assetId: string,
  includeStats = true
): Promise<KleverAssetData> {
  // Validate input
  validateAssetId(assetId);

  const response = await fetchWithTimeout(
    `${KLEVER_API_URL}/v1.0/assets/${assetId}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // Disable Next.js cache, TanStack Query handles caching
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch asset ${assetId}: ${response.status} ${response.statusText}`
    );
  }

  const rawData = await response.json();

  // Validate response structure
  const parseResult = KleverAssetSchema.safeParse(rawData);

  if (!parseResult.success) {
    console.error("API response validation failed:", parseResult.error);
    throw new Error(`Invalid API response for asset ${assetId}`);
  }

  const data = parseResult.data;

  if (data.error && data.error !== "") {
    throw new Error(`API error: ${data.error.slice(0, 100)}`);
  }

  const asset = data.data.asset;
  const precision = asset.precision;
  const circulatingSupply = BigInt(Math.floor(asset.circulatingSupply));
  const maxSupply = BigInt(Math.floor(asset.maxSupply));

  // Fetch stats in parallel if requested
  let holdersCount: number | undefined;
  let transactionsCount: number | undefined;

  if (includeStats) {
    const stats = await fetchAssetStats(assetId);
    holdersCount = stats.holdersCount;
    transactionsCount = stats.transactionsCount;
  }

  return {
    assetId: asset.assetId,
    circulatingSupply,
    maxSupply,
    formattedCirculatingSupply: formatBalance(circulatingSupply, precision),
    precision,
    holdersCount,
    transactionsCount,
  };
}

/**
 * Fetch holders count for an asset
 */
export async function fetchAssetHoldersCount(assetId: string): Promise<number> {
  validateAssetId(assetId);

  try {
    const response = await fetchWithTimeout(
      `${KLEVER_API_URL}/v1.0/assets/holders/${assetId}?limit=0`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch holders for ${assetId}: ${response.status}`);
      return 0;
    }

    const data = await response.json();
    return data.pagination?.totalRecords ?? 0;
  } catch (error) {
    console.error(`Error fetching holders count for ${assetId}:`, error);
    return 0;
  }
}

/**
 * Fetch transactions count for an asset
 */
export async function fetchAssetTransactionsCount(assetId: string): Promise<number> {
  validateAssetId(assetId);

  try {
    const response = await fetchWithTimeout(
      `${KLEVER_API_URL}/v1.0/transaction/list?asset=${assetId}&limit=0`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch transactions for ${assetId}: ${response.status}`);
      return 0;
    }

    const data = await response.json();
    return data.pagination?.totalRecords ?? 0;
  } catch (error) {
    console.error(`Error fetching transactions count for ${assetId}:`, error);
    return 0;
  }
}

/**
 * Fetch asset stats (holders and transactions count)
 */
export async function fetchAssetStats(assetId: string): Promise<{
  holdersCount: number;
  transactionsCount: number;
}> {
  const [holdersCount, transactionsCount] = await Promise.all([
    fetchAssetHoldersCount(assetId),
    fetchAssetTransactionsCount(assetId),
  ]);

  return { holdersCount, transactionsCount };
}

