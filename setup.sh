#!/bin/bash

# Comment App Setup Script
# This script helps you get started with the comment application quickly

set -e

echo "🚀 Comment App Setup Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed ✓"
}

# Check if Node.js is installed (for development)
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. You'll need it for local development."
    else
        NODE_VERSION=$(node --version)
        print_status "Node.js version: $NODE_VERSION ✓"
    fi
}

# Create environment files
create_env_files() {
    print_header "Creating environment files..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/comment_app
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production-$(openssl rand -hex 32)
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-$(openssl rand -hex 32)
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
THROTTLE_TTL=60
THROTTLE_LIMIT=100
CACHE_TTL=300
CACHE_MAX=100
CORS_ORIGIN=http://localhost:3000
EOF
        print_status "Created backend/.env with secure JWT secrets"
    else
        print_status "Backend .env file already exists"
    fi
    
    # Frontend .env.local
    if [ ! -f "frontend/.env.local" ]; then
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
        print_status "Created frontend/.env.local"
    else
        print_status "Frontend .env.local file already exists"
    fi
}

# Setup function
setup_application() {
    print_header "Setting up Comment Application..."
    
    # Install root dependencies
    if [ -f "package.json" ]; then
        print_status "Installing root dependencies..."
        npm install
    fi
    
    # Build and start containers
    print_header "Building Docker containers..."
    docker-compose build
    
    print_header "Starting services..."
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to start..."
    sleep 10
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_status "Services are starting up..."
        
        echo ""
        echo "🎉 Setup completed successfully!"
        echo ""
        echo "📋 Service URLs:"
        echo "   🌐 Frontend: http://localhost:3000"
        echo "   🔧 Backend API: http://localhost:3001"
        echo "   📚 API Documentation: http://localhost:3001/api/docs"
        echo "   🏥 Health Check: http://localhost:3001/health"
        echo ""
        echo "📊 Database & Cache:"
        echo "   🐘 PostgreSQL: localhost:5432"
        echo "   📦 Redis: localhost:6379"
        echo ""
        echo "🔧 Useful commands:"
        echo "   View logs: npm run docker:logs"
        echo "   Stop services: npm run docker:down"
        echo "   Restart: docker-compose restart"
        echo ""
        echo "⚠️  Note: It may take a few moments for all services to be fully ready."
        echo "   Check the logs if you encounter any issues: npm run docker:logs"
        
    else
        print_error "Some services failed to start. Check logs with: docker-compose logs"
        exit 1
    fi
}

# Development setup
setup_development() {
    print_header "Setting up for local development..."
    
    # Backend setup
    if [ -d "backend" ]; then
        print_status "Setting up backend..."
        cd backend
        if [ ! -d "node_modules" ]; then
            npm install
        fi
        cd ..
    fi
    
    # Frontend setup
    if [ -d "frontend" ]; then
        print_status "Setting up frontend..."
        cd frontend
        if [ ! -d "node_modules" ]; then
            npm install
        fi
        cd ..
    fi
    
    print_status "Development setup completed!"
    echo ""
    echo "🔧 Development commands:"
    echo "   Backend: cd backend && npm run start:dev"
    echo "   Frontend: cd frontend && npm run dev"
    echo "   Both: npm run dev (from root)"
}

# Main menu
show_menu() {
    echo ""
    echo "Please choose an option:"
    echo "1) 🐳 Docker Setup (Recommended)"
    echo "2) 💻 Development Setup"
    echo "3) 🔧 Create Environment Files Only"
    echo "4) ❌ Exit"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            check_docker
            create_env_files
            setup_application
            ;;
        2)
            check_nodejs
            create_env_files
            setup_development
            ;;
        3)
            create_env_files
            print_status "Environment files created successfully!"
            ;;
        4)
            print_status "Goodbye! 👋"
            exit 0
            ;;
        *)
            print_error "Invalid option. Please choose 1-4."
            show_menu
            ;;
    esac
}

# Check if running with arguments
if [ $# -eq 0 ]; then
    show_menu
else
    case $1 in
        "docker")
            check_docker
            create_env_files
            setup_application
            ;;
        "dev")
            check_nodejs
            create_env_files
            setup_development
            ;;
        "env")
            create_env_files
            ;;
        *)
            echo "Usage: $0 [docker|dev|env]"
            echo "  docker: Setup with Docker (recommended)"
            echo "  dev: Setup for local development"
            echo "  env: Create environment files only"
            exit 1
            ;;
    esac
fi