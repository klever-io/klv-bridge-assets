import { z } from "zod";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const REQUEST_TIMEOUT = 10_000;

// CoinGecko IDs for supported tokens
export const COINGECKO_IDS: Record<string, string> = {
  usdt: "tether",
  usdc: "usd-coin",
  wbtc: "bitcoin",
  weth: "ethereum",
};

// Response schema for simple/price endpoint
const PriceResponseSchema = z.record(
  z.string(),
  z.object({
    usd: z.number(),
    usd_24h_change: z.number().optional(),
  })
);

export type TokenPrices = Record<string, { usd: number; change24h?: number }>;

/**
 * Fetch current USD prices for multiple tokens from CoinGecko
 * Free tier: 10-30 calls/minute, no API key required
 */
export async function fetchTokenPrices(
  tokenIds: string[]
): Promise<TokenPrices> {
  // Map our token IDs to CoinGecko IDs
  const geckoIds = tokenIds
    .map((id) => COINGECKO_IDS[id])
    .filter(Boolean);

  if (geckoIds.length === 0) {
    return {};
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const url = new URL(`${COINGECKO_API_URL}/simple/price`);
    url.searchParams.set("ids", geckoIds.join(","));
    url.searchParams.set("vs_currencies", "usd");
    url.searchParams.set("include_24hr_change", "true");

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // Disable Next.js cache, TanStack Query handles caching
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    const parsed = PriceResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new Error("Invalid CoinGecko response format");
    }

    // Map back to our token IDs
    const prices: TokenPrices = {};
    for (const [tokenId, geckoId] of Object.entries(COINGECKO_IDS)) {
      if (tokenIds.includes(tokenId) && parsed.data[geckoId]) {
        prices[tokenId] = {
          usd: parsed.data[geckoId].usd,
          change24h: parsed.data[geckoId].usd_24h_change,
        };
      }
    }

    // Stablecoins fallback to $1 if not in response
    for (const tokenId of tokenIds) {
      if (!prices[tokenId]) {
        if (tokenId === "usdt" || tokenId === "usdc") {
          prices[tokenId] = { usd: 1 };
        }
      }
    }

    return prices;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("CoinGecko request timeout");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Format USD value for display
 */
export function formatUsdValue(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}
