import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');

        if (error) {
          console.error('OAuth error:', error);
          navigate('/login?error=oauth_failed');
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          navigate('/login?error=no_code');
          return;
        }

        // Get role from sessionStorage
        const role = sessionStorage.getItem('google_oauth_role') || 'STUDENT';
        sessionStorage.removeItem('google_oauth_role');

        // Exchange code for tokens via our backend
        const response = await fetch('http://localhost:8080/api/auth/google/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            role: role,
            redirectUri: `${window.location.origin}/auth/callback`
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token and user info
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role
          }));

          // Update auth context - create the expected format
          if (login) {
            const userDataForAuth = {
              accessToken: data.token, // Map token to accessToken for AuthContext
              id: data.id,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              role: data.role
            };
            login(userDataForAuth);
          }

          // Navigate to appropriate dashboard
          navigate(data.role === 'TEACHER' ? '/teacher' : '/student');
        } else {
          console.error('Backend authentication failed:', data);
          navigate('/login?error=auth_failed');
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        navigate('/login?error=callback_error');
      }
    };

    handleCallback();
  }, [navigate, login]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <h2 className="mt-4 text-lg font-medium text-gray-900">
          Completing Google Sign-In...
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please wait while we process your authentication.
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;