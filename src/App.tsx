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

// Interface for the private route component props
interface PrivateRouteProps {
  children: React.ReactNode;
}

// Main App component that defines the application's routing structure
export default function App() {
  // PrivateRoute component that protects routes requiring authentication
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
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/blog' element={<BlogPage />} />
        <Route path='/blog/:id' element={<BlogPostDetail />} />
        <Route path='/legal' element={<LegalNotice />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/cookies' element={<CookiePolicy />} />
        <Route path='/terms' element={<TermsOfService />} />
        <Route path='/contact' element={<Contact />} />
        <Route
          path='/dashboard/*'
          element={
            // Protect dashboard routes with authentication
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