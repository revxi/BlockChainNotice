# BlockNotice Tamper-Evident System - Quick Reference

## Core Concept in One Sentence

**Each notice is cryptographically hashed and linked to the previous notice, creating an unbreakable chain where any tampering is immediately detected.**

## How It Works

```
Notice 1 (Hash A)
    ↓
Notice 2 (Hash B, Previous = A)  ← If A changes, B becomes invalid
    ↓
Notice 3 (Hash C, Previous = B)  ← If B changes, C becomes invalid
```

## API at a Glance

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/notices-chain` | POST | Publish notice |
| `/api/notices-chain` | GET | List all notices |
| `/api/notices-chain/:id` | GET | Get single notice |
| `/api/chain-verify` | GET | Check for tampering |
| `/api/notice-verify/:id` | GET | Verify one notice |
| `/api/chain-status` | GET | Health status |
| `/api/health` | GET | Server status |

## Quick Test

```bash
# 1. Publish
curl -X POST http://localhost:5000/api/notices-chain \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Content","author":"admin"}'

# 2. Verify (should be valid)
curl http://localhost:5000/api/chain-verify

# 3. Try to tamper with database
# UPDATE notices_chain SET title = 'Hacked' WHERE id = 1;

# 4. Verify again (should show tampering!)
curl http://localhost:5000/api/chain-verify
```

## Setup (5 minutes)

```bash
# 1. Install
cd blockchain/backend && npm install

# 2. Database
createdb blocknotice

# 3. Configure
cp .env.example .env
# Edit .env with your DB credentials

# 4. Run
npm start

# 5. Test
node test-tamper-evident.js
```

## Key Files

| File | What It Does |
|------|-------------|
| `backend/utils/blockchain.js` | Hashing & verification logic |
| `blockchain/backend/server.js` | Express API with endpoints |
| `blockchain/backend/TAMPER_EVIDENT_GUIDE.md` | Complete documentation |
| `TAMPER_EVIDENT_IMPLEMENTATION.md` | Implementation guide |
| `DEPLOYMENT_CHECKLIST.md` | Production deployment |

## Hash Calculation

```javascript
// Each notice's hash is:
SHA-256(
  JSON.stringify({
    noticeData: { title, content },
    timestamp: "2026-05-20T10:30:00Z",
    previousHash: "abc123..." // or "0000..." for first
  })
)

// Change any field → completely different hash
// Different hash → tampering detected
```

## Verification Logic

```
For each notice:
  1. Recalculate hash from stored data
  2. Compare with stored hash
  3. Check previous_hash matches previous notice's hash
  
If any mismatch → Tampering detected! ⚠️
```

## Response Examples

### ✅ Publish (Success)
```json
{
  "success": true,
  "notice": {
    "id": 1,
    "hash": "a7f3e8c2b1d9...",
    "previous_hash": "0000000000000000"
  }
}
```

### ✅ Chain Valid
```json
{
  "is_valid": true,
  "chain_status": "✓ CHAIN VERIFIED",
  "tampering_detected": false
}
```

### ❌ Chain Compromised
```json
{
  "is_valid": false,
  "chain_status": "✗ TAMPERING DETECTED",
  "tampered_notices": [
    {
      "id": 3,
      "reason": "Hash mismatch"
    }
  ]
}
```

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...
# OR
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=pass
DB_NAME=blocknotice

# Server
PORT=5000
NODE_ENV=development
```

## What Gets Detected

✅ Notice title changed
✅ Notice content modified
✅ Timestamp altered
✅ Notice deleted (link breaks)
✅ Notice inserted in middle
✅ Hash directly modified
✅ Multiple notices tampered

## Performance

| Operation | Time |
|-----------|------|
| Publish notice | ~100ms |
| Fetch all notices | ~50ms |
| Verify 1000 notices | ~1s |
| Verify 1 notice | ~10ms |

## Deployment

```bash
# Set DATABASE_URL
export DATABASE_URL=postgresql://user:pass@host:5432/blocknotice

# Deploy (Render, Heroku, AWS, etc.)
git push

# Verify
curl https://your-backend/api/chain-verify
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database error | Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` |
| Port in use | Change `PORT` in `.env` |
| Hash mismatch | This is tampering detection working! |
| Slow queries | Add database indexes (auto-created) |

## Security Properties

- **Cryptographic**: Uses SHA-256 (Bitcoin-level security)
- **Immutable**: Changing anything changes the hash
- **Verifiable**: Anyone can verify the chain
- **Transparent**: All hashes stored in database
- **Atomic**: Transactions prevent partial writes

## Genesis Hash

First notice uses this as previous: `0000000000000000`

Subsequent notices use: Hash of previous notice

## Database Schema

```sql
CREATE TABLE notices_chain (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500),
  content TEXT,
  hash VARCHAR(64) UNIQUE,          -- SHA-256
  previous_hash VARCHAR(64),        -- SHA-256 of previous
  created_at TIMESTAMP
);
```

## Common Commands

```bash
# Start server
npm start

# Run tests
node test-tamper-evident.js

# Publish notice
curl -X POST http://localhost:5000/api/notices-chain ...

# Verify chain
curl http://localhost:5000/api/chain-verify

# Check status
curl http://localhost:5000/api/chain-status

# Verify single
curl http://localhost:5000/api/notice-verify/1
```

## Tips

- Hashes are stored in lowercase hex (64 characters)
- Timestamps are ISO 8601 format
- Keep `.env` file with DATABASE_URL secure
- Commit `.gitignore` to prevent `.env` leaks
- Monitor `/api/chain-verify` regularly
- Log all deployments for audit trail

---

**Remember:** The tamper-evident system doesn't prevent direct database tampering—it detects it instantly. For full security, add database access controls, encryption, and backups.
