import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

/**
 * OAuthCallbackPage handles redirect from WSO2 Identity Server / Asgardeo.
 * @asgardeo/auth-react automatically parses the authorization code and completes PKCE exchange.
 * Once verified, user profile is synchronized with useAuthStore with role forced to 'Public'.
 */
const OAuthCallbackPage = () => {
  const { state, getBasicUserInfo, error } = useAuthContext();
  const navigate = useNavigate();
  const setLogin = useAuthStore((s) => s.login);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      // If Asgardeo reports an error
      if (error) {
        console.error('Asgardeo auth callback error:', error);
        toast.error(error?.message || 'Authentication with WSO2 Identity Server failed.');
        navigate('/login', { replace: true });
        return;
      }

      // Check if Asgardeo has completed authentication
      if (state.isAuthenticated) {
        try {
          const userInfo = await getBasicUserInfo();
          if (!isMounted) return;

          const wso2User = {
            _id: userInfo.sub || `wso2-${Date.now()}`,
            name: userInfo.displayName || userInfo.username || 'WSO2 User',
            email: userInfo.email || userInfo.username || 'wso2@vaxtrack.local',
            // Assignment Security Requirement: Role must always be forced to Public on client SSO
            role: 'Public',
            authProvider: 'wso2',
          };

          setLogin(wso2User);
          toast.success(`Welcome to VaxTrack, ${wso2User.name.split(' ')[0]}!`);
          navigate('/dashboard', { replace: true });
        } catch (err) {
          console.error('Error fetching WSO2 user info:', err);
          if (isMounted) {
            toast.error('Failed to retrieve user profile from WSO2.');
            navigate('/login', { replace: true });
          }
        } finally {
          if (isMounted) setIsProcessing(false);
        }
      } else if (!state.isLoading) {
        // If not loading and not authenticated, check if code param exists in URL
        const params = new URLSearchParams(window.location.search);
        if (!params.get('code') && !params.get('session_state')) {
          // No auth code present, redirect back to login
          navigate('/login', { replace: true });
        }
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [state.isAuthenticated, state.isLoading, error, getBasicUserInfo, navigate, setLogin]);

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
            Verifying with WSO2 Identity Server
          </h2>
          <p className="mt-2 text-sm text-secondary-500 dark:text-slate-400">
            Completing OpenID Connect verification and establishing your secure session...
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
