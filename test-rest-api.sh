#!/bin/bash

# Test AYU REST API endpoints
# Usage: ./test-rest-api.sh <your-token>

set -e

TOKEN="${1:-}"
WORDPRESS_URL="http://localhost:8080"

if [ -z "$TOKEN" ]; then
    echo "❌ Error: Token required"
    echo "Usage: ./test-rest-api.sh <your-token>"
    echo ""
    echo "Get a token from: http://localhost:8080/wp-admin/admin.php?page=ayu-ai-tokens"
    exit 1
fi

echo "🧪 Testing AYU REST API"
echo "======================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: List Posts
echo "1️⃣ Testing wp:listPosts..."
RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" \
    "$WORDPRESS_URL/wp-json/ayu/v1/posts?per_page=5")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Success (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ Failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""

# Test 2: Get Site Health
echo "2️⃣ Testing wp:getSiteHealth..."
RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" \
    "$WORDPRESS_URL/wp-json/ayu/v1/site-health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Success (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY" | head -20
else
    echo -e "${RED}✗ Failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""

# Test 3: List Taxonomies
echo "3️⃣ Testing wp:listTaxonomies..."
RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" \
    "$WORDPRESS_URL/wp-json/ayu/v1/taxonomies")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Success (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ Failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""

# Test 4: List Menus
echo "4️⃣ Testing wp:listMenus..."
RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" \
    "$WORDPRESS_URL/wp-json/ayu/v1/menus")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Success (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ Failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""

echo "======================"
echo -e "${GREEN}✅ API Tests Complete!${NC}"
echo ""
echo "If all tests passed, your token is working correctly!"
echo "You can now configure Cursor MCP with this token."

