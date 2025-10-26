# Security Setup Guide

## Admin API Key Configuration

The `/api/admin/*` endpoints are protected with API key authentication.

### Setup on EC2 (Production)

1. **SSH into your EC2 server**:
   ```bash
   ssh -i your-key.pem ubuntu@YOUR_EC2_IP
   ```

2. **Create `.env` file** in the project directory:
   ```bash
   cd ~/birdie
   nano .env
   ```

3. **Add the API key**:
   ```env
   ADMIN_API_KEY=817200522e0aed6d55a7ee2458930701bcb6127f7e20ced46e021d449a134eb1
   ```

4. **Save and exit** (Ctrl+X, then Y, then Enter)

5. **Secure the `.env` file**:
   ```bash
   chmod 600 .env
   ```

6. **Update docker-compose** to load the .env file:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

---

## Using the Admin API

### Export Subscribers (with API key)

**From EC2 server**:
```bash
# Using header
docker exec birdie-backend wget --header="x-api-key: 817200522e0aed6d55a7ee2458930701bcb6127f7e20ced46e021d449a134eb1" -qO- http://localhost:3001/api/admin/export
```

**From browser or curl**:
```bash
# Using query parameter
curl "https://birdie.augustwheel.com/api/admin/export?key=817200522e0aed6d55a7ee2458930701bcb6127f7e20ced46e021d449a134eb1"

# Or using header (more secure)
curl -H "x-api-key: 817200522e0aed6d55a7ee2458930701bcb6127f7e20ced46e021d449a134eb1" \
  https://birdie.augustwheel.com/api/admin/export
```

**In browser** (query parameter):
```
https://birdie.augustwheel.com/api/admin/export?key=817200522e0aed6d55a7ee2458930701bcb6127f7e20ced46e021d449a134eb1
```

---

## Security Best Practices

### ✅ DO:
- Keep your API key secret
- Use headers instead of query parameters when possible
- Rotate the key periodically
- Monitor logs for unauthorized access attempts
- Store the key in `.env` file (gitignored)

### ❌ DON'T:
- Share the API key publicly
- Commit the `.env` file to git
- Use the API key in client-side code
- Share the key in chat/email without encryption

---

## Rotating the API Key

If you need to change the API key:

1. **Generate a new key**:
   ```bash
   openssl rand -hex 32
   ```

2. **Update `.env` file on EC2**:
   ```bash
   nano ~/birdie/.env
   # Replace ADMIN_API_KEY value
   ```

3. **Restart backend**:
   ```bash
   docker-compose restart backend
   ```

---

## Monitoring Security

### Check for unauthorized attempts:

```bash
# View backend logs
docker logs birdie-backend --tail=100

# Look for:
# 🚨 Unauthorized admin access attempt from XXX.XXX.XXX.XXX
```

---

## Future Enhancements

For production with multiple admins, consider:
- OAuth2/JWT authentication
- Role-based access control (RBAC)
- Admin user accounts with passwords
- 2FA (Two-factor authentication)
- API key expiration
- Per-key rate limiting

---

**Your API Key** (KEEP SECRET!):
```
817200522e0aed6d55a7ee2458930701bcb6127f7e20ced46e021d449a134eb1
```

Save this somewhere safe (password manager, encrypted note, etc.)!
