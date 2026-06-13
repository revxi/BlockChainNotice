const crypto = require('crypto');

/**
 * Calculate SHA-256 hash of notice data
 * @param {Object} noticeData - The notice payload { title, content }
 * @param {string} timestamp - ISO timestamp of creation
 * @param {string} previousHash - Hash of the previous notice
 * @returns {string} - SHA-256 hex digest
 */
function calculateHash(noticeData, timestamp, previousHash) {
  // Stringify predictably to ensure consistent hashing
  const dataString = JSON.stringify({
    noticeData,
    timestamp,
    previousHash
  });
  return crypto.createHash('sha256').update(dataString).digest('hex');
}

/**
 * Get the genesis hash (used for the first notice in the chain)
 * @returns {string}
 */
function getGenesisHash() {
  return '0000000000000000';
}

/**
 * Verify the entire notice chain
 * Checks that each notice's hash is correctly computed and linked
 * @param {Array} notices - All notices from database in chronological order
 * @returns {Object} - { isValid: boolean, tamperedNotices: [], errors: [] }
 */
function verifyChain(notices) {
  const tamperedNotices = [];
  const errors = [];

  if (!notices || notices.length === 0) {
    return { isValid: true, tamperedNotices: [], errors: [] };
  }

  let previousHash = getGenesisHash();

  for (let i = 0; i < notices.length; i++) {
    const notice = notices[i];
    const noticeData = { title: notice.title, content: notice.content };

    // 1. Verify the notice's own hash is correct
    const recomputedHash = calculateHash(
      noticeData,
      notice.created_at,
      notice.previous_hash
    );

    if (recomputedHash !== notice.hash) {
      tamperedNotices.push({
        id: notice.id,
        reason: 'Hash mismatch - notice payload, timestamp, or reference may have been altered',
        storedHash: notice.hash,
        recomputedHash
      });
      errors.push(`Notice ${notice.id}: Hash verification failed`);
    }

    // 2. Verify the previous_hash link is correct
    if (notice.previous_hash !== previousHash) {
      tamperedNotices.push({
        id: notice.id,
        reason: 'Previous hash link broken - notice sequence may have been altered',
        expectedPreviousHash: previousHash,
        storedPreviousHash: notice.previous_hash
      });
      errors.push(`Notice ${notice.id}: Previous hash link broken`);
    }

    // Move forward in the chain
    previousHash = notice.hash;
  }

  return {
    isValid: tamperedNotices.length === 0,
    tamperedNotices,
    errors
  };
}

/**
 * Verify a single notice in the chain
 * @param {Object} notice - The notice to verify
 * @param {string} expectedPreviousHash - The expected previous hash
 * @returns {Object} - { isValid: boolean, details: {} }
 */
function verifySingleNotice(notice, expectedPreviousHash = getGenesisHash()) {
  const noticeData = { title: notice.title, content: notice.content };
  const recomputedHash = calculateHash(
    noticeData,
    notice.created_at,
    notice.previous_hash
  );

  const hashValid = recomputedHash === notice.hash;
  const linkValid = notice.previous_hash === expectedPreviousHash;

  return {
    isValid: hashValid && linkValid,
    details: {
      hashValid,
      linkValid,
      storedHash: notice.hash,
      recomputedHash,
      storedPreviousHash: notice.previous_hash,
      expectedPreviousHash
    }
  };
}

module.exports = {
  calculateHash,
  getGenesisHash,
  verifyChain,
  verifySingleNotice
};
