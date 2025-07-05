#!/bin/bash

# Generate Secure Secrets for Comment App
# This script generates cryptographically secure secrets for production use

echo "🔐 Generating secure secrets for Comment App production deployment..."
echo

# Check if openssl is available
if ! command -v openssl &> /dev/null; then
    echo "❌ Error: openssl is not installed. Please install openssl first."
    exit 1
fi

# Generate JWT secrets
echo "📝 Generating JWT secrets..."
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
JWT_REFRESH_SECRET=$(openssl rand -base64 64 | tr -d '\n')

# Generate database password
echo "📝 Generating database password..."
DB_PASSWORD=$(openssl rand -base64 32 | tr -d '\n' | tr -d '=')

# Generate Redis password
echo "📝 Generating Redis password..."
REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d '\n' | tr -d '=')

# Create output file
OUTPUT_FILE=".env.production.generated"

echo "💾 Writing secrets to ${OUTPUT_FILE}..."
cat > "${OUTPUT_FILE}" << EOF
# ==============================================
# PRODUCTION SECRETS - GENERATED $(date)
# ==============================================
# ⚠️  IMPORTANT: Keep these secrets secure and never commit to version control
# Copy these values to your production .env file

# ==============================================
# APPLICATION SETTINGS
# ==============================================
NODE_ENV=production
PORT=3001
API_PREFIX=api

# ==============================================
# DATABASE CONFIGURATION
# ==============================================
DATABASE_URL=postgresql://comment_app_user:${DB_PASSWORD}@localhost:5432/comment_app_production
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=comment_app_user
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=comment_app_production

# ==============================================
# REDIS CONFIGURATION
# ==============================================
REDIS_URL=redis://:${REDIS_PASSWORD}@localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# ==============================================
# JWT AUTHENTICATION SECRETS
# ==============================================
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# ==============================================
# RATE LIMITING & THROTTLING
# ==============================================
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# ==============================================
# CACHING CONFIGURATION
# ==============================================
CACHE_TTL=300
CACHE_MAX=100

# ==============================================
# CORS CONFIGURATION
# ==============================================
# Update with your actual domain(s)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# ==============================================
# FRONTEND CONFIGURATION
# ==============================================
# Update with your actual API domain
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# ==============================================
# PRODUCTION SECURITY
# ==============================================
DATABASE_SSL=true
REDIS_TLS=false

# ==============================================
# MONITORING & LOGGING
# ==============================================
LOG_LEVEL=error
ENABLE_REQUEST_LOGGING=false
EOF

echo
echo "✅ Secrets generated successfully!"
echo
echo "📋 Next steps:"
echo "1. Copy the contents of '${OUTPUT_FILE}' to your production .env file"
echo "2. Update CORS_ORIGIN with your actual domain(s)"
echo "3. Update NEXT_PUBLIC_API_URL with your actual API domain"
echo "4. Secure the .env file with proper permissions: chmod 600 .env"
echo "5. Delete the generated file after copying: rm ${OUTPUT_FILE}"
echo
echo "🔒 Security reminders:"
echo "- Never commit .env files to version control"
echo "- Store secrets securely (e.g., in a password manager)"
echo "- Rotate secrets regularly"
echo "- Use different secrets for different environments"
echo
echo "⚠️  The generated file '${OUTPUT_FILE}' contains sensitive information."
echo "   Please handle it securely and delete it after use."