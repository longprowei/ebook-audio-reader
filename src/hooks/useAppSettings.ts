import { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { AppSettings, defaultSettings } from "../types/settings";

const SETTINGS_KEY = "ebook-audio-reader.settings.v1";

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const raw = await SecureStore.getItemAsync(SETTINGS_KEY);

        if (!isMounted) {
          return;
        }

        if (raw) {
          setSettings({ ...defaultSettings, ...JSON.parse(raw) });
        }
      } catch {
        if (isMounted) {
          setError("Settings could not be loaded.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveSettings = useCallback(async (nextSettings: AppSettings) => {
    setSettings(nextSettings);
    setError(null);

    try {
      await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(nextSettings));
    } catch {
      setError("Settings could not be saved.");
    }
  }, []);

  return {
    error,
    isLoading,
    saveSettings,
    settings
  };
}
