import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { UserProvider, useUser } from './contexts/UserContext';
import { DashboardThemeProvider } from './contexts/ThemeContext';
import Home from "./pages/landing/Home";
import AuthPage from "./pages/landing/AuthPage";
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
const LegalNotice = React.lazy(() => import('./pages/landing/legal/LegalNotice'));
const PrivacyPolicy = React.lazy(() => import('./pages/landing/legal/PrivacyPolicy'));
const CookiePolicy = React.lazy(() => import('./pages/landing/legal/CookiePolicy'));
const TermsOfService = React.lazy(() => import('./pages/landing/legal/TermsOfService'));
const Contact = React.lazy(() => import('./pages/landing/legal/Contact'));

interface PrivateRouteProps {
  children: React.ReactNode;
}

function App() {
  const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, isLoading } = useUser();

    if (isLoading) {
      return (
        <div className='loading-container'>
          <img src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL.svg" alt="logo" />
        </div>
      );
    }

    return user ? (
      <DashboardThemeProvider>
        {children}
      </DashboardThemeProvider>
    ) : <Navigate to='/login' replace />;
  };

  return (
    <UserProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<AuthPage />} />
        <Route path='/legal' element={<LegalNotice />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/cookies' element={<CookiePolicy />} />
        <Route path='/terms' element={<TermsOfService />} />
        <Route path='/contact' element={<Contact />} />
        <Route
          path='/dashboard/*'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
