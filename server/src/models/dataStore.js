import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initialSeedData } from '../seed/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

class DataStore {
  constructor() {
    this.data = JSON.parse(JSON.stringify(initialSeedData));
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.persist();
      }
    } catch (err) {
      console.warn('[DataStore] Warning: Could not read store file, running in-memory fallback:', err.message);
    }
  }

  persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[DataStore] Warning: Persist failed, data remains in memory:', err.message);
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(initialSeedData));
    this.persist();
    return this.data;
  }

  getCollection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }

  find(collectionName, filter = {}) {
    const coll = this.getCollection(collectionName);
    return coll.filter(item => {
      for (const [key, val] of Object.entries(filter)) {
        if (item[key] !== val) return false;
      }
      return true;
    });
  }

  findById(collectionName, id) {
    const coll = this.getCollection(collectionName);
    return coll.find(item => item.id === id) || null;
  }

  findOne(collectionName, filter = {}) {
    const results = this.find(collectionName, filter);
    return results.length > 0 ? results[0] : null;
  }

  create(collectionName, item) {
    const coll = this.getCollection(collectionName);
    const id = item.id || `${collectionName.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newItem = {
      ...item,
      id,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    coll.push(newItem);
    this.persist();
    return newItem;
  }

  update(collectionName, id, updates) {
    const coll = this.getCollection(collectionName);
    const index = coll.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    coll[index] = {
      ...coll[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return coll[index];
  }

  delete(collectionName, id) {
    const coll = this.getCollection(collectionName);
    const index = coll.findIndex(item => item.id === id);
    if (index === -1) return false;
    coll.splice(index, 1);
    this.persist();
    return true;
  }
}

export const db = new DataStore();
