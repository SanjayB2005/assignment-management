import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RoleSelectionModal from './RoleSelectionModal';

const GoogleLogin = ({ onSuccess, onError, role }) => {
  const { login } = useAuth();
  const googleButtonRef = useRef(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingGoogleData, setPendingGoogleData] = useState(null);

  useEffect(() => {
    // Load Google Identity Services
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google && googleButtonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
          callback: handleCredentialResponse,
          use_fedcm_for_prompt: false,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the Google button directly
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: '100%',
        });
      } catch (error) {
        console.error('Google Sign-In initialization error:', error);
        // Fallback to OAuth popup method
        setupOAuthPopup();
      }
    }
  };

  const setupOAuthPopup = () => {
    // Fallback OAuth popup method
    console.log('Using OAuth popup fallback method');
  };

  const handleCredentialResponse = async (response) => {
    try {
      const idToken = response.credential;
      
      // Send the ID token to your backend (without role for new users)
      const backendResponse = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
          role: role
        }),
      });

      const data = await backendResponse.json();

      if (backendResponse.ok) {
        // Check if this user doesn't have a role (new Google OAuth user)
        if (!data.role) {
          // Store pending data and show role selection modal
          setPendingGoogleData({
            idToken: idToken,
            userData: data
          });
          setShowRoleModal(true);
          return;
        }

        // Existing user or user with role already set
        // Store the token and user info
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role
        }));

        // Update auth context
        if (login) {
          login(data);
        }

        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        if (onError) {
          onError(data.message || 'Google login failed');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (onError) {
        onError('Google login failed');
      }
    }
  };

  const handleFallbackLogin = () => {
    // OAuth popup fallback
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
    const scope = encodeURIComponent('openid profile email');
    const responseType = 'code';
    const state = Math.random().toString(36).substring(2, 15);
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&state=${state}`;
    
    // Open popup window
    const popup = window.open(authUrl, 'googleAuth', 'width=500,height=600');
    
    // Monitor popup
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        if (onError) {
          onError('Google login was cancelled');
        }
      }
    }, 1000);
  };

  const handleRoleSelect = async (selectedRole) => {
    if (!pendingGoogleData) return;

    try {
      // First, complete the Google login with the selected role
      const completeLoginResponse = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: pendingGoogleData.idToken,
          role: selectedRole
        }),
      });

      if (completeLoginResponse.ok) {
        const loginData = await completeLoginResponse.json();
        
        // If we don't get an access token, try the role update endpoint
        if (!loginData.accessToken && loginData.id) {
          // Fallback: use the role update endpoint if available
          const token = localStorage.getItem('token'); // Check if we have any stored token
          if (token) {
            const updateResponse = await fetch('http://localhost:8080/api/auth/update-role', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                role: selectedRole
              }),
            });

            if (updateResponse.ok) {
              const updatedData = await updateResponse.json();
              localStorage.setItem('token', updatedData.accessToken);
              localStorage.setItem('user', JSON.stringify({
                id: updatedData.id,
                email: updatedData.email,
                firstName: updatedData.firstName,
                lastName: updatedData.lastName,
                role: updatedData.role
              }));

              // Update auth context
              if (login) {
                login(updatedData);
              }

              // Close modal and clean up
              setShowRoleModal(false);
              setPendingGoogleData(null);

              if (onSuccess) {
                onSuccess(updatedData);
              }
              return;
            }
          }
        }

        // Standard flow: we got the token from the complete login
        localStorage.setItem('token', loginData.accessToken);
        localStorage.setItem('user', JSON.stringify({
          id: loginData.id,
          email: loginData.email,
          firstName: loginData.firstName,
          lastName: loginData.lastName,
          role: loginData.role
        }));

        // Update auth context
        if (login) {
          login(loginData);
        }

        // Close modal and clean up
        setShowRoleModal(false);
        setPendingGoogleData(null);

        if (onSuccess) {
          onSuccess(loginData);
        }
      } else {
        const errorData = await completeLoginResponse.json();
        if (onError) {
          onError(errorData.message || 'Failed to complete login with selected role');
        }
      }
    } catch (error) {
      console.error('Role selection error:', error);
      if (onError) {
        onError('Failed to complete login with selected role');
      }
    }
  };

  return (
    <div className="w-full">
      {/* Google Sign-In Button Container */}
      <div ref={googleButtonRef} className="w-full min-h-12" />
      
      {/* Fallback Button */}
      <div className="mt-2">
        <button
          onClick={handleFallbackLogin}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors text-sm"
          type="button"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Alternative Google Sign-In
        </button>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setPendingGoogleData(null);
        }}
        onRoleSelect={handleRoleSelect}
        userEmail={pendingGoogleData?.userData?.email || ''}
        userFirstName={pendingGoogleData?.userData?.firstName || ''}
      />
    </div>
  );
};

export default GoogleLogin;