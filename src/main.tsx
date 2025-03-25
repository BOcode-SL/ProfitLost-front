import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Contexts
import { GlobalThemeProvider } from './contexts/ThemeContext';

// Translation
import './i18n';

// Styles
import './index.css';

// Importing the main application component
import App from './App.tsx';

// Creating the root of the application and rendering it
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Providing Google OAuth context with client ID */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* Wrapping the application in a global theme provider */}
      <GlobalThemeProvider>
        <CssBaseline />
        {/* Setting up routing for the application */}
        <BrowserRouter>
          <App />
          {/* Toast notifications for user feedback */}
          <Toaster />
        </BrowserRouter>
      </GlobalThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
