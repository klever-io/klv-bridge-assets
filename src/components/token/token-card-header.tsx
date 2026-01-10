import Image from "next/image";

interface TokenCardHeaderProps {
  symbol: string;
  name: string;
  logo: string;
  tokenId?: string;
}

export function TokenCardHeader({ symbol, name, logo, tokenId }: TokenCardHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-full bg-[var(--muted)] flex items-center justify-center overflow-hidden ring-2 ring-[var(--border)]">
        {logo ? (
          <Image
            src={logo}
            alt={`${symbol} logo`}
            width={48}
            height={48}
            className="object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-[var(--primary)]" aria-hidden="true">
            {symbol.slice(0, 2)}
          </span>
        )}
      </div>
      <div>
        <h3
          id={tokenId ? `token-title-${tokenId}` : undefined}
          className="font-semibold text-lg text-[var(--foreground)]"
        >
          {symbol}
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">{name}</p>
      </div>
    </div>
  );
}
