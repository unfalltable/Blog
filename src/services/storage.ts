import * as fs from 'fs';
import * as path from 'path';

// ============================================
// File Lock Manager
// Simple in-memory lock for concurrent access
// ============================================

class FileLockManager {
  private locks: Map<string, Promise<void>> = new Map();

  async acquireLock(filePath: string): Promise<() => void> {
    // Wait for any existing lock to be released
    while (this.locks.has(filePath)) {
      await this.locks.get(filePath);
    }

    // Create a new lock
    let releaseLock: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    this.locks.set(filePath, lockPromise);

    return () => {
      this.locks.delete(filePath);
      releaseLock!();
    };
  }
}

const lockManager = new FileLockManager();

// ============================================
// Base Entity Interface
// ============================================

export interface BaseEntity {
  id: string;
}

// ============================================
// JSON Storage Service
// Generic CRUD operations for JSON file storage
// Requirements: 1.5, 1.6, 3.4, 3.5, 5.5, 5.6, 7.6, 7.7
// ============================================

export class JsonStorageService<T extends BaseEntity> {
  private filePath: string;

  constructor(fileName: string) {
    this.filePath = path.join(process.cwd(), 'data', fileName);
  }

  /**
   * Read all items from the JSON file
   */
  async getAll(): Promise<T[]> {
    const release = await lockManager.acquireLock(this.filePath);
    try {
      return this.readFile();
    } finally {
      release();
    }
  }


  /**
   * Get a single item by ID
   */
  async getById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find((item) => item.id === id) || null;
  }

  /**
   * Create a new item
   */
  async create(item: T): Promise<T> {
    const release = await lockManager.acquireLock(this.filePath);
    try {
      const items = this.readFile();
      items.push(item);
      this.writeFile(items);
      return item;
    } finally {
      release();
    }
  }

  /**
   * Update an existing item
   */
  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const release = await lockManager.acquireLock(this.filePath);
    try {
      const items = this.readFile();
      const index = items.findIndex((item) => item.id === id);

      if (index === -1) {
        return null;
      }

      items[index] = { ...items[index], ...updates };
      this.writeFile(items);
      return items[index];
    } finally {
      release();
    }
  }

  /**
   * Delete an item by ID
   */
  async delete(id: string): Promise<boolean> {
    const release = await lockManager.acquireLock(this.filePath);
    try {
      const items = this.readFile();
      const index = items.findIndex((item) => item.id === id);

      if (index === -1) {
        return false;
      }

      items.splice(index, 1);
      this.writeFile(items);
      return true;
    } finally {
      release();
    }
  }

  /**
   * Find items matching a predicate
   */
  async find(predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.getAll();
    return items.filter(predicate);
  }

  /**
   * Check if an item exists
   */
  async exists(id: string): Promise<boolean> {
    const item = await this.getById(id);
    return item !== null;
  }

  /**
   * Get count of all items
   */
  async count(): Promise<number> {
    const items = await this.getAll();
    return items.length;
  }

  /**
   * Replace all items (useful for bulk operations)
   */
  async replaceAll(items: T[]): Promise<void> {
    const release = await lockManager.acquireLock(this.filePath);
    try {
      this.writeFile(items);
    } finally {
      release();
    }
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  private readFile(): T[] {
    try {
      if (!fs.existsSync(this.filePath)) {
        return [];
      }
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content) as T[];
    } catch {
      return [];
    }
  }

  private writeFile(items: T[]): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2), 'utf-8');
  }
}


// ============================================
// Serialization Utilities
// For round-trip serialization testing
// ============================================

export function serialize<T>(data: T): string {
  return JSON.stringify(data);
}

export function deserialize<T>(json: string): T {
  return JSON.parse(json) as T;
}

/**
 * Round-trip serialization: serialize then deserialize
 * Used for property testing to verify data integrity
 */
export function roundTrip<T>(data: T): T {
  return deserialize<T>(serialize(data));
}

// ============================================
// Profile Storage Service
// Special handling for single-object storage
// ============================================

export class ProfileStorageService<T> {
  private filePath: string;

  constructor(fileName: string) {
    this.filePath = path.join(process.cwd(), 'data', fileName);
  }

  async get(): Promise<T | null> {
    const release = await lockManager.acquireLock(this.filePath);
    try {
      return this.readFile();
    } finally {
      release();
    }
  }

  async save(data: T): Promise<T> {
    const release = await lockManager.acquireLock(this.filePath);
    try {
      this.writeFile(data);
      return data;
    } finally {
      release();
    }
  }

  private readFile(): T | null {
    try {
      if (!fs.existsSync(this.filePath)) {
        return null;
      }
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch {
      return null;
    }
  }

  private writeFile(data: T): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
