import { Pressable, StyleSheet, Text, View } from "react-native";

import { Section } from "../components/Section";

export function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Section
        title="Books"
        description="Imported TXT and EPUB books will appear here."
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No books yet</Text>
          <Text style={styles.emptyText}>
            Phase 2 will add file import, multilingual text cleanup, and
            chapter detection.
          </Text>
          <Pressable disabled style={styles.disabledButton}>
            <Text style={styles.disabledButtonText}>Import coming next</Text>
          </Pressable>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyState: {
    backgroundColor: "#fffaf1",
    borderColor: "#ddd3c2",
    borderRadius: 8,
    borderWidth: 1,
    gap: 9,
    padding: 18
  },
  emptyTitle: {
    color: "#171512",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0
  },
  emptyText: {
    color: "#665f55",
    fontSize: 14,
    lineHeight: 20
  },
  disabledButton: {
    alignItems: "center",
    backgroundColor: "#d2c7b6",
    borderRadius: 7,
    minHeight: 44,
    justifyContent: "center",
    marginTop: 5,
    paddingHorizontal: 14
  },
  disabledButtonText: {
    color: "#6b6458",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0
  }
});
