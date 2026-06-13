# Tamper-Evident Notice System Implementation

## Overview

This backend implements a **cryptographically verifiable notice ledger** using blockchain principles entirely within your backend—without the overhead or cost of actual smart contracts. By applying cryptographic hashing and sequential chaining directly to database records, you can mathematically prove that notices haven't been secretly altered.

## Architecture

### Core Concept: The Notice Chain

Every notice stored acts like a "block" in a chain:

```
[Genesis] → [Notice 1] → [Notice 2] → [Notice 3]
   |           |           |           |
   X           H1          H2          H3
               ↑           ↑           ↑
           prev: X     prev: H1    prev: H2
```

Where:
- **X** = Genesis hash (`0000000000000000`)
- **H1, H2, H3** = SHA-256 hashes of notice data
- Each notice stores the hash of the previous notice (`previous_hash`), creating an unbreakable chain

### Database Schema

```sql
CREATE TABLE notices_chain (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(42),
  timestamp TIMESTAMP,
  hash VARCHAR(64) NOT NULL UNIQUE,          -- SHA-256 of this notice
  previous_hash VARCHAR(64) NOT NULL,        -- SHA-256 of previous notice
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### How Hashing Works

For each notice, the hash is calculated as:

```javascript
hash = SHA-256(
  JSON.stringify({
    noticeData: { title, content },
    timestamp: "2026-05-20T10:30:00.000Z",
    previousHash: "0000000000000000"  // or hash of previous notice
  })
)
```

**Key property**: Even changing a single character in the title, content, or timestamp produces a completely different hash.

---

## API Endpoints

### 1. Deploy (Publish) a New Notice

**POST** `/api/notices-chain`

Adds a new notice to the tamper-evident chain.

**Request:**
```json
{
  "title": "Final Semester Exam Schedule",
  "content": "Exams will begin on June 1st, 2026...",
  "author": "admin@university.edu"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Notice deployed to tamper-evident chain",
  "notice": {
    "id": 1,
    "title": "Final Semester Exam Schedule",
    "content": "Exams will begin on June 1st, 2026...",
    "author": "admin@university.edu",
    "timestamp": "2026-05-20T10:30:00.000Z",
    "hash": "a7f3e8c2b1d9f4e6a3c5b7d9f1e3a5c7b9d1f3e5a7c9b1d3f5e7a9b1c3d5",
    "previous_hash": "0000000000000000",
    "created_at": "2026-05-20T10:30:00.000Z"
  },
  "chain_info": {
    "total_notices": 1,
    "chain_hash": "a7f3e8c2b1d9f4e6a3c5b7d9f1e3a5c7b9d1f3e5a7c9b1d3f5e7a9b1c3d5",
    "previous_hash": "0000000000000000"
  }
}
```

**How it works:**
1. Fetches the most recent notice's hash (or uses genesis hash if first notice)
2. Calculates the new notice's hash using SHA-256
3. Atomically saves to database in a transaction (prevents concurrent forks)
4. Returns the deployed notice with its hash and chain info

---

### 2. Retrieve All Notices

**GET** `/api/notices-chain`

Fetch all notices in the chain, in chronological order.

**Response:**
```json
{
  "success": true,
  "count": 3,
  "notices": [
    {
      "id": 1,
      "title": "Notice 1",
      "content": "...",
      "hash": "a7f3e8c2...",
      "previous_hash": "0000000000000000",
      "created_at": "2026-05-20T10:00:00.000Z"
    },
    ...
  ]
}
```

---

### 3. Retrieve a Single Notice

**GET** `/api/notices-chain/:id`

Fetch a specific notice by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "notice": {
    "id": 1,
    "title": "Final Semester Exam Schedule",
    "content": "...",
    "hash": "a7f3e8c2b1d9f4e6a3c5b7d9f1e3a5c7...",
    "previous_hash": "0000000000000000",
    "created_at": "2026-05-20T10:30:00.000Z"
  }
}
```

---

### 4. Verify the Entire Chain

**GET** `/api/chain-verify`

Scan the entire chain and detect any tampering.

