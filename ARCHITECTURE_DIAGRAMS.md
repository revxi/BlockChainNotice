# BlockNotice Tamper-Evident System - Visual Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     BlockNotice Backend                          │
│                  (Node.js + Express + PostgreSQL)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              TAMPER-EVIDENT NOTICE CHAIN                         │
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Notice 1   │───→│   Notice 2   │───→│   Notice 3   │      │
│  │              │    │              │    │              │      │
│  │ Title        │    │ Title        │    │ Title        │      │
│  │ Content      │    │ Content      │    │ Content      │      │
│  │ Time         │    │ Time         │    │ Time         │      │
│  │              │    │              │    │              │      │
│  │ Hash:        │    │ Hash:        │    │ Hash:        │      │
│  │ abc123...    │    │ def456...    │    │ ghi789...    │      │
│  │              │    │              │    │              │      │
│  │ PrevHash:    │    │ PrevHash:    │    │ PrevHash:    │      │
│  │ 0000000...   │    │ abc123...    │    │ def456...    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│        ↑                    ↑                    ↑               │
│     Genesis            Linked to 1         Linked to 2         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (notices_chain)                 │
└─────────────────────────────────────────────────────────────────┘
```

## Hash Calculation Flow

```
┌─────────────────┐
│  Notice Data    │
│                 │
│ Title:          │
│ "Exam Schedule" │
│                 │
│ Content:        │
│ "Starts June1"  │
│                 │
│ Timestamp:      │
│ "2026-05-20..." │
│                 │
│ PrevHash:       │
│ "abc123..."     │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────┐
│   JSON Stringify (deterministic)    │
│                                     │
│ {                                   │
│   "noticeData": {                   │
│     "title": "Exam Schedule",       │
│     "content": "Starts June1"       │
│   },                                │
│   "timestamp": "2026-05-20...",     │
│   "previousHash": "abc123..."       │
│ }                                   │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│      SHA-256 Hash Function          │
│                                     │
│   "Apply cryptographic hash"        │
│   (produces fixed 64-char string)   │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│          Notice Hash                │
│                                     │
│   "def456ghi789jkl012mno345pqr678" │
│   (stored in database)              │
└─────────────────────────────────────┘
```

## Tampering Detection Flow

```
Stored Notice                  Recalculation
─────────────────────────────────────────────────────

Title: "Exam Schedule"    ──→  Title: "Exam Schedule"
Content: "Starts June1"   ──→  Content: "Starts June1"
Time: "2026-05-20:10:30"  ──→  Time: "2026-05-20:10:30"
PrevHash: "abc123..."     ──→  PrevHash: "abc123..."
                               │
                          ┌────┴────────────────┐
                          │  Recalculate Hash   │
                          └────┬────────────────┘
                               │
Stored Hash:                   │  Computed Hash:
"def456ghi789..."              │  "def456ghi789..."
      │                        │        │
      └───────────┬────────────┘
                  ↓
           ┌──────────────┐
           │ Compare      │
           │ Match? YES ✓ │ → Chain Link Valid
           │ Match? NO ✗  │ → TAMPERING DETECTED ⚠️
           └──────────────┘
```

## API Request/Response Flow

```
Frontend/Client
       │
       ├──→ POST /api/notices-chain ──→ ┌──────────────────┐
       │    {"title": "..."}            │  Publish Notice  │
       │                                 │                  │
       │                                 │ 1. Get prev hash │
       │                                 │ 2. Calculate new │
       │                                 │ 3. Save atomically
       │    ←────────────────────────── │ 4. Return notice │
       │    {"id": 1, "hash": "..."}   └──────────────────┘
       │
       ├──→ GET /api/notices-chain ──→ ┌──────────────────┐
       │                                │ Get All Notices  │
       │    ←────────────────────────── │                  │
       │    [{id:1, hash:...}, ...]    └──────────────────┘
       │
       ├──→ GET /api/chain-verify ──→ ┌──────────────────┐
       │                                │ Verify Chain     │
       │                                │                  │
       │                                │ For each notice: │
       │                                │ • Recalc hash    │
       │                                │ • Compare        │
       │                                │ • Check link     │
       │    ←────────────────────────── │ • Report result  │
       │    {is_valid: true, ...}      └──────────────────┘
       │
       └──→ GET /api/notice-verify/:id → ┌────────────────┐
            ←───────────────────────────────│ Verify Notice  │
            {is_valid: true, status: "✓"}   └────────────────┘
```

## Chain Integrity After Tampering

```
Normal Chain:
Notice 1 (Hash: A)  →  Notice 2 (Hash: B)  →  Notice 3 (Hash: C)
PrevHash: 0000      PrevHash: A              PrevHash: B
✓ Valid             ✓ Valid                  ✓ Valid


After Tampering (Notice 2 content changed):

