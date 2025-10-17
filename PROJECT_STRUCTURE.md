# Project Structure

## Complete File Tree

```
node_project/
│
├── 📄 .env                          # Environment variables (SECRET - DO NOT COMMIT!)
├── 📄 .gitignore                    # Git ignore file (includes .env)
├── 📄 .dockerignore                 # Docker ignore file
├── 📄 package.json                  # Dependencies and scripts
├── 📄 package-lock.json             # Locked dependency versions
├── 📄 app.js                        # Main application file ⭐ UPDATED
│
├── 📄 AUTH_README.md                # Authentication documentation ✨ NEW
├── 📄 SETUP_COMPLETE.md             # Setup guide ✨ NEW
├── 📄 PROJECT_STRUCTURE.md          # This file ✨ NEW
│
├── 📁 controllers/
│   ├── 📄 authController.js         # Authentication logic ✨ NEW
│   └── 📄 customerController.js     # Existing customer logic
│
├── 📁 middleware/
│   └── 📄 authMiddleware.js         # Auth middleware ✨ NEW
│
├── 📁 models/
│   ├── 📄 userSchema.js             # User model ✨ NEW
│   └── 📄 customerSchema.js         # Existing customer model
│
├── 📁 routes/
│   ├── 📄 authRoutes.js             # Auth routes ✨ NEW
│   └── 📄 allRouters.js             # Existing routes
│
├── 📁 views/
│   ├── 📁 auth/                     # Authentication views ✨ NEW
│   │   ├── 📄 login.ejs             # Login page
│   │   ├── 📄 register.ejs          # Registration page
│   │   └── 📄 dashboard.ejs         # Dashboard page
│   │
│   ├── 📁 components/               # Existing components
│   │   └── [existing files]
│   │
│   ├── 📁 user/                     # Existing user views
│   │   └── [existing files]
│   │
│   └── 📄 index.ejs                 # Existing home page
│
└── 📁 public/                       # Static assets (CSS, JS, images)
    └── [existing files]
```

## Key Files Explained

### 🔐 Authentication Files (NEW)

#### `.env`
- Stores sensitive configuration (secrets, database URI)
- **NEVER commit this file to Git!**
- Contains: PORT, MONGODB_URI, SESSION_SECRET, JWT_SECRET

#### `models/userSchema.js`
- Mongoose schema for user accounts
- Handles password hashing automatically
- Fields: email, hashedPassword, createdAt

#### `controllers/authController.js`
- Login logic
- Registration logic
- Logout logic
- Dashboard logic
- Input validation
- Error handling

#### `routes/authRoutes.js`
- `/auth/login` - Login routes
- `/auth/register` - Registration routes
- `/auth/logout` - Logout route
- Rate limiting configuration

#### `middleware/authMiddleware.js`
- `isAuthenticated` - Protects routes
- `isNotAuthenticated` - Redirects logged-in users
- `setUserLocals` - Makes user data available to views

#### `views/auth/login.ejs`
- Beautiful login page
- Client-side validation
- Password toggle
- Flash messages

#### `views/auth/register.ejs`
- Registration page
- Password strength indicator
- Real-time validation
- Requirement checklist

#### `views/auth/dashboard.ejs`
- Protected user dashboard
- Account information display
- Quick links
- Modern UI

### 📝 Updated Files

#### `app.js`
- Added dotenv configuration
- Added session middleware
- Added flash messages
- Integrated auth routes
- Added dashboard route
- Updated MongoDB connection to use env variable

#### `.gitignore`
- Added `.env` to prevent committing secrets

#### `package.json`
- Added new dependencies:
  - bcrypt (password hashing)
  - express-session (session management)
  - connect-flash (flash messages)
  - express-rate-limit (rate limiting)
  - dotenv (environment variables)
  - jsonwebtoken (JWT tokens)

## Route Structure

### Authentication Routes (`/auth/*`)
```
GET  /auth/login          → Login page
POST /auth/login          → Process login (rate limited)
GET  /auth/register       → Registration page
POST /auth/register       → Process registration (rate limited)
GET  /auth/logout         → Logout and destroy session
```