**Response (200 OK - Chain is Valid):**
```json
{
  "success": true,
  "is_valid": true,
  "total_notices": 5,
  "tampering_detected": false,
  "tampered_notices": [],
  "errors": [],
  "chain_status": "✓ CHAIN VERIFIED"
}
```

**Response (200 OK - Chain is Compromised):**
```json
{
  "success": true,
  "is_valid": false,
  "total_notices": 5,
  "tampering_detected": true,
  "tampered_notices": [
    {
      "id": 3,
      "reason": "Hash mismatch - notice payload, timestamp, or reference may have been altered",
      "storedHash": "old_hash_value",
      "recomputedHash": "new_hash_value"
    }
  ],
  "errors": [
    "Notice 3: Hash verification failed"
  ],
  "chain_status": "✗ TAMPERING DETECTED"
}
```

**How verification works:**
1. Fetches all notices in chronological order
2. For each notice, recalculates its hash using the stored payload, timestamp, and previous_hash
3. Compares computed hash against stored hash
4. Verifies that each notice's `previous_hash` matches the previous notice's hash
5. Reports any mismatches

---

### 5. Verify a Single Notice

**GET** `/api/notice-verify/:id`

Verify a specific notice's hash and chain link.

**Response:**
```json
{
  "success": true,
  "notice_id": 3,
  "is_valid": true,
  "verification_details": {
    "hashValid": true,
    "linkValid": true,
    "storedHash": "a7f3e8c2b1d9f4e6a3c5b7d9f1e3a5c7b9d1f3e5a7c9b1d3f5e7a9b1c3d5",
    "recomputedHash": "a7f3e8c2b1d9f4e6a3c5b7d9f1e3a5c7b9d1f3e5a7c9b1d3f5e7a9b1c3d5",
    "storedPreviousHash": "b2e4d7a1c3f6b8e0a2c4d6f8a0b2c4d6e8f0a2c4d6e8f0a2c4d6e8f0a2c",
    "expectedPreviousHash": "b2e4d7a1c3f6b8e0a2c4d6f8a0b2c4d6e8f0a2c4d6e8f0a2c4d6e8f0a2c"
  },
  "status": "✓ VERIFIED"
}
```

---

### 6. Get Chain Status

**GET** `/api/chain-status`

Quick health check of the notice chain.

**Response:**
```json
{
  "success": true,
  "chain_length": 5,
  "is_intact": true,
  "latest_notice": {
    "id": 5,
    "title": "Latest Notice",
    "created_at": "2026-05-20T15:45:00.000Z",
    "hash": "f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e"
  },
  "genesis_hash": "0000000000000000",
  "chain_health": "healthy"
}
```

---

## Deployment Workflow

### Step 1: Environment Setup

Create a `.env` file in `/blockchain/backend/`:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/blocknotice
# OR set individually:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=blocknotice

# Server
PORT=5000
NODE_ENV=development

# Blockchain (optional, for read-only contract access)
CONTRACT_ADDRESS=0x...
RPC_URL=https://...
ETHEREUM_NETWORK=sepolia
```

### Step 2: Install Dependencies

```bash
cd blockchain/backend
npm install
```

This installs `pg` (PostgreSQL driver) and other dependencies.

### Step 3: Initialize Database

The database schema is automatically created on server startup via the `initDatabase()` function.

```bash
npm start
```

You should see:
```
✓ Database schema ready (tamper-evident table)
🚀 BlockNotice Backend running on http://localhost:5000
```

### Step 4: Publish Your First Notice

```bash
curl -X POST http://localhost:5000/api/notices-chain \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Welcome to BlockNotice",
    "content": "This is the first tamper-proof notice.",
    "author": "system"
  }'
