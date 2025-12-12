// @ts-nocheck
// Persistence Layer Types

export interface StorageMetrics {
  totalSize: number;
  itemCount: number;
  lastAccessed: number;
  hitRate: number;
  missRate: number;
  errorRate: number;
}

export interface StorageEvent {
  type: 'get' | 'set' | 'remove' | 'clear' | 'error';
  key?: string;
  timestamp: number;
  success: boolean;
  error?: Error;
  size?: number;
}

export interface StorageQuota {
  used: number;
  available: number;
  total: number;
}

export interface BackupOptions {
  includeMetadata?: boolean;
  compression?: boolean;
  encryption?: boolean;
  format?: 'json' | 'binary';
}

export interface RestoreOptions {
  overwrite?: boolean;
  merge?: boolean;
  validateSchema?: boolean;
}

export interface SyncOptions {
  endpoint: string;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  conflictResolution?: 'client' | 'server' | 'merge' | 'manual';
}

export interface CachePolicy {
  maxAge?: number;
  maxSize?: number;
  maxItems?: number;
  evictionStrategy?: 'lru' | 'lfu' | 'fifo' | 'random';
}

export interface ValidationSchema {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface MigrationContext {
  fromVersion: number;
  toVersion: number;
  data: any;
  metadata?: Record<string, any>;
}

export interface StorageTransaction {
  id: string;
  operations: StorageOperation[];
  timestamp: number;
  status: 'pending' | 'committed' | 'rolled_back';
}

export interface StorageOperation {
  type: 'get' | 'set' | 'remove';
  key: string;
  value?: any;
  previousValue?: any;
}

export interface IndexConfig {
  name: string;
  keyPath: string | string[];
  unique?: boolean;
  multiEntry?: boolean;
}

export interface QueryOptions {
  index?: string;
  range?: IDBKeyRange;
  direction?: 'next' | 'nextunique' | 'prev' | 'prevunique';
  limit?: number;
  offset?: number;
}

export interface StorageHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  issues: string[];
  metrics: StorageMetrics;
}

export interface CompressionResult {
  compressed: string;
  originalSize: number;
  compressedSize: number;
  ratio: number;
}

export interface EncryptionResult {
  encrypted: string;
  iv?: string;
  salt?: string;
  algorithm: string;
}

export interface SerializationResult {
  serialized: string;
  type: string;
  metadata?: Record<string, any>;
}

export type StorageEventListener = (event: StorageEvent) => void;
export type MigrationFunction = (context: MigrationContext) => any;
export type ValidationFunction = (data: any, schema?: ValidationSchema) => boolean;
export type ConflictResolver = (local: any, remote: any, key: string) => any;

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type StorageKey = string | number;
export type StorageValue = any;

export interface TypedStorageAdapter<T = any> {
  get(key: StorageKey): Promise<T | null>;
  set(key: StorageKey, value: T): Promise<void>;
  remove(key: StorageKey): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<StorageKey[]>;
  has(key: StorageKey): Promise<boolean>;
}

export interface BatchOperation<T = any> {
  type: 'set' | 'remove';
  key: StorageKey;
  value?: T;
}

export interface BatchResult {
  success: boolean;
  results: Array<{ key: StorageKey; success: boolean; error?: Error }>;
}

export interface StorageStats {
  reads: number;
  writes: number;
  deletes: number;
  errors: number;
  totalSize: number;
  averageItemSize: number;
  oldestItem: number;
  newestItem: number;
}

export interface CacheItem<T = any> {
  key: StorageKey;
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  ttl?: number;
}

export interface EvictionCandidate {
  key: StorageKey;
  score: number;
  reason: string;
}

export interface StorageConfig {
  name: string;
  version: number;
  adapter: string;
  options: Record<string, any>;
  migrations: Record<number, MigrationFunction>;
  validation?: ValidationSchema;
  encryption?: boolean;
  compression?: boolean;
  backup?: BackupOptions;
  sync?: SyncOptions;
  cache?: CachePolicy;
}

export interface StorageProvider {
  name: string;
  create(config: StorageConfig): Promise<any>;
  isSupported(): boolean;
  getQuota?(): Promise<StorageQuota>;
  cleanup?(): Promise<void>;
}

// Error types
export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public key?: StorageKey,
    public operation?: string
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export class QuotaExceededError extends StorageError {
  constructor(key?: StorageKey) {
    super('Storage quota exceeded', 'QUOTA_EXCEEDED', key, 'set');
    this.name = 'QuotaExceededError';
  }
}

