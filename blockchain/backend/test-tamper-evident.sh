#!/bin/bash

# BlockNotice Tamper-Evident System - Quick Test Guide
# Usage: Copy and paste these commands into your terminal to test the API

BASE_URL="http://localhost:5000"

echo "================================"
echo "BlockNotice Tamper-Evident Tests"
echo "================================"
echo ""

# 1. Create First Notice
echo "1️⃣  Creating first notice..."
NOTICE_1=$(curl -s -X POST $BASE_URL/api/notices-chain \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Campus Closure - Weather Advisory",
    "content": "Due to severe weather, the campus will be closed tomorrow. All classes and examinations are postponed.",
    "author": "Dean of Academics"
  }')
echo "$NOTICE_1" | jq '.'
echo ""

# 2. Create Second Notice
echo "2️⃣  Creating second notice..."
NOTICE_2=$(curl -s -X POST $BASE_URL/api/notices-chain \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Library Extended Hours",
    "content": "The main library will remain open until 11 PM this week to support exam preparation.",
    "author": "Library Director"
  }')
echo "$NOTICE_2" | jq '.'
echo ""

# 3. Create Third Notice
echo "3️⃣  Creating third notice..."
NOTICE_3=$(curl -s -X POST $BASE_URL/api/notices-chain \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Scholarship Applications Open",
    "content": "Applications for the 2026-2027 merit scholarships are now open. Deadline: June 15, 2026.",
    "author": "Financial Aid Office"
  }')
echo "$NOTICE_3" | jq '.'
echo ""

# 4. Get All Notices
echo "4️⃣  Retrieving all notices..."
curl -s -X GET $BASE_URL/api/notices-chain | jq '.'
echo ""

# 5. Get Single Notice
echo "5️⃣  Retrieving notice #1..."
curl -s -X GET $BASE_URL/api/notices-chain/1 | jq '.'
echo ""

# 6. Verify Entire Chain
echo "6️⃣  Verifying entire chain (should be valid)..."
curl -s -X GET $BASE_URL/api/chain-verify | jq '.'
echo ""

# 7. Get Chain Status
echo "7️⃣  Getting chain status..."
curl -s -X GET $BASE_URL/api/chain-status | jq '.'
echo ""

# 8. Verify Single Notice
echo "8️⃣  Verifying notice #2..."
curl -s -X GET $BASE_URL/api/notice-verify/2 | jq '.'
echo ""

# 9. Server Health Check
echo "9️⃣  Server health check..."
curl -s -X GET $BASE_URL/api/health | jq '.'
echo ""

echo "✅ All tests completed!"
echo ""
echo "📝 Next Steps:"
echo "   1. The notices are now stored in your PostgreSQL database"
echo "   2. Try accessing /api/chain-verify to verify the chain is intact"
echo "   3. The hashes prove that no notice has been tampered with"
echo "   4. Any modification to title/content/timestamp will show up on verification"
