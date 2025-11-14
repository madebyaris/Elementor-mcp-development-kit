#!/bin/bash

# Check if AYU plugin is activated

echo "🔍 Checking AYU AI Elementor Plugin Status"
echo "==========================================="
echo ""

# Check if plugin file exists
PLUGIN_FILE="apps/wordpress/wp-content/plugins/ayu-ai-elementor/ayu-ai-elementor.php"
if [ -f "$PLUGIN_FILE" ]; then
    echo "✅ Plugin file exists"
else
    echo "❌ Plugin file not found at: $PLUGIN_FILE"
    exit 1
fi

# Check WordPress REST API base
echo ""
echo "Testing WordPress REST API..."
REST_BASE=$(curl -s http://localhost:8080/wp-json/ | grep -o '"name":"[^"]*"' | head -1)
if [ ! -z "$REST_BASE" ]; then
    echo "✅ WordPress REST API is accessible"
else
    echo "❌ WordPress REST API not accessible"
    exit 1
fi

# Check if AYU namespace exists
echo ""
echo "Checking AYU REST API namespace..."
AYU_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/wp-json/ayu/v1/ 2>/dev/null)
if [ "$AYU_RESPONSE" = "200" ] || [ "$AYU_RESPONSE" = "401" ] || [ "$AYU_RESPONSE" = "403" ]; then
    echo "✅ AYU namespace exists (HTTP $AYU_RESPONSE)"
    echo ""
    echo "Testing specific endpoint..."
    curl -s http://localhost:8080/wp-json/ayu/v1/posts 2>&1 | head -5
elif [ "$AYU_RESPONSE" = "404" ]; then
    echo "❌ AYU namespace not found (HTTP 404)"
    echo ""
    echo "Possible issues:"
    echo "1. Plugin not activated"
    echo "2. Permalink rewrite rules need flushing"
    echo ""
    echo "Solutions:"
    echo "1. Go to: http://localhost:8080/wp-admin/plugins.php"
    echo "   - Find 'AYU AI Elementor'"
    echo "   - Click 'Activate'"
    echo ""
    echo "2. Flush permalinks:"
    echo "   - Go to: http://localhost:8080/wp-admin/options-permalink.php"
    echo "   - Click 'Save Changes' (no need to change anything)"
else
    echo "⚠️  Unexpected response: HTTP $AYU_RESPONSE"
fi

echo ""
echo "==========================================="

