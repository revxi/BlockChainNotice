# BlockNotice Tamper-Evident System - Step-by-Step Tutorial

## Complete Walkthrough: From Zero to Deployed

This tutorial takes you from installation to publishing and verifying tamper-proof notices.

---

## Step 1: Prerequisites (5 minutes)

### What You Need

✅ Node.js (v16+)
✅ npm or yarn
✅ PostgreSQL (local or remote)
✅ A terminal/command line
✅ A text editor

### Check Installations

```bash
# Check Node.js
node --version    # Should show v16+

# Check npm
npm --version     # Should show 8+

# Check PostgreSQL
psql --version    # Should show version
```

If PostgreSQL isn't installed:
- **macOS**: `brew install postgresql@15`
- **Ubuntu/Debian**: `sudo apt-get install postgresql postgresql-contrib`
- **Windows**: Download from postgresql.org

---

## Step 2: Create Database (3 minutes)

### Start PostgreSQL

```bash
# macOS - if installed via Homebrew
brew services start postgresql

# Ubuntu/Linux
sudo systemctl start postgresql

# Windows - it should start automatically
```

### Create the Database

```bash
# Open PostgreSQL command line
psql -U postgres

# Inside psql, create database
CREATE DATABASE blocknotice;

# Exit psql
\q
```

Or one-liner:
```bash
createdb blocknotice
```

Verify it worked:
```bash
psql blocknotice -c "\d"
```

---

## Step 3: Set Up Backend (5 minutes)

### Navigate to Backend

```bash
cd /workspaces/BlockChainNotice/blockchain/backend
```

### Install Dependencies

```bash
npm install
```

This installs:
- `pg` (PostgreSQL driver)
- `express` (web server)
- `cors` (cross-origin support)
- `helmet` (security)
- `ethers` (blockchain integration)

### Create Environment File

```bash
# Copy template
cp .env.example .env

# Edit with your credentials
nano .env
```

Or if using VS Code:
```bash
code .env
```

### Configure .env

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/blocknotice

# Or use individual params:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=blocknotice

# Server
PORT=5000
NODE_ENV=development
```

**Save the file.**

---

## Step 4: Start the Server (2 minutes)

```bash
npm start
```

You should see:
```
✓ Database schema ready (tamper-evident table)
🚀 BlockNotice Backend running on http://localhost:5000
```

**Don't close this terminal!** Keep the server running.

---

## Step 5: Open New Terminal for Testing

**In a new terminal**, navigate to the backend directory:

```bash
cd /workspaces/BlockChainNotice/blockchain/backend
```

---

## Step 6: Test Server Health (1 minute)

### Verify Server is Running

```bash
curl http://localhost:5000/api/health
```

Response should be:
```json
{
  "status": "healthy",
  "uptime": 123.456
}
```

### Get Chain Status

```bash
curl http://localhost:5000/api/chain-status
```

Response:
```json
{
  "success": true,
  "chain_length": 0,
  "is_intact": true,
  "latest_notice": null,
  "genesis_hash": "0000000000000000",
  "chain_health": "healthy"
}
```

**Perfect!** Your system is ready.

---

## Step 7: Publish Your First Notice (2 minutes)

### Create Notice 1

```bash
curl -X POST http://localhost:5000/api/notices-chain \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Campus Closure - Weather Advisory",
    "content": "Due to severe weather conditions, the campus will be closed tomorrow. All classes and examinations are postponed until further notice.",
    "author": "Dean of Academics"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Notice deployed to tamper-evident chain",
  "notice": {
    "id": 1,
    "title": "Campus Closure - Weather Advisory",
    "content": "Due to severe weather conditions...",
    "author": "Dean of Academics",
    "timestamp": "2026-05-20T10:30:00.000Z",
    "hash": "a7f3e8c2b1d9f4e6a3c5b7d9f1e3a5c7b9d1f3e5a7c9b1d3f5e7a9b1c3d5",
    "previous_hash": "0000000000000000",
    "created_at": "2026-05-20T10:30:00.000Z"
  },
  "chain_info": {
    "total_notices": 1,
    "chain_hash": "a7f3e8c2b1d9...",
    "previous_hash": "0000000000000000"
  }
}
```

**Key observation:** 
- `hash`: SHA-256 of this notice (64-character hex string)
- `previous_hash`: Hash of the previous notice (or genesis "0000..." for first)
- This notice is now **cryptographically chained**

---

## Step 8: Publish More Notices

### Create Notice 2

```bash
curl -X POST http://localhost:5000/api/notices-chain \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Library Extended Hours",
    "content": "The main library will remain open until 11 PM this week to support final exam preparation. Additional study materials available at reference desk.",
    "author": "Library Director"
  }'
