// Storage Encryption Utilities

import { EncryptionResult, EncryptionError } from './types';

export interface Encryptor {
  name: string;
  encrypt(data: string, key: string): string;
  decrypt(data: string, key: string): string;
  generateKey?(): string;
  validateKey?(key: string): boolean;
}

export interface EncryptionOptions {
  algorithm?: string;
  keyLength?: number;
  iterations?: number;
  saltLength?: number;
  ivLength?: number;
}

// Simple XOR Cipher (for demonstration - not secure for production)
export class XOREncryptor implements Encryptor {
  name = 'xor';

  encrypt(data: string, key: string): string {
    if (!key) throw new EncryptionError(undefined, new Error('Encryption key is required'));
    
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const dataChar = data.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(dataChar ^ keyChar);
    }
    return btoa(result); // Base64 encode the result
  }

  decrypt(data: string, key: string): string {
    if (!key) throw new EncryptionError(undefined, new Error('Decryption key is required'));
    
    try {
      const decoded = atob(data); // Base64 decode
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const dataChar = decoded.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        result += String.fromCharCode(dataChar ^ keyChar);
      }
      return result;
    } catch (error) {
      throw new EncryptionError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  generateKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  validateKey(key: string): boolean {
    return typeof key === 'string' && key.length > 0;
  }
}

// Caesar Cipher
export class CaesarEncryptor implements Encryptor {
  name = 'caesar';
  private shift: number;

  constructor(shift: number = 13) {
    this.shift = shift;
  }

  encrypt(data: string, key: string): string {
    const shiftValue = this.getShiftFromKey(key);
    return data.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + shiftValue) % 26) + base);
      }
      return char;
    }).join('');
  }

  decrypt(data: string, key: string): string {
    const shiftValue = this.getShiftFromKey(key);
    return data.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base - shiftValue + 26) % 26) + base);
      }
      return char;
    }).join('');
  }

  private getShiftFromKey(key: string): number {
    if (!key) return this.shift;
    let sum = 0;
    for (let i = 0; i < key.length; i++) {
      sum += key.charCodeAt(i);
    }
    return (sum % 26) || this.shift;
  }

  generateKey(): string {
    return Math.floor(Math.random() * 26).toString();
  }

  validateKey(key: string): boolean {
    const num = parseInt(key, 10);
    return !isNaN(num) && num >= 0 && num <= 25;
  }
}

// Vigenère Cipher
export class VigenereEncryptor implements Encryptor {
  name = 'vigenere';

  encrypt(data: string, key: string): string {
    if (!key) throw new EncryptionError(undefined, new Error('Encryption key is required'));
    
    const cleanKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (!cleanKey) throw new EncryptionError(undefined, new Error('Key must contain at least one letter'));
    
    let result = '';
    let keyIndex = 0;
    
    for (const char of data) {
      if (char.match(/[a-zA-Z]/)) {
        const isUpperCase = char === char.toUpperCase();
        const charCode = char.toUpperCase().charCodeAt(0) - 65;
        const keyCode = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        const encryptedCode = (charCode + keyCode) % 26;
        const encryptedChar = String.fromCharCode(encryptedCode + 65);
        result += isUpperCase ? encryptedChar : encryptedChar.toLowerCase();
        keyIndex++;
      } else {
        result += char;
      }
    }
    
    return result;
  }

  decrypt(data: string, key: string): string {
    if (!key) throw new EncryptionError(undefined, new Error('Decryption key is required'));
    
    const cleanKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (!cleanKey) throw new EncryptionError(undefined, new Error('Key must contain at least one letter'));
    
    let result = '';
    let keyIndex = 0;
    
    for (const char of data) {
      if (char.match(/[a-zA-Z]/)) {
        const isUpperCase = char === char.toUpperCase();
        const charCode = char.toUpperCase().charCodeAt(0) - 65;
        const keyCode = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        const decryptedCode = (charCode - keyCode + 26) % 26;
        const decryptedChar = String.fromCharCode(decryptedCode + 65);
        result += isUpperCase ? decryptedChar : decryptedChar.toLowerCase();
        keyIndex++;
      } else {
        result += char;
      }
    }
    
    return result;
  }

  generateKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const length = Math.floor(Math.random() * 20) + 5; // 5-24 characters
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  validateKey(key: string): boolean {
    return typeof key === 'string' && /[a-zA-Z]/.test(key);
  }
}

