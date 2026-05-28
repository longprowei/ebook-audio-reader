import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { Section } from "../components/Section";
import { loadBooks, pickAndImportTxtBook } from "../services/bookLibrary";
import { ImportedBook } from "../types/book";

function formatCharacterCount(characterCount: number) {
  if (characterCount >= 10000) {
    return `${(characterCount / 10000).toFixed(1)}w chars`;
  }

  return `${characterCount.toLocaleString()} chars`;
}

function formatImportDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
}

export function LibraryScreen() {
  const [books, setBooks] = useState<ImportedBook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshBooks = useCallback(async () => {
    setError(null);

    try {
      setBooks(await loadBooks());
    } catch {
      setError("Books could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  async function handleImportTxt() {
    setError(null);
    setIsImporting(true);

    try {
      const importedBook = await pickAndImportTxtBook();

      if (importedBook) {
        setBooks((currentBooks) => [importedBook, ...currentBooks]);
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "The TXT file could not be imported.";

      setError(message);
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Section
        title="Books"
        description="Import TXT books from Files. EPUB support will come later."
      >
        <Pressable
          accessibilityRole="button"
          disabled={isImporting}
          onPress={handleImportTxt}
          style={[styles.importButton, isImporting && styles.disabledButton]}
        >
          <Text style={styles.importButtonText}>
            {isImporting ? "Importing..." : "Import TXT"}
          </Text>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </Section>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color="#171512" />
          <Text style={styles.loadingText}>Loading books</Text>
        </View>
      ) : books.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No books yet</Text>
          <Text style={styles.emptyText}>
            Import a UTF-8 .txt book to start building your audio library.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.bookList}
          showsVerticalScrollIndicator={false}
        >
          {books.map((book) => (
            <View key={book.id} style={styles.bookCard}>
              <View style={styles.bookHeader}>
                <Text numberOfLines={2} style={styles.bookTitle}>
                  {book.title}
                </Text>
                <Text style={styles.formatBadge}>{book.format.toUpperCase()}</Text>
              </View>

              <Text numberOfLines={1} style={styles.fileName}>
                {book.fileName}
              </Text>

              <View style={styles.bookMetaRow}>
                <Text style={styles.bookMeta}>
                  {formatCharacterCount(book.characterCount)}
                </Text>
                {book.textEncoding ? (
                  <Text style={styles.bookMeta}>{book.textEncoding}</Text>
                ) : null}
                <Text style={styles.bookMeta}>{formatImportDate(book.createdAt)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  importButton: {
    alignItems: "center",
    backgroundColor: "#171512",
    borderRadius: 7,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 14
  },
  disabledButton: {
    opacity: 0.62
  },
  importButtonText: {
    color: "#fffaf1",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0
  },
  error: {
    color: "#9a2f2f",
    fontSize: 14,
    lineHeight: 20
  },
  loadingState: {
    alignItems: "center",
    flex: 1,
    gap: 10,
    justifyContent: "center"
  },
  loadingText: {
    color: "#665f55",
    fontSize: 14
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
  bookList: {
    gap: 10,
    paddingBottom: 16
  },
  bookCard: {
    backgroundColor: "#fffaf1",
    borderColor: "#ddd3c2",
    borderRadius: 8,
    borderWidth: 1,
    gap: 9,
    padding: 14
  },
  bookHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between"
  },
  bookTitle: {
    color: "#171512",
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 22
  },
  formatBadge: {
    backgroundColor: "#e8e1d4",
    borderRadius: 6,
    color: "#4d473e",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  fileName: {
    color: "#665f55",
    fontSize: 13
  },
  bookMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  bookMeta: {
    color: "#7c7367",
    fontSize: 12,
    fontWeight: "700"
  }
});
