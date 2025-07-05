# 🚀 Production Deployment Checklist

Use this checklist to ensure a successful production deployment of the Comment App.

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Server meets minimum requirements (2 vCPU, 4GB RAM, 20GB SSD)
- [ ] Docker and Docker Compose installed
- [ ] Domain name configured and DNS pointing to server
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] SSL certificate obtained (Let's Encrypt recommended)

### Security Configuration
- [ ] Strong, unique passwords generated for all services
- [ ] JWT secrets generated using `./scripts/generate-secrets.sh`
- [ ] Environment variables configured in `.env` file
- [ ] `.env` file permissions set to 600 (`chmod 600 .env`)
- [ ] Database user created with limited privileges
- [ ] Redis password configured

### Application Configuration
- [ ] CORS origins updated with production domains
- [ ] API URL updated in frontend configuration
- [ ] Nginx configuration updated with correct domain names
- [ ] Health check endpoints tested

## 🚀 Deployment Steps

### 1. Server Preparation
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

# Reboot if kernel updated
sudo reboot
```

### 2. Application Setup
```bash
# Clone repository
git clone https://github.com/Vatsalya001/comment-app.git
cd comment-app

# Generate secrets
./scripts/generate-secrets.sh

# Configure environment
cp .env.production.generated .env
nano .env  # Update domains and verify settings
chmod 600 .env

# Remove temporary file
rm .env.production.generated
```

### 3. Database Setup
```bash
# Create production database and user
docker-compose -f docker-compose.prod.yml up -d postgres redis
sleep 30

# Create database user (optional - can be done via environment)
docker exec -it comment-app-db-prod psql -U postgres -c "
CREATE USER comment_app_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE comment_app_production OWNER comment_app_user;
GRANT ALL PRIVILEGES ON DATABASE comment_app_production TO comment_app_user;
"
```

### 4. SSL Certificate Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Stop nginx if running
sudo systemctl stop nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update nginx configuration with SSL paths
nano nginx/nginx.conf

# Enable SSL in nginx config (uncomment SSL section)
```

### 5. Application Deployment
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## ✅ Post-Deployment Verification

### Health Checks
- [ ] Backend health check: `curl http://localhost:3001/health`
- [ ] Frontend accessible: `curl http://localhost:3000`
- [ ] Nginx health check: `curl http://localhost/health`
- [ ] HTTPS redirect working: `curl -I http://yourdomain.com`
- [ ] SSL certificate valid: `curl -I https://yourdomain.com`

### Functionality Tests
- [ ] User registration works
- [ ] User login works
- [ ] Comment creation works
- [ ] Comment viewing works
- [ ] API documentation accessible (if enabled)

### Performance Tests
- [ ] Page load times acceptable (<2 seconds)
- [ ] API response times acceptable (<500ms)
- [ ] Database connections working
- [ ] Redis caching working

### Security Tests
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] Rate limiting working
- [ ] CORS properly configured
- [ ] No sensitive data in logs

## 🔄 CI/CD Setup (Optional)

### GitHub Secrets Configuration
Add these secrets to your GitHub repository:

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
SLACK_WEBHOOK=your_slack_webhook_url  # Optional
```

### SSH Key Setup for Deployment
```bash
# On your local machine, generate SSH key for deployment
ssh-keygen -t ed25519 -f ~/.ssh/comment-app-deploy -C "comment-app-deployment"

# Copy public key to server
ssh-copy-id -i ~/.ssh/comment-app-deploy.pub user@your.server.ip

# Add private key to GitHub secrets (PRODUCTION_SSH_KEY)
cat ~/.ssh/comment-app-deploy
```

## 📊 Monitoring Setup

### Log Monitoring
```bash
# Set up log rotation
sudo nano /etc/logrotate.d/docker-containers

# Add log monitoring commands to crontab
crontab -e
```

### Backup Setup
```bash
# Create backup script
nano /opt/backup-comment-app.sh

# Add to crontab for daily backups
0 2 * * * /opt/backup-comment-app.sh
```

### Health Monitoring
```bash
# Set up health check monitoring
# Add to crontab for regular health checks
*/5 * * * * curl -f http://localhost/health || echo "Health check failed" | mail -s "Comment App Down" admin@yourdomain.com
```

## 🚨 Troubleshooting

### Common Issues

1. **Container fails to start**
   ```bash
   docker-compose -f docker-compose.prod.yml logs [service_name]
   ```

2. **Database connection fails**
   ```bash
   docker exec -it comment-app-db-prod psql -U postgres
   ```

3. **SSL certificate issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

4. **Nginx configuration issues**
   ```bash
   docker exec -it comment-app-nginx-prod nginx -t
   ```

### Emergency Rollback
```bash
# Stop current deployment
docker-compose -f docker-compose.prod.yml down

# Restore from backup
docker run --rm -v postgres_data_prod:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/backup.tar.gz"

# Restart with previous configuration
git checkout previous-working-commit
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Support Contacts

- **Technical Issues**: Create issue on GitHub
- **Security Concerns**: security@yourdomain.com
- **Emergency Contact**: Your emergency contact

---

**✅ Deployment Complete!**

Your Comment App is now running in production. Remember to:
- Monitor logs regularly
- Keep dependencies updated
- Rotate secrets periodically
- Backup data regularly
- Monitor performance metrics