### Protected Routes
```
GET  /dashboard           → User dashboard (requires login)
```

### Existing Routes (Unchanged)
```
GET  /                    → Home page
GET  /user/add.html       → Add user page
GET  /search              → Search page
GET  /edit/:id            → Edit user page
GET  /view/:id            → View user page
POST /user/add.html       → Add user
POST /search              → Search users
PUT  /edit/:id            → Update user
DELETE /edit/:id          → Delete user
```

## Data Flow

### Registration Flow
```
User fills form → Client validation → Submit
                                      ↓
                        Server validation (authController)
                                      ↓
                        Check if email exists
                                      ↓
                        Hash password (bcrypt)
                                      ↓
                        Save to MongoDB
                                      ↓
                        Redirect to login with success message
```

### Login Flow
```
User enters credentials → Client validation → Submit
                                              ↓
                            Server validation (authController)
                                              ↓
                            Find user by email
                                              ↓
                            Compare password (bcrypt)
                                              ↓
                            Create session
                                              ↓
                            Redirect to dashboard
```

### Protected Route Access
```
User requests /dashboard → isAuthenticated middleware
                                    ↓
                          Check if session exists
                                    ↓
                    Yes ←                → No
                    ↓                      ↓
            Allow access          Redirect to login
                    ↓
            Render dashboard
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. Client-Side Validation              │
│     - Email format                      │
│     - Password strength                 │
│     - Real-time feedback                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  2. Rate Limiting                       │
│     - 5 login attempts / 15 min         │
│     - 3 register attempts / hour        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  3. Server-Side Validation              │
│     - Email format                      │
│     - Password requirements             │
│     - Input sanitization                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  4. Password Hashing                    │
│     - Bcrypt with salt factor 10        │
│     - Never store plain passwords       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  5. Session Security                    │
│     - HttpOnly cookies                  │
│     - Secure flag in production         │
│     - 7-day expiration                  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  6. Database Security                   │
│     - Mongoose schema validation        │
│     - Unique email constraint           │
│     - Connection string in .env         │
└─────────────────────────────────────────┘
```

## Dependencies Overview

### Production Dependencies
```json
{
  "bcrypt": "Password hashing",
  "connect-flash": "Flash messages",
  "dotenv": "Environment variables",
  "ejs": "Template engine",
  "express": "Web framework",
  "express-rate-limit": "Rate limiting",
  "express-session": "Session management",
  "jsonwebtoken": "JWT tokens (optional)",
  "mongoose": "MongoDB ODM"
}
```

### Development Dependencies
```json
{
  "nodemon": "Auto-restart server",
  "@types/node": "TypeScript definitions"
}
```

## Environment Variables

```env
# Server
PORT=3001                    # Server port

# Database
MONGODB_URI=mongodb+srv://   # MongoDB connection string

# Security
SESSION_SECRET=***           # Session encryption key
JWT_SECRET=***               # JWT signing key (optional)
JWT_EXPIRES_IN=7d           # JWT expiration time
```

## Quick Reference

### Start Server
```bash
npm start              # Production
npm run watch          # Development (auto-reload)
```

### Access Points
```
Login:        http://localhost:3001/auth/login
Register:     http://localhost:3001/auth/register
Dashboard:    http://localhost:3001/dashboard
Home:         http://localhost:3001/
```

### Protect a Route
```javascript
const { isAuthenticated } = require('./middleware/authMiddleware');
app.get('/protected', isAuthenticated, controller.method);
```

### Access User in Controller
```javascript
const userId = req.session.userId;
const userEmail = req.session.userEmail;
```

### Flash Messages in Views
```ejs
<% if (error && error.length > 0) { %>
  <div class="alert alert-danger"><%= error %></div>
<% } %>
```

---

**Legend:**
- ✨ NEW - Newly created file
- ⭐ UPDATED - Modified existing file
- 📁 - Directory
- 📄 - File
