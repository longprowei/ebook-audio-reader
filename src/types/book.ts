export type BookFormat = "txt" | "epub";

export type ImportedBook = {
  id: string;
  title: string;
  fileName: string;
  format: BookFormat;
  localUri: string;
  sourceUri?: string;
  createdAt: string;
  updatedAt: string;
  characterCount: number;
  sizeBytes?: number;
  textEncoding?: string;
};