```

This notice's `previous_hash` should match Notice 1's `hash`.

### Create Notice 3

```bash
curl -X POST http://localhost:5000/api/notices-chain \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Scholarship Applications Open",
    "content": "Applications for the 2026-2027 merit scholarships are now open. Deadline: June 15, 2026. Apply through the student portal.",
    "author": "Financial Aid Office"
  }'
```

---

## Step 9: View All Notices

```bash
curl http://localhost:5000/api/notices-chain | jq '.'
```

Or without `jq` (pretty-print):
```bash
curl http://localhost:5000/api/notices-chain
```

Response shows all 3 notices with their hashes and previous_hash links.

---

## Step 10: Verify the Chain (Most Important!)

```bash
curl http://localhost:5000/api/chain-verify
```

Response (if chain is valid):
```json
{
  "success": true,
  "is_valid": true,
  "total_notices": 3,
  "tampering_detected": false,
  "tampered_notices": [],
  "errors": [],
  "chain_status": "✓ CHAIN VERIFIED"
}
```

**This proves:**
✅ All 3 notices are intact
✅ No tampering detected
✅ Chain links are valid
✅ Hashes are correct

---

## Step 11: Test Tampering Detection

### Simulate Direct Database Tampering

**In PostgreSQL**, directly modify a notice:

```bash
psql blocknotice
```

Inside psql:
```sql
-- Update Notice 2's title (simulating tampering)
UPDATE notices_chain 
SET title = 'HACKED - This should not happen!' 
WHERE id = 2;

-- Exit
\q
```

### Now Verify the Chain Again

```bash
curl http://localhost:5000/api/chain-verify
```

Response (chain is now compromised):
```json
{
  "success": true,
  "is_valid": false,
  "total_notices": 3,
  "tampering_detected": true,
  "tampered_notices": [
    {
      "id": 2,
      "reason": "Hash mismatch - notice payload, timestamp, or reference may have been altered",
      "storedHash": "original_hash_value",
      "recomputedHash": "different_hash_value"
    }
  ],
  "errors": [
    "Notice 2: Hash verification failed"
  ],
  "chain_status": "✗ TAMPERING DETECTED"
}
```

**What happened:**
1. We changed Notice 2's title in the database
2. The verification endpoint **automatically detected it**
3. Hashes don't match because the content changed
4. The chain is flagged as compromised

---

## Step 12: Fix the Tampering (Recovery)

### Restore from Git

If this was real production, you'd restore from backup:

```bash
# Option 1: Restore database from backup
psql blocknotice < backup.sql

# Option 2: Re-run verification to log the incident
curl http://localhost:5000/api/chain-verify
```

For this tutorial, let's revert using psql:

```bash
psql blocknotice
```

```sql
-- Revert the tampered notice
UPDATE notices_chain 
SET title = 'Library Extended Hours' 
WHERE id = 2;

\q
```

### Verify Again

```bash
curl http://localhost:5000/api/chain-verify
```

Response should show all valid again:
```json
{
  "is_valid": true,
  "chain_status": "✓ CHAIN VERIFIED"
}
```

---

## Step 13: Verify Individual Notice

```bash
# Verify Notice 2
curl http://localhost:5000/api/notice-verify/2
```

Response:
```json
{
  "success": true,
  "notice_id": 2,
  "is_valid": true,
  "verification_details": {
    "hashValid": true,
    "linkValid": true,
    "storedHash": "abc123...",
    "recomputedHash": "abc123...",
    "storedPreviousHash": "def456...",
    "expectedPreviousHash": "def456..."
  },
  "status": "✓ VERIFIED"
}
```

---

## Step 14: Run Automated Test Suite

```bash
node test-tamper-evident.js
```

Output:
```
🧪 BlockNotice Tamper-Evident System - Test Suite

