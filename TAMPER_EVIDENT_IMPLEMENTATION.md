# BlockNotice: Tamper-Evident Backend Implementation

## 🔐 What You've Implemented

A **cryptographically verifiable notice ledger** using blockchain principles entirely within your backend—without the overhead or cost of actual smart contracts.

### Key Architecture

```
Notice 1          Notice 2          Notice 3
    |                 |                |
    v                 v                v
[Payload]    →    [Payload]    →    [Payload]
[Timestamp]       [Timestamp]       [Timestamp]
[Genesis]         [Hash₁]           [Hash₂]
    |________________|________________|
         SHA-256 Chain: Cryptographically Linked
```

Each notice contains:
- **Payload**: Title and content
- **Timestamp**: When published
- **Hash**: SHA-256 of (payload + timestamp + previousHash)
- **Previous Hash**: Creates the chain link

### Security Guarantee

**If even one character in any notice is changed, the hash breaks and the entire chain becomes verifiable as tampered.**

---

## 📁 Project Structure

```
/workspaces/BlockChainNotice/
├── backend/
│   └── utils/
│       └── blockchain.js          ← Core hashing & verification logic
│
├── blockchain/
│   └── backend/
│       ├── server.js              ← Express server with new endpoints
│       ├── package.json           ← Updated with pg dependency
│       ├── .env.example           ← Database config template
│       ├── TAMPER_EVIDENT_GUIDE.md ← Full documentation
│       ├── test-tamper-evident.js ← Node.js test suite
│       └── test-tamper-evident.sh ← Bash test script
└── [other project files]
```

---

## 🚀 Quick Start

### 1. **Install Dependencies**

```bash
cd blockchain/backend
npm install
```

This installs:
- `pg` (PostgreSQL driver)
- `express`, `cors`, `helmet` (existing)
- `ethers` (existing)

### 2. **Set Up PostgreSQL Database**

Create a database:
```bash
createdb blocknotice
```

Or use a managed PostgreSQL service (AWS RDS, Heroku, DigitalOcean, etc.)

### 3. **Configure Environment**

Copy `.env.example` to `.env` and set your database credentials:

```bash
# For local PostgreSQL:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=blocknotice
```

Or use full URL:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/blocknotice
```

### 4. **Start the Server**

```bash
npm start
```

You should see:
```
✓ Database schema ready (tamper-evident table)
🚀 BlockNotice Backend running on http://localhost:5000
```

**Database tables are automatically created on startup!**

### 5. **Test the API**

Using Node.js:
```bash
node test-tamper-evident.js
```

Using Bash:
```bash
bash test-tamper-evident.sh
```

Or manually:
```bash
# Publish first notice
curl -X POST http://localhost:5000/api/notices-chain \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Campus Closed",
    "content": "Due to weather, campus is closed.",
    "author": "admin"
  }'

