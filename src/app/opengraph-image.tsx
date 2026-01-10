import { ImageResponse } from "next/og";

// NOTE: Currently using static /og-image.png instead
// This dynamic generator is kept for future use if needed
export const alt = "Klever Bridge Proof - Asset Transparency Dashboard";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Base URL for fetching images - use GitHub raw content as reliable fallback
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bridge-proof.klever.org";
const fallbackUrl = "https://raw.githubusercontent.com/klever-io/klv-bridge-assets/main/public";

async function fetchImage(path: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(`${baseUrl}${path}`);
    if (res.ok) return res.arrayBuffer();
  } catch {
    // Primary failed, try fallback
  }
  try {
    const res = await fetch(`${fallbackUrl}${path}`);
    if (res.ok) return res.arrayBuffer();
  } catch {
    // Both failed
  }
  return null;
}

export default async function Image() {
  // Fetch chain logos with fallback
  const [ethLogo, kleverLogo] = await Promise.all([
    fetchImage("/assets/chains/ethereum.png"),
    fetchImage("/assets/chains/klever.png"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #050507 0%, #0a0a0f 50%, #050507 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow effects */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(233,30,140,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Chain icons row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {/* Ethereum logo */}
          {ethLogo ? (
            <img
              src={`data:image/png;base64,${Buffer.from(ethLogo).toString("base64")}`}
              width={70}
              height={70}
              style={{ borderRadius: "50%" }}
            />
          ) : (
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #627EEA 0%, #3C3C3D 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                color: "white",
              }}
            >
              Ξ
            </div>
          )}

          {/* Arrow */}
          <div
            style={{
              fontSize: "32px",
              color: "#e91e8c",
            }}
          >
            →
          </div>

          {/* Lock icon */}
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #e91e8c 0%, #9333ea 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            🔒
          </div>

          {/* Arrow */}
          <div
            style={{
              fontSize: "32px",
              color: "#e91e8c",
            }}
          >
            →
          </div>

          {/* Klever logo */}
          {kleverLogo ? (
            <img
              src={`data:image/png;base64,${Buffer.from(kleverLogo).toString("base64")}`}
              width={70}
              height={70}
              style={{ borderRadius: "50%" }}
            />
          ) : (
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e91e8c 0%, #d946ef 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              K
            </div>
          )}
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #e91e8c, #d946ef, #9333ea)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "16px",
            letterSpacing: "-2px",
          }}
        >
          Bridge Proof
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "#a1a1aa",
            marginBottom: "40px",
          }}
        >
          Klever Blockchain Asset Transparency
        </div>

        {/* Status badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 32px",
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "100px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span
            style={{
              fontSize: "24px",
              color: "#22c55e",
              fontWeight: "600",
            }}
          >
            100% Backed & Verified
          </span>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: "18px",
            color: "#71717a",
          }}
        >
          bridge-proof.klever.org
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
