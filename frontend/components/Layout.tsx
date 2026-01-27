import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Product', path: '/product' },
    { name: 'Datasets', path: '/datasets' },
    { name: 'Ads', path: '/ads' },
    { name: 'Use Cases', path: '/use-cases' },
    { name: 'Contact', path: '/contact' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#111] font-sans selection:bg-black selection:text-white">
      {/* Platform Header - Fixed, Blur */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between">

          {/* Logo Area */}
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-1 text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="6" cy="12" r="5" />
                  <rect x="13" y="7" width="10" height="10" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-tight uppercase text-black">HARBOR</span>
            </Link>

            {/* Nav Links - Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link to="/auth/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors hidden sm:block">Log in</Link>
            <Link to="/contact" className="bg-[#111] text-white text-sm font-medium px-5 py-2.5 rounded hover:bg-black transition-colors flex items-center gap-2 group">
              Contact Sales
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Mobile Toggle */}
            <button className="lg:hidden p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl py-6 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-medium text-[#111] py-3 border-b border-gray-50"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-4 mt-4">
              <Link to="/auth/login" className="text-base font-medium text-gray-600">Log in</Link>
              <Link to="/contact" className="text-base font-medium text-black">Contact Sales</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="w-full flex-grow pt-16">
        <Outlet />
      </main>

      {/* Platform Footer */}
      <footer className="bg-white pt-24 pb-12 px-6 md:px-12 lg:px-16 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">

          {/* Column 1: Product */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-sm text-black mb-2">Product</h4>
            <Link to="/use-cases" className="text-sm text-gray-500 hover:text-black transition-colors">Use Cases</Link>
            <Link to="/product" className="text-sm text-gray-500 hover:text-black transition-colors">Annotation Fabric</Link>
            <Link to="/datasets" className="text-sm text-gray-500 hover:text-black transition-colors">Multimodal Datasets</Link>
            <Link to="/infrastructure" className="text-sm text-gray-500 hover:text-black transition-colors">Data Infrastructure</Link>
            <Link to="/ads" className="text-sm text-gray-500 hover:text-black transition-colors">Advertising</Link>
          </div>

          {/* Column 2: Company */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-sm text-black mb-2">Company</h4>
            <Link to="/about" className="text-sm text-gray-500 hover:text-black transition-colors">About Harbor</Link>
            <Link to="/ambassadors" className="text-sm text-gray-500 hover:text-black transition-colors">Ambassadors</Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-black transition-colors">Contact</Link>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-sm text-black mb-2">Resources</h4>
            <Link to="/docs" className="text-sm text-gray-500 hover:text-black transition-colors">Documentation</Link>
            <Link to="/trust" className="text-sm text-gray-500 hover:text-black transition-colors">Trust & Compliance</Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-black transition-colors">Terms</Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-black transition-colors">Privacy</Link>
          </div>

        </div>

        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-4 md:mb-0 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            <div className="flex items-center gap-1 text-black">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="12" r="5" />
                <rect x="13" y="7" width="10" height="10" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-tight uppercase text-black">HARBOR</span>
          </div>
          <span className="text-xs text-gray-400">&copy; Harbor Technologies, Inc.</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;