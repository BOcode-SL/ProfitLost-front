/**
 * Main Application Component
 * 
 * Defines the routing structure and authentication flow for the Profit & Lost application.
 * This component:
 * - Sets up the primary routing system with protected and public routes
 * - Manages authentication state through UserProvider context
 * - Implements route protection with redirect logic for unauthorized access
 * - Handles loading states during authentication checks
 * - Applies theme context to authenticated dashboard routes
 * 
 * @module App
 */

import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Contexts
import { UserProvider, useUser } from './contexts/UserContext';
import { DashboardThemeProvider } from './contexts/ThemeContext';

// Components
import Home from "./pages/landing/Home";
import AuthPage from "./pages/landing/auth/AuthPage";
const BlogPage = React.lazy(() => import('./pages/blog/BlogPage'));
const BlogPostDetail = React.lazy(() => import('./pages/blog/components/BlogPostDetail'));
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
const LegalNotice = React.lazy(() => import('./pages/landing/legal/LegalNotice'));
const PrivacyPolicy = React.lazy(() => import('./pages/landing/legal/PrivacyPolicy'));
const CookiePolicy = React.lazy(() => import('./pages/landing/legal/CookiePolicy'));
const TermsOfService = React.lazy(() => import('./pages/landing/legal/TermsOfService'));
const Contact = React.lazy(() => import('./pages/landing/legal/Contact'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

/**
 * Interface for the private route component props
 * @interface PrivateRouteProps
 * @property {React.ReactNode} children - Components to render when authenticated
 */
interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Main App component that defines the application's routing structure
 * 
 * @returns {JSX.Element} The complete application with all routes
 */
export default function App() {
  /**
   * PrivateRoute component that protects routes requiring authentication
   * Redirects to the auth page if user is not authenticated
   * 
   * @param {PrivateRouteProps} props - Component props with children to render
   * @returns {JSX.Element} Protected route content or redirect
   */
  const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, isLoading } = useUser(); // Get user authentication state and loading status

    // Display a loading indicator while checking authentication status
    if (isLoading) {
      return (
        <div className='loading-container'>
          <img src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL.svg" alt="logo" />
        </div>
      );
    }

    // Render the protected content if user is authenticated, otherwise redirect to login
    return user ? (
      <DashboardThemeProvider>
        {children}
      </DashboardThemeProvider>
    ) : <Navigate to='/auth' replace />;
  };

  // Render the complete application with routes
  return (
    // Provide user context throughout the application
    <UserProvider>
      {/* Application routing configuration */}
      <Routes>
        {/* Public routes - accessible to all users */}
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/blog' element={<BlogPage />} />
        <Route path='/blog/:id' element={<BlogPostDetail />} />
        
        {/* Legal and information pages */}
        <Route path='/legal' element={<LegalNotice />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/cookies' element={<CookiePolicy />} />
        <Route path='/terms' element={<TermsOfService />} />
        <Route path='/contact' element={<Contact />} />
        
        {/* Protected dashboard routes - require authentication */}
        <Route
          path='/dashboard/*'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        {/* Catch-all route for handling 404 errors */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
}