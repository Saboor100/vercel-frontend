
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, loading, refreshToken } = useFirebaseAuth();
  const [isTokenRefreshed, setIsTokenRefreshed] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const refreshUserToken = async () => {
      if (user && !isTokenRefreshed) {
        try {
          const token = await refreshToken();
          if (token) {
            console.log('Token refreshed in protected route');
            setIsTokenRefreshed(true);
          }
        } catch (error) {
          console.error('Token refresh error in protected route:', error);
          toast.error('Authentication error. Please try logging in again.');
        }
      }
    };

    refreshUserToken();
  }, [user, refreshToken, isTokenRefreshed]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Check for admin route access
  if (adminOnly && !user.isAdmin) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
