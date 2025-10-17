# Authentication System Documentation

## Overview
This authentication system has been successfully integrated into your Node.js/Express project with the following features:

- ✅ User registration with email and password
- ✅ Secure password hashing using bcrypt
- ✅ User login with session management
- ✅ Protected dashboard route
- ✅ Client-side and server-side validation
- ✅ Rate limiting to prevent brute-force attacks
- ✅ Flash messages for user feedback
- ✅ MongoDB Atlas integration with Mongoose
- ✅ Environment variables for sensitive data

## File Structure

```
node_project/
├── .env                              # Environment variables (DO NOT COMMIT)
├── app.js                            # Updated with session, flash, auth routes
├── controllers/
│   ├── authController.js             # Authentication logic (login, register, logout)
│   └── customerController.js         # Existing controller
├── middleware/
│   └── authMiddleware.js             # Auth middleware (isAuthenticated, etc.)
├── models/
│   ├── userSchema.js                 # User model with password hashing
│   └── customerSchema.js             # Existing model
├── routes/
│   ├── authRoutes.js                 # Auth routes with rate limiting
│   └── allRouters.js                 # Existing routes
└── views/
    ├── auth/
    │   ├── login.ejs                 # Login page
    │   ├── register.ejs              # Registration page
    │   └── dashboard.ejs             # Protected dashboard
    └── [other existing views]
```

## Routes

### Authentication Routes
- **GET** `/auth/login` - Display login page
- **POST** `/auth/login` - Handle login (rate limited: 5 attempts per 15 minutes)
- **GET** `/auth/register` - Display registration page
- **POST** `/auth/register` - Handle registration (rate limited: 3 attempts per hour)
- **GET** `/auth/logout` - Logout user and destroy session
- **GET** `/dashboard` - Protected dashboard (requires authentication)

### Existing Routes
All your existing routes remain unchanged and functional.

## Environment Variables

The `.env` file contains sensitive configuration. **IMPORTANT**: Update the following values:

```env
# Server Configuration
PORT=3001

# MongoDB Configuration
MONGODB_URI=your-mongodb-connection-string

# Session Configuration
SESSION_SECRET=change-this-to-a-random-secure-string

# JWT Configuration (optional)
JWT_SECRET=change-this-to-a-random-secure-string
JWT_EXPIRES_IN=7d
```

### How to Generate Secure Secrets
Run this in Node.js console:
```javascript
require('crypto').randomBytes(64).toString('hex')
```

## Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

## Security Features

### 1. Password Hashing
- Passwords are hashed using bcrypt with a salt factor of 10
- Original passwords are never stored in the database
- Password comparison is done securely using bcrypt.compare()

### 2. Rate Limiting
- **Login**: 5 attempts per 15 minutes per IP
- **Registration**: 3 attempts per hour per IP
- Prevents brute-force attacks

### 3. Session Management
- Sessions expire after 7 days
- HttpOnly cookies prevent XSS attacks
- Secure flag enabled in production (requires HTTPS)

### 4. Input Validation
- **Client-side**: Real-time validation with visual feedback
- **Server-side**: Comprehensive validation before processing
- Email format validation
- Password strength validation

### 5. Error Handling
- Generic error messages to prevent user enumeration
- Flash messages for user feedback
- Proper error logging for debugging

## Usage

### Starting the Server
```bash
npm start
# or for development with auto-reload
npm run watch
```

### Testing the Authentication

1. **Register a new user**:
   - Navigate to `http://localhost:3001/auth/register`
   - Enter a valid email and strong password
   - Submit the form

2. **Login**:
   - Navigate to `http://localhost:3001/auth/login`
   - Enter your credentials
   - You'll be redirected to `/dashboard`

3. **Access protected routes**:
   - Try accessing `/dashboard` without logging in
   - You'll be redirected to the login page

4. **Logout**:
   - Click the logout button or navigate to `/auth/logout`

## Protecting Additional Routes

To protect any route, use the `isAuthenticated` middleware:

```javascript
const { isAuthenticated } = require('./middleware/authMiddleware');

// Protect a single route
app.get('/protected-route', isAuthenticated, (req, res) => {
  res.render('protected-page');
});

// Protect multiple routes
router.use(isAuthenticated); // All routes below this will be protected
router.get('/admin', adminController.index);
router.get('/settings', settingsController.index);
```

## Database Schema

### User Collection
```javascript
{
  email: String,           // Unique, lowercase, validated
  hashedPassword: String,  // Bcrypt hashed password
  createdAt: Date         // Timestamp of account creation
}
```

## Flash Messages

Flash messages are available in all views:
```ejs
<% if (success && success.length > 0) { %>
  <div class="alert alert-success"><%= success %></div>
<% } %>

<% if (error && error.length > 0) { %>
  <div class="alert alert-danger"><%= error %></div>
<% } %>
```

## Session Data

Access user data in controllers:
```javascript
// Check if user is logged in
if (req.session.userId) {
  const userId = req.session.userId;
  const userEmail = req.session.userEmail;
}
```

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
- Check your `MONGODB_URI` in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify network connectivity

### Issue: "Session not persisting"
- Check if cookies are enabled in your browser
- Verify `SESSION_SECRET` is set in `.env`
- Clear browser cookies and try again

### Issue: "Rate limit reached"
- Wait for the cooldown period (15 minutes for login, 1 hour for registration)
- Or restart the server to reset rate limits (development only)

### Issue: "Password validation failing"
- Ensure password meets all requirements
- Check for leading/trailing spaces
- Verify special characters are from the allowed set

## Next Steps

### Recommended Enhancements
1. **Email Verification**: Add email verification on registration
2. **Password Reset**: Implement forgot password functionality
3. **Two-Factor Authentication**: Add 2FA for enhanced security
4. **Remember Me**: Add "remember me" checkbox for longer sessions
5. **Account Settings**: Allow users to update email/password
6. **Admin Panel**: Create admin roles and permissions
7. **Social Login**: Integrate OAuth (Google, Facebook, etc.)
8. **Audit Logging**: Track login attempts and account changes

### Production Checklist
- [ ] Update `SESSION_SECRET` to a strong random value
- [ ] Update `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Configure proper CORS settings
- [ ] Set up monitoring and logging
- [ ] Implement backup strategy for database
- [ ] Add rate limiting to other sensitive routes
- [ ] Review and test all security measures

## Support

For issues or questions, refer to the documentation of:
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [express-session](https://www.npmjs.com/package/express-session)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
