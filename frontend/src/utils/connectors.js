/**
 * Returns the best available connector in priority order:
 *  1. MetaMask-specific connector (opens MetaMask popup)
 *  2. Any injected EIP-1193 connector
 *  3. First available connector
 */
export const findInjectedConnector = (connectors) => {
  if (!connectors || connectors.length === 0) return undefined;

  const metaMaskConnector = connectors.find(
    (c) => c.id === "metaMask" || c.id === "metamask"
  );
  if (metaMaskConnector) return metaMaskConnector;

  const injectedConnector = connectors.find((c) => c.id === "injected");
  if (injectedConnector) return injectedConnector;

  return connectors[0];
};

/**
 * Returns true if MetaMask is installed in the browser.
 */
export const isMetaMaskInstalled = () =>
  typeof window !== "undefined" &&
  typeof window.ethereum !== "undefined" &&
  (window.ethereum.isMetaMask === true ||
    window.ethereum.providers?.some?.((p) => p.isMetaMask));
