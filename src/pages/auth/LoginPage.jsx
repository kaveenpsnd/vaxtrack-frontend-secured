import React, { useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { consumeLoggedOut, getWso2LoginUrl } from '../../api/authApi';

const ERROR_MESSAGES = {
  denied: 'Authentication was cancelled or access was denied by WSO2 Identity Server.',
  unverified: 'Your email address has not been verified by WSO2. Please verify your email to proceed.',
  state: 'Single sign-on session expired or security state mismatch. Please try again.',
  account: 'Account synchronization error. Please contact the administrator.',
  token: 'Failed to negotiate authorization tokens with WSO2 Identity Server.',
  verify: 'ID token verification failed against WSO2 Identity Server keys.',
  nonce: 'Security nonce mismatch detected during authentication.',
  server: 'An internal server error occurred during WSO2 authentication.',
};

/**
 * LoginPage: All authentication is delegated entirely and exclusively
 * to WSO2 Identity Server via the backend confidential client flow.
 */
const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ssoError = searchParams.get('sso_error');

  const errorMessage = useMemo(() => {
    if (!ssoError) return null;
    return ERROR_MESSAGES[ssoError] || `Single sign-on failed (${ssoError}). Please try again.`;
  }, [ssoError]);

  const handleSignIn = () => {
    window.location.href = getWso2LoginUrl();
  };

  // Run the auto-redirect once, even though StrictMode runs effects twice in dev.
  const hasAutoRedirected = useRef(false);

  useEffect(() => {
    if (hasAutoRedirected.current) return;
    hasAutoRedirected.current = true;

    // Just logged out of WSO2: go to the landing page instead of signing in again.
    if (consumeLoggedOut()) {
      navigate('/', { replace: true });
      return;
    }
    // Only redirect automatically if there isn't an active error to display
    if (!ssoError) {
      handleSignIn();
    }
  }, [ssoError, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-2xl shadow-lg border border-border">
        {/* VaxTrack Logo */}
        <div className="flex justify-center mb-2">
          <Link to="/">
            <img 
              src="/logo/image.png" 
              alt="VaxTrack Logo" 
              className="w-16 h-16 rounded-xl object-contain shadow-sm hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Sign in with WSO2 Identity Server
          </h2>
          <p className="text-sm text-secondary-500 dark:text-slate-400">
            {errorMessage 
              ? 'There was an issue authenticating with your identity provider.' 
              : 'Redirecting to WSO2 Identity Server to authenticate securely...'}
          </p>
        </div>

        {errorMessage ? (
          <div className="space-y-4">
            <p className="text-sm text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/40 p-3.5 rounded-xl border border-danger-200 dark:border-danger-800 text-left">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full py-2.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              Retry WSO2 Sign In
            </button>
            <Link to="/" className="block text-xs text-primary-600 dark:text-primary-400 hover:underline">
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
            <button
              type="button"
              onClick={handleSignIn}
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
            >
              Click here if you are not redirected automatically
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
