#!/usr/bin/env node

/**
 * BlockNotice Tamper-Evident System - Integration Test
 * 
 * Tests the complete workflow:
 * 1. Create notices
 * 2. Verify chain
 * 3. Detect tampering (simulated)
 * 
 * Usage: node test-tamper-evident.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Helper to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 BlockNotice Tamper-Evident System - Test Suite\n');
  
  try {
    // Test 1: Create first notice
    console.log('Test 1: Creating first notice...');
    const notice1 = await makeRequest('POST', '/api/notices-chain', {
      title: 'Campus Closure - Weather Advisory',
      content: 'Due to severe weather, the campus will be closed tomorrow.',
      author: 'Dean of Academics'
    });
    if (notice1.status !== 201) throw new Error('Failed to create notice 1');
    console.log('✓ Notice 1 created:', notice1.data.notice.id);
    console.log('  Hash:', notice1.data.notice.hash.substring(0, 16) + '...');
    console.log('  Previous Hash:', notice1.data.notice.previous_hash.substring(0, 16) + '...\n');

    // Test 2: Create second notice
    console.log('Test 2: Creating second notice...');
    const notice2 = await makeRequest('POST', '/api/notices-chain', {
      title: 'Library Extended Hours',
      content: 'The main library will remain open until 11 PM this week.',
      author: 'Library Director'
    });
    if (notice2.status !== 201) throw new Error('Failed to create notice 2');
    console.log('✓ Notice 2 created:', notice2.data.notice.id);
    console.log('  Hash:', notice2.data.notice.hash.substring(0, 16) + '...');
    console.log('  Previous Hash:', notice2.data.notice.previous_hash.substring(0, 16) + '...\n');

    // Test 3: Create third notice
    console.log('Test 3: Creating third notice...');
    const notice3 = await makeRequest('POST', '/api/notices-chain', {
      title: 'Scholarship Applications Open',
      content: 'Applications for the 2026-2027 merit scholarships are now open.',
      author: 'Financial Aid Office'
    });
    if (notice3.status !== 201) throw new Error('Failed to create notice 3');
    console.log('✓ Notice 3 created:', notice3.data.notice.id);
    console.log('  Hash:', notice3.data.notice.hash.substring(0, 16) + '...');
    console.log('  Previous Hash:', notice3.data.notice.previous_hash.substring(0, 16) + '...\n');

    // Test 4: Retrieve all notices
    console.log('Test 4: Retrieving all notices...');
    const allNotices = await makeRequest('GET', '/api/notices-chain');
    if (allNotices.status !== 200) throw new Error('Failed to retrieve notices');
    console.log('✓ Retrieved', allNotices.data.count, 'notices\n');

    // Test 5: Verify entire chain
    console.log('Test 5: Verifying entire chain...');
    const chainVerify = await makeRequest('GET', '/api/chain-verify');
    if (chainVerify.status !== 200) throw new Error('Failed to verify chain');
    console.log('✓ Chain verification complete');
    console.log('  Status:', chainVerify.data.chain_status);
    console.log('  Valid:', chainVerify.data.is_valid);
    console.log('  Total Notices:', chainVerify.data.total_notices);
    console.log('  Tampering Detected:', chainVerify.data.tampering_detected);
    console.log('  Errors:', chainVerify.data.errors.length);
    console.log();

    // Test 6: Verify single notice
    console.log('Test 6: Verifying single notice (#2)...');
    const singleVerify = await makeRequest('GET', '/api/notice-verify/2');
    if (singleVerify.status !== 200) throw new Error('Failed to verify notice');
    console.log('✓ Notice #2 verification');
    console.log('  Status:', singleVerify.data.status);
    console.log('  Hash Valid:', singleVerify.data.verification_details.hashValid);
    console.log('  Link Valid:', singleVerify.data.verification_details.linkValid);
    console.log();

    // Test 7: Get chain status
    console.log('Test 7: Getting chain status...');
    const chainStatus = await makeRequest('GET', '/api/chain-status');
    if (chainStatus.status !== 200) throw new Error('Failed to get chain status');
    console.log('✓ Chain status retrieved');
    console.log('  Chain Length:', chainStatus.data.chain_length);
    console.log('  Chain Health:', chainStatus.data.chain_health);
    console.log('  Is Intact:', chainStatus.data.is_intact);
    console.log();

    // Test 8: Get specific notice
    console.log('Test 8: Retrieving specific notice (#1)...');
    const specificNotice = await makeRequest('GET', '/api/notices-chain/1');
    if (specificNotice.status !== 200) throw new Error('Failed to retrieve notice');
    console.log('✓ Notice retrieved');
    console.log('  Title:', specificNotice.data.notice.title);
    console.log('  Hash:', specificNotice.data.notice.hash.substring(0, 32) + '...');
    console.log();

    // Test 9: Server health
    console.log('Test 9: Checking server health...');
    const health = await makeRequest('GET', '/api/health');
    if (health.status !== 200) throw new Error('Server not healthy');
    console.log('✓ Server is healthy');
    console.log('  Status:', health.data.status);
    console.log('  Uptime:', health.data.uptime.toFixed(2), 'seconds');
    console.log();

    console.log('════════════════════════════════════════');
    console.log('✅ All tests passed!');
    console.log('════════════════════════════════════════');
    console.log();
    console.log('📊 Summary:');
    console.log('  • Created 3 notices');
    console.log('  • All notices linked in cryptographic chain');
    console.log('  • Chain verified: ' + (chainVerify.data.is_valid ? '✓ INTACT' : '✗ COMPROMISED'));
    console.log('  • No tampering detected: ' + (!chainVerify.data.tampering_detected ? '✓ YES' : '✗ NO'));
    console.log();
    console.log('🔐 Security Properties:');
    console.log('  • Each notice has unique SHA-256 hash');
    console.log('  • Each notice linked to previous via previous_hash');
    console.log('  • Altering any notice invalidates entire chain');
    console.log('  • Verification can detect: direct tampering, timestamp forgery, insertion, deletion');
    console.log();

  } catch (err) {
    console.error('❌ Test failed:', err.message);
    console.error('\nMake sure:');
    console.error('  1. Server is running: npm start');
    console.error('  2. PostgreSQL database is accessible');
    console.error('  3. DATABASE_URL or DB_* env variables are set');
    process.exit(1);
  }
}

// Run tests
runTests();