export class SerializationError extends StorageError {
  constructor(key?: StorageKey, cause?: Error) {
    super(`Serialization failed: ${cause?.message}`, 'SERIALIZATION_ERROR', key, 'serialize');
    this.name = 'SerializationError';
  }
}

export class EncryptionError extends StorageError {
  constructor(key?: StorageKey, cause?: Error) {
    super(`Encryption failed: ${cause?.message}`, 'ENCRYPTION_ERROR', key, 'encrypt');
    this.name = 'EncryptionError';
  }
}

export class MigrationError extends StorageError {
  constructor(fromVersion: number, toVersion: number, cause?: Error) {
    super(
      `Migration failed from version ${fromVersion} to ${toVersion}: ${cause?.message}`,
      'MIGRATION_ERROR'
    );
    this.name = 'MigrationError';
  }
}

export class ValidationError extends StorageError {
  constructor(key?: StorageKey, schema?: string) {
    super(`Validation failed for key ${key} against schema ${schema}`, 'VALIDATION_ERROR', key, 'validate');
    this.name = 'ValidationError';
  }
}

export class SyncError extends StorageError {
  constructor(endpoint: string, cause?: Error) {
    super(`Sync failed with endpoint ${endpoint}: ${cause?.message}`, 'SYNC_ERROR');
    this.name = 'SyncError';
  }
}

// Event types
export interface StorageEventMap {
  'storage:get': { key: StorageKey; value: any; hit: boolean };
  'storage:set': { key: StorageKey; value: any; previousValue?: any };
  'storage:remove': { key: StorageKey; previousValue?: any };
  'storage:clear': { count: number };
  'storage:error': { error: StorageError; operation: string };
  'storage:quota': { used: number; available: number };
  'storage:sync': { status: 'start' | 'success' | 'error'; endpoint: string };
  'storage:migration': { fromVersion: number; toVersion: number; status: 'start' | 'success' | 'error' };
}

export type StorageEventType = keyof StorageEventMap;
export type StorageEventData<T extends StorageEventType> = StorageEventMap[T];

// Plugin types
export interface StoragePlugin {
  name: string;
  version: string;
  install(storage: any): void;
  uninstall?(storage: any): void;
}

export interface MiddlewareContext {
  operation: string;
  key: StorageKey;
  value?: any;
  options?: any;
}

export type MiddlewareFunction = (
  context: MiddlewareContext,
  next: () => Promise<any>
) => Promise<any>;

export interface StorageMiddleware {
  name: string;
  handler: MiddlewareFunction;
  priority?: number;
}

// Advanced types
export interface StorageIndex {
  name: string;
  keyPath: string | string[];
  unique: boolean;
  multiEntry: boolean;
}

export interface StorageSchema {
  version: number;
  stores: Record<string, {
    keyPath?: string;
    autoIncrement?: boolean;
    indexes?: StorageIndex[];
  }>;
}

export interface TransactionOptions {
  mode?: 'readonly' | 'readwrite';
  durability?: 'default' | 'strict' | 'relaxed';
  timeout?: number;
}

export interface CursorOptions {
  direction?: 'next' | 'nextunique' | 'prev' | 'prevunique';
  range?: IDBKeyRange;
}

export interface BulkOperationOptions {
  batchSize?: number;
  parallel?: boolean;
  continueOnError?: boolean;
}

export interface StorageObserver {
  observe(key: StorageKey | RegExp, callback: (event: StorageEvent) => void): () => void;
  unobserve(key: StorageKey | RegExp): void;
  unobserveAll(): void;
}

export interface StorageReplication {
  replicate(target: StorageAdapter, options?: ReplicationOptions): Promise<void>;
  startReplication(target: StorageAdapter, options?: ReplicationOptions): () => void;
  stopReplication(): void;
}

export interface ReplicationOptions {
  direction?: 'push' | 'pull' | 'sync';
  filter?: (key: StorageKey, value: any) => boolean;
  transform?: (key: StorageKey, value: any) => any;
  conflictResolution?: ConflictResolver;
  continuous?: boolean;
  interval?: number;
}

// Type guards
export const isStorageError = (error: any): error is StorageError => {
  return error instanceof StorageError;
};

export const isQuotaExceededError = (error: any): error is QuotaExceededError => {
  return error instanceof QuotaExceededError;
};

export const isSerializationError = (error: any): error is SerializationError => {
  return error instanceof SerializationError;
};

export const isEncryptionError = (error: any): error is EncryptionError => {
  return error instanceof EncryptionError;
};

export const isMigrationError = (error: any): error is MigrationError => {
  return error instanceof MigrationError;
};

export const isValidationError = (error: any): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isSyncError = (error: any): error is SyncError => {
  return error instanceof SyncError;
};
