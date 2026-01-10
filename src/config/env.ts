import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_KLEVER_API_URL: z
    .string()
    .url()
    .startsWith("https://", "Must use HTTPS")
    .default("https://api.mainnet.klever.org"),
});

function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_KLEVER_API_URL: process.env.NEXT_PUBLIC_KLEVER_API_URL,
  });

  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten());
    // Don't throw in production, use defaults
    return {
      NEXT_PUBLIC_KLEVER_API_URL: "https://api.mainnet.klever.org",
    };
  }

  return parsed.data;
}

export const env = validateEnv();
