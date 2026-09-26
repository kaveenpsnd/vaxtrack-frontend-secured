import React, { useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import toast from 'react-hot-toast';

/**
 * WSO2 Identity Server / Asgardeo Sign-In button
 * Triggers the OIDC authorization code flow with PKCE via @asgardeo/auth-react
 */
export const WSO2LoginButton = ({ label = 'Sign in with WSO2', className = '' }) => {
  const { signIn, state } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await signIn();
    } catch (err) {
      console.error('WSO2 sign-in error:', err);
      toast.error(err?.message || 'Failed to initialize WSO2 sign-in. Please try again.');
      setIsSubmitting(false);
    }
  };

  const loading = isSubmitting || state?.isLoading;

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={loading}
      aria-label={label}
      className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Connecting to WSO2...</span>
        </>
      ) : (
        <>
          {/* WSO2 Branded Icon */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" fill="#FF7300" />
            <path d="M7 16.5C7 11.25 11.25 7 16.5 7C20.5 7 23.9 9.5 25.2 13.1L21.7 14.5C20.9 12.1 18.9 10.4 16.5 10.4C13.1 10.4 10.4 13.1 10.4 16.5C10.4 19.9 13.1 22.6 16.5 22.6C18.9 22.6 20.9 20.9 21.7 18.5L25.2 19.9C23.9 23.5 20.5 26 16.5 26C11.25 26 7 21.75 7 16.5Z" fill="white" />
            <path d="M14.5 15H25V18H14.5V15Z" fill="white" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default WSO2LoginButton;
