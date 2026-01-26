import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Ambient gradients removed as per user request */}

            {/* Harbor Logo */}
            <div className="mb-8 relative z-10 flex flex-col items-center justify-center w-full">
                <Link to="/" className="inline-block transition-opacity hover:opacity-80">
                    <img
                        src="/harbor-logo.svg"
                        alt="Harbor"
                        className="h-16 w-auto mx-auto"
                    />
                </Link>
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    {children}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center relative z-10">
                <p className="text-sm text-stone-500">
                    Enterprise-grade authentication and access controls.
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;
