// @ts-nocheck
// Storage Compression Utilities

import { CompressionResult } from './types';

export interface Compressor {
  name: string;
  compress(data: string): string;
  decompress(data: string): string;
  getCompressionRatio(original: string, compressed: string): number;
}

export interface CompressionOptions {
  level?: number; // Compression level (1-9, where 9 is maximum compression)
  threshold?: number; // Minimum size threshold to apply compression
  algorithm?: string; // Compression algorithm to use
}

// LZ77-based compression (simplified implementation)
export class LZ77Compressor implements Compressor {
  name = 'lz77';
  private windowSize: number;
  private bufferSize: number;

  constructor(windowSize = 4096, bufferSize = 18) {
    this.windowSize = windowSize;
    this.bufferSize = bufferSize;
  }

  compress(data: string): string {
    if (data.length === 0) return data;

    const result: string[] = [];
    let i = 0;

    while (i < data.length) {
      let matchLength = 0;
      let matchDistance = 0;

      // Look for matches in the sliding window
      const windowStart = Math.max(0, i - this.windowSize);
      const maxMatchLength = Math.min(this.bufferSize, data.length - i);

      for (let j = windowStart; j < i; j++) {
        let length = 0;
        while (
          length < maxMatchLength &&
          i + length < data.length &&
          data[j + length] === data[i + length]
        ) {
          length++;
        }

        if (length > matchLength) {
          matchLength = length;
          matchDistance = i - j;
        }
      }

      if (matchLength >= 3) {
        // Encode as (distance, length, next_char)
        const nextChar = i + matchLength < data.length ? data[i + matchLength] : '';
        result.push(`<${matchDistance},${matchLength},${nextChar}>`);
        i += matchLength + (nextChar ? 1 : 0);
      } else {
        // Encode as literal character
        result.push(data[i]);
        i++;
      }
    }

    return result.join('');
  }

  decompress(data: string): string {
    if (data.length === 0) return data;

    const result: string[] = [];
    let i = 0;

    while (i < data.length) {
      if (data[i] === '<') {
        // Find the end of the encoded sequence
        const endIndex = data.indexOf('>', i);
        if (endIndex === -1) {
          result.push(data[i]);
          i++;
          continue;
        }

        const encoded = data.slice(i + 1, endIndex);
        const parts = encoded.split(',');
        
        if (parts.length === 3) {
          const distance = parseInt(parts[0], 10);
          const length = parseInt(parts[1], 10);
          const nextChar = parts[2];

          if (!isNaN(distance) && !isNaN(length)) {
            // Copy from the sliding window
            const startPos = result.length - distance;
            for (let j = 0; j < length; j++) {
              if (startPos + j >= 0 && startPos + j < result.length) {
                result.push(result[startPos + j]);
              }
            }
            if (nextChar) {
              result.push(nextChar);
            }
            i = endIndex + 1;
            continue;
          }
        }
      }

      // Treat as literal character
      result.push(data[i]);
      i++;
    }

    return result.join('');
  }

  getCompressionRatio(original: string, compressed: string): number {
    if (original.length === 0) return 1;
    return compressed.length / original.length;
  }
}

// Run-Length Encoding compressor
export class RLECompressor implements Compressor {
  name = 'rle';

  compress(data: string): string {
    if (data.length === 0) return data;

    const result: string[] = [];
    let i = 0;

    while (i < data.length) {
      const char = data[i];
      let count = 1;

      // Count consecutive occurrences
      while (i + count < data.length && data[i + count] === char) {
        count++;
      }

      if (count > 3 || (count > 1 && char === ' ')) {
        // Encode as count + character
        result.push(`${count}${char}`);
      } else {
        // Keep as literal characters
        result.push(char.repeat(count));
      }

      i += count;
    }

    return result.join('');
  }

  decompress(data: string): string {
    if (data.length === 0) return data;

    const result: string[] = [];
    let i = 0;

    while (i < data.length) {
      // Check if this is an encoded sequence
      if (/^\d+/.test(data.slice(i))) {
        const match = data.slice(i).match(/^(\d+)(.)/);
        if (match) {
          const count = parseInt(match[1], 10);
          const char = match[2];
          result.push(char.repeat(count));
          i += match[0].length;
          continue;
        }
      }

      // Treat as literal character
      result.push(data[i]);
      i++;
    }

    return result.join('');
  }

  getCompressionRatio(original: string, compressed: string): number {
    if (original.length === 0) return 1;
    return compressed.length / original.length;
  }
}

// Dictionary-based compressor
export class DictionaryCompressor implements Compressor {
  name = 'dictionary';
  private dictionary: Map<string, string> = new Map();
  private reverseDictionary: Map<string, string> = new Map();
  private nextCode = 256; // Start after ASCII characters

  constructor() {
    this.initializeDictionary();
  }

