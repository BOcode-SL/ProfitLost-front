/**
 * Main Application Entry Point
 * 
 * Sets up the React application with all required providers:
 * - Google OAuth for authentication
 * - Global theme provider for consistent styling
 * - Router for navigation
 * - Toast notifications for user feedback
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Application context providers
import { GlobalThemeProvider } from './contexts/ThemeContext';

// Load internationalization configuration
import './i18n';

// Global styles
import './index.css';

// Main application component
import App from './App.tsx';

// Initialize and render the application to the DOM
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Google OAuth provider for authentication services */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* Global theme provider for application-wide styling */}
      <GlobalThemeProvider>
        <CssBaseline />
        {/* Router for handling navigation and URL management */}
        <BrowserRouter>
          <App />
          {/* Toast notification system for user feedback messages */}
          <Toaster />
        </BrowserRouter>
      </GlobalThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
