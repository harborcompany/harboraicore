import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Video, Mic, CreditCard } from 'lucide-react';

const DocsContributors: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-medium text-[#111] mb-4 flex items-center gap-3">
                    <Users className="text-indigo-600" />
                    Contributor Guide
                </h1>
                <p className="text-gray-600 mb-8">Everything you need to know about contributing data to Harbor.</p>
            </div>

            <section>
                <h2 className="text-xl font-semibold text-[#111] mb-4">Getting Started</h2>
                <ol className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">1</span>
                        <span><Link to="/auth/signup" className="text-blue-600 hover:underline">Create an account</Link></span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">2</span>
                        <span>Complete the onboarding questionnaire</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">3</span>
                        <span>Browse available data programs from your Dashboard</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">4</span>
                        <span>Submit your first contribution</span>
                    </li>
                </ol>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-[#111] mb-4">Submission Guidelines</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Video className="text-blue-600" size={20} />
                            <h3 className="font-semibold text-[#111]">Video Submissions</h3>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>• Minimum resolution: 720p</li>
                            <li>• Formats: MP4, MOV, WebM</li>
                            <li>• Hands-only builds: Keep face out of frame</li>
                            <li>• Good lighting, stable camera</li>
                        </ul>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Mic className="text-green-600" size={20} />
                            <h3 className="font-semibold text-[#111]">Audio Submissions</h3>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>• Minimum quality: 16-bit, 44.1kHz</li>
                            <li>• Formats: WAV, MP3, FLAC</li>
                            <li>• Clear voice, minimal background noise</li>
                            <li>• Follow provided script prompts exactly</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-[#111] mb-4 flex items-center gap-2">
                    <CreditCard className="text-green-600" size={20} />
                    Payment Schedule
                </h2>
                <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                    <p className="text-gray-700">
                        Approved submissions are paid out on the <strong>1st of each month</strong>.
                        View your pending and approved submissions in your{' '}
                        <Link to="/app/contribute" className="text-blue-600 hover:underline">Contributor Dashboard</Link>.
                    </p>
                </div>
            </section>

            <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-[#111] mb-2">Questions?</h3>
                <p className="text-sm text-gray-600">
                    Check out our <Link to="/ambassadors" className="text-blue-600 hover:underline">Ambassador Program</Link> for
                    additional earning opportunities or <Link to="/contact" className="text-blue-600 hover:underline">contact support</Link>
                    {' '}if you need help with your submissions.
                </p>
            </section>
        </div>
    );
};

export default DocsContributors;
