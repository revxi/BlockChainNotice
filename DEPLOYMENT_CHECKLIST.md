# BlockNotice Tamper-Evident System - Deployment Checklist

## Pre-Deployment

### Local Development
- [ ] Clone repository
- [ ] Read `TAMPER_EVIDENT_IMPLEMENTATION.md`
- [ ] Read `blockchain/backend/TAMPER_EVIDENT_GUIDE.md`
- [ ] Install Node.js dependencies: `npm install`
- [ ] Create PostgreSQL database: `createdb blocknotice`
- [ ] Copy `.env.example` to `.env`
- [ ] Update database credentials in `.env`
- [ ] Run server: `npm start`
- [ ] Verify setup: `node test-tamper-evident.js`
- [ ] All tests pass ✓

### Database Setup
- [ ] PostgreSQL installed and running
- [ ] Database created: `blocknotice`
- [ ] User account with proper permissions
- [ ] Connection tested from application
- [ ] Schema auto-created on first server start
- [ ] Backups configured

## Deployment Steps

### 1. Database Provisioning
- [ ] Create managed PostgreSQL instance (AWS RDS, Heroku, DigitalOcean, etc.)
- [ ] Note connection string
- [ ] Create database: `blocknotice`
- [ ] Set `DATABASE_URL` environment variable
- [ ] Test connection from your machine
- [ ] Configure automatic backups
- [ ] Set retention policy (e.g., 30 days)

### 2. Backend Deployment
- [ ] Push code to repository
- [ ] Set `DATABASE_URL` in production environment
- [ ] Ensure `NODE_ENV=production`
- [ ] Set `FRONTEND_URL` to your frontend domain
- [ ] Deploy backend (Render, Heroku, AWS, DigitalOcean, etc.)
- [ ] Verify deployment: `curl https://your-backend/api/health`
- [ ] Check logs for startup messages

### 3. Verification
- [ ] Database schema created automatically
- [ ] Test POST to `/api/notices-chain` (create notice)
- [ ] Test GET from `/api/notices-chain` (retrieve notices)
- [ ] Test GET `/api/chain-verify` (verify integrity)
- [ ] Test GET `/api/chain-status` (check health)
- [ ] All endpoints respond with correct status codes

### 4. Monitoring Setup
- [ ] Set up error logging (Sentry, LogRocket, etc.)
- [ ] Configure database monitoring
- [ ] Set up alerting for chain tampering
- [ ] Create dashboard for monitoring chain health
- [ ] Test alert notifications

## Post-Deployment

### Security Verification
- [ ] HTTPS enabled for all endpoints
- [ ] CORS configured for your frontend domain only
- [ ] Database password not in logs
- [ ] Environment variables use `.env` file (not committed to git)
- [ ] `.env` file in `.gitignore`
- [ ] SSH keys and secrets not exposed

### Performance Verification
- [ ] Server responds under 200ms for read endpoints
- [ ] Publish endpoint completes under 500ms
- [ ] Verification endpoint completes in reasonable time
- [ ] Database connections pooled properly
- [ ] No memory leaks over 24 hours

### Data Integrity Verification
- [ ] Run chain verification after deployment: `GET /api/chain-verify`
- [ ] Result shows `is_valid: true`
- [ ] No tampering detected
- [ ] Previous notice hashes are correct
- [ ] Genesis hash is "0000000000000000"

## Ongoing Operations

### Daily
- [ ] Automated chain verification runs
- [ ] No tampering alerts
- [ ] Error logs checked
- [ ] Performance metrics normal

### Weekly
- [ ] Database backups verified
- [ ] Chain integrity report generated
- [ ] Monitoring alerts reviewed
- [ ] System resource usage checked

### Monthly
- [ ] Full backup test and restore
- [ ] Security patches applied
- [ ] Performance optimization review
- [ ] Capacity planning assessment

## Rollback Plan

If something goes wrong:

1. **Database Rollback**
   ```bash
   # Stop backend
   # Restore from backup
   psql blocknotice < backup.sql
   # Restart backend
   ```

2. **Code Rollback**
   ```bash
   # Revert to previous version
   git checkout previous-commit-hash
   # Redeploy
   ```

3. **Verification After Rollback**
   ```bash
   # Verify chain integrity
   curl https://your-backend/api/chain-verify
   # Check for tampering
   ```

## Emergency Contacts

- [ ] Database provider support contact
- [ ] Hosting provider support contact
- [ ] Security team contact
- [ ] Backup contacts for critical systems

## Sign-Off

- **Deployed by:** _____________________
- **Date:** _____________________
- **Verified by:** _____________________
- **Date:** _____________________

## Notes

```
[Space for deployment notes, issues encountered, solutions applied]
```

---

## API Health Endpoints (for Monitoring)

```bash
# General health
curl https://your-backend/api/health

# Chain status
curl https://your-backend/api/chain-status

# Full verification
curl https://your-backend/api/chain-verify

# Database connectivity
curl https://your-backend/api/notices-chain
```

## Environment Variables Checklist

```bash
# Copy this to production environment
DATABASE_URL=postgresql://...
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
CONTRACT_ADDRESS=0x...  # Optional
RPC_URL=https://...      # Optional
ETHEREUM_NETWORK=sepolia # Optional
```

## Support Resources

- Main documentation: `TAMPER_EVIDENT_IMPLEMENTATION.md`
- API guide: `blockchain/backend/TAMPER_EVIDENT_GUIDE.md`
- Test suite: `blockchain/backend/test-tamper-evident.js`
- Database: `backend/utils/blockchain.js`