// Base64 with key rotation (simple obfuscation)
export class Base64KeyEncryptor implements Encryptor {
  name = 'base64key';

  encrypt(data: string, key: string): string {
    if (!key) throw new EncryptionError(undefined, new Error('Encryption key is required'));
    
    try {
      // First, apply key rotation
      let rotated = '';
      for (let i = 0; i < data.length; i++) {
        const dataChar = data.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        rotated += String.fromCharCode((dataChar + keyChar) % 256);
      }
      
      // Then base64 encode
      return btoa(rotated);
    } catch (error) {
      throw new EncryptionError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  decrypt(data: string, key: string): string {
    if (!key) throw new EncryptionError(undefined, new Error('Decryption key is required'));
    
    try {
      // First, base64 decode
      const decoded = atob(data);
      
      // Then, reverse key rotation
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const dataChar = decoded.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        result += String.fromCharCode((dataChar - keyChar + 256) % 256);
      }
      
      return result;
    } catch (error) {
      throw new EncryptionError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  generateKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  validateKey(key: string): boolean {
    return typeof key === 'string' && key.length > 0;
  }
}

// AES-like encryption (simplified, not actual AES)
export class SimpleAESEncryptor implements Encryptor {
  name = 'simple-aes';

  private sBox = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
  ];

  private invSBox = new Array(256);

  constructor() {
    // Build inverse S-box
    for (let i = 0; i < 256; i++) {
      this.invSBox[this.sBox[i]] = i;
    }
  }

  encrypt(data: string, key: string): string {
    if (!key) throw new EncryptionError(undefined, new Error('Encryption key is required'));
    
    try {
      const keyBytes = this.stringToBytes(key);
      const dataBytes = this.stringToBytes(data);
      const encrypted = this.encryptBytes(dataBytes, keyBytes);
      return this.bytesToBase64(encrypted);
    } catch (error) {
      throw new EncryptionError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  decrypt(data: string, key: string): string {
    if (!key) throw new EncryptionError(undefined, new Error('Decryption key is required'));
    
    try {
      const keyBytes = this.stringToBytes(key);
      const encryptedBytes = this.base64ToBytes(data);
      const decrypted = this.decryptBytes(encryptedBytes, keyBytes);
      return this.bytesToString(decrypted);
    } catch (error) {
      throw new EncryptionError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  private stringToBytes(str: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i) & 0xFF);
    }
    return bytes;
  }

  private bytesToString(bytes: number[]): string {
    return String.fromCharCode(...bytes);
  }

  private bytesToBase64(bytes: number[]): string {
    const binary = String.fromCharCode(...bytes);
    return btoa(binary);
  }

  private base64ToBytes(base64: string): number[] {
    const binary = atob(base64);
    const bytes: number[] = [];
    for (let i = 0; i < binary.length; i++) {
      bytes.push(binary.charCodeAt(i));
    }
    return bytes;
  }

  private encryptBytes(data: number[], key: number[]): number[] {
    const result: number[] = [];
    
    for (let i = 0; i < data.length; i++) {
      let byte = data[i];
      
      // Apply S-box substitution
      byte = this.sBox[byte];
      
      // XOR with key
      byte ^= key[i % key.length];
      
      // Simple shift
      byte = ((byte << 1) | (byte >> 7)) & 0xFF;
      
      result.push(byte);
    }
    
    return result;
  }

  private decryptBytes(data: number[], key: number[]): number[] {
    const result: number[] = [];
    
    for (let i = 0; i < data.length; i++) {
      let byte = data[i];
      
      // Reverse shift
      byte = ((byte >> 1) | (byte << 7)) & 0xFF;
      
      // XOR with key
      byte ^= key[i % key.length];
      
      // Apply inverse S-box substitution
      byte = this.invSBox[byte];
      
      result.push(byte);
    }
    
    return result;
  }

  generateKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  validateKey(key: string): boolean {
    return typeof key === 'string' && key.length >= 8;
  }
}

// Encryption Manager
export class EncryptionManager {
  private encryptors = new Map<string, Encryptor>();
  private defaultEncryptor: Encryptor;

  constructor(defaultEncryptor?: Encryptor) {
    this.defaultEncryptor = defaultEncryptor || new XOREncryptor();
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.register(new XOREncryptor());
    this.register(new CaesarEncryptor());
    this.register(new VigenereEncryptor());
    this.register(new Base64KeyEncryptor());
    this.register(new SimpleAESEncryptor());
  }

  register(encryptor: Encryptor): void {
    this.encryptors.set(encryptor.name, encryptor);
  }

  unregister(name: string): void {
    this.encryptors.delete(name);
  }

  get(name: string): Encryptor | undefined {
    return this.encryptors.get(name);
  }

  getDefault(): Encryptor {
    return this.defaultEncryptor;
  }

  setDefault(encryptor: Encryptor): void {
    this.defaultEncryptor = encryptor;
  }

  encrypt(data: string, key: string, options: EncryptionOptions = {}): EncryptionResult {
    const { algorithm } = options;
    const encryptor = algorithm ? this.get(algorithm) : this.defaultEncryptor;
    
    if (!encryptor) {
      throw new EncryptionError(undefined, new Error(`Encryptor '${algorithm}' not found`));
    }

    if (encryptor.validateKey && !encryptor.validateKey(key)) {
      throw new EncryptionError(undefined, new Error('Invalid encryption key'));
    }

    const encrypted = encryptor.encrypt(data, key);
    
    return {
      encrypted,
      algorithm: encryptor.name
    };
  }

  decrypt(data: EncryptionResult | string, key: string, algorithm?: string): string {
    let encrypted: string;
    let algorithmName: string;

    if (typeof data === 'string') {
      encrypted = data;
      algorithmName = algorithm || this.defaultEncryptor.name;
    } else {
      encrypted = data.encrypted;
      algorithmName = data.algorithm;
    }

    const encryptor = this.get(algorithmName);
    if (!encryptor) {
      throw new EncryptionError(undefined, new Error(`Encryptor '${algorithmName}' not found`));
    }

    if (encryptor.validateKey && !encryptor.validateKey(key)) {
      throw new EncryptionError(undefined, new Error('Invalid decryption key'));
    }

    return encryptor.decrypt(encrypted, key);
  }

  generateKey(algorithm?: string): string {
    const encryptor = algorithm ? this.get(algorithm) : this.defaultEncryptor;
    
    if (!encryptor) {
      throw new EncryptionError(undefined, new Error(`Encryptor '${algorithm}' not found`));
    }

    if (!encryptor.generateKey) {
      throw new EncryptionError(undefined, new Error(`Encryptor '${encryptor.name}' does not support key generation`));
    }

    return encryptor.generateKey();
  }

  validateKey(key: string, algorithm?: string): boolean {
    const encryptor = algorithm ? this.get(algorithm) : this.defaultEncryptor;
    
    if (!encryptor || !encryptor.validateKey) {
      return true; // Assume valid if no validator
    }

    return encryptor.validateKey(key);
  }

  getAllEncryptors(): Encryptor[] {
    return Array.from(this.encryptors.values());
  }

  getEncryptorNames(): string[] {
    return Array.from(this.encryptors.keys());
  }
}

// Utility functions
export const createXOREncryptor = (): XOREncryptor => {
  return new XOREncryptor();
};

export const createCaesarEncryptor = (shift?: number): CaesarEncryptor => {
  return new CaesarEncryptor(shift);
};

export const createVigenereEncryptor = (): VigenereEncryptor => {
  return new VigenereEncryptor();
};

export const createBase64KeyEncryptor = (): Base64KeyEncryptor => {
  return new Base64KeyEncryptor();
};

export const createSimpleAESEncryptor = (): SimpleAESEncryptor => {
  return new SimpleAESEncryptor();
};

// Default instances
export const xorEncryptor = new XOREncryptor();
export const caesarEncryptor = new CaesarEncryptor();
export const vigenereEncryptor = new VigenereEncryptor();
export const base64KeyEncryptor = new Base64KeyEncryptor();
export const simpleAESEncryptor = new SimpleAESEncryptor();
export const encryptionManager = new EncryptionManager();

// Export all encryptors
export const encryptors = {
  xor: xorEncryptor,
  caesar: caesarEncryptor,
  vigenere: vigenereEncryptor,
  base64key: base64KeyEncryptor,
  'simple-aes': simpleAESEncryptor
};

export default {
  EncryptionManager,
  XOREncryptor,
  CaesarEncryptor,
  VigenereEncryptor,
  Base64KeyEncryptor,
  SimpleAESEncryptor,
  encryptors,
  encryptionManager,
  createXOREncryptor,
  createCaesarEncryptor,
  createVigenereEncryptor,
  createBase64KeyEncryptor,
  createSimpleAESEncryptor
};