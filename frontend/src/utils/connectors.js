/**
 * Helper to find an injected/MetaMask connector robustly
 * @param {Array} connectors - Array of wagmi connectors
 * @returns {Object|undefined} - The found connector or undefined
 */
export const findInjectedConnector = (connectors) =>
  connectors.find(
    (c) =>
      c.id === "injected" ||
      c.id === "metaMask" ||
      c.id === "metamask" ||
      (c.name && /meta/i.test(c.name)) ||
      /meta/i.test(c.id)
  );
