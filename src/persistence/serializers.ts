// Storage Serializers - Data Serialization Utilities

import { SerializationResult, SerializationError } from './types';

export interface Serializer {
  name: string;
  serialize(value: any): string;
  deserialize<T = any>(value: string): T;
  canHandle(value: any): boolean;
}

export interface SerializerOptions {
  pretty?: boolean;
  space?: number;
  replacer?: (key: string, value: any) => any;
  reviver?: (key: string, value: any) => any;
}

// JSON Serializer
export class JSONSerializer implements Serializer {
  name = 'json';

  constructor(private options: SerializerOptions = {}) {}

  serialize(value: any): string {
    try {
      if (this.options.pretty) {
        return JSON.stringify(value, this.options.replacer, this.options.space ?? 2);
      }
      return JSON.stringify(value, this.options.replacer);
    } catch (error) {
      throw new SerializationError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  deserialize<T = any>(value: string): T {
    try {
      return JSON.parse(value, this.options.reviver);
    } catch (error) {
      throw new SerializationError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  canHandle(value: any): boolean {
    try {
      JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  }
}

// Binary Serializer (using MessagePack-like approach)
export class BinarySerializer implements Serializer {
  name = 'binary';

  serialize(value: any): string {
    try {
      // Convert to JSON first, then to binary representation
      const json = JSON.stringify(value);
      const encoder = new TextEncoder();
      const bytes = encoder.encode(json);
      
      // Convert to base64 for string representation
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    } catch (error) {
      throw new SerializationError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  deserialize<T = any>(value: string): T {
    try {
      // Decode from base64
      const binary = atob(value);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      // Convert back to JSON string
      const decoder = new TextDecoder();
      const json = decoder.decode(bytes);
      return JSON.parse(json);
    } catch (error) {
      throw new SerializationError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  canHandle(value: any): boolean {
    return true; // Can handle any JSON-serializable value
  }
}

// String Serializer (for primitive strings)
export class StringSerializer implements Serializer {
  name = 'string';

  serialize(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    return String(value);
  }

  deserialize<T = any>(value: string): T {
    return value as T;
  }

  canHandle(value: any): boolean {
    return typeof value === 'string';
  }
}

// Number Serializer
export class NumberSerializer implements Serializer {
  name = 'number';

  serialize(value: any): string {
    if (typeof value === 'number') {
      return value.toString();
    }
    throw new SerializationError(undefined, new Error('Value is not a number'));
  }

  deserialize<T = any>(value: string): T {
    const num = Number(value);
    if (isNaN(num)) {
      throw new SerializationError(undefined, new Error('Cannot deserialize to number'));
    }
    return num as T;
  }

  canHandle(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }
}

// Boolean Serializer
export class BooleanSerializer implements Serializer {
  name = 'boolean';

  serialize(value: any): string {
    if (typeof value === 'boolean') {
      return value.toString();
    }
    throw new SerializationError(undefined, new Error('Value is not a boolean'));
  }

  deserialize<T = any>(value: string): T {
    if (value === 'true') return true as T;
    if (value === 'false') return false as T;
    throw new SerializationError(undefined, new Error('Cannot deserialize to boolean'));
  }

  canHandle(value: any): boolean {
    return typeof value === 'boolean';
  }
}

// Date Serializer
export class DateSerializer implements Serializer {
  name = 'date';

  serialize(value: any): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new SerializationError(undefined, new Error('Value is not a Date'));
  }

  deserialize<T = any>(value: string): T {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new SerializationError(undefined, new Error('Cannot deserialize to Date'));
    }
    return date as T;
  }

  canHandle(value: any): boolean {
    return value instanceof Date;
  }
}

// RegExp Serializer
export class RegExpSerializer implements Serializer {
  name = 'regexp';

  serialize(value: any): string {
    if (value instanceof RegExp) {
      return JSON.stringify({
        source: value.source,
        flags: value.flags
      });
    }
    throw new SerializationError(undefined, new Error('Value is not a RegExp'));
  }

  deserialize<T = any>(value: string): T {
    try {
      const { source, flags } = JSON.parse(value);
      return new RegExp(source, flags) as T;
    } catch (error) {
      throw new SerializationError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  canHandle(value: any): boolean {
    return value instanceof RegExp;
  }
}

// Map Serializer
export class MapSerializer implements Serializer {
  name = 'map';

  serialize(value: any): string {
    if (value instanceof Map) {
      return JSON.stringify(Array.from(value.entries()));
    }
    throw new SerializationError(undefined, new Error('Value is not a Map'));
  }

  deserialize<T = any>(value: string): T {
    try {
      const entries = JSON.parse(value);
      return new Map(entries) as T;
    } catch (error) {
      throw new SerializationError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  canHandle(value: any): boolean {
    return value instanceof Map;
  }
}

// Set Serializer
export class SetSerializer implements Serializer {
  name = 'set';

  serialize(value: any): string {
    if (value instanceof Set) {
      return JSON.stringify(Array.from(value));
    }
    throw new SerializationError(undefined, new Error('Value is not a Set'));
  }

  deserialize<T = any>(value: string): T {
    try {
      const array = JSON.parse(value);
      return new Set(array) as T;
    } catch (error) {
      throw new SerializationError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  canHandle(value: any): boolean {
    return value instanceof Set;
  }
}

// ArrayBuffer Serializer
export class ArrayBufferSerializer implements Serializer {
  name = 'arraybuffer';

  serialize(value: any): string {
    if (value instanceof ArrayBuffer) {
      const bytes = new Uint8Array(value);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }
    throw new SerializationError(undefined, new Error('Value is not an ArrayBuffer'));
  }

  deserialize<T = any>(value: string): T {
    try {
      const binary = atob(value);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer as T;
    } catch (error) {
      throw new SerializationError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  canHandle(value: any): boolean {
    return value instanceof ArrayBuffer;
  }
}

// Composite Serializer (handles complex objects with type information)
export class CompositeSerializer implements Serializer {
  name = 'composite';
  private serializers: Serializer[];

  constructor(serializers?: Serializer[]) {
    this.serializers = serializers || [
      new DateSerializer(),
      new RegExpSerializer(),
      new MapSerializer(),
      new SetSerializer(),
      new ArrayBufferSerializer(),
      new NumberSerializer(),
      new BooleanSerializer(),
      new StringSerializer(),
      new JSONSerializer()
    ];
  }

  serialize(value: any): string {
    try {
      const result = this.serializeValue(value);
      return JSON.stringify(result);
    } catch (error) {
      throw new SerializationError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  deserialize<T = any>(value: string): T {
    try {
      const parsed = JSON.parse(value);
      return this.deserializeValue(parsed);
    } catch (error) {
      throw new SerializationError(undefined, error instanceof Error ? error : new Error(String(error)));
    }
  }

  canHandle(value: any): boolean {
    return true; // Can handle any value
  }

  private serializeValue(value: any): any {
    if (value === null || value === undefined) {
      return { __type: 'primitive', value };
    }

    // Find appropriate serializer
    for (const serializer of this.serializers) {
      if (serializer.canHandle(value)) {
        return {
          __type: serializer.name,
          value: serializer.serialize(value)
        };
      }
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return {
        __type: 'array',
        value: value.map(item => this.serializeValue(item))
      };
    }

    // Handle plain objects
    if (typeof value === 'object') {
      const serialized: any = {};
      for (const [key, val] of Object.entries(value)) {
        serialized[key] = this.serializeValue(val);
      }
      return {
        __type: 'object',
        value: serialized
      };
    }

    // Fallback to JSON serializer
    return {
      __type: 'json',
      value: JSON.stringify(value)
    };
  }

  private deserializeValue(data: any): any {
    if (!data || typeof data !== 'object' || !data.__type) {
      return data;
    }

    const { __type, value } = data;

    if (__type === 'primitive') {
      return value;
    }

    if (__type === 'array') {
      return value.map((item: any) => this.deserializeValue(item));
    }

    if (__type === 'object') {
      const deserialized: any = {};
      for (const [key, val] of Object.entries(value)) {
        deserialized[key] = this.deserializeValue(val);
      }
      return deserialized;
    }

    // Find appropriate deserializer
    const serializer = this.serializers.find(s => s.name === __type);
    if (serializer) {
      return serializer.deserialize(value);
    }

    // Fallback
    return value;
  }
}

// Serializer Manager
export class SerializerManager {
  private serializers = new Map<string, Serializer>();
  private defaultSerializer: Serializer;

  constructor(defaultSerializer?: Serializer) {
    this.defaultSerializer = defaultSerializer || new JSONSerializer();
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.register(new JSONSerializer());
    this.register(new BinarySerializer());
    this.register(new StringSerializer());
    this.register(new NumberSerializer());
    this.register(new BooleanSerializer());
    this.register(new DateSerializer());
    this.register(new RegExpSerializer());
    this.register(new MapSerializer());
    this.register(new SetSerializer());
    this.register(new ArrayBufferSerializer());
    this.register(new CompositeSerializer());
  }

  register(serializer: Serializer): void {
    this.serializers.set(serializer.name, serializer);
  }

  unregister(name: string): void {
    this.serializers.delete(name);
  }

  get(name: string): Serializer | undefined {
    return this.serializers.get(name);
  }

  getDefault(): Serializer {
    return this.defaultSerializer;
  }

  setDefault(serializer: Serializer): void {
    this.defaultSerializer = serializer;
  }

  serialize(value: any, serializerName?: string): SerializationResult {
    const serializer = serializerName ? this.get(serializerName) : this.defaultSerializer;
    
    if (!serializer) {
      throw new SerializationError(undefined, new Error(`Serializer '${serializerName}' not found`));
    }

    const serialized = serializer.serialize(value);
    
    return {
      serialized,
      type: serializer.name,
      metadata: {
        timestamp: Date.now(),
        size: serialized.length
      }
    };
  }

  deserialize<T = any>(data: SerializationResult | string, serializerName?: string): T {
    let serialized: string;
    let type: string;

    if (typeof data === 'string') {
      serialized = data;
      type = serializerName || this.defaultSerializer.name;
    } else {
      serialized = data.serialized;
      type = data.type;
    }

    const serializer = this.get(type);
    if (!serializer) {
      throw new SerializationError(undefined, new Error(`Serializer '${type}' not found`));
    }

    return serializer.deserialize<T>(serialized);
  }

  findBestSerializer(value: any): Serializer {
    // Try specialized serializers first
    for (const serializer of this.serializers.values()) {
      if (serializer.name !== 'json' && serializer.name !== 'composite' && serializer.canHandle(value)) {
        return serializer;
      }
    }

    // Fallback to composite or JSON
    return this.get('composite') || this.defaultSerializer;
  }

  getAllSerializers(): Serializer[] {
    return Array.from(this.serializers.values());
  }

  getSerializerNames(): string[] {
    return Array.from(this.serializers.keys());
  }
}

// Utility functions
export const createSerializer = (options: SerializerOptions = {}): JSONSerializer => {
  return new JSONSerializer(options);
};

export const createCompositeSerializer = (serializers?: Serializer[]): CompositeSerializer => {
  return new CompositeSerializer(serializers);
};

export const createBinarySerializer = (): BinarySerializer => {
  return new BinarySerializer();
};

// Default instances
export const jsonSerializer = new JSONSerializer();
export const binarySerializer = new BinarySerializer();
export const compositeSerializer = new CompositeSerializer();
export const serializerManager = new SerializerManager();

// Export all serializers
export const serializers = {
  json: jsonSerializer,
  binary: binarySerializer,
  composite: compositeSerializer,
  string: new StringSerializer(),
  number: new NumberSerializer(),
  boolean: new BooleanSerializer(),
  date: new DateSerializer(),
  regexp: new RegExpSerializer(),
  map: new MapSerializer(),
  set: new SetSerializer(),
  arraybuffer: new ArrayBufferSerializer()
};

export default {
  SerializerManager,
  JSONSerializer,
  BinarySerializer,
  CompositeSerializer,
  serializers,
  serializerManager,
  createSerializer,
  createCompositeSerializer,
  createBinarySerializer
};