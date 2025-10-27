# Google OAuth Setup Guide - Step by Step

## 🚨 **IMPORTANT: You must complete this setup before Google login will work!**

The error you're seeing occurs because placeholder values are being used instead of real Google OAuth credentials.

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Sign in** with your Google account
3. **Create a new project** or select an existing one:
   - Click the project dropdown at the top
   - Click "NEW PROJECT"
   - Give it a name like "Assignment Management System"
   - Click "CREATE"

## Step 2: Enable Required APIs

1. **Go to APIs & Services** > **Library**
2. **Search for "Google+ API"** and click on it
3. **Click "ENABLE"**
4. **Also enable "Google Identity"** (search and enable this too)

## Step 3: Configure OAuth Consent Screen

1. **Go to APIs & Services** > **OAuth consent screen**
2. **Choose "External"** (unless you have a Google Workspace account)
3. **Fill in required fields**:
   - App name: "Assignment Management System"
   - User support email: Your email
   - Developer contact information: Your email
4. **Click "SAVE AND CONTINUE"**
5. **Skip Scopes** (click "SAVE AND CONTINUE")
6. **Add test users** (add your email address)
7. **Click "SAVE AND CONTINUE"**

## Step 4: Create OAuth 2.0 Credentials

1. **Go to APIs & Services** > **Credentials**
2. **Click "CREATE CREDENTIALS"** > **OAuth 2.0 Client IDs**
3. **Choose "Web application"**
4. **Set the name**: "Assignment Management OAuth"
5. **Add Authorized redirect URIs**:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173
   ```
6. **Click "CREATE"**
7. **COPY the Client ID and Client Secret** - you'll need these!

## Step 5: Update Configuration Files

### Frontend Configuration
Edit `client/.env`:
```env
# Replace YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE with your real Client ID
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
VITE_API_URL=http://localhost:8080
```

### Backend Configuration
Edit `server/src/main/resources/application.properties`:
```properties
# Replace with your actual credentials
spring.security.oauth2.client.registration.google.client-id=123456789-abcdefghijklmnop.apps.googleusercontent.com
spring.security.oauth2.client.registration.google.client-secret=GOCSPX-your_actual_client_secret_here
```

## Step 6: Restart Applications

1. **Stop both frontend and backend** (Ctrl+C in terminals)
2. **Restart backend**: `cd server && mvn spring-boot:run`
3. **Restart frontend**: `cd client && npm run dev`

## Step 7: Test Google Login

1. **Go to** http://localhost:5173/login
2. **Click "Continue with Google"**
3. **Should redirect to Google login** (no more 400 error!)

## 🔍 **Troubleshooting**

### If you still get 400 error:
- ✅ **Check Client ID**: Make sure it ends with `.apps.googleusercontent.com`
- ✅ **Check Redirect URIs**: Must match exactly in Google Console
- ✅ **Clear browser cache**: Hard refresh (Ctrl+Shift+R)
- ✅ **Check console logs**: Look for any JavaScript errors

### If you get "OAuth consent required":
- ✅ **Add your email as test user** in OAuth consent screen
- ✅ **Make sure app is in "Testing" mode**

### Common mistakes:
- ❌ **Using placeholder values** (`YOUR_GOOGLE_CLIENT_ID`)
- ❌ **Wrong redirect URI** (must be exact match)
- ❌ **Not restarting after config changes**
- ❌ **Client ID doesn't end with `.apps.googleusercontent.com`**

## 📝 **Example of Correct Values**

Your Client ID should look like:
```
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

Your Client Secret should look like:
```
GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
```

## ⚠️ **Security Notes**

- **Never commit real credentials** to version control
- **Use environment variables** in production
- **Keep Client Secret secure** - don't share it publicly
- **Regularly rotate credentials** for security

---

Once you complete these steps, the Google login should work without any 400 errors!