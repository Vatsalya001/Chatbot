#!/bin/bash

# Netlify Deployment Preparation Script
# This script helps prepare your comment app for Netlify deployment

set -e

echo "🚀 Netlify Deployment Preparation"
echo "================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the comment app root directory"
    exit 1
fi

print_step "Preparing frontend for Netlify deployment..."

# Step 2: Navigate to frontend directory
cd frontend

# Step 3: Check if required files exist
if [ ! -f "netlify.toml" ]; then
    echo "❌ netlify.toml not found. Please ensure the frontend configuration is complete."
    exit 1
fi

print_success "netlify.toml configuration found"

# Step 4: Create production environment file if it doesn't exist
if [ ! -f ".env.production" ]; then
    print_step "Creating .env.production file..."
    
    # Prompt for backend URL
    echo ""
    echo "🔗 Please enter your backend URL (Railway/Render deployment URL):"
    echo "   Example: https://your-app.railway.app"
    read -p "Backend URL: " BACKEND_URL
    
    if [ -z "$BACKEND_URL" ]; then
        echo "❌ Backend URL is required"
        exit 1
    fi
    
    # Create production environment file
    cat > .env.production << EOF
NEXT_PUBLIC_API_URL=$BACKEND_URL
EOF
    
    print_success "Created .env.production with backend URL: $BACKEND_URL"
else
    print_success ".env.production already exists"
fi

# Step 5: Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_step "Installing frontend dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi

# Step 6: Test build
print_step "Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build successful! ✨"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi

# Step 7: Check if 'out' directory was created
if [ -d "out" ]; then
    print_success "Static export created in 'out' directory"
else
    echo "❌ Static export failed. 'out' directory not found."
    exit 1
fi

# Navigate back to root
cd ..

echo ""
echo "🎉 Frontend is ready for Netlify deployment!"
echo ""
echo "📋 Next steps:"
echo "1. 🌐 Go to https://netlify.com and sign up/login"
echo "2. 📁 Click 'New site from Git'"
echo "3. 🔗 Connect your GitHub repository"
echo "4. ⚙️  Configure build settings:"
echo "   - Base directory: frontend"
echo "   - Build command: npm run build"
echo "   - Publish directory: frontend/out"
echo "5. 🔧 Add environment variable:"
echo "   - NEXT_PUBLIC_API_URL = $(cat frontend/.env.production | grep NEXT_PUBLIC_API_URL | cut -d'=' -f2)"
echo "6. 🚀 Deploy!"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - QUICK_DEPLOY.md (quick guide)"
echo "   - NETLIFY_DEPLOYMENT.md (comprehensive guide)"
echo ""

# Step 8: Display backend deployment reminder
echo "⚠️  IMPORTANT: Make sure your backend is deployed first!"
echo ""
echo "Backend deployment options:"
echo "🚂 Railway: https://railway.app (recommended)"
echo "🎨 Render: https://render.com"
echo "🌿 Heroku: https://heroku.com"
echo ""
echo "Required backend environment variables:"
echo "- NODE_ENV=production"
echo "- JWT_SECRET=your-secure-secret"
echo "- JWT_REFRESH_SECRET=your-secure-refresh-secret"
echo "- CORS_ORIGIN=https://your-netlify-url.netlify.app"
echo ""

print_success "Deployment preparation complete! 🎊"