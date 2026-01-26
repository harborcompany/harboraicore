import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Product', path: '/product' },
    { name: 'Datasets', path: '/datasets' },
    { name: 'Ads', path: '/ads' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F8F6] text-[#1A1A1A]">
      {/* Navigation - Floating Pill Style */}
      <nav className="fixed top-0 w-full z-[100] pointer-events-none p-6">
        <div className="max-w-[1600px] mx-auto flex items-start justify-between">

          {/* Logo */}
          <Link to="/" className="pointer-events-auto z-50 flex items-center gap-3 group">
            <img
              src="/harbor-logo.svg"
              alt="HARBOR"
              className="h-8 w-auto" // Adjusted height to match screenshot branding size
            />
          </Link>

          {/* Desktop Floating Pill Nav - Dark Capsule */}
          <div className="hidden md:flex pointer-events-auto z-50 bg-[#4a453d] rounded-full p-1.5 items-center shadow-lg gap-2 pl-6">
            <Link to="/product" className="text-sm text-white/90 hover:text-white font-medium transition-all hover:scale-105 px-2">Product</Link>
            <Link to="/datasets" className="text-sm text-white/90 hover:text-white font-medium transition-all hover:scale-105 px-2">Datasets</Link>
            <Link to="/ads" className="text-sm text-white/90 hover:text-white font-medium transition-all hover:scale-105 px-2">Ads</Link>
            <Link to="/about" className="text-sm text-white/90 hover:text-white font-medium transition-all hover:scale-105 px-2 mr-2">About</Link>
            <Link
              to="/auth"
              className="bg-white text-[#4a453d] px-5 py-2 rounded-full text-sm font-bold hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm ease-out"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden pointer-events-auto p-3 bg-white rounded-full shadow-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150]" onClick={() => setIsMenuOpen(false)}></div>
            <div className="md:hidden pointer-events-auto absolute top-20 right-6 w-72 bg-white rounded-2xl shadow-2xl py-6 px-4 flex flex-col space-y-3 border border-stone-100 z-[200] animate-in slide-in-from-top-5 duration-200">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium px-4 py-3 hover:bg-stone-50 rounded-xl text-stone-700 active:bg-stone-100 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-stone-100 my-2"></div>
              <Link
                to="/auth/signup"
                onClick={() => setIsMenuOpen(false)}
                className="block text-center px-4 py-3.5 bg-[#1A1A1A] text-white rounded-xl text-base font-bold shadow-lg active:scale-95 transition-transform"
              >
                Get Started
              </Link>
            </div>
          </>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer - Dark Rounded Container Style */}
      <div className="px-4 pb-4 md:px-6 md:pb-6 pt-12">
        <footer className="bg-[#1A1A1A] text-white rounded-[2rem] md:rounded-[3rem] py-16 md:py-24 overflow-hidden relative">
          <div className="max-w-[1400px] mx-auto px-8 md:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
              <div className="md:col-span-5">
                <img
                  src="/harbor-logo.svg"
                  alt="Harbor"
                  className="h-12 w-auto mb-8 opacity-40 invert grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
                <p className="text-white/60 text-lg leading-relaxed max-w-sm">
                  The infrastructure layer for high-throughput multimodal data. Powering scale-aware model training and creative automation.
                </p>
              </div>

              <div className="md:col-span-2 md:col-start-7">
                <h5 className="font-medium mb-6 text-white/40">Platform</h5>
                <ul className="space-y-4 text-white/80">
                  <li><Link to="/product" className="hover:text-white">Product</Link></li>
                  <li><Link to="/datasets" className="hover:text-white">Datasets</Link></li>
                  <li><Link to="/infrastructure" className="hover:text-white">Infrastructure</Link></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h5 className="font-medium mb-6 text-white/40">Company</h5>
                <ul className="space-y-4 text-white/80">
                  <li><Link to="/ads" className="hover:text-white">Harbor Ads</Link></li>
                  <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h5 className="font-medium mb-6 text-white/40">Connect</h5>
                <ul className="space-y-4 text-white/80">
                  <li><Link to="/contact" className="hover:text-white">Contact Sales</Link></li>
                  <li><a href="https://twitter.com/harbor" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter / X</a></li>
                  <li><a href="https://linkedin.com/company/harbor" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-white/40 text-sm">
              <p>&copy; {new Date().getFullYear()} HARBOR SYSTEMS INC.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              </div>
            </div>
          </div>

          {/* Abstract Footer Graphic */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"></div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;