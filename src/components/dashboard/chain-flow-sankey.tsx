"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatUsdValue } from "@/services/coingecko-api";
import type { TokenBalanceData } from "@/types/bridge";
import type { TokenPrices } from "@/services/coingecko-api";
import bridgeAssetsConfig from "@/config/bridge-assets.json";
import type { BridgeAssetsConfig } from "@/types/bridge";

const config = bridgeAssetsConfig as BridgeAssetsConfig;

interface ChainFlowSankeyProps {
  tokens: TokenBalanceData[];
  prices: TokenPrices;
  isLoading: boolean;
}

interface ChainData {
  id: string;
  name: string;
  logo: string;
  color: string;
  totalValue: number;
  percentage: number;
  tokens: TokenData[];
}

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  value: number;
  percentage: number;
  color: string;
}

const CHAIN_COLORS: Record<string, string> = {
  ethereum: "#627EEA",
  bsc: "#F3BA2F",
  polygon: "#8247E5",
  arbitrum: "#28A0F0",
  tron: "#FF0013",
  kleverchain: "#e91e8c",
};

const TOKEN_COLORS: Record<string, string> = {
  usdt: "#26A17B",
  usdc: "#2775CA",
  wbtc: "#F7931A",
  weth: "#627EEA",
};

// Generate smooth curved path with better horizontal flow (like Wormhole)
function generateCurvedPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  curvature: number = 0.6
): string {
  const dx = x2 - x1;

  // Control points offset horizontally for smooth horizontal ease-in/ease-out
  const cx1 = x1 + dx * curvature;
  const cx2 = x2 - dx * curvature;

  // Keep Y values same as endpoints for smoother horizontal flow
  return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
}

