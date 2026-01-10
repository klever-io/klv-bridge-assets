/**
 * Format a bigint balance to a human-readable string
 * For transparency dashboard, shows appropriate precision per token type
 */
export function formatBalance(
  balance: bigint,
  decimals: number,
  options?: {
    maxDecimals?: number;
    minDecimals?: number;
    showSymbol?: boolean;
    symbol?: string;
  }
): string {
  // Default precision based on token decimals:
  // - Stablecoins (6 decimals): show 2-4
  // - wBTC (8 decimals): show 6-8
  // - wETH (18 decimals): show 4-6
  const defaultMax = decimals <= 6 ? 4 : decimals <= 8 ? 8 : 6;
  const defaultMin = decimals <= 6 ? 2 : decimals <= 8 ? 4 : 4;

  const {
    maxDecimals = defaultMax,
    minDecimals = defaultMin,
    showSymbol = false,
    symbol = ""
  } = options ?? {};

  if (balance === BigInt(0)) {
    const zeros = "0".repeat(minDecimals);
    const zeroStr = minDecimals > 0 ? `0.${zeros}` : "0";
    return showSymbol ? `${zeroStr} ${symbol}`.trim() : zeroStr;
  }

  const divisor = BigInt(10 ** decimals);
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;

  // Format integer part with thousands separators
  const integerStr = integerPart.toLocaleString("en-US");

  // Format fractional part
  let fractionalStr = fractionalPart.toString().padStart(decimals, "0");
  fractionalStr = fractionalStr.slice(0, maxDecimals);

  // Remove trailing zeros but keep minimum decimals
  fractionalStr = fractionalStr.replace(/0+$/, "");
  if (fractionalStr.length < minDecimals) {
    fractionalStr = fractionalStr.padEnd(minDecimals, "0");
  }

  const formatted =
    fractionalStr.length > 0
      ? `${integerStr}.${fractionalStr}`
      : integerStr;

  return showSymbol ? `${formatted} ${symbol}`.trim() : formatted;
}

/**
 * Normalize balance from one decimal precision to another
 */
export function normalizeDecimals(
  balance: bigint,
  fromDecimals: number,
  toDecimals: number
): bigint {
  if (fromDecimals === toDecimals) {
    return balance;
  }

  if (fromDecimals > toDecimals) {
    return balance / BigInt(10 ** (fromDecimals - toDecimals));
  }

  return balance * BigInt(10 ** (toDecimals - fromDecimals));
}
