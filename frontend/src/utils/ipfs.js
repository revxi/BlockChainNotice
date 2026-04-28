const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Encode(uint8Array) {
  let x = BigInt(0);
  for (const byte of uint8Array) {
    x = x * 256n + BigInt(byte);
  }

  let result = '';
  while (x > 0n) {
    result = ALPHABET[Number(x % 58n)] + result;
    x = x / 58n;
  }

  // Handle leading zeros
  for (let i = 0; i < uint8Array.length && uint8Array[i] === 0; i++) {
    result = ALPHABET[0] + result;
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Encode(buffer) {
  let result = '';
  let x = BigInt('0x' + Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join(''));

  while (x > 0n) {
    result = BASE58_ALPHABET[Number(x % 58n)] + result;
    x = x / 58n;
  }

  // Handle leading zeros in buffer
  const uint8View = new Uint8Array(buffer);
  for (let i = 0; i < uint8View.length && uint8View[i] === 0; i++) {
    result = '1' + result;
  }

  return result;
}

/**
 * Simulates generating an IPFS CIDv0 hash for the given content.
 * Uses SHA-256 and Base58 encoding with the multihash prefix (0x1220).
 * @param {string} content - The content to hash.
 * @returns {Promise<string>} The generated IPFS hash (CIDv0).
 */
export async function generateIPFSHash(content) {
  if (!content) return "";

  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  // Use Web Crypto API for secure SHA-256 hashing
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);

  // CIDv0 format: <multihash-type><length><hash-digest>
  // 0x12 = SHA2-256, 0x20 = 32 bytes length
 * Deterministically generates an IPFS CIDv0-like hash from content.
 * Uses SHA-256 and Base58 encoding with the 'Qm' multihash prefix (0x1220).
 *
 * @param {string} content - The content to hash.
 * @returns {Promise<string>} - The generated hash.
 */
export async function generateIPFSHash(content) {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  // Hash the content using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);

  // IPFS CIDv0 (Qm...) is a multihash: 0x12 (SHA-256 prefix) + 0x20 (32 bytes length) + digest
  const multihash = new Uint8Array(2 + hashArray.length);
  multihash[0] = 0x12;
  multihash[1] = 0x20;
  multihash.set(hashArray, 2);

  return base58Encode(multihash);
}
