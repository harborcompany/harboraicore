import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { jobs } from '../data/jobs';
import { MapPin, DollarSign, Clock, ArrowLeft, CheckCircle, Upload, ChevronRight, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

const JobApplication: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const job = jobs.find(j => j.id === id);
    const [submitted, setSubmitted] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    if (!job) {
        return <Navigate to="/jobs" replace />;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => setSubmitted(true), 1000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6">
                <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#111] mb-4">Application Received</h2>
                    <p className="text-gray-600 mb-8">
                        Thanks for applying to be a <strong>{job.title}</strong>. Our team will review your profile and get back to you within 48 hours.
                    </p>
                    <Link to="/jobs" className="block w-full py-3 bg-[#111] text-white rounded-lg hover:bg-black transition-colors font-medium">
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            <Helmet>
                <title>Apply for {job.title} | Harbor Careers</title>
                <meta name="description" content={job.description.slice(0, 160)} />
            </Helmet>

            {/* Hero Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <Link to="/jobs" className="inline-flex items-center text-gray-500 hover:text-[#111] mb-6 transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all jobs
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4 inline-block">
                                {job.department}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-semibold text-[#111] mb-4">{job.title}</h1>
                            <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> {job.location}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> {job.type}
                                </span>
                                <span className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" /> {job.rate}
                                </span>
                            </div>
                        </div>
                        <a href="#apply-form" className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-lg font-medium hover:bg-black transition-colors whitespace-nowrap">
                            Apply Now <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Left Column: Full Content */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* About the Role */}
                        <section>
                            <h2 className="text-xl font-semibold text-[#111] mb-4">About the Role</h2>
                            <p className="text-gray-600 leading-relaxed">{job.description}</p>
                        </section>

                        {/* Responsibilities */}
                        <section>
                            <h2 className="text-xl font-semibold text-[#111] mb-4">Responsibilities</h2>
                            <ul className="space-y-3">
                                {job.responsibilities.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-600">
                                        <span className="w-1.5 h-1.5 bg-[#111] rounded-full mt-2 flex-shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Requirements */}
                        <section>
                            <h2 className="text-xl font-semibold text-[#111] mb-4">Requirements</h2>
                            <ul className="space-y-3">
                                {job.requirements.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-600">
                                        <span className="w-1.5 h-1.5 bg-[#111] rounded-full mt-2 flex-shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* How It Works */}
                        {job.howItWorks && (
                            <section className="bg-white border border-gray-100 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-[#111] mb-6">How It Works</h2>
                                <div className="space-y-4">
                                    {job.howItWorks.map((step, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-[#111] text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                                {i + 1}
                                            </div>
                                            <p className="text-gray-600 pt-1">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Benefits */}
                        <section>
                            <h2 className="text-xl font-semibold text-[#111] mb-4">Benefits</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {job.benefits.map((benefit, i) => (
                                    <div key={i} className="bg-white border border-gray-100 rounded-lg p-4">
                                        <p className="text-gray-700">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Compensation */}
                        <section className="bg-white border border-gray-100 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-[#111] mb-4">Compensation</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-3 text-gray-500 font-medium">Rate</td>
                                            <td className="py-3 text-gray-900">{job.rate}</td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-3 text-gray-500 font-medium">Type</td>
                                            <td className="py-3 text-gray-900">{job.type}</td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-3 text-gray-500 font-medium">Payment Timeline</td>
                                            <td className="py-3 text-gray-900">60-90 days after approval</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-gray-500 font-medium">Method</td>
                                            <td className="py-3 text-gray-900">Direct deposit to your preferred method</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* FAQ */}
                        {job.faq && job.faq.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-[#111] mb-6 flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5" /> Frequently Asked Questions
                                </h2>
                                <div className="space-y-4">
                                    {job.faq.map((item, i) => (
                                        <div key={i} className="bg-white border border-gray-100 rounded-lg p-5">
                                            <h3 className="font-medium text-[#111] mb-2">{item.question}</h3>
                                            <p className="text-gray-600 text-sm">{item.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Why Harbor */}
                        <section className="bg-gradient-to-br from-gray-900 to-black text-white rounded-xl p-8">
                            <h2 className="text-xl font-semibold mb-4">Why Harbor?</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                Join the world's most premium data contributor network. We treat our contributors like partners, offering fair pay, flexible schedules, and the chance to be part of history in the making of AGI.
                            </p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" /> Transparent compensation
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" /> Work from anywhere
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" /> Choose your own schedule
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" /> Shape the future of AI
                                </li>
                            </ul>
                        </section>

                        {/* LEGO Disclaimer */}
                        {job.disclaimer && (
                            <section className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-500 leading-relaxed">
                                <strong>Trademark Notice:</strong> {job.disclaimer}
                            </section>
                        )}
                    </div>

                    {/* Right Column: Sticky Application Form */}
                    <div className="lg:col-span-1">
                        <div id="apply-form" className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-24">
                            <h3 className="text-lg font-semibold text-[#111] mb-6">Apply Now</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 outline-none transition-colors text-sm"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 outline-none transition-colors text-sm"
                                        placeholder="jane@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn / Portfolio</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 outline-none transition-colors text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume / Cover Letter</label>
                                    <label className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer block">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                        />
                                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                        {fileName ? (
                                            <span className="text-sm text-[#111] font-medium">{fileName}</span>
                                        ) : (
                                            <span className="text-xs text-gray-500">Drag & drop or click to upload</span>
                                        )}
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#111] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors mt-4"
                                >
                                    Submit Application
                                </button>
                                <p className="text-xs text-gray-400 text-center mt-2">
                                    By applying, you agree to Harbor's Privacy Policy.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplication;
