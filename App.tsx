import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { LibraryScreen } from "./src/screens/LibraryScreen";
import { PlayerScreen } from "./src/screens/PlayerScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { AppTab } from "./src/types/navigation";
import { TabBar } from "./src/components/TabBar";

const tabs: AppTab[] = ["library", "player", "settings"];

const titles: Record<AppTab, string> = {
  library: "Library",
  player: "Player",
  settings: "Settings"
};

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("library");

  const screen = useMemo(() => {
    switch (activeTab) {
      case "library":
        return <LibraryScreen />;
      case "player":
        return <PlayerScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.appShell}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Ebook Audio Reader</Text>
            <Text style={styles.title}>{titles[activeTab]}</Text>
          </View>

          <View style={styles.content}>{screen}</View>

          <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f4ed"
  },
  appShell: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10
  },
  header: {
    gap: 4,
    paddingBottom: 16
  },
  eyebrow: {
    color: "#6b6458",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0
  },
  title: {
    color: "#171512",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 0
  },
  content: {
    flex: 1
  }
});
