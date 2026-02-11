import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/authStore';

export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useAuth();
    const location = useLocation();

    // Check if authenticated first
    if (user.loading) {
        return null; // Let RequireAuth handle the loading UI or just wait
    }

    if (!user.authenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Check for admin role or specific email
    const isAdmin = user.role === 'admin' || user.email === 'agentwoodai@gmail.com';

    if (!isAdmin) {
        // Redirect to app dashboard if not admin
        return <Navigate to="/app" replace />;
    }

    return <>{children}</>;
};