Test 1: Creating first notice...
✓ Notice 1 created: 4
  Hash: 0dbfa3eb91cc8...
  Previous Hash: 000000000000...

Test 2: Creating second notice...
✓ Notice 2 created: 5
  Hash: f8a1c9b2d4e6...
  Previous Hash: 0dbfa3eb91cc8...

... [more tests]

✅ All tests passed!

📊 Summary:
  • Created 3 notices
  • Chain is intact
  • No tampering detected

🔐 Security Properties:
  • Each notice has unique SHA-256 hash
  • Each notice linked to previous via previous_hash
  • Altering any notice invalidates entire chain
```

---

## Step 15: View Chain Status

```bash
curl http://localhost:5000/api/chain-status
```

Response:
```json
{
  "success": true,
  "chain_length": 6,
  "is_intact": true,
  "latest_notice": {
    "id": 6,
    "title": "Latest Notice Title",
    "created_at": "2026-05-20T15:45:00.000Z",
    "hash": "xyz789..."
  },
  "genesis_hash": "0000000000000000",
  "chain_health": "healthy"
}
```

---

## Summary: What You've Done

✅ Installed Node.js dependencies
✅ Created PostgreSQL database
✅ Configured environment variables
✅ Started the backend server
✅ Published 3 notices to the tamper-evident chain
✅ Verified the chain integrity
✅ Simulated tampering (modified database)
✅ Detected the tampering automatically
✅ Fixed the issue
✅ Ran automated tests
✅ Checked system status

---

## Key Takeaways

### How It Works

1. **Each notice gets a SHA-256 hash** of its title, content, and timestamp
2. **Each notice stores the previous notice's hash**, creating a chain
3. **Verification recalculates hashes** and compares them to stored values
4. **Any mismatch = tampering detected**

### Security Guarantee

If someone changes even ONE character in any notice:
- The hash won't match
- The chain link breaks
- Verification instantly detects it

### No Blockchain Needed

- ✅ Works with regular PostgreSQL
- ✅ No gas fees
- ✅ No smart contract complexity
- ✅ Instant results
- ✅ Scales to millions of notices

---

## Next Steps

1. **Frontend Integration**
   - Display notice hashes in your UI
   - Show verification status
   - Add "Verify" button to admin dashboard

2. **Production Deployment**
   - Follow `DEPLOYMENT_CHECKLIST.md`
   - Use managed PostgreSQL (Heroku, AWS RDS, etc.)
   - Set up automated backups

3. **Monitoring**
   - Schedule periodic chain verification
   - Set up alerts for tampering detection
   - Create monitoring dashboard

4. **Access Control**
   - Add authentication for publishing
   - Implement role-based access
   - Log all publishing actions

---

## API Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/notices-chain` | POST | Publish notice |
| `/api/notices-chain` | GET | List all notices |
| `/api/notices-chain/:id` | GET | Get single notice |
| `/api/chain-verify` | GET | Verify entire chain |
| `/api/notice-verify/:id` | GET | Verify single notice |
| `/api/chain-status` | GET | Get status |
| `/api/health` | GET | Server health |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Database connection error | Check DB_HOST, DB_USER, DB_PASSWORD in .env |
| Port 5000 already in use | Change PORT in .env or kill process using port |
| npm install fails | Delete node_modules, run `npm install` again |
| PostgreSQL not starting | Check PostgreSQL is installed, brew services start postgresql |
| Hashes don't match | This is working! It means tampering was detected |

---

## Congratulations! 🎉

You've successfully set up and tested a **production-grade tamper-evident system** using blockchain principles entirely within your backend.

The system now:
- ✅ Stores notices cryptographically
- ✅ Detects any tampering instantly
- ✅ Creates immutable historical records
- ✅ Works without blockchain complexity or cost

**You're ready to deploy to production!** 🚀
