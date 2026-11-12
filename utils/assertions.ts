import { expect } from '@playwright/test';
import type { Product } from '../api/types';

/** Extracts the decimal amount from currency labels like `$29.99` or `Tax: $3.20`. */
export function parsePrice(label: string): number {
  const match = label.match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    throw new Error(`Unable to parse numeric price from label: "${label}"`);
  }
  return Number.parseFloat(match[1]);
}

/** Verifies whether an array of strings or numbers is ordered consistently. */
export function isSorted(
  values: readonly string[] | readonly number[],
  direction: 'asc' | 'desc',
): boolean {
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1];
    const curr = values[i];
    const diff =
      typeof prev === 'string'
        ? prev.localeCompare(curr as string)
        : (prev as number) - (curr as number);

    if ((direction === 'asc' && diff > 0) || (direction === 'desc' && diff < 0)) {
      return false;
    }
  }
  return true;
}

/** Asserts core schema invariants on a product payload returned by the REST API. */
export function assertValidProductSchema(product: Product): void {
  expect(typeof product.id).toBe('number');
  expect(product.id).toBeGreaterThan(0);
  expect(typeof product.title).toBe('string');
  expect(product.title.trim().length).toBeGreaterThan(0);
  expect(typeof product.category).toBe('string');
  expect(typeof product.price).toBe('number');
  expect(product.price).toBeGreaterThan(0);
}