  private initializeDictionary(): void {
    this.dictionary.clear();
    this.reverseDictionary.clear();
    this.nextCode = 256;

    // Initialize with single characters
    for (let i = 0; i < 256; i++) {
      const char = String.fromCharCode(i);
      const code = String.fromCharCode(i);
      this.dictionary.set(char, code);
      this.reverseDictionary.set(code, char);
    }
  }

  compress(data: string): string {
    if (data.length === 0) return data;

    this.initializeDictionary();
    const result: string[] = [];
    let current = '';

    for (const char of data) {
      const combined = current + char;
      
      if (this.dictionary.has(combined)) {
        current = combined;
      } else {
        // Output the code for current
        result.push(this.dictionary.get(current) || current);
        
        // Add new sequence to dictionary
        if (this.nextCode < 65536) { // Limit dictionary size
          const code = String.fromCharCode(this.nextCode);
          this.dictionary.set(combined, code);
          this.reverseDictionary.set(code, combined);
          this.nextCode++;
        }
        
        current = char;
      }
    }

    // Output the final sequence
    if (current) {
      result.push(this.dictionary.get(current) || current);
    }

    return result.join('');
  }

  decompress(data: string): string {
    if (data.length === 0) return data;

    this.initializeDictionary();
    const result: string[] = [];
    let previous = '';

    for (const code of data) {
      let current = this.reverseDictionary.get(code) || code;
      
      if (previous) {
        // Add new sequence to dictionary
        if (this.nextCode < 65536) {
          const newSequence = previous + current[0];
          const newCode = String.fromCharCode(this.nextCode);
          this.dictionary.set(newSequence, newCode);
          this.reverseDictionary.set(newCode, newSequence);
          this.nextCode++;
        }
      }
      
      result.push(current);
      previous = current;
    }

    return result.join('');
  }

  getCompressionRatio(original: string, compressed: string): number {
    if (original.length === 0) return 1;
    return compressed.length / original.length;
  }
}

// Base64 compressor (not really compression, but encoding)
export class Base64Compressor implements Compressor {
  name = 'base64';

  compress(data: string): string {
    try {
      return btoa(unescape(encodeURIComponent(data)));
    } catch (error) {
      throw new Error(`Base64 compression failed: ${error}`);
    }
  }

  decompress(data: string): string {
    try {
      return decodeURIComponent(escape(atob(data)));
    } catch (error) {
      throw new Error(`Base64 decompression failed: ${error}`);
    }
  }

  getCompressionRatio(original: string, compressed: string): number {
    if (original.length === 0) return 1;
    return compressed.length / original.length;
  }
}

// Huffman coding compressor (simplified)
export class HuffmanCompressor implements Compressor {
  name = 'huffman';

  private buildFrequencyTable(data: string): Map<string, number> {
    const freq = new Map<string, number>();
    for (const char of data) {
      freq.set(char, (freq.get(char) || 0) + 1);
    }
    return freq;
  }

  private buildHuffmanTree(freq: Map<string, number>): any {
    const nodes = Array.from(freq.entries()).map(([char, frequency]) => ({
      char,
      frequency,
      left: null,
      right: null
    }));

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.frequency - b.frequency);
      const left = nodes.shift()!;
      const right = nodes.shift()!;
      
      nodes.push({
        char: null,
        frequency: left.frequency + right.frequency,
        left,
        right
      });
    }

    return nodes[0];
  }

  private buildCodeTable(root: any): Map<string, string> {
    const codes = new Map<string, string>();
    
    const traverse = (node: any, code: string) => {
      if (node.char !== null) {
        codes.set(node.char, code || '0'); // Single character gets '0'
      } else {
        if (node.left) traverse(node.left, code + '0');
        if (node.right) traverse(node.right, code + '1');
      }
    };

    traverse(root, '');
    return codes;
  }

  compress(data: string): string {
    if (data.length === 0) return data;
    if (data.length === 1) return data; // Single character can't be compressed

    const freq = this.buildFrequencyTable(data);
    const tree = this.buildHuffmanTree(freq);
    const codes = this.buildCodeTable(tree);

    // Encode the data
    let encoded = '';
    for (const char of data) {
      encoded += codes.get(char) || '';
    }

    // Store the tree structure for decompression
    const treeData = JSON.stringify(this.serializeTree(tree));
    const treeLength = treeData.length.toString().padStart(8, '0');
    
    return treeLength + treeData + encoded;
  }

  decompress(data: string): string {
    if (data.length === 0) return data;
    if (data.length < 8) return data; // Invalid compressed data

    try {
      const treeLength = parseInt(data.slice(0, 8), 10);
      const treeData = data.slice(8, 8 + treeLength);
      const encoded = data.slice(8 + treeLength);

      const tree = this.deserializeTree(JSON.parse(treeData));
      
      let decoded = '';
      let current = tree;
      
      for (const bit of encoded) {
        if (bit === '0') {
          current = current.left;
        } else {
          current = current.right;
        }
        
        if (current.char !== null) {
          decoded += current.char;
          current = tree;
        }
      }
      
      return decoded;
    } catch (error) {
      throw new Error(`Huffman decompression failed: ${error}`);
    }
  }

  private serializeTree(node: any): any {
    if (node.char !== null) {
      return { char: node.char };
    }
    return {
      left: this.serializeTree(node.left),
      right: this.serializeTree(node.right)
    };
  }

  private deserializeTree(data: any): any {
    if (data.char !== undefined) {
      return { char: data.char, left: null, right: null };
    }
    return {
      char: null,
      left: this.deserializeTree(data.left),
      right: this.deserializeTree(data.right)
    };
  }

  getCompressionRatio(original: string, compressed: string): number {
    if (original.length === 0) return 1;
    return compressed.length / original.length;
  }
}

