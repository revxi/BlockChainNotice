const crypto = require('crypto');

function calculateHash(noticeData, timestamp, previousHash) {
  const dataString = JSON.stringify({
    noticeData,
    timestamp,
    previousHash
  });
  return crypto.createHash('sha256').update(dataString).digest('hex');
}

function getGenesisHash() {
  return '0000000000000000';
}

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

    if (notice.previous_hash !== previousHash) {
      tamperedNotices.push({
        id: notice.id,
        reason: 'Previous hash link broken - notice sequence may have been altered',
        expectedPreviousHash: previousHash,
        storedPreviousHash: notice.previous_hash
      });
      errors.push(`Notice ${notice.id}: Previous hash link broken`);
    }

    previousHash = notice.hash;
  }

  return {
    isValid: tamperedNotices.length === 0,
    tamperedNotices,
    errors
  };
}

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
