"use client";

import { TokenList } from "@/components/token/token-list";
import { TVLHero } from "./tvl-hero";
import { ChainFlowSankey } from "./chain-flow-sankey";
import { useAllTokenBalances } from "@/hooks/use-all-token-balances";
import { useTokenPrices } from "@/hooks/use-token-prices";

export function DashboardContent() {
  const { tokens, isLoading } = useAllTokenBalances({ enabled: true });
  const { prices, isLoading: isPricesLoading } = useTokenPrices();

  const showLoading = isLoading && tokens.length === 0;

  return (
    <>
      <TVLHero
        tokens={tokens}
        prices={prices}
        isLoading={showLoading}
        isPricesLoading={isPricesLoading}
      />
      <TokenList prices={prices} />
      <ChainFlowSankey
        tokens={tokens}
        prices={prices}
        isLoading={showLoading || isPricesLoading}
      />
    </>
  );
}
