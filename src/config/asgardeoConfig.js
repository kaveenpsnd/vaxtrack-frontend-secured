/**
 * WSO2 Identity Server / Asgardeo OpenID Connect configuration
 * Client credentials and endpoints dynamically loaded from environment variables
 */
export const asgardeoConfig = {
  signInRedirectURL: import.meta.env.VITE_ASGARDEO_REDIRECT_URL || `${window.location.origin}/oauth/callback`,
  signOutRedirectURL: import.meta.env.VITE_ASGARDEO_SIGNOUT_URL || window.location.origin,
  clientID: import.meta.env.VITE_ASGARDEO_CLIENT_ID || '',
  baseUrl: import.meta.env.VITE_ASGARDEO_BASE_URL || '',
  scope: import.meta.env.VITE_ASGARDEO_SCOPE
    ? import.meta.env.VITE_ASGARDEO_SCOPE.split(' ')
    : ['openid', 'profile'],
};

export default asgardeoConfig;
