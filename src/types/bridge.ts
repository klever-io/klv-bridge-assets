// ============================================
// Chain Types
// ============================================

export type ChainType = "evm" | "tron" | "klever";

export interface ChainConfig {
  id: string;
  name: string;
  type: ChainType;
  evmChainId?: number;
  tronNetwork?: "mainnet" | "testnet";
  explorer: string;
  logo: string;
}

// ============================================
// Token Configuration Types (from JSON)
// ============================================

export interface KleverChainToken {
  baseTokenId: string;
}

export interface LiquidityToken {
  chainId: string;
  kdaId: string;
  description?: string;
}

export interface SourceChainConfig {
  chainId: string;
  chainName: string;
  evmChainId?: number;
  tronNetwork?: string;
  bridgeContract: string;
  tokenContract: string;
  decimals: number;
  enabled: boolean;
}

export interface BaseTokenConfig {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
  kleverChain: KleverChainToken;
  liquidityTokens: LiquidityToken[];
  sourceChains: SourceChainConfig[];
}

export interface BridgeAssetsConfig {
  version: string;
  lastUpdated: string;
  baseTokens: BaseTokenConfig[];
  chains: Record<string, ChainConfig>;
}

// ============================================
// Balance Data Types (Runtime)
// ============================================

export interface ChainBalance {
  chainId: string;
  chainName: string;
  logo?: string;
  balance: bigint;
  formattedBalance: string;
  decimals: number;
  percentage: number;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
}

export interface KleverAssetData {
  assetId: string;
  circulatingSupply: bigint;
  maxSupply: bigint;
  formattedCirculatingSupply: string;
  precision: number;
  holdersCount?: number;
  transactionsCount?: number;
}

export interface LiquidityBreakdown {
  chainId: string;
  kdaId: string;
  balance: bigint;
  formattedBalance: string;
  percentage: number;
  isLoading: boolean;
  isError: boolean;
}

export type BackingStatus =
  | "fully-backed"
  | "over-backed"
  | "under-backed"
  | "loading"
  | "error";

export interface TokenBalanceData {
  tokenId: string;
  symbol: string;
  name: string;
  logo: string;
  decimals: number;

  // KleverChain data
  baseTokenId: string; // Universal token ID (e.g., USDC-1LN4)
  kleverMinted: bigint;
  formattedKleverMinted: string;

  // Source chain locked totals
  totalLocked: bigint;
  formattedTotalLocked: string;

  // Per-chain breakdown
  sourceChainBalances: ChainBalance[];
  liquidityBreakdown: LiquidityBreakdown[];

  // Backing status
  backingRatio: number;
  backingStatus: BackingStatus;

  // Statistics
  holdersCount?: number;
  transactionsCount?: number;

  // Loading states
  isLoading: boolean;
  isError: boolean;
}

// ============================================
// API Response Types
// ============================================

export interface KleverAssetApiResponse {
  data: {
    asset: {
      assetId: string;
      name: string;
      ticker: string;
      precision: number;
      circulatingSupply: number;
      maxSupply: number;
      initialSupply: number;
      mintedValue: number;
      burnedValue: number;
    };
  };
  error: string;
  code: string;
}

// ============================================
// UI State Types
// ============================================

export interface TokenCardExpandedState {
  [tokenId: string]: boolean;
}

export interface FilterState {
  searchQuery: string;
  chainFilter: string | null;
  backingStatusFilter: BackingStatus | null;
  sortBy: "symbol" | "totalLocked" | "backingRatio";
  sortOrder: "asc" | "desc";
}
