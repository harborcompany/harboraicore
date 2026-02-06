import React from 'react';

const LogoStrip: React.FC = () => {
    return (
        <section className="w-full border-y border-gray-200 bg-[#FAFAFA]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 py-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest shrink-0">
                    Trusted by teams building production AI systems
                </span>
                <div className="flex flex-wrap gap-12 opacity-60 grayscale items-center justify-center md:justify-start">
                    {/* Higgsfield */}
                    <div className="h-6 flex items-center">
                        <span className="text-xl font-bold tracking-tight text-black flex items-center gap-2">
                            Higgsfield
                        </span>
                    </div>

                    {/* IBM */}
                    <div className="h-8 flex items-center">
                        <svg viewBox="0 0 100 40" className="h-full w-auto fill-current text-black">
                            <g>
                                <path d="M0,5 h20 v5 h-20 z M25,5 h20 v5 h-20 z M50,5 h10 v5 h-5 v10 h-5 v-10 h-5 v20 h5 v-5 h5 v5 h10 v-25 z M0,15 h20 v5 h-20 z M25,15 h20 v5 h-20 z M0,25 h20 v5 h-20 z M25,25 h20 v5 h-20 z" />
                            </g>
                            <text x="0" y="30" fontSize="26" fontWeight="bold" fontFamily="sans-serif">IBM</text>
                        </svg>
                    </div>

                    {/* Adobe */}
                    <div className="h-8 flex items-center">
                        <svg viewBox="0 0 100 85" className="h-full w-auto fill-current text-black">
                            <polygon points="30,0 0,85 25,85 42,40 58,40 75,85 100,85 70,0" />
                        </svg>
                        <span className="text-xl font-bold tracking-tight text-black ml-3">Adobe</span>
                    </div>

                    {/* Runway */}
                    <div className="h-6 flex items-center">
                        <span className="text-xl font-bold tracking-tight text-black flex items-center gap-1">
                            Runway
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LogoStrip;
