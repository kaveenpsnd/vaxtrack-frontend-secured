import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extends Vitest's expect with jest-dom matchers
afterEach(() => {
  cleanup();
});

// Node 25+ ships its own `localStorage`/`sessionStorage` globals, which shadow
// jsdom's and are unusable without --localstorage-file. Provide in-memory ones.
const createMemoryStorage = () => {
  let store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => { store = new Map(); },
    key: (index) => [...store.keys()][index] ?? null,
    get length() { return store.size; },
  };
};

for (const name of ['localStorage', 'sessionStorage']) {
  if (typeof globalThis[name]?.removeItem !== 'function') {
    Object.defineProperty(globalThis, name, { value: createMemoryStorage(), configurable: true, writable: true });
  }
}
