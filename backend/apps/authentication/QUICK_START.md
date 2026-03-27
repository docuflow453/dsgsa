# Authentication Module - Quick Start Guide

## 🚀 Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env - set EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend for dev
```

### 3. Run Migrations
```bash
python manage.py makemigrations authentication
python manage.py migrate
```

### 4. Create Test User
```bash
python manage.py shell
```
```python
from users.models import User
user = User.objects.create_user(
    username='sarah.parker@shyft.com',
    email='sarah.parker@shyft.com',
    password='TestPass123!',
    first_name='Sarah',
    last_name='Parker'
)
```

### 5. Start Server
```bash
python manage.py runserver
```

## 📡 API Endpoints Reference

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "sarah.parker@shyft.com", "password": "TestPass123!"}'
```

**Response:**
```json
{
  "user": {...},
  "tokens": {
    "access_token": "eyJ0eXAi...",
    "refresh_token": "eyJ0eXAi...",
    "expires_in": 1800
  }
}
```

### Refresh Token
```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
```

### Forgot Password
```bash
curl -X POST http://localhost:8000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "sarah.parker@shyft.com"}'
```

### Reset Password
```bash
curl -X POST http://localhost:8000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_FROM_EMAIL",
    "new_password": "NewPass123!",
    "confirm_password": "NewPass123!"
  }'
```

### Logout
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
```

## 🧪 Running Tests

```bash
# All authentication tests
pytest apps/authentication/tests.py -v

# Specific test class
pytest apps/authentication/tests.py::TestAuthenticationService -v

# With coverage
pytest apps/authentication/tests.py --cov=apps.authentication
```

## 🔑 Key Configuration Variables

Add to your `.env` file:

```bash
# Email (Development - prints to console)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@shyft.com

# Email (Production - SMTP)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@shyft.com
EMAIL_HOST_PASSWORD=your-app-password

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:4200

# JWT Token Lifetimes (optional)
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=30
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7
PASSWORD_RESET_TOKEN_EXPIRY_HOURS=1
```

## 💡 Frontend Integration Example

### Login Component (TypeScript)
```typescript
async login(email: string, password: string) {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Store tokens
  localStorage.setItem('access_token', data.tokens.access_token);
  localStorage.setItem('refresh_token', data.tokens.refresh_token);
  
  return data;
}
```

### Making Authenticated Requests
```typescript
async makeAuthRequest(url: string) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
}
```

### Token Refresh
```typescript
async refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  
  const response = await fetch('http://localhost:8000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
}
```

## 🐛 Troubleshooting

**Problem:** Email not sending  
**Solution:** Check EMAIL_BACKEND in .env - use `console.EmailBackend` for dev

**Problem:** Token expired errors  
**Solution:** Implement automatic token refresh in frontend

**Problem:** Tests failing  
**Solution:** Ensure test database is clean: `pytest --create-db`

**Problem:** Import errors  
**Solution:** Install all dependencies: `pip install -r requirements.txt`

## 📚 Additional Resources

- **Full Documentation**: See `README.md`
- **Setup Guide**: See `SETUP.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **API Docs**: Visit `http://localhost:8000/api/docs` (when server is running)

