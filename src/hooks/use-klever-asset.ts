"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchKleverAsset } from "@/services/klever-api";
import type { KleverAssetData } from "@/types/bridge";

interface UseKleverAssetOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useKleverAsset(
  assetId: string,
  options: UseKleverAssetOptions = {}
) {
  const { enabled = true, refetchInterval = 60_000 } = options;

  return useQuery<KleverAssetData, Error>({
    queryKey: ["klever-asset", assetId],
    queryFn: () => fetchKleverAsset(assetId),
    enabled: enabled && !!assetId && assetId !== "XXXX",
    staleTime: 30_000,
    refetchInterval,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useKleverAssets(
  assetIds: string[],
  options: UseKleverAssetOptions = {}
) {
  const { enabled = true, refetchInterval = 60_000 } = options;

  const validAssetIds = assetIds.filter((id) => id && !id.includes("XXXX"));

  return useQuery<Map<string, KleverAssetData>, Error>({
    queryKey: ["klever-assets", validAssetIds],
    queryFn: async () => {
      const results = new Map<string, KleverAssetData>();

      await Promise.all(
        validAssetIds.map(async (assetId) => {
          try {
            const data = await fetchKleverAsset(assetId);
            results.set(assetId, data);
          } catch (error) {
            console.error(`Failed to fetch asset ${assetId}:`, error);
          }
        })
      );

      return results;
    },
    enabled: enabled && validAssetIds.length > 0,
    staleTime: 30_000,
    refetchInterval,
    retry: 3,
  });
}
