import Image from "next/image";

interface ChainIconProps {
  chainId: string;
  chainName: string;
  logo?: string;
  size?: "sm" | "md" | "lg";
}

const CHAIN_COLORS: Record<string, string> = {
  ethereum: "#627EEA",
  bsc: "#F0B90B",
  polygon: "#8247E5",
  arbitrum: "#28A0F0",
  tron: "#FF0013",
  kleverchain: "#AA33B5",
};

const CHAIN_INITIALS: Record<string, string> = {
  ethereum: "ETH",
  bsc: "BSC",
  polygon: "POLY",
  arbitrum: "ARB",
  tron: "TRX",
  kleverchain: "KLV",
};

export function ChainIcon({
  chainId,
  chainName,
  logo,
  size = "md",
}: ChainIconProps) {
  const sizeMap = {
    sm: { container: "w-5 h-5", text: "text-[8px]", image: 20 },
    md: { container: "w-6 h-6", text: "text-[10px]", image: 24 },
    lg: { container: "w-8 h-8", text: "text-xs", image: 32 },
  };

  const { container, text, image } = sizeMap[size];
  const bgColor = CHAIN_COLORS[chainId] || "var(--primary)";
  const initials = CHAIN_INITIALS[chainId] || chainName.slice(0, 3).toUpperCase();

  if (logo) {
    return (
      <div
        className={`${container} rounded-full overflow-hidden bg-[var(--muted)] flex items-center justify-center`}
      >
        <Image
          src={logo}
          alt={chainName}
          width={image}
          height={image}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${container} rounded-full flex items-center justify-center`}
      style={{ backgroundColor: bgColor }}
    >
      <span className={`${text} font-bold text-white`}>{initials}</span>
    </div>
  );
}
