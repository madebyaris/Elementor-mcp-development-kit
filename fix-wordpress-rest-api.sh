#!/bin/bash

# Fix WordPress REST API by flushing permalinks

echo "🔧 Fixing WordPress REST API"
echo "============================"
echo ""

# Method 1: Try to flush permalinks via PHP
echo "Attempting to flush permalinks..."

# Create a temporary PHP file to flush permalinks
cat > /tmp/flush-permalinks.php << 'EOF'
<?php
require_once('/var/www/html/wp-load.php');
flush_rewrite_rules();
echo "Permalinks flushed successfully!\n";
EOF

# Copy to WordPress container and execute
docker cp /tmp/flush-permalinks.php madebyaris-mcp-elementor-wordpress-1:/tmp/flush-permalinks.php
docker exec madebyaris-mcp-elementor-wordpress-1 php /tmp/flush-permalinks.php 2>&1

# Cleanup
rm -f /tmp/flush-permalinks.php
docker exec madebyaris-mcp-elementor-wordpress-1 rm -f /tmp/flush-permalinks.php

echo ""
echo "Testing REST API..."
sleep 2

# Test REST API
REST_TEST=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080/wp-json/" 2>/dev/null)
if [ "$REST_TEST" = "200" ]; then
    echo "✅ WordPress REST API is now accessible!"
else
    echo "⚠️  REST API still returning HTTP $REST_TEST"
    echo ""
    echo "Manual steps required:"
    echo "1. Go to: http://localhost:8080/wp-admin/options-permalink.php"
    echo "2. Click 'Save Changes' (no need to change anything)"
    echo "3. This will flush rewrite rules and enable REST API"
fi

echo ""
echo "Testing AYU endpoints..."
AYU_TEST=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080/wp-json/ayu/v1/posts" 2>/dev/null)
if [ "$AYU_TEST" = "403" ] || [ "$AYU_TEST" = "401" ]; then
    echo "✅ AYU REST API namespace exists (auth required - expected)"
elif [ "$AYU_TEST" = "200" ]; then
    echo "✅ AYU REST API is accessible"
elif [ "$AYU_TEST" = "404" ]; then
    echo "❌ AYU namespace not found"
    echo "   Make sure plugin is activated: http://localhost:8080/wp-admin/plugins.php"
else
    echo "⚠️  Unexpected response: HTTP $AYU_TEST"
fi

