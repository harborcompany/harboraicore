import React, { useState } from 'react';
import SeoHead from '../components/SeoHead';
import { ArrowRight, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6 text-[#111] font-sans selection:bg-black selection:text-white animate-in fade-in duration-700">
      <SeoHead
        title="Contact Harbor"
        description="Get in touch with our team for enterprise access, partnerships, or support."
      />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
        {/* Left Column: Copy */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-wide mb-8 block">
              New creative tools for every workflow and industry.
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8 leading-[1.1] text-black max-w-2xl">
              Whether you're an advertising agency putting together pitch decks or an architecture firm iterating on new building concepts, Harbor's full-suite of creative and production AI tools allow you to efficiently and intuitively explore ideas and executions.
            </h1>
            <div className="mt-12 max-w-lg">
              <p className="text-lg text-gray-500 font-light leading-relaxed mb-6">
                Fill out your information and a Harbor expert will reach out. Need help right away? Check out these resources:
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-black">
                <a href="/support" className="flex items-center gap-1 hover:opacity-70 transition-opacity">Contact customer support <ArrowRight size={14} /></a>
                <a href="/docs" className="flex items-center gap-1 hover:opacity-70 transition-opacity">Explore our API docs <ArrowRight size={14} /></a>
                <a href="/help" className="flex items-center gap-1 hover:opacity-70 transition-opacity">Visit our help center <ArrowRight size={14} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div>
          {submitted ? (
            <div className="h-full flex flex-col justify-center items-center text-center py-20 animate-in fade-in zoom-in duration-500 bg-gray-50 rounded-3xl">
              <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mb-6">
                <ArrowRight size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-medium mb-2 text-black">Message Sent</h3>
              <p className="text-gray-500">We'll be in touch shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 text-sm text-gray-500 hover:text-black transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 max-w-lg ml-auto">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name*</label>
                  <input
                    required
                    className="w-full bg-transparent border-b border-gray-200 py-3 text-black focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 font-light"
                    placeholder="Type your first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name*</label>
                  <input
                    required
                    className="w-full bg-transparent border-b border-gray-200 py-3 text-black focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 font-light"
                    placeholder="Type your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Business Email*</label>
                <input
                  type="email"
                  required
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-black focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 font-light"
                  placeholder="Type your business email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company*</label>
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-black focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 font-light"
                  placeholder="Type your company name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Size</label>
                <div className="relative">
                  <select className="w-full bg-gray-50 border-none rounded-lg px-4 py-3.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-200 appearance-none cursor-pointer">
                    <option>Select an option</option>
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201-500</option>
                    <option>500+</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Industry</label>
                <div className="relative">
                  <select className="w-full bg-gray-50 border-none rounded-lg px-4 py-3.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-200 appearance-none cursor-pointer">
                    <option>Select an option</option>
                    <option>Technology</option>
                    <option>Media & Entertainment</option>
                    <option>Manufacturing</option>
                    <option>Retail</option>
                    <option>Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message*</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-400 resize-none"
                  placeholder="How can we help?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;