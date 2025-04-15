/**
 * Main Application Entry Point
 * 
 * Sets up the React application with all required providers arranged in a specific
 * hierarchy to ensure proper context inheritance throughout the component tree:
 * 
 * - GoogleOAuthProvider: Enables Google authentication services
 * - GlobalThemeProvider: Provides theme context for consistent UI styling
 * - BrowserRouter: Manages navigation and URL routing
 * - Toaster: Displays toast notifications for user feedback
 * 
 * This arrangement ensures that all components have access to their required contexts
 * regardless of where they are in the component hierarchy.
 * 
 * @module main
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
