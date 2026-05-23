import { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { Section } from "../components/Section";
import { SegmentedControl } from "../components/SegmentedControl";
import { useAppSettings } from "../hooks/useAppSettings";
import {
  AppSettings,
  providerLabels,
  TTSProviderId
} from "../types/settings";

const providerOptions = Object.entries(providerLabels).map(([value, label]) => ({
  label,
  value: value as TTSProviderId
}));

const speedOptions = [0.85, 1, 1.15, 1.3].map((speed) => ({
  label: `${speed}x`,
  value: String(speed)
}));

export function SettingsScreen() {
  const { error, isLoading, saveSettings, settings } = useAppSettings();

  const speedValue = useMemo(
    () => String(settings.playbackSpeed),
    [settings.playbackSpeed]
  );

  function updateSettings(nextSettings: AppSettings) {
    saveSettings(nextSettings);
  }

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#171512" />
        <Text style={styles.loadingText}>Loading settings</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Section
        title="Audio Service"
        description="Choose the provider the app will use when Phase 4 adds generation."
      >
        <SegmentedControl
          value={settings.tts.provider}
          options={providerOptions}
          onChange={(provider) =>
            updateSettings({
              ...settings,
              tts: {
                ...settings.tts,
                provider
              }
            })
          }
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>API Key</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Paste your personal API key"
            placeholderTextColor="#9a9182"
            secureTextEntry
            style={styles.input}
            value={settings.tts.apiKey}
            onChangeText={(apiKey) =>
              updateSettings({
                ...settings,
                tts: {
                  ...settings.tts,
                  apiKey
                }
              })
            }
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowField}>
            <Text style={styles.label}>Model</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              value={settings.tts.model}
              onChangeText={(model) =>
                updateSettings({
                  ...settings,
                  tts: {
                    ...settings.tts,
                    model
                  }
                })
              }
            />
          </View>
          <View style={styles.rowField}>
            <Text style={styles.label}>Voice</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              value={settings.tts.voice}
              onChangeText={(voice) =>
                updateSettings({
                  ...settings,
                  tts: {
                    ...settings.tts,
                    voice
                  }
                })
              }
            />
          </View>
        </View>
      </Section>

      <Section title="Playback">
        <SegmentedControl
          value={speedValue}
          options={speedOptions}
          onChange={(nextSpeed) =>
            updateSettings({
              ...settings,
              playbackSpeed: Number(nextSpeed)
            })
          }
        />
      </Section>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={styles.resetButton}
        onPress={() =>
          updateSettings({
            tts: {
              provider: "openai",
              apiKey: "",
              voice: "alloy",
              model: "gpt-4o-mini-tts"
            },
            playbackSpeed: 1
          })
        }
      >
        <Text style={styles.resetText}>Reset settings</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8
  },
  loading: {
    alignItems: "center",
    flex: 1,
    gap: 10,
    justifyContent: "center"
  },
  loadingText: {
    color: "#665f55",
    fontSize: 14
  },
  fieldGroup: {
    gap: 7
  },
  label: {
    color: "#4d473e",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0
  },
  input: {
    backgroundColor: "#fffaf1",
    borderColor: "#ddd3c2",
    borderRadius: 7,
    borderWidth: 1,
    color: "#171512",
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 12
  },
  row: {
    flexDirection: "row",
    gap: 10
  },
  rowField: {
    flex: 1,
    gap: 7
  },
  error: {
    color: "#9a2f2f",
    fontSize: 14,
    lineHeight: 19
  },
  resetButton: {
    alignItems: "center",
    borderColor: "#c8bca9",
    borderRadius: 7,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: "center",
    marginTop: 4
  },
  resetText: {
    color: "#4d473e",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0
  }
});
