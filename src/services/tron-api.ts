/**
 * Tron API Service - Stub for future implementation
 *
 * This service will handle fetching balances from Tron blockchain
 * when Tron bridge support is enabled.
 */

export interface TronBalance {
  balance: bigint;
  decimals: number;
}

/**
 * Fetch TRC20 token balance from Tron network
 * @stub This is a placeholder for future Tron integration
 */
export async function fetchTronBalance(
  _tokenContract: string,
  _bridgeContract: string
): Promise<TronBalance> {
  // TODO: Implement TronWeb integration
  // Example implementation:
  //
  // const tronWeb = new TronWeb({
  //   fullHost: 'https://api.trongrid.io',
  // });
  //
  // const contract = await tronWeb.contract().at(tokenContract);
  // const balance = await contract.balanceOf(bridgeContract).call();
  // const decimals = await contract.decimals().call();
  //
  // return {
  //   balance: BigInt(balance.toString()),
  //   decimals: Number(decimals),
  // };

  console.warn("Tron balance fetching not yet implemented");

  return {
    balance: BigInt(0),
    decimals: 6,
  };
}

/**
 * Check if Tron API is reachable
 * @stub This is a placeholder for future Tron integration
 */
export async function checkTronApiHealth(): Promise<boolean> {
  // TODO: Implement health check for TronGrid API
  return false;
}
