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
  }
  return result;
}

/**
 * Deterministically generates an IPFS CIDv0-like hash from content.
 * Uses SHA-256 and Base58 encoding with the 'Qm' multihash prefix (0x1220).
 *
 * @param {string} content - The content to hash.
 * @returns {Promise<string>} - The generated hash.
 */
export async function generateIPFSHash(content) {
  if (!content) return "";

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
