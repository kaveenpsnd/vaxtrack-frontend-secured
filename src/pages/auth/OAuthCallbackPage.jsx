import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';
import { getProfile } from '../../api/authApi';

/**
 * OAuthCallbackPage handles redirect after backend WSO2 token exchange.
 * The backend sets the session cookie and redirects here.
 * This component verifies the session via getProfile() and enters the dashboard.
 */
const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    let isMounted = true;

    const establishSession = async () => {
      try {
        const user = await checkAuth(getProfile);
        if (!isMounted) return;

        if (user) {
          toast.success(`Welcome to VaxTrack, ${user.name?.split(' ')[0] || 'User'}!`);
          navigate('/dashboard', { replace: true });
        } else {
          toast.error('Failed to establish session from WSO2 login.');
          navigate('/login?sso_error=session', { replace: true });
        }
      } catch (err) {
        console.error('Session establishment error:', err);
        if (isMounted) {
          toast.error('An error occurred while establishing your session.');
          navigate('/login?sso_error=session', { replace: true });
        }
      }
    };

    establishSession();

    return () => {
      isMounted = false;
    };
  }, [checkAuth, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-2xl shadow-lg border border-border">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center text-primary-600 border border-primary-200 dark:border-primary-800">
              <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground">
            Completing WSO2 Authentication
          </h2>
          <p className="mt-2 text-sm text-secondary-500 dark:text-slate-400">
            Establishing your secure session and preparing your dashboard...
          </p>
        </div>

        <div className="pt-2">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary-600 h-full rounded-full animate-pulse w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
