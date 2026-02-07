import React from 'react';
import { Link } from 'react-router-dom';

interface AuthSplitLayoutProps {
    children: React.ReactNode;
    imageSrc?: string;
    title?: string;
    subtitle?: string;
}

const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({
    children,
    imageSrc = "/auth-side-image.webp", // Default or passed prop
    title,
    subtitle
}) => {
    return (
        <div className="min-h-screen w-full bg-[#fcfcfc] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-[1600px] h-[800px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-row">
                {/* Left Side - Form */}
                <div className="w-full lg:w-5/12 p-8 sm:p-12 flex flex-col justify-center relative">
                    <div className="mb-12">
                        <Link to="/" className="flex items-center gap-2 mb-10">
                            <img src="/mainlogoblack.jpeg" alt="HARBOR" className="h-24 w-auto object-contain" />
                        </Link>

                        {title && (
                            <h1 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-2">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-stone-500 text-sm">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="w-full max-w-sm">
                        {children}
                    </div>

                    <div className="mt-8 pt-6 border-t border-stone-100 flex gap-4 text-xs text-stone-400">
                        <Link to="/terms" className="hover:text-[#1A1A1A]">Terms</Link>
                        <Link to="/privacy" className="hover:text-[#1A1A1A]">Privacy</Link>
                        <span className="ml-auto">© 2026 Harbor</span>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="hidden lg:block lg:w-7/12 relative bg-[#1A1A1A] overflow-hidden">
                    <img
                        src={imageSrc}
                        alt="Harbor Vision"
                        className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.6)] via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-12 left-12 right-12 text-white z-10">
                        <p className="text-lg font-serif italic mb-2 opacity-90">
                            "Every breakthrough in AI is a story of human ingenuity."
                        </p>
                        <div className="h-0.5 w-12 bg-white/30 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthSplitLayout;
