// Storage Migrations Utilities

import { MigrationFunction, MigrationContext, MigrationError } from './types';

export interface Migration {
  version: number;
  description: string;
  up: MigrationFunction;
  down?: MigrationFunction;
  validate?: (data: any) => boolean;
}

export interface MigrationPlan {
  from: number;
  to: number;
  migrations: Migration[];
  rollback?: boolean;
}

export class MigrationManager {
  private migrations = new Map<number, Migration>();
  private history: number[] = [];

  constructor(migrations: Migration[] = []) {
    migrations.forEach(migration => this.addMigration(migration));
  }

  addMigration(migration: Migration): void {
    if (this.migrations.has(migration.version)) {
      throw new Error(`Migration for version ${migration.version} already exists`);
    }
    this.migrations.set(migration.version, migration);
  }

  removeMigration(version: number): void {
    this.migrations.delete(version);
  }

  getMigration(version: number): Migration | undefined {
    return this.migrations.get(version);
  }

  getAllMigrations(): Migration[] {
    return Array.from(this.migrations.values()).sort((a, b) => a.version - b.version);
  }

  createMigrationPlan(fromVersion: number, toVersion: number): MigrationPlan {
    const allMigrations = this.getAllMigrations();
    const isRollback = toVersion < fromVersion;
    
    let relevantMigrations: Migration[];
    
    if (isRollback) {
      // For rollback, we need migrations from toVersion+1 to fromVersion (inclusive)
      relevantMigrations = allMigrations
        .filter(m => m.version > toVersion && m.version <= fromVersion)
        .reverse(); // Apply in reverse order for rollback
    } else {
      // For upgrade, we need migrations from fromVersion+1 to toVersion (inclusive)
      relevantMigrations = allMigrations
        .filter(m => m.version > fromVersion && m.version <= toVersion);
    }

    return {
      from: fromVersion,
      to: toVersion,
      migrations: relevantMigrations,
      rollback: isRollback
    };
  }

