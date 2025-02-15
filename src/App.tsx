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

// Defining the type for private route props
interface PrivateRouteProps {
  children: React.ReactNode;
}

// Main App component
export default function App() {
  // PrivateRoute component to protect dashboard routes
  const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, isLoading } = useUser(); // Accessing user context


    // Display loading state while user data is being fetched
    if (isLoading) {
      return (
        <div className='loading-container'>
          <img src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL.svg" alt="logo" />
        </div>
      );
    }

    // Render children if user is authenticated, otherwise redirect to auth page
    return user ? (
      <DashboardThemeProvider>
        {children}
      </DashboardThemeProvider>
    ) : <Navigate to='/auth' replace />;
  };

  // Main render of the application
  return (
    // Providing user context to the application
    <UserProvider>
      {/* Setting up routing for the application */}
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
            // Protecting the dashboard routes with PrivateRoute
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}