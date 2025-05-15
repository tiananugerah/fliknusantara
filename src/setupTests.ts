/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="@types/jest" />
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';

import type { Global } from '@jest/types';

declare let global: Global.Global & typeof globalThis;

// Set global TextEncoder dan TextDecoder
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;


// Setup mock untuk fetch API
global.fetch = jest.fn();

// Cleanup setelah setiap test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Mock untuk IntersectionObserver yang digunakan di useInfiniteScroll
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn().mockReturnValue([]);
}

(global).IntersectionObserver = MockIntersectionObserver;

// Mock untuk window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});