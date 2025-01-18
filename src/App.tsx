import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { UserProvider, useUser } from './contexts/UserContext';

import Home from "./pages/landing/Home";
import AuthPage from "./pages/landing/AuthPage";
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));

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

    return user ? <>{children}</> : <Navigate to='/login' replace />;
  };

  return (
    <UserProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<AuthPage />} />
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
