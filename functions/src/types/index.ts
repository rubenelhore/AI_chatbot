export interface DocumentData {
  documentId: string;
  filePath: string;
  fileName: string;
  fileType: string;
  userId?: string;
}

export interface ChunkMetadata {
  documentId: string;
  chunkIndex: number;
  text: string;
  chunkCount: number;
  fileName?: string;
  [key: string]: any;
}

export interface VectorRecord {
  id: string;
  values: number[];
  metadata: ChunkMetadata;
}

export interface ChatQuery {
  query: string;
  documentIds: string[];
  userId?: string;
  conversationId?: string;
}

export interface ChatResponse {
  response: string;
  sources: Array<{
    documentId: string;
    chunkIndex: number;
    score: number;
    text?: string;
  }>;
  chatId: string;
}

export interface ProcessingResult {
  success: boolean;
  chunkCount: number;
  error?: string;
}