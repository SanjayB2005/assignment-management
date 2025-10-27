# Assignment Management System - Setup Guide

## Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Google OAuth Setup

To enable Google OAuth login functionality, you'll need to configure Google API credentials.

### 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API for your project:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Configure the consent screen first if prompted
   - Choose "Web application" as application type
   - Add authorized redirect URIs:
     - `http://localhost:5173/auth/callback`
     - `http://localhost:5173` (for frontend)
   - Note down your Client ID and Client Secret

### 2. Configure Backend

1. Open `server/src/main/resources/application.properties`
2. Replace the placeholder values:
   ```properties
   spring.security.oauth2.client.registration.google.client-id=YOUR_ACTUAL_GOOGLE_CLIENT_ID
   spring.security.oauth2.client.registration.google.client-secret=YOUR_ACTUAL_GOOGLE_CLIENT_SECRET
   ```

### 3. Configure Frontend

1. Open `client/.env`
2. Replace the placeholder value:
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_GOOGLE_CLIENT_ID
   ```

## Database Setup

1. Create a MySQL database named `assignment_management`
2. Update database credentials in `application.properties`:
   ```properties
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

## Running the Application

### Backend
```bash
cd server
mvn spring-boot:run
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Google OAuth Login Flow

Users can now:
1. Click "Continue with Google" on login/register pages
2. Authenticate with their Google account
3. Be automatically registered/logged into the system
4. Default role for new Google users is STUDENT
5. Users can specify their role during registration with Google

## Security Notes

- Never commit actual API keys to version control
- Use environment variables for production deployments
- Regularly rotate your OAuth credentials
- Configure proper CORS settings for production