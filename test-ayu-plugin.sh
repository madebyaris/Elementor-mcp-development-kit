#!/bin/bash

# AYU AI Elementor Plugin Test Script
# This script helps test the plugin functionality

set -e

echo "🚀 AYU AI Elementor Plugin Test Script"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check WordPress is running
echo "1️⃣ Checking WordPress..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ WordPress is running${NC}"
else
    echo -e "${RED}✗ WordPress is not accessible at http://localhost:8080${NC}"
    echo "   Please start WordPress with: docker compose up -d wordpress wordpress-db"
    exit 1
fi

# Check plugin files exist
echo ""
echo "2️⃣ Checking plugin files..."
PLUGIN_DIR="apps/wordpress/wp-content/plugins/ayu-ai-elementor"
if [ -d "$PLUGIN_DIR" ]; then
    echo -e "${GREEN}✓ Plugin directory exists${NC}"
    
    # Check main files
    if [ -f "$PLUGIN_DIR/ayu-ai-elementor.php" ]; then
        echo -e "${GREEN}✓ Main plugin file exists${NC}"
    else
        echo -e "${RED}✗ Main plugin file missing${NC}"
        exit 1
    fi
    
    if [ -d "$PLUGIN_DIR/includes" ]; then
        echo -e "${GREEN}✓ Includes directory exists${NC}"
    else
        echo -e "${RED}✗ Includes directory missing${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ Plugin directory not found${NC}"
    exit 1
fi

# Check MCP server
echo ""
echo "3️⃣ Checking MCP server..."
MCP_DIR="apps/wp-mcp-server-ayu"
if [ -d "$MCP_DIR/dist" ] && [ -f "$MCP_DIR/dist/server.js" ]; then
    echo -e "${GREEN}✓ MCP server is built${NC}"
else
    echo -e "${YELLOW}⚠ MCP server not built. Building now...${NC}"
    cd "$MCP_DIR" && pnpm run build && cd ../..
    if [ -f "$MCP_DIR/dist/server.js" ]; then
        echo -e "${GREEN}✓ MCP server built successfully${NC}"
    else
        echo -e "${RED}✗ Failed to build MCP server${NC}"
        exit 1
    fi
fi

# Test REST API endpoint (if plugin is activated)
echo ""
echo "4️⃣ Testing REST API endpoint..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/wp-json/ayu/v1/posts 2>/dev/null || echo "000")
if [ "$API_RESPONSE" = "403" ] || [ "$API_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✓ REST API endpoint exists (auth required - expected)${NC}"
elif [ "$API_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ REST API endpoint is accessible${NC}"
elif [ "$API_RESPONSE" = "404" ]; then
    echo -e "${YELLOW}⚠ REST API endpoint not found. Plugin may not be activated.${NC}"
    echo "   Please activate the plugin in WordPress admin:"
    echo "   http://localhost:8080/wp-admin/plugins.php"
else
    echo -e "${YELLOW}⚠ Unexpected response: $API_RESPONSE${NC}"
fi

# Summary
echo ""
echo "========================================"
echo -e "${GREEN}✅ Basic checks completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Go to WordPress admin: http://localhost:8080/wp-admin"
echo "2. Activate 'AYU AI Elementor' plugin"
echo "3. Go to AYU AI → Tokens"
echo "4. Create a Personal Access Token"
echo "5. Copy the token and add it to ~/.cursor/mcp.json"
echo ""
echo "MCP Server Configuration:"
echo "  Command: pnpm --filter wp-mcp-server-ayu start:stdio"
echo "  CWD: $(pwd)"
echo "  Env: WORDPRESS_URL=http://localhost:8080"
echo "       AYU_TOKEN=<your-token-here>"
echo ""