// Compression Manager
export class CompressionManager {
  private compressors = new Map<string, Compressor>();
  private defaultCompressor: Compressor;

  constructor(defaultCompressor?: Compressor) {
    this.defaultCompressor = defaultCompressor || new LZ77Compressor();
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.register(new LZ77Compressor());
    this.register(new RLECompressor());
    this.register(new DictionaryCompressor());
    this.register(new Base64Compressor());
    this.register(new HuffmanCompressor());
  }

  register(compressor: Compressor): void {
    this.compressors.set(compressor.name, compressor);
  }

  unregister(name: string): void {
    this.compressors.delete(name);
  }

  get(name: string): Compressor | undefined {
    return this.compressors.get(name);
  }

  getDefault(): Compressor {
    return this.defaultCompressor;
  }

  setDefault(compressor: Compressor): void {
    this.defaultCompressor = compressor;
  }

  compress(data: string, options: CompressionOptions = {}): CompressionResult {
    const { algorithm, threshold = 100 } = options;
    
    // Skip compression for small data
    if (data.length < threshold) {
      return {
        compressed: data,
        originalSize: data.length,
        compressedSize: data.length,
        ratio: 1
      };
    }

    const compressor = algorithm ? this.get(algorithm) : this.defaultCompressor;
    
    if (!compressor) {
      throw new Error(`Compressor '${algorithm}' not found`);
    }

    const compressed = compressor.compress(data);
    const ratio = compressor.getCompressionRatio(data, compressed);

    return {
      compressed,
      originalSize: data.length,
      compressedSize: compressed.length,
      ratio
    };
  }

  decompress(data: CompressionResult | string, algorithm?: string): string {
    if (typeof data === 'string') {
      const compressor = algorithm ? this.get(algorithm) : this.defaultCompressor;
      if (!compressor) {
        throw new Error(`Compressor '${algorithm}' not found`);
      }
      return compressor.decompress(data);
    }

    // If ratio is 1, data wasn't compressed
    if (data.ratio === 1) {
      return data.compressed;
    }

    const compressor = algorithm ? this.get(algorithm) : this.defaultCompressor;
    if (!compressor) {
      throw new Error(`Compressor '${algorithm}' not found`);
    }

    return compressor.decompress(data.compressed);
  }

  findBestCompressor(data: string): { compressor: Compressor; ratio: number } {
    let bestCompressor = this.defaultCompressor;
    let bestRatio = 1;

    for (const compressor of this.compressors.values()) {
      try {
        const compressed = compressor.compress(data);
        const ratio = compressor.getCompressionRatio(data, compressed);
        
        if (ratio < bestRatio) {
          bestCompressor = compressor;
          bestRatio = ratio;
        }
      } catch (error) {
        // Skip compressors that fail
        continue;
      }
    }

    return { compressor: bestCompressor, ratio: bestRatio };
  }

  getAllCompressors(): Compressor[] {
    return Array.from(this.compressors.values());
  }

  getCompressorNames(): string[] {
    return Array.from(this.compressors.keys());
  }
}

// Utility functions
export const createLZ77Compressor = (windowSize?: number, bufferSize?: number): LZ77Compressor => {
  return new LZ77Compressor(windowSize, bufferSize);
};

export const createRLECompressor = (): RLECompressor => {
  return new RLECompressor();
};

export const createDictionaryCompressor = (): DictionaryCompressor => {
  return new DictionaryCompressor();
};

export const createHuffmanCompressor = (): HuffmanCompressor => {
  return new HuffmanCompressor();
};

// Default instances
export const lz77Compressor = new LZ77Compressor();
export const rleCompressor = new RLECompressor();
export const dictionaryCompressor = new DictionaryCompressor();
export const base64Compressor = new Base64Compressor();
export const huffmanCompressor = new HuffmanCompressor();
export const compressionManager = new CompressionManager();

// Export all compressors
export const compressors = {
  lz77: lz77Compressor,
  rle: rleCompressor,
  dictionary: dictionaryCompressor,
  base64: base64Compressor,
  huffman: huffmanCompressor
};

export default {
  CompressionManager,
  LZ77Compressor,
  RLECompressor,
  DictionaryCompressor,
  Base64Compressor,
  HuffmanCompressor,
  compressors,
  compressionManager,
  createLZ77Compressor,
  createRLECompressor,
  createDictionaryCompressor,
  createHuffmanCompressor
};
