import { describe, it, expect } from 'vitest';
import { generateIPFSHash } from './ipfs';

// Mock crypto if not available in environment
if (typeof crypto === 'undefined') {
  globalThis.crypto = {
    subtle: {
      digest: async () => {
        // Simple mock of SHA-256 for testing purposes if Web Crypto is missing
        // In a real browser/Node 19+ this won't be needed
        return new Uint8Array(32).fill(1).buffer;
      }
    }
  };
}

describe('generateIPFSHash', () => {
  it('should generate a Qm-prefixed hash', async () => {
    const hash = await generateIPFSHash('test content');
    expect(hash).toMatch(/^Qm/);
  });

  it('should be deterministic', async () => {
    const content = 'hello world';
    const hash1 = await generateIPFSHash(content);
    const hash2 = await generateIPFSHash(content);
    expect(hash1).toBe(hash2);
  });

  it('should return empty string for empty input', async () => {
    const hash = await generateIPFSHash('');
    expect(hash).toBe('');
  });
});
