import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/authStore';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useAuth();
    const location = useLocation();

    if (!user.authenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