# Verify entire chain
curl http://localhost:5000/api/chain-verify
```

---

## 🔗 API Endpoints

### Publish a Notice
**POST** `/api/notices-chain`
```json
{
  "title": "Notice Title",
  "content": "Notice content...",
  "author": "admin@example.com"
}
```
Returns: New notice with hash and chain info

### Get All Notices
**GET** `/api/notices-chain`

Returns: Array of all notices in chronological order

### Get Single Notice
**GET** `/api/notices-chain/:id`

### Verify Entire Chain
**GET** `/api/chain-verify`

Scans all notices and detects any tampering.

Response if valid:
```json
{
  "is_valid": true,
  "chain_status": "✓ CHAIN VERIFIED",
  "total_notices": 5,
  "tampering_detected": false
}
```

Response if tampered:
```json
{
  "is_valid": false,
  "tampering_detected": true,
  "tampered_notices": [
    {
      "id": 3,
      "reason": "Hash mismatch - notice payload may have been altered"
    }
  ]
}
```

### Verify Single Notice
**GET** `/api/notice-verify/:id`

### Get Chain Status
**GET** `/api/chain-status`

Quick health check: chain length, latest notice, integrity status

### Server Health
**GET** `/api/health`

---

## 🔒 How Tampering is Detected

### Example: Direct Database Modification

1. **Original state:**
   ```
   Notice 2: title = "Exam Schedule"
            hash = "abc123..."
   Notice 3: previous_hash = "abc123..." ✓ VALID
   ```

2. **Admin modifies Notice 2 directly in database:**
   ```
   UPDATE notices_chain 
   SET title = 'Tampered Title'
   WHERE id = 2;
   ```

3. **Verification detects tampering:**
   ```
   Notice 2 stored hash: "abc123..."
   Notice 2 recomputed hash: "xyz789..." ← DIFFERENT!
   
   Result: ✗ Notice 2 is TAMPERED
           ✗ Notice 3's previous_hash link is BROKEN
           ✗ Entire chain from Notice 2 onwards is INVALID
   ```

### Types of Tampering Detected

- ✓ Direct content/title modification
- ✓ Timestamp forgery
- ✓ Notice insertion (new notice in the middle)
- ✓ Notice deletion (breaks chain links)
- ✓ Hash modification (recomputed hash won't match)
- ✓ Previous_hash modification (link breaks)

---

## 📊 How It Works (Technical Details)

### Hash Calculation

```javascript
hash = SHA256(
  JSON.stringify({
    noticeData: { title, content },
    timestamp: "2026-05-20T10:30:00.000Z",
    previousHash: "abc123def456..." // or "0000000000000000" for first notice
  })
)
```

**Key property:** Even changing a single character produces a completely different hash.

### Database Schema

```sql
CREATE TABLE notices_chain (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(42),
  timestamp TIMESTAMP,
  hash VARCHAR(64) NOT NULL UNIQUE,           -- SHA-256 of this notice
  previous_hash VARCHAR(64) NOT NULL,         -- SHA-256 of previous notice
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notices_hash ON notices_chain(hash);
CREATE INDEX idx_notices_previous_hash ON notices_chain(previous_hash);
CREATE INDEX idx_notices_created_at ON notices_chain(created_at DESC);
```

### Chaining Flow

```
1. Admin publishes notice
   ↓
2. Backend fetches last notice's hash (or genesis "0000..." if first)
   ↓
3. Calculate SHA-256 of (title + content + timestamp + previousHash)
   ↓
4. Atomically save to database in transaction
   ↓
5. Return notice with hash and chain info
```

---

## 🛡️ Security Guarantees

| Guarantee | How It Works |
|-----------|-------------|
| **Immutability** | Hashes are permanently stored; changing payload = different hash |
| **Sequential Linking** | Each notice links to previous via previous_hash |
| **Tamper Detection** | Verification endpoint recalculates and compares hashes |
| **Atomicity** | Database transactions prevent concurrent/partial writes |
| **Cryptographic Strength** | SHA-256 is the same algorithm used by Bitcoin |

---

## 📈 Monitoring & Audit

### Automated Verification

Schedule periodic chain verification:

```javascript
// Verify chain every 6 hours
setInterval(async () => {
  const res = await fetch('http://localhost:5000/api/chain-verify');
  const data = await res.json();
  
  if (!data.is_valid) {
    console.error('⚠️  TAMPERING DETECTED:', data.tampered_notices);
    // Alert security team, log incident, etc.
  }
}, 6 * 3600 * 1000);
```

### Audit Trail

Log all deployments:

```javascript
const res = await fetch('http://localhost:5000/api/notices-chain', {
  method: 'POST',
  body: JSON.stringify({ title, content, author })
});
const { notice } = await res.json();

// Log for audit
auditLog({
  action: 'NOTICE_DEPLOYED',
  noticeId: notice.id,
  hash: notice.hash,
  previousHash: notice.previous_hash,
  author: notice.author,
  timestamp: new Date()
});
```

---

## ⚙️ Configuration

### Environment Variables

See `blockchain/backend/.env.example` for all options:

```bash
# Database
DATABASE_URL=postgresql://...
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=blocknotice

# Server
PORT=5000
NODE_ENV=development

# Optional: Ethereum integration
RPC_URL=https://...
ETHEREUM_NETWORK=sepolia
CONTRACT_ADDRESS=0x...
```

---

## 🧪 Testing

### Automated Tests

```bash
# Node.js test suite (comprehensive)
node test-tamper-evident.js

# Bash test script (simple API calls)
bash test-tamper-evident.sh
```

### Manual Testing

```bash
# Publish notices
curl -X POST http://localhost:5000/api/notices-chain \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Content","author":"admin"}'

# Get all
curl http://localhost:5000/api/notices-chain

# Verify
curl http://localhost:5000/api/chain-verify

# Check single
curl http://localhost:5000/api/notice-verify/1
```

---

## 🚨 Common Issues

### Issue: "Contract not configured"
**Solution:** This is expected. The smart contract integration is optional. The tamper-evident system works independently with PostgreSQL.

### Issue: "PostgreSQL connection failed"
**Solution:** Ensure:
1. PostgreSQL is running: `psql --version`
2. Database exists: `createdb blocknotice`
3. Credentials in `.env` are correct
4. Try: `psql -U postgres -h localhost blocknotice`

### Issue: "PORT 5000 already in use"
**Solution:** Change port in `.env`: `PORT=5001`

### Issue: "Hash verification failing"
**Solution:** Hashes are automatically recalculated. If they don't match, it means either:
- Database records were directly modified
- Timestamps were changed
- Content was altered

This is exactly what we want to detect!

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `backend/utils/blockchain.js` | Core hashing, chaining, verification logic |
| `blockchain/backend/server.js` | Express server with tamper-evident endpoints |
| `blockchain/backend/package.json` | Dependencies (includes pg) |
| `blockchain/backend/.env.example` | Environment configuration template |
| `blockchain/backend/TAMPER_EVIDENT_GUIDE.md` | Complete technical guide |
| `blockchain/backend/test-tamper-evident.js` | Node.js test suite |
| `blockchain/backend/test-tamper-evident.sh` | Bash test script |

---

## 🔄 Next Steps

1. **Frontend Integration**: Create UI to display notice hashes and verification status
2. **Admin Dashboard**: Build dashboard for monitoring chain health
3. **Alerts & Notifications**: Set up monitoring to detect tampering
4. **Access Control**: Add authentication/authorization for publishing
5. **API Rate Limiting**: Prevent abuse
6. **Metrics**: Track notice publishing trends, chain growth

---

## 📖 Additional Resources

- Full API documentation: [TAMPER_EVIDENT_GUIDE.md](./blockchain/backend/TAMPER_EVIDENT_GUIDE.md)
- Test suite examples: [test-tamper-evident.js](./blockchain/backend/test-tamper-evident.js)
- Environment setup: [.env.example](./blockchain/backend/.env.example)

---

## ✅ Summary

You now have:

✓ **Tamper-evident notice system** using cryptographic hashing
✓ **PostgreSQL database** with immutable chain structure
✓ **Verification endpoints** to detect tampering
✓ **Complete test suites** for validation
✓ **Comprehensive documentation** for deployment

The system proves that no notice has been secretly altered by using SHA-256 hashing and sequential chaining—all without the cost or complexity of a real blockchain.

**The beauty:** If someone changes even one letter in a 10-year-old notice, the verification endpoint will instantly flag it as compromised.