  async executeMigrationPlan(plan: MigrationPlan, data: any, metadata?: Record<string, any>): Promise<any> {
    let currentData = data;
    let currentVersion = plan.from;

    try {
      for (const migration of plan.migrations) {
        const context: MigrationContext = {
          fromVersion: currentVersion,
          toVersion: plan.rollback ? migration.version - 1 : migration.version,
          data: currentData,
          metadata
        };

        // Validate data before migration if validator exists
        if (migration.validate && !migration.validate(currentData)) {
          throw new MigrationError(
            context.fromVersion,
            context.toVersion,
            new Error(`Data validation failed for migration ${migration.version}`)
          );
        }

        // Execute migration
        if (plan.rollback) {
          if (!migration.down) {
            throw new MigrationError(
              context.fromVersion,
              context.toVersion,
              new Error(`No rollback function defined for migration ${migration.version}`)
            );
          }
          currentData = await migration.down(context);
          currentVersion = migration.version - 1;
        } else {
          currentData = await migration.up(context);
          currentVersion = migration.version;
        }

        // Track migration in history
        if (plan.rollback) {
          const index = this.history.indexOf(migration.version);
          if (index > -1) {
            this.history.splice(index, 1);
          }
        } else {
          if (!this.history.includes(migration.version)) {
            this.history.push(migration.version);
          }
        }
      }

      return currentData;
    } catch (error) {
      throw new MigrationError(
        plan.from,
        plan.to,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  async migrate(data: any, fromVersion: number, toVersion: number, metadata?: Record<string, any>): Promise<any> {
    if (fromVersion === toVersion) {
      return data;
    }

    const plan = this.createMigrationPlan(fromVersion, toVersion);
    return this.executeMigrationPlan(plan, data, metadata);
  }

  async rollback(data: any, fromVersion: number, toVersion: number, metadata?: Record<string, any>): Promise<any> {
    if (fromVersion <= toVersion) {
      throw new Error('Rollback target version must be lower than current version');
    }

    return this.migrate(data, fromVersion, toVersion, metadata);
  }

  getHistory(): number[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  getLatestVersion(): number {
    const versions = Array.from(this.migrations.keys());
    return versions.length > 0 ? Math.max(...versions) : 0;
  }

  hasVersion(version: number): boolean {
    return this.migrations.has(version);
  }

  validateMigrationChain(): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    const versions = Array.from(this.migrations.keys()).sort((a, b) => a - b);
    
    // Check for gaps in version numbers
    for (let i = 1; i < versions.length; i++) {
      if (versions[i] - versions[i - 1] > 1) {
        issues.push(`Gap in migration versions: ${versions[i - 1]} -> ${versions[i]}`);
      }
    }

    // Check for missing rollback functions
    for (const migration of this.migrations.values()) {
      if (!migration.down) {
        issues.push(`Migration ${migration.version} has no rollback function`);
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

// Common migration utilities
export const migrationUtils = {
  // Add a field with default value
  addField: (fieldName: string, defaultValue: any) => (context: MigrationContext) => {
    if (Array.isArray(context.data)) {
      return context.data.map(item => ({ ...item, [fieldName]: defaultValue }));
    } else if (typeof context.data === 'object' && context.data !== null) {
      return { ...context.data, [fieldName]: defaultValue };
    }
    return context.data;
  },

  // Remove a field
  removeField: (fieldName: string) => (context: MigrationContext) => {
    if (Array.isArray(context.data)) {
      return context.data.map(item => {
        const { [fieldName]: removed, ...rest } = item;
        return rest;
      });
    } else if (typeof context.data === 'object' && context.data !== null) {
      const { [fieldName]: removed, ...rest } = context.data;
      return rest;
    }
    return context.data;
  },

  // Rename a field
  renameField: (oldName: string, newName: string) => (context: MigrationContext) => {
    if (Array.isArray(context.data)) {
      return context.data.map(item => {
        if (item.hasOwnProperty(oldName)) {
          const { [oldName]: value, ...rest } = item;
          return { ...rest, [newName]: value };
        }
        return item;
      });
    } else if (typeof context.data === 'object' && context.data !== null && context.data.hasOwnProperty(oldName)) {
      const { [oldName]: value, ...rest } = context.data;
      return { ...rest, [newName]: value };
    }
    return context.data;
  },

  // Transform field value
  transformField: (fieldName: string, transformer: (value: any) => any) => (context: MigrationContext) => {
    if (Array.isArray(context.data)) {
      return context.data.map(item => {
        if (item.hasOwnProperty(fieldName)) {
          return { ...item, [fieldName]: transformer(item[fieldName]) };
        }
        return item;
      });
    } else if (typeof context.data === 'object' && context.data !== null && context.data.hasOwnProperty(fieldName)) {
      return { ...context.data, [fieldName]: transformer(context.data[fieldName]) };
    }
    return context.data;
  },

  // Change data structure
  restructure: (restructurer: (data: any) => any) => (context: MigrationContext) => {
    return restructurer(context.data);
  },

  // Validate data structure
  validate: (validator: (data: any) => boolean, errorMessage?: string) => (context: MigrationContext) => {
    if (!validator(context.data)) {
      throw new Error(errorMessage || `Data validation failed for migration from ${context.fromVersion} to ${context.toVersion}`);
    }
    return context.data;
  },

  // Combine multiple migrations
  combine: (...migrations: MigrationFunction[]) => async (context: MigrationContext) => {
    let result = context.data;
    for (const migration of migrations) {
      result = await migration({ ...context, data: result });
    }
    return result;
  },

  // Conditional migration
  conditional: (condition: (data: any) => boolean, migration: MigrationFunction) => (context: MigrationContext) => {
    if (condition(context.data)) {
      return migration(context);
    }
    return context.data;
  }
};

// Pre-built common migrations
export const commonMigrations = {
  // Version 1 -> 2: Add timestamps
  addTimestamps: {
    version: 2,
    description: 'Add created and updated timestamps',
    up: migrationUtils.combine(
      migrationUtils.addField('createdAt', Date.now()),
      migrationUtils.addField('updatedAt', Date.now())
    ),
    down: migrationUtils.combine(
      migrationUtils.removeField('createdAt'),
      migrationUtils.removeField('updatedAt')
    )
  },

  // Version 2 -> 3: Add user ID field
  addUserId: {
    version: 3,
    description: 'Add user ID field',
    up: migrationUtils.addField('userId', null),
    down: migrationUtils.removeField('userId')
  },

  // Version 3 -> 4: Convert string IDs to numbers
  convertIdsToNumbers: {
    version: 4,
    description: 'Convert string IDs to numbers',
    up: migrationUtils.transformField('id', (value: any) => {
      const num = parseInt(value, 10);
      return isNaN(num) ? value : num;
    }),
    down: migrationUtils.transformField('id', (value: any) => String(value))
  },

  // Version 4 -> 5: Normalize email addresses
  normalizeEmails: {
    version: 5,
    description: 'Normalize email addresses to lowercase',
    up: migrationUtils.transformField('email', (value: any) => 
      typeof value === 'string' ? value.toLowerCase().trim() : value
    ),
    down: (context: MigrationContext) => context.data // No rollback needed
  },

  // Version 5 -> 6: Split full name into first and last name
  splitFullName: {
    version: 6,
    description: 'Split fullName into firstName and lastName',
    up: (context: MigrationContext) => {
      if (Array.isArray(context.data)) {
        return context.data.map(item => {
          if (item.fullName && typeof item.fullName === 'string') {
            const parts = item.fullName.trim().split(' ');
            const firstName = parts[0] || '';
            const lastName = parts.slice(1).join(' ') || '';
            const { fullName, ...rest } = item;
            return { ...rest, firstName, lastName };
          }
          return item;
        });
      } else if (typeof context.data === 'object' && context.data !== null && context.data.fullName) {
        const parts = context.data.fullName.trim().split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';
        const { fullName, ...rest } = context.data;
        return { ...rest, firstName, lastName };
      }
      return context.data;
    },
    down: (context: MigrationContext) => {
      if (Array.isArray(context.data)) {
        return context.data.map(item => {
          if (item.firstName || item.lastName) {
            const fullName = `${item.firstName || ''} ${item.lastName || ''}`.trim();
            const { firstName, lastName, ...rest } = item;
            return { ...rest, fullName };
          }
          return item;
        });
      } else if (typeof context.data === 'object' && context.data !== null) {
        if (context.data.firstName || context.data.lastName) {
          const fullName = `${context.data.firstName || ''} ${context.data.lastName || ''}`.trim();
          const { firstName, lastName, ...rest } = context.data;
          return { ...rest, fullName };
        }
      }
      return context.data;
    }
  }
};

// Migration builder for fluent API
export class MigrationBuilder {
  private migration: Partial<Migration> = {};

  version(version: number): this {
    this.migration.version = version;
    return this;
  }

  description(description: string): this {
    this.migration.description = description;
    return this;
  }

  up(fn: MigrationFunction): this {
    this.migration.up = fn;
    return this;
  }

  down(fn: MigrationFunction): this {
    this.migration.down = fn;
    return this;
  }

  validate(fn: (data: any) => boolean): this {
    this.migration.validate = fn;
    return this;
  }

  build(): Migration {
    if (!this.migration.version || !this.migration.up) {
      throw new Error('Migration must have version and up function');
    }
    return this.migration as Migration;
  }
}

// Factory function for creating migrations
export const createMigration = (version: number, description: string) => {
  return new MigrationBuilder().version(version).description(description);
};

// Default migration manager instance
export const defaultMigrationManager = new MigrationManager([
  commonMigrations.addTimestamps,
  commonMigrations.addUserId,
  commonMigrations.convertIdsToNumbers,
  commonMigrations.normalizeEmails,
  commonMigrations.splitFullName
]);

// Export utilities
export { MigrationError } from './types';

export default {
  MigrationManager,
  MigrationBuilder,
  migrationUtils,
  commonMigrations,
  createMigration,
  defaultMigrationManager
};