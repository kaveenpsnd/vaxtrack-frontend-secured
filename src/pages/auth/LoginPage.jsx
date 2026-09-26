import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * LoginPage: All authentication is delegated entirely and exclusively
 * to the WSO2 Identity Server / Asgardeo OIDC endpoint.
 * No local credential input form is displayed.
 */
const LoginPage = () => {
  const { signIn } = useAuthContext();
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initiateSignIn = async () => {
      try {
        await signIn();
      } catch (err) {
        if (!isMounted) return;
        console.error('WSO2 sign-in initiation error:', err);
        setError(err?.message || 'Could not redirect to WSO2 Identity Server.');
        toast.error('Failed to redirect to WSO2 Identity Server');
      }
    };

    initiateSignIn();

    return () => {
      isMounted = false;
    };
  }, [signIn]);

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
            Redirecting to WSO2 Identity Server to authenticate securely...
          </p>
        </div>

        {error ? (
          <div className="space-y-4">
            <p className="text-sm text-danger-500 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/40 p-3 rounded-lg border border-danger-200 dark:border-danger-800">
              {error}
            </p>
            <button
              type="button"
              onClick={() => signIn()}
              className="w-full py-2.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm transition-all shadow-sm"
            >
              Retry WSO2 Sign In
            </button>
            <Link to="/" className="block text-xs text-primary-600 hover:underline">
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
            <button
              type="button"
              onClick={() => signIn()}
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
