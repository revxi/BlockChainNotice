import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { findInjectedConnector, isMetaMaskInstalled } from './connectors';

describe('connectors utilities', () => {
  describe('findInjectedConnector', () => {
    it('should return undefined for empty or falsy inputs', () => {
      expect(findInjectedConnector()).toBeUndefined();
      expect(findInjectedConnector(null)).toBeUndefined();
      expect(findInjectedConnector([])).toBeUndefined();
    });

    it('should return the MetaMask connector when it is present', () => {
      const metamaskConnector = { id: 'metaMask' };
      const injectedConnector = { id: 'injected' };
      const otherConnector = { id: 'other' };

      expect(findInjectedConnector([injectedConnector, metamaskConnector, otherConnector])).toBe(metamaskConnector);

      const metamaskLower = { id: 'metamask' };
      expect(findInjectedConnector([injectedConnector, metamaskLower, otherConnector])).toBe(metamaskLower);
    });

    it('should fall back to the generic "injected" connector if MetaMask is not found', () => {
      const injectedConnector = { id: 'injected' };
      const otherConnector = { id: 'other' };

      expect(findInjectedConnector([otherConnector, injectedConnector])).toBe(injectedConnector);
    });

    it('should fall back to the first available connector if neither MetaMask nor "injected" are present', () => {
      const otherConnector1 = { id: 'other1' };
      const otherConnector2 = { id: 'other2' };

      expect(findInjectedConnector([otherConnector1, otherConnector2])).toBe(otherConnector1);
    });
  });

  describe('isMetaMaskInstalled', () => {
    let originalWindow;

    beforeEach(() => {
      // Vitest runs in JSDOM, so window might be defined but let's mock it for tests
      originalWindow = global.window;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it('should return false if window or window.ethereum are undefined', () => {
      // Need to use vi.stubGlobal for modifying window in vitest correctly
      // But we can also just temporarily override globalThis.window

      // Test when window is explicitly undefined (e.g., node environment)
      const prevWindow = globalThis.window;
      globalThis.window = undefined;
      expect(isMetaMaskInstalled()).toBe(false);

      // Test when window exists but ethereum is undefined
      globalThis.window = {};
      expect(isMetaMaskInstalled()).toBe(false);

      globalThis.window = prevWindow;
    });

    it('should return true if window.ethereum.isMetaMask is true', () => {
      const prevWindow = globalThis.window;
      globalThis.window = {
        ethereum: {
          isMetaMask: true
        }
      };
      expect(isMetaMaskInstalled()).toBe(true);
      globalThis.window = prevWindow;
    });

    it('should return true if window.ethereum.providers array contains a provider with isMetaMask set to true', () => {
      const prevWindow = globalThis.window;
      globalThis.window = {
        ethereum: {
          providers: [
            { isMetaMask: false },
            { isMetaMask: true }
          ]
        }
      };
      expect(isMetaMaskInstalled()).toBe(true);
      globalThis.window = prevWindow;
    });

    it('should return false if ethereum exists but isMetaMask is false and no providers have it', () => {
      const prevWindow = globalThis.window;
      globalThis.window = {
        ethereum: {
          isMetaMask: false,
          providers: [
            { isMetaMask: false }
          ]
        }
      };
      expect(isMetaMaskInstalled()).toBe(false);
      globalThis.window = prevWindow;
    });
  });
});
