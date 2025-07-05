# 💬 Comment App - Production Ready

A highly scalable, production-ready comment application built with modern technologies and best practices.

## 🏗️ Architecture

### Tech Stack
- **Backend**: NestJS with TypeScript
- **Frontend**: Next.js 14 with TypeScript
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Reverse Proxy**: Nginx
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

### Key Features
- ✅ JWT Authentication with refresh tokens
- ✅ Rate limiting and throttling
- ✅ Comprehensive security headers
- ✅ Redis caching layer
- ✅ API documentation with Swagger
- ✅ Health checks and monitoring
- ✅ Multi-stage Docker builds
- ✅ Production-ready optimizations
- ✅ Automated CI/CD pipeline

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vatsalya001/comment-app.git
   cd comment-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.development .env
   ```

4. **Start development environment**
   ```bash
   # Using Docker Compose (Recommended)
   docker-compose up -d
   
   # Or start services individually
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api/docs

## 🏭 Production Deployment

### 1. Server Requirements

**Minimum Requirements:**
- 2 vCPU
- 4GB RAM
- 20GB SSD
- Ubuntu 20.04+ or similar Linux distribution

**Recommended for Production:**
- 4+ vCPU
- 8GB+ RAM
- 50GB+ SSD
- Load balancer for high availability

### 2. Server Setup

#### Install Docker and Docker Compose
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

#### Install Nginx (if not using containerized Nginx)
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3. Application Deployment

#### Clone and Setup Application
```bash
# Clone repository
git clone https://github.com/Vatsalya001/comment-app.git
cd comment-app

# Create application directory
sudo mkdir -p /opt/comment-app
sudo chown $USER:$USER /opt/comment-app
cp -r . /opt/comment-app/
cd /opt/comment-app
```

#### Configure Environment Variables
```bash
# Copy environment template
cp .env.example .env

# Generate secure JWT secrets
openssl rand -base64 64  # Use for JWT_SECRET
openssl rand -base64 64  # Use for JWT_REFRESH_SECRET

# Edit environment file
nano .env
```

**Important Environment Variables for Production:**
```bash
NODE_ENV=production
JWT_SECRET=your_secure_64_char_secret_here
JWT_REFRESH_SECRET=your_secure_64_char_refresh_secret_here
DATABASE_URL=postgresql://username:password@localhost:5432/comment_app_production
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

#### Deploy with Docker Compose
```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. SSL/TLS Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run

# Set up auto-renewal cron job
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### 5. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

## 🔧 Configuration Options

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Application environment | `development` | ✅ |
| `PORT` | Backend server port | `3001` | ❌ |
| `DATABASE_URL` | PostgreSQL connection string | - | ✅ |
| `REDIS_URL` | Redis connection string | - | ✅ |
| `JWT_SECRET` | JWT signing secret | - | ✅ |
| `JWT_REFRESH_SECRET` | Refresh token secret | - | ✅ |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` | ✅ |
| `NEXT_PUBLIC_API_URL` | Frontend API URL | `http://localhost:3001` | ✅ |

### Docker Commands

```bash
# Development
docker-compose up -d                    # Start dev environment
docker-compose down                     # Stop dev environment
docker-compose logs -f [service]        # View logs

# Production
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml pull

# Maintenance
docker system prune -f                  # Clean up unused containers
docker volume prune -f                  # Clean up unused volumes
```

## 🚀 Cloud Deployment Options

### 1. AWS EC2 Deployment

1. **Launch EC2 instance** (t3.medium or larger)
2. **Configure Security Groups** (ports 22, 80, 443)
3. **Follow server setup steps above**
4. **Configure Route 53** for domain management
5. **Set up Application Load Balancer** for HA

### 2. DigitalOcean Droplet

1. **Create Droplet** (2GB RAM minimum)
2. **Follow server setup steps above**
3. **Configure DNS** in DigitalOcean panel
4. **Set up floating IP** for static addressing

### 3. Google Cloud Platform

1. **Create Compute Engine instance**
2. **Configure firewall rules**
3. **Follow server setup steps above**
4. **Set up Cloud DNS** for domain management

### 4. Kubernetes Deployment

See the `/k8s` directory for Kubernetes manifests and Helm charts.

## 🔐 Security Considerations

### Production Security Checklist

- ✅ Use strong, unique JWT secrets (64+ characters)
- ✅ Configure proper CORS origins
- ✅ Enable SSL/TLS certificates
- ✅ Use environment variables for secrets
- ✅ Configure proper firewall rules
- ✅ Regular security updates
- ✅ Database connection encryption
- ✅ Rate limiting configured
- ✅ Security headers implemented

### Additional Security Measures

1. **Database Security**
   ```bash
   # Create dedicated database user
   sudo -u postgres psql
   CREATE USER comment_app_user WITH PASSWORD 'secure_password';
   GRANT ALL ON DATABASE comment_app_production TO comment_app_user;
   ```

2. **Redis Security**
   ```bash
   # Configure Redis password
   echo "requirepass your_redis_password" >> /etc/redis/redis.conf
   sudo systemctl restart redis
   ```

## 📊 Monitoring and Maintenance

### Health Checks

The application includes built-in health check endpoints:
- Backend: `http://localhost:3001/health`
- Frontend: `http://localhost:3000` (Next.js built-in)
- Nginx: `http://localhost/health`

### Logging

```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u docker -f
```

### Backup Strategy

```bash
# Database backup
docker exec comment-app-db-prod pg_dump -U postgres comment_app_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Redis backup
docker exec comment-app-redis-prod redis-cli BGSAVE
```

## 🔄 CI/CD Pipeline

The repository includes a comprehensive GitHub Actions pipeline:

1. **Automated Testing** - Unit tests, integration tests, linting
2. **Security Scanning** - Vulnerability assessment with Trivy
3. **Docker Image Building** - Multi-architecture builds
4. **Automated Deployment** - Zero-downtime deployments
5. **Notifications** - Slack integration for deployment status

### Required GitHub Secrets

```bash
PRODUCTION_HOST=your.server.ip
PRODUCTION_USER=deployment_user
PRODUCTION_SSH_KEY=your_private_ssh_key
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
JWT_SECRET=your_production_jwt_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
SLACK_WEBHOOK=your_slack_webhook_url
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests
cd backend && npm run test
cd backend && npm run test:e2e

# Frontend tests
cd frontend && npm run test

# Type checking
npm run type-check
```

## 📈 Performance Optimization

### Database Optimization
- Connection pooling configured
- Proper indexing strategies
- Query optimization
- Regular VACUUM and ANALYZE

### Caching Strategy
- Redis for session storage
- Application-level caching
- Nginx static file caching
- CDN integration ready

### Frontend Optimization
- Next.js automatic code splitting
- Image optimization
- Static asset caching
- Gzip compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

---

**Made with ❤️ for production deployment**