export function ChainFlowSankey({ tokens, prices, isLoading }: ChainFlowSankeyProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 600, height: 400 });
  const [selectedChains, setSelectedChains] = useState<Set<string>>(new Set(["ethereum"]));
  const [hoveredChain, setHoveredChain] = useState<string | null>(null);

  // Resize observer for SVG container
  useEffect(() => {
    if (!svgContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSvgDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(svgContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate chain and token data
  const { chainData, tokenTotals } = useMemo(() => {
    const chainMap = new Map<string, { totalValue: number; tokens: Map<string, number> }>();
    const tokenTotals = new Map<string, { value: number; symbol: string; name: string; logo: string }>();

    for (const token of tokens) {
      const tokenPrice =
        prices[token.tokenId]?.usd ?? (token.tokenId === "usdt" || token.tokenId === "usdc" ? 1 : 0);

      for (const chain of token.sourceChainBalances) {
        const chainAmount = Number(chain.balance) / 10 ** chain.decimals;
        const chainUsd = chainAmount * tokenPrice;

        if (!chainMap.has(chain.chainId)) {
          chainMap.set(chain.chainId, { totalValue: 0, tokens: new Map() });
        }

        const chainEntry = chainMap.get(chain.chainId)!;
        chainEntry.totalValue += chainUsd;
        chainEntry.tokens.set(token.tokenId, (chainEntry.tokens.get(token.tokenId) ?? 0) + chainUsd);

        // Track token totals
        if (!tokenTotals.has(token.tokenId)) {
          tokenTotals.set(token.tokenId, {
            value: 0,
            symbol: token.symbol,
            name: token.name,
            logo: token.logo,
          });
        }
        const tokenEntry = tokenTotals.get(token.tokenId)!;
        tokenEntry.value += chainUsd;
      }
    }

    const totalValue = Array.from(chainMap.values()).reduce((a, b) => a + b.totalValue, 0);

    const chainData: ChainData[] = Array.from(chainMap.entries())
      .filter(([, data]) => data.totalValue > 0)
      .sort((a, b) => b[1].totalValue - a[1].totalValue)
      .map(([chainId, data]) => {
        const chainConfig = config.chains[chainId];
        const tokenData: TokenData[] = Array.from(data.tokens.entries())
          .filter(([, value]) => value > 0)
          .sort((a, b) => b[1] - a[1])
          .map(([tokenId, value]) => {
            const tokenConfig = tokens.find((t) => t.tokenId === tokenId);
            return {
              id: tokenId,
              symbol: tokenConfig?.symbol ?? tokenId.toUpperCase(),
              name: tokenConfig?.name ?? tokenId,
              logo: tokenConfig?.logo ?? `/assets/${tokenId}.png`,
              value,
              percentage: data.totalValue > 0 ? (value / data.totalValue) * 100 : 0,
              color: TOKEN_COLORS[tokenId] ?? "#6b7280",
            };
          });

        return {
          id: chainId,
          name: chainConfig?.name ?? chainId,
          logo: chainConfig?.logo ?? `/assets/chains/${chainId}.png`,
          color: CHAIN_COLORS[chainId] ?? "#6b7280",
          totalValue: data.totalValue,
          percentage: totalValue > 0 ? (data.totalValue / totalValue) * 100 : 0,
          tokens: tokenData,
        };
      });

    return { chainData, tokenTotals };
  }, [tokens, prices]);

  // Build flow lines data
  const flowData = useMemo(() => {
    if (chainData.length === 0) return null;

    const padding = { top: 20, right: 10, bottom: 30, left: 10 };
    const width = svgDimensions.width - padding.left - padding.right;

    // Get all unique tokens
    const allTokenIds = new Set<string>();
    for (const chain of chainData) {
      for (const token of chain.tokens) {
        allTokenIds.add(token.id);
      }
    }
    const tokenIds = Array.from(allTokenIds);

    // Calculate positions for source chains (left side)
    // Align with chain list items - first item starts after header ("SOURCE" label + margin)
    const chainItemHeight = 52; // Approximate height of each chain button
    const chainStartY = 70; // Start position matching first chain card center
    const chainPositions = chainData.map((chain, i) => ({
      ...chain,
      y: chainStartY + (i * chainItemHeight),
      x: padding.left,
    }));

    // Calculate positions for target tokens (right side)
    // Align with token list items on the right column - items have more vertical spacing
    const tokenItemHeight = 70; // Height of each token item including gap
    const tokenStartY = 70; // Start position matching first token card center
    const tokenPositions = tokenIds.map((tokenId, i) => {
      const tokenInfo = tokenTotals.get(tokenId);
      return {
        id: tokenId,
        symbol: tokenInfo?.symbol ?? tokenId.toUpperCase(),
        logo: tokenInfo?.logo ?? `/assets/${tokenId}.png`,
        color: TOKEN_COLORS[tokenId] ?? "#6b7280",
        y: tokenStartY + (i * tokenItemHeight),
        x: padding.left + width,
      };
    });

    // Generate flow lines - multiple thin lines per flow for the elegant effect
    // All lines from a chain start bundled together, then fan out to targets
    const flows: {
      chainId: string;
      tokenId: string;
      chainColor: string;
      tokenColor: string;
      paths: string[];
      value: number;
    }[] = [];

    for (const chain of chainPositions) {
      // Calculate total lines for this chain to determine bundle positions
      const totalLines = chain.tokens.reduce((sum, t) => {
        return sum + Math.max(3, Math.min(10, Math.ceil(t.percentage / 8)));
      }, 0);

      // Source bundle spread - tighter bundle for cleaner look
      const sourceSpread = Math.min(60, totalLines * 2);
      let currentSourceLine = 0;

      for (const token of chain.tokens) {
        const targetToken = tokenPositions.find((t) => t.id === token.id);
        if (!targetToken) continue;

        // Fewer lines per flow for cleaner bundles
        const lineCount = Math.max(3, Math.min(10, Math.ceil(token.percentage / 8)));
        // Wider target spread for clarity at destination
        const targetSpread = Math.min(40, Math.max(15, lineCount * 3));
        const paths: string[] = [];

        for (let i = 0; i < lineCount; i++) {
          // Source: lines are bundled together at the chain Y position
          const sourceLineRatio = (currentSourceLine + i) / Math.max(1, totalLines - 1);
          const sourceOffset = (sourceLineRatio - 0.5) * sourceSpread;

          // Target: lines spread out around the token position
          const targetLineRatio = lineCount > 1 ? i / (lineCount - 1) : 0.5;
          const targetOffset = (targetLineRatio - 0.5) * targetSpread;

          const path = generateCurvedPath(
            padding.left + 5, // Start at edge of source bar
            chain.y + sourceOffset,
            padding.left + width, // End at right edge (connects to token list)
            targetToken.y + targetOffset,
            0.6 // Smoother horizontal curve
          );
          paths.push(path);
        }

        currentSourceLine += lineCount;

        flows.push({
          chainId: chain.id,
          tokenId: token.id,
          chainColor: chain.color,
          tokenColor: token.color,
          paths,
          value: token.value,
        });
      }
    }

    return { chainPositions, tokenPositions, flows, padding, tokenIds };
  }, [chainData, tokenTotals, svgDimensions]);

  // Toggle chain selection
  const toggleChain = (chainId: string) => {
    setSelectedChains((prev) => {
      const next = new Set(prev);
      if (next.has(chainId)) {
        if (next.size > 1) {
          next.delete(chainId);
        }
      } else {
        next.add(chainId);
      }
      return next;
    });
  };

  if (isLoading || chainData.length === 0 || !flowData) {
    return null;
  }

  // Calculate selected totals for right side
  const selectedTokenTotals = new Map<string, number>();
  for (const chain of chainData) {
    if (selectedChains.has(chain.id)) {
      for (const token of chain.tokens) {
        selectedTokenTotals.set(token.id, (selectedTokenTotals.get(token.id) ?? 0) + token.value);
      }
    }
  }
  const selectedTotal = Array.from(selectedTokenTotals.values()).reduce((a, b) => a + b, 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-glass rounded-2xl p-6 md:p-8 mt-8 mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-(--foreground)">Cross-Chain Flow</h2>
          <p className="text-sm text-(--muted-foreground)">
            Click chains to select/deselect
          </p>
        </div>
      </div>

      {/* Main Layout: Source | Flow | Target */}
      <div className="flex gap-0 min-h-[380px]">
        {/* Left Column - Source Chains */}
        <div className="w-[220px] flex-shrink-0 border-r border-(--border) pr-4">
          <p className="text-xs font-medium text-(--muted-foreground) mb-4 uppercase tracking-wider">Source</p>
          <div className="space-y-3">
            {chainData.map((chain, index) => {
              const isSelected = selectedChains.has(chain.id);
              const isHovered = hoveredChain === chain.id;

              return (
                <motion.button
                  key={chain.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleChain(chain.id)}
                  onMouseEnter={() => setHoveredChain(chain.id)}
                  onMouseLeave={() => setHoveredChain(null)}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-xl transition-all overflow-hidden ${
                    isSelected
                      ? "bg-(--primary)/10 border-2 border-(--primary)/40 shadow-lg shadow-(--primary)/10"
                      : "bg-(--muted)/30 border-2 border-transparent hover:bg-(--muted)/50 hover:border-(--border)"
                  } ${isHovered ? "scale-[1.02]" : ""}`}
                  style={{
                    opacity: !isSelected && !isHovered && selectedChains.size > 0 ? 0.5 : 1,
                  }}
                >
                  {/* Chain Icon */}
                  <div className="relative flex-shrink-0">
                    <Image
                      src={chain.logo}
                      alt={chain.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    {isSelected && (
                      <div
                        className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 rounded-full border-2 border-(--background)"
                        style={{ backgroundColor: chain.color }}
                      />
                    )}
                  </div>

                  {/* Chain Name */}
                  <div className="flex-1 min-w-0 text-left">
                    <span className="block text-sm font-semibold text-(--foreground) truncate">
                      {chain.name}
                    </span>
                    <span
                      className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold tabular-nums mt-0.5"
                      style={{
                        backgroundColor: `${chain.color}30`,
                        color: chain.color,
                      }}
                    >
                      {chain.percentage.toFixed(1)}%
                    </span>
                  </div>

                  {/* Value */}
                  <span className="flex-shrink-0 text-sm font-bold text-(--foreground) tabular-nums">
                    {formatUsdValue(chain.totalValue)}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Center - Flow Diagram */}
        <div ref={svgContainerRef} className="flex-1 min-w-[250px]">
          <svg width="100%" height={svgDimensions.height} viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`} preserveAspectRatio="none">
            <defs>
              {/* Gradients for each chain-token combination */}
              {flowData.flows.map((flow) => (
                <linearGradient
                  key={`gradient-${flow.chainId}-${flow.tokenId}`}
                  id={`gradient-${flow.chainId}-${flow.tokenId}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor={flow.chainColor} />
                  <stop offset="100%" stopColor={flow.tokenColor} />
                </linearGradient>
              ))}
            </defs>

            {/* Flow lines */}
            {flowData.flows.map((flow) => {
              const isSelected = selectedChains.has(flow.chainId);
              const isHovered = hoveredChain === flow.chainId;

              return flow.paths.map((path, pathIndex) => (
                <motion.path
                  key={`flow-${flow.chainId}-${flow.tokenId}-${pathIndex}`}
                  d={path}
                  fill="none"
                  stroke={`url(#gradient-${flow.chainId}-${flow.tokenId})`}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: isSelected || isHovered ? 0.65 : 0.12,
                  }}
                  transition={{
                    pathLength: { duration: 0.8, delay: pathIndex * 0.02 },
                    opacity: { duration: 0.3 },
                  }}
                  onMouseEnter={() => setHoveredChain(flow.chainId)}
                  onMouseLeave={() => setHoveredChain(null)}
                  onClick={() => toggleChain(flow.chainId)}
                  className="cursor-pointer"
                />
              ));
            })}

            {/* Source nodes (small bars on left) */}
            {flowData.chainPositions.map((chain, index) => {
              const isSelected = selectedChains.has(chain.id);
              const isHovered = hoveredChain === chain.id;
              // Calculate bar height based on total lines from this chain
              const totalLines = chain.tokens.reduce((sum, t) => {
                return sum + Math.max(3, Math.min(10, Math.ceil(t.percentage / 8)));
              }, 0);
              const barHeight = Math.min(60, totalLines * 2);

              return (
                <motion.rect
                  key={`source-${chain.id}`}
                  x={flowData.padding.left}
                  y={chain.y - barHeight / 2}
                  width={5}
                  height={barHeight}
                  fill={chain.color}
                  rx={2.5}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{
                    scaleY: 1,
                    opacity: isSelected || isHovered ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  style={{ transformOrigin: `${flowData.padding.left + 2.5}px ${chain.y}px` }}
                  onMouseEnter={() => setHoveredChain(chain.id)}
                  onMouseLeave={() => setHoveredChain(null)}
                  onClick={() => toggleChain(chain.id)}
                  className="cursor-pointer"
                />
              );
            })}

            {/* Target bars removed - flow lines connect directly to the edge where token list items are */}
          </svg>
        </div>

        {/* Right Column - Target (Tokens on KleverChain) */}
        <div className="w-[220px] flex-shrink-0 border-l border-(--border) pl-4">
          <p className="text-xs font-medium text-(--muted-foreground) mb-4 uppercase tracking-wider">Target</p>
          <div className="space-y-2">
            {flowData.tokenIds.map((tokenId, index) => {
              const tokenInfo = tokenTotals.get(tokenId);
              const tokenColor = TOKEN_COLORS[tokenId] ?? "#6b7280";
              const selectedValue = selectedTokenTotals.get(tokenId) ?? 0;
              const percentage = selectedTotal > 0 ? (selectedValue / selectedTotal) * 100 : 0;
              const hasSelectedFlow = chainData.some(
                (c) => selectedChains.has(c.id) && c.tokens.some((t) => t.id === tokenId)
              );

              return (
                <motion.div
                  key={tokenId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`flex items-center justify-between p-2.5 rounded-lg transition-opacity ${
                    hasSelectedFlow ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={tokenInfo?.logo ?? `/assets/${tokenId}.png`}
                      alt={tokenInfo?.symbol ?? tokenId}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium text-(--foreground)">
                      {tokenInfo?.symbol ?? tokenId.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-sm text-(--foreground) font-medium tabular-nums">
                      {formatUsdValue(selectedValue)}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold tabular-nums"
                      style={{
                        backgroundColor: `${tokenColor}25`,
                        color: tokenColor,
                      }}
                    >
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* KleverChain Destination Card */}
          <div className="mt-6 pt-4 border-t border-(--border)">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 p-2.5 bg-(--primary)/10 border-2 border-(--primary)/30 rounded-xl shadow-lg shadow-(--primary)/10 overflow-hidden"
            >
              {/* KleverChain Icon */}
              <div className="flex-shrink-0 p-1 bg-(--background) rounded-full">
                <Image
                  src="/assets/chains/klever.png"
                  alt="KleverChain"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              </div>

              {/* Name */}
              <p className="flex-1 min-w-0 text-sm font-bold text-(--primary) truncate">Klever</p>

              {/* Total Value */}
              <p className="flex-shrink-0 text-sm font-bold text-(--primary) tabular-nums">
                {formatUsdValue(selectedTotal)}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="flex justify-center mt-6 pt-4 border-t border-(--border)">
        <div className="flex items-center gap-6 text-xs text-(--muted-foreground)">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-(--primary)/50 ring-2 ring-(--primary)/30" />
            <span>Selected chain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              <div className="w-6 h-0.5 bg-gradient-to-r from-[#627EEA] to-[#26A17B] rounded opacity-70" />
              <div className="w-6 h-0.5 bg-gradient-to-r from-[#627EEA] to-[#26A17B] rounded opacity-70" />
            </div>
            <span>Asset flow</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