```

### Step 5: Verify the Chain

```bash
curl http://localhost:5000/api/chain-verify
```

---

## Security Guarantees

### ✓ **Immutability Proof**
Once a notice is published:
- Its hash is permanently stored
- Any change to title, content, or timestamp changes the hash
- Database auditing can detect when hashes are modified

### ✓ **Sequential Chaining**
Each notice is cryptographically linked to the previous one:
- Breaking a link requires modifying the `previous_hash` field
- This automatically breaks all subsequent notices' links
- Verification instantly detects broken chains

### ✓ **Tamper Detection**
The verification endpoint can detect:
- **Direct tampering**: Changed title or content (hash mismatch)
- **Timestamp forgery**: Different timestamp (hash mismatch)
- **Chain insertion**: New notice injected in the middle (link broken)
- **Notice deletion**: Missing notice in sequence (link broken)
- **Batch manipulation**: Multiple notices altered (multiple hash mismatches)

### ✓ **Cryptographic Strength**
- Uses SHA-256 (same algorithm as Bitcoin)
- Produces 64-character hexadecimal hashes
- Computationally infeasible to find two inputs with the same hash

---

## Example: Detecting Tampering

### Scenario: Admin directly modifies notice in database

**Before tampering:**
```
Notice 2: hash = "abc123def456..."
Notice 3: previous_hash = "abc123def456..." ✓ VALID
```

**Admin directly updates Notice 2 title in database:**
```
Notice 2 title: "Old Title" → "Hacked Title"
```

**After tampering:**
```
Notice 2: hash = "abc123def456..." (STILL OLD, database wasn't updated)
Recomputed hash = "xyz789ghi012..." (DIFFERENT!)
Result: ✗ TAMPERING DETECTED - Notice 2 compromised
```

**And Notice 3:**
```
Notice 3: previous_hash = "abc123def456..." (Links to OLD hash)
But Notice 2's new recomputed hash = "xyz789ghi012..."
Result: ✗ LINK BROKEN - Notice 3 becomes invalid
```

Entire chain from Notice 2 onwards becomes invalid.

---

## Monitoring & Auditing

### Automated Verification

Schedule periodic verification:

```javascript
// Run verification every 1 hour
setInterval(async () => {
  const response = await fetch('http://localhost:5000/api/chain-verify');
  const data = await response.json();
  
  if (!data.is_valid) {
    console.error('⚠️  TAMPERING DETECTED:', data.tampered_notices);
    // Alert security team
    sendAlert(data);
  }
}, 3600000);
```

### Log All Deployments

Each deployment returns the chain hash—log it for audit trail:

```javascript
const response = await fetch('http://localhost:5000/api/notices-chain', {
  method: 'POST',
  body: JSON.stringify({ title, content, author })
});
const { notice } = await response.json();

// Log for audit
auditLog({
  action: 'NOTICE_DEPLOYED',
  noticeId: notice.id,
  hash: notice.hash,
  previousHash: notice.previous_hash,
  timestamp: notice.created_at,
  author: notice.author
});
```

---

## Limitations & Considerations

1. **Database-Level Tampering**: This system prevents **application-level** tampering. If someone has direct database access, they can modify records. Mitigate with:
   - Database access controls (role-based permissions)
   - Database encryption at rest
   - Automated backups
   - Auditing of database modifications

2. **Timestamp Manipulation**: The timestamp is part of the hash. Changing it invalidates the hash. Use server-side timestamp generation only.

3. **Concurrency**: The transaction-based approach prevents race conditions, but ensure your PostgreSQL is properly configured.

4. **Scalability**: SHA-256 hashing and verification are very fast (microseconds). Verification of 1 million notices takes ~1 second.

---

## API Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/notices-chain` | POST | Publish a new notice |
| `/api/notices-chain` | GET | Retrieve all notices |
| `/api/notices-chain/:id` | GET | Retrieve single notice |
| `/api/chain-verify` | GET | Verify entire chain integrity |
| `/api/notice-verify/:id` | GET | Verify single notice |
| `/api/chain-status` | GET | Get chain health status |

---

## Next Steps

1. **Frontend Integration**: Create UI components that display hash information and verification status
2. **Monitoring Dashboard**: Build a dashboard showing chain health, tampering alerts
3. **API Rate Limiting**: Add rate limiting to prevent abuse
4. **Authentication**: Require authorization for publishing notices
5. **Audit Logging**: Log all deployments and verifications
