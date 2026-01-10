/**
 * Format a bigint balance to a human-readable string
 */
export function formatBalance(
  balance: bigint,
  decimals: number,
  options?: {
    maxDecimals?: number;
    showSymbol?: boolean;
    symbol?: string;
  }
): string {
  const { maxDecimals = 2, showSymbol = false, symbol = "" } = options ?? {};

  if (balance === BigInt(0)) {
    return showSymbol ? `0 ${symbol}`.trim() : "0";
  }

  const divisor = BigInt(10 ** decimals);
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;

  // Format integer part with thousands separators
  const integerStr = integerPart.toLocaleString("en-US");

  // Format fractional part
  let fractionalStr = fractionalPart.toString().padStart(decimals, "0");
  fractionalStr = fractionalStr.slice(0, maxDecimals);

  // Remove trailing zeros
  fractionalStr = fractionalStr.replace(/0+$/, "");

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
