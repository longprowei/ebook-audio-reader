import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppTab } from "../types/navigation";

type Props = {
  tabs: AppTab[];
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
};

const labels: Record<AppTab, string> = {
  library: "Library",
  player: "Player",
  settings: "Settings"
};

export function TabBar({ tabs, activeTab, onChange }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            key={tab}
            onPress={() => onChange(tab)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {labels[tab]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#e8e1d4",
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    minHeight: 56,
    padding: 6
  },
  tab: {
    alignItems: "center",
    borderRadius: 7,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 8
  },
  activeTab: {
    backgroundColor: "#171512"
  },
  label: {
    color: "#615b51",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0
  },
  activeLabel: {
    color: "#fffaf1"
  }
});
