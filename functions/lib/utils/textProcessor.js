"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessText = exports.chunkText = exports.extractTextFromFile = void 0;
const pdfParse = require('pdf-parse');
const mammoth = __importStar(require("mammoth"));
async function extractTextFromFile(fileBuffer, fileName) {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
        case 'pdf':
            return extractFromPDF(fileBuffer);
        case 'docx':
            return extractFromDOCX(fileBuffer);
        case 'txt':
            return fileBuffer.toString('utf-8');
        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
}
exports.extractTextFromFile = extractTextFromFile;
async function extractFromPDF(buffer) {
    try {
        const data = await pdfParse(buffer);
        return data.text.trim();
    }
    catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
}
async function extractFromDOCX(buffer) {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value.trim();
    }
    catch (error) {
        console.error('Error extracting text from DOCX:', error);
        throw new Error('Failed to extract text from DOCX');
    }
}
function chunkText(text, chunkSize = 1000, overlap = 200) {
    if (!text || text.length === 0) {
        return [];
    }
    const chunks = [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let currentChunk = '';
    let currentLength = 0;
    for (const sentence of sentences) {
        const sentenceLength = sentence.length;
        if (currentLength + sentenceLength > chunkSize && currentChunk) {
            chunks.push(currentChunk.trim());
            const overlapText = currentChunk.slice(-overlap);
            currentChunk = overlapText + sentence;
            currentLength = overlapText.length + sentenceLength;
        }
        else {
            currentChunk += sentence;
            currentLength += sentenceLength;
        }
    }
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}
exports.chunkText = chunkText;
function preprocessText(text) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
exports.preprocessText = preprocessText;
//# sourceMappingURL=textProcessor.js.map