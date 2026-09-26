import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@asgardeo/auth-react';
import { asgardeoConfig } from './config/asgardeoConfig';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider config={asgardeoConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
);
