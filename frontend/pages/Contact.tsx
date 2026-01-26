import { useState } from 'react';
import { Mail, MessageCircle, FileText, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'demo' }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Failed to send. Please try again.');
    }
  };

  return (
    <div className="w-full bg-[#F9F8F6]">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 border-b border-stone-200 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-8 leading-[1.1]">
              Solutions for <br />global scale.
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed max-w-md mb-12">
              Whether you're training a foundation model or deploying an automated ad engine, our engineering team is ready to architect your pipeline.
            </p>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-mono text-stone-500">SYSTEM STATUS: ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          {/* Request Demo Form */}
          <div className="bg-[#F9F8F6] p-8 rounded-2xl border border-stone-200">
            <h2 className="text-2xl font-serif mb-6">Request a Demo</h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">Thank you!</h3>
                <p className="text-stone-500">We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                    <AlertCircle size={16} />
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Work Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company name"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    rows={4}
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Request Demo'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-16 px-6 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="mailto:sales@harbor.ai" className="group p-6 rounded-xl border border-stone-200 hover:border-[#1A1A1A] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center"><Mail size={20} /></div>
                <ArrowRight className="text-stone-300 group-hover:text-[#1A1A1A] transition-colors" />
              </div>
              <h3 className="text-lg font-medium mb-1">Enterprise Sales</h3>
              <p className="text-sm text-stone-500">Custom infrastructure & volume pricing</p>
            </a>

            <a href="mailto:support@harbor.ai" className="group p-6 rounded-xl border border-stone-200 hover:border-[#1A1A1A] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center"><MessageCircle size={20} /></div>
                <ArrowRight className="text-stone-300 group-hover:text-[#1A1A1A] transition-colors" />
              </div>
              <h3 className="text-lg font-medium mb-1">Technical Support</h3>
              <p className="text-sm text-stone-500">API integration & incident reporting</p>
            </a>

            <a href="mailto:legal@harbor.ai" className="group p-6 rounded-xl border border-stone-200 hover:border-[#1A1A1A] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center"><FileText size={20} /></div>
                <ArrowRight className="text-stone-300 group-hover:text-[#1A1A1A] transition-colors" />
              </div>
              <h3 className="text-lg font-medium mb-1">Compliance & Legal</h3>
              <p className="text-sm text-stone-500">SOC 2, DPA, insurance certs</p>
            </a>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-xl font-medium mb-12 border-b border-stone-200 pb-4">Global HQs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-serif text-2xl mb-4">San Francisco</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                548 Market St<br />
                San Francisco, CA 94104<br />
                United States
              </p>
              <div className="text-xs font-mono text-stone-400">CORE ENGINEERING</div>
            </div>
            <div>
              <h3 className="font-serif text-2xl mb-4">London</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                30 Stamford St<br />
                London SE1 9LQ<br />
                United Kingdom
              </p>
              <div className="text-xs font-mono text-stone-400">EMEA SALES</div>
            </div>
            <div>
              <h3 className="font-serif text-2xl mb-4">Singapore</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                71 Ayer Rajah Crescent<br />
                Singapore 139951
              </p>
              <div className="text-xs font-mono text-stone-400">APAC OPERATIONS</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;