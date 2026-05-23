export type TTSProviderId = "openai" | "google" | "elevenlabs";

export type ProviderSettings = {
  provider: TTSProviderId;
  apiKey: string;
  voice: string;
  model: string;
};

export type AppSettings = {
  tts: ProviderSettings;
  playbackSpeed: number;
};

export const defaultSettings: AppSettings = {
  tts: {
    provider: "openai",
    apiKey: "",
    voice: "alloy",
    model: "gpt-4o-mini-tts"
  },
  playbackSpeed: 1
};

export const providerLabels: Record<TTSProviderId, string> = {
  openai: "OpenAI",
  google: "Google",
  elevenlabs: "ElevenLabs"
};