Notice 1 (Hash: A)  →  Notice 2 (Hash: A'?) →  Notice 3 (Hash: C)
PrevHash: 0000      PrevHash: A              PrevHash: B
✓ Valid             ✗ INVALID!               ✗ INVALID!
                    (Recompute gives A'')    (Link broken to B)
                    (Hash mismatch)          (Expected B, got A'')


Verification Result:
┌─────────────────────────────────────┐
│ tampering_detected: true            │
│                                      │
│ tampered_notices: [                 │
│   {                                 │
│     id: 2,                          │
│     reason: "Hash mismatch",        │
│     storedHash: "A",                │
│     recomputedHash: "A''"           │
│   }                                 │
│ ]                                   │
│                                      │
│ Notices affected: 2, 3              │
└─────────────────────────────────────┘
```

## Database Schema Diagram

```
┌──────────────────────────────────────────────────────────┐
│              notices_chain (PostgreSQL)                   │
├──────────────────────────────────────────────────────────┤
│ Column        │ Type              │ Special              │
├───────────────┼──────────────────┼──────────────────────┤
│ id            │ SERIAL PRIMARY    │ Auto-increment       │
│ title         │ VARCHAR(500)      │ NOT NULL             │
│ content       │ TEXT              │ NOT NULL             │
│ author        │ VARCHAR(42)       │ Wallet address       │
│ timestamp     │ TIMESTAMP         │ Server-side          │
│ hash          │ VARCHAR(64)       │ SHA-256, UNIQUE      │
│ previous_hash │ VARCHAR(64)       │ Link to previous     │
│ created_at    │ TIMESTAMP         │ Auto-insert          │
│ updated_at    │ TIMESTAMP         │ Auto-update          │
└──────────────────────────────────────────────────────────┘

Indexes:
• idx_notices_hash (for quick hash lookup)
• idx_notices_previous_hash (for chain link verification)
• idx_notices_created_at (for chronological queries)
```

## Security Guarantees Diagram

```
                    Notice Published
                          │
                    ┌─────┴─────┐
                    │           │
            Hashed with SHA-256  │
                    │           │
                    ▼           │
            Stored in DB  ◄─────┘
                    │
            ┌───────┴───────┐
            │               │
      Try to change    Normal verification
            │               │
            ▼               ▼
        New hash    Recalculate hash
        computed    from stored data
            │               │
            ├───────┬───────┤
            │       │       │
            v       v       v
         Do hashes match?
            │
    ┌───────┴───────┐
    │               │
   YES              NO
    │               │
    ▼               ▼
 VALID      TAMPERING DETECTED ⚠️
```

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend Application                  │
│           (displays hashes, verification status)        │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    [POST]        [GET]          [GET]
    Publish    Retrieve       Verify
    Notice     Notices        Chain
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Express.js API Server       │
        │  (blockchain/backend)        │
        │                              │
        │  ├─ Hash calculation         │
        │  ├─ Chain verification       │
        │  ├─ Atomic transactions      │
        │  └─ Response formatting      │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  PostgreSQL Database         │
        │  (notices_chain table)       │
        │                              │
        │  ├─ Notice records           │
        │  ├─ Cryptographic hashes     │
        │  ├─ Chain links              │
        │  └─ Full audit trail         │
        └──────────────────────────────┘
```

## Data Flow: Publishing a Notice

```
1. Admin submits notice
   ↓
2. API receives POST /api/notices-chain
   ↓
3. Backend begins transaction:
   ├─ Query last notice's hash
   ├─ Validate title & content
   ├─ Generate SHA-256 hash
   ├─ Insert into database
   ├─ Lock transaction
   └─ Commit
   ↓
4. Return notice with metadata
   ↓
5. Frontend displays hash to user
   ↓
6. Notice is now part of the cryptographic chain
```

## Data Flow: Verifying Chain Integrity

```
1. Admin requests chain verification
   ↓
2. API receives GET /api/chain-verify
   ↓
3. Backend queries all notices (chronologically)
   ↓
4. For each notice:
   ├─ Extract: title, content, timestamp, prev_hash
   ├─ Recalculate hash using SHA-256
   ├─ Compare with stored hash
   ├─ Check previous_hash matches previous notice
   └─ Flag any mismatches
   ↓
5. Generate verification report
   ├─ Valid/Invalid status
   ├─ List of tampered notices
   ├─ Specific reasons for each
   └─ Recommended actions
   ↓
6. Return report to frontend
   ↓
7. Display results to admin
```

## Timeline: Impact of Tampering

```
Time  →

Notice 1    Notice 2    Notice 3    Notice 4    Notice 5
Hash: A     Hash: B     Hash: C     Hash: D     Hash: E
✓           ✓           ✓           ✓           ✓

Admin tampers with Notice 2 (changes title)
  ↓
Verification runs:
  Notice 1: Hash A = Computed A ✓
  Notice 2: Hash B ≠ Computed B' ✗ TAMPERING!
  Notice 3: Previous_hash B ≠ B' ✗ LINK BROKEN!
  Notice 4: Previous_hash C ≠ C' ✗ LINK BROKEN!
  Notice 5: Previous_hash D ≠ D' ✗ LINK BROKEN!

Result: Notice 2 flagged, Notices 3-5 invalidated
Impact: Can pinpoint exact moment tampering occurred
```

---

This visual architecture shows how the tamper-evident system creates an unbreakable cryptographic chain where any modification is instantly detected.
