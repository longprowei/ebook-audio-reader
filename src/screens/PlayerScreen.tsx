import { Pressable, StyleSheet, Text, View } from "react-native";

import { Section } from "../components/Section";

export function PlayerScreen() {
  return (
    <View style={styles.container}>
      <Section
        title="Now Playing"
        description="The generated chapter audio will play from this screen."
      >
        <View style={styles.playerPanel}>
          <Text style={styles.bookTitle}>No chapter selected</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.controls}>
            <Pressable disabled style={styles.controlButton}>
              <Text style={styles.controlText}>-15s</Text>
            </Pressable>
            <Pressable disabled style={[styles.controlButton, styles.playButton]}>
              <Text style={[styles.controlText, styles.playText]}>Play</Text>
            </Pressable>
            <Pressable disabled style={styles.controlButton}>
              <Text style={styles.controlText}>+30s</Text>
            </Pressable>
          </View>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  playerPanel: {
    backgroundColor: "#fffaf1",
    borderColor: "#ddd3c2",
    borderRadius: 8,
    borderWidth: 1,
    gap: 18,
    padding: 18
  },
  bookTitle: {
    color: "#171512",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0
  },
  progressTrack: {
    backgroundColor: "#e0d7c9",
    borderRadius: 999,
    height: 8,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: "#2f7f6f",
    height: 8,
    width: "0%"
  },
  controls: {
    flexDirection: "row",
    gap: 10
  },
  controlButton: {
    alignItems: "center",
    backgroundColor: "#e3dbce",
    borderRadius: 7,
    flex: 1,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 10
  },
  playButton: {
    backgroundColor: "#171512"
  },
  controlText: {
    color: "#6b6458",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0
  },
  playText: {
    color: "#fffaf1"
  }
});
