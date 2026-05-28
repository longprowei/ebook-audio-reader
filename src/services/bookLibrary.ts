import { Buffer } from "buffer";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import iconv from "iconv-lite";

import { ImportedBook } from "../types/book";

const BOOKS_DIRECTORY = `${FileSystem.documentDirectory ?? ""}books/`;
const BOOKS_INDEX_URI = `${BOOKS_DIRECTORY}books.json`;
const DECODING_FALLBACKS = ["gb18030", "big5", "utf16-le"] as const;

type DecodeResult = {
  encoding: string;
  text: string;
};

function assertDocumentDirectory() {
  if (!FileSystem.documentDirectory) {
    throw new Error("Document storage is not available on this device.");
  }
}

async function ensureBookStorage() {
  assertDocumentDirectory();

  await FileSystem.makeDirectoryAsync(BOOKS_DIRECTORY, {
    intermediates: true
  });
}

async function readBookIndex(): Promise<ImportedBook[]> {
  await ensureBookStorage();

  const indexInfo = await FileSystem.getInfoAsync(BOOKS_INDEX_URI);

  if (!indexInfo.exists) {
    return [];
  }

  const rawIndex = await FileSystem.readAsStringAsync(BOOKS_INDEX_URI, {
    encoding: FileSystem.EncodingType.UTF8
  });

  return JSON.parse(rawIndex) as ImportedBook[];
}

async function writeBookIndex(books: ImportedBook[]) {
  await ensureBookStorage();

  await FileSystem.writeAsStringAsync(BOOKS_INDEX_URI, JSON.stringify(books, null, 2), {
    encoding: FileSystem.EncodingType.UTF8
  });
}

function createBookId() {
  return `book-${Date.now()}`;
}

function getTitleFromFileName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "").trim() || "Untitled Book";
}

function isTxtAsset(asset: DocumentPicker.DocumentPickerAsset) {
  const name = asset.name.toLowerCase();
  const mimeType = asset.mimeType?.toLowerCase() ?? "";

  return name.endsWith(".txt") || mimeType === "text/plain";
}

function stripByteOrderMark(text: string) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function countMatches(text: string, pattern: RegExp) {
  return text.match(pattern)?.length ?? 0;
}

function scoreDecodedText(text: string) {
  const replacementCharacters = countMatches(text, /\uFFFD/g);
  const controlCharacters = countMatches(text, /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g);
  const cjkCharacters = countMatches(text, /[\u3400-\u9fff]/g);
  const asciiLettersAndNumbers = countMatches(text, /[a-zA-Z0-9]/g);
  const commonPunctuation = countMatches(text, /[，。！？；：、“”‘’《》（）,.!?;:'"()\s-]/g);

  return (
    cjkCharacters * 4 +
    asciiLettersAndNumbers +
    commonPunctuation -
    replacementCharacters * 100 -
    controlCharacters * 25
  );
}

function decodeUtf8Strict(bytes: Buffer) {
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function decodeTxtBytes(bytes: Buffer): DecodeResult {
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return {
      encoding: "utf-8-bom",
      text: stripByteOrderMark(iconv.decode(bytes, "utf8"))
    };
  }

  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return {
      encoding: "utf-16le-bom",
      text: stripByteOrderMark(iconv.decode(bytes, "utf16-le"))
    };
  }

  try {
    return {
      encoding: "utf-8",
      text: stripByteOrderMark(decodeUtf8Strict(bytes))
    };
  } catch {
    const candidates = DECODING_FALLBACKS.map((encoding) => ({
      encoding,
      text: stripByteOrderMark(iconv.decode(bytes, encoding))
    })).sort((first, second) => scoreDecodedText(second.text) - scoreDecodedText(first.text));

    const bestCandidate = candidates[0];

    if (!bestCandidate) {
      throw new Error("This TXT file could not be decoded.");
    }

    return bestCandidate;
  }
}

async function readTxtAsset(assetUri: string): Promise<DecodeResult> {
  const base64Contents = await FileSystem.readAsStringAsync(assetUri, {
    encoding: FileSystem.EncodingType.Base64
  });

  return decodeTxtBytes(Buffer.from(base64Contents, "base64"));
}

export async function loadBooks() {
  const books = await readBookIndex();

  return books.sort(
    (first, second) =>
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );
}

export async function pickAndImportTxtBook() {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
    type: ["text/plain", "text/*", "application/octet-stream"]
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];

  if (!asset) {
    throw new Error("No file was selected.");
  }

  if (!isTxtAsset(asset)) {
    throw new Error("Please choose a .txt file.");
  }

  const decodedBook = await readTxtAsset(asset.uri);
  const text = decodedBook.text;

  const now = new Date().toISOString();
  const id = createBookId();
  const localUri = `${BOOKS_DIRECTORY}${id}.txt`;

  await ensureBookStorage();
  await FileSystem.writeAsStringAsync(localUri, text, {
    encoding: FileSystem.EncodingType.UTF8
  });

  const importedBook: ImportedBook = {
    id,
    title: getTitleFromFileName(asset.name),
    fileName: asset.name,
    format: "txt",
    localUri,
    sourceUri: asset.uri,
    createdAt: now,
    updatedAt: now,
    characterCount: text.length,
    sizeBytes: asset.size,
    textEncoding: decodedBook.encoding
  };

  const books = await readBookIndex();
  const nextBooks = [importedBook, ...books];

  await writeBookIndex(nextBooks);

  return importedBook;
}
