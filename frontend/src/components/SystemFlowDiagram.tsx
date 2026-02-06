import React, { useState, useEffect, useRef } from 'react';

const SystemFlowDiagram: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const diagramRef = useRef<HTMLDivElement>(null);

    // Intersection Observer to trigger animation
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });

        if (diagramRef.current) {
            observer.observe(diagramRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Animation Classes
    const getFlowClass = (delay: number) => {
        return isVisible
            ? `transition-all duration-500 ease-out opacity-100`
            : `opacity-0`;
    };

    const getPathClass = (delay: number) => {
        return isVisible
            ? `path-draw transition-all duration-700 ease-linear`
            : `path-hidden`;
    };

    const nodeBaseClass = "fill-white stroke-[#D0D5DD] stroke-[1px] rx-2 hover:stroke-[#1A1A1A] hover:stroke-2 transition-all duration-200 cursor-default";
    const textTitleClass = "font-mono font-semibold fill-[#1A1A1A] text-sm text-anchor-middle pointer-events-none";
    const textDescClass = "font-sans text-xs fill-[#666666] text-anchor-middle pointer-events-none";

    return (
        <div ref={diagramRef} className="w-full max-w-4xl mx-auto p-8 bg-white rounded-xl border border-stone-100 shadow-sm">
            <svg
                viewBox="0 0 800 1000"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
            >
                <style>
                    {`
                        .path-hidden { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
                        .path-draw { stroke-dasharray: 1000; stroke-dashoffset: 0; }
                        .fade-in { opacity: 0; animation: fadeIn 0.5s forwards; }
                        @keyframes fadeIn { to { opacity: 1; } }
                    `}
                </style>

                {/* --- 1. CAPTURE NETWORK --- */}
                <g className={getFlowClass(0)} style={{ transitionDelay: '0ms' }}>
                    <rect x="250" y="20" width="300" height="80" rx="4" className={nodeBaseClass} />
                    <text x="400" y="55" textAnchor="middle" className={textTitleClass}>Capture Network</text>
                    <text x="400" y="75" textAnchor="middle" className={textDescClass}>
                        Contributor Service • Device Ingest • Consent
                    </text>
                </g>

                {/* Line 1 -> 2 */}
                <path d="M400 100 V140" stroke="#D0D5DD" strokeWidth="2" className={getPathClass(200)} style={{ transitionDelay: '200ms' }} />

                {/* --- 2. MEDIA INGESTION --- */}
                <g className={getFlowClass(300)} style={{ transitionDelay: '300ms' }}>
                    <rect x="250" y="140" width="300" height="80" rx="4" className={nodeBaseClass} />
                    <text x="400" y="175" textAnchor="middle" className={textTitleClass}>Media Ingestion & Storage</text>
                    <text x="400" y="195" textAnchor="middle" className={textDescClass}>
                        Chunking • Fingerprinting • Temporal
                    </text>
                </g>

                {/* Line 2 -> 3 */}
                <path d="M400 220 V260" stroke="#D0D5DD" strokeWidth="2" className={getPathClass(500)} style={{ transitionDelay: '500ms' }} />

                {/* --- 3. ANNOTATION FABRIC --- */}
                <g className={getFlowClass(600)} style={{ transitionDelay: '600ms' }}>
                    <rect x="250" y="260" width="300" height="80" rx="4" className={nodeBaseClass} />
                    <text x="400" y="295" textAnchor="middle" className={textTitleClass}>Annotation & Curation Fabric</text>
                    <text x="400" y="315" textAnchor="middle" className={textDescClass}>
                        Review • Versioning • Confidence
                    </text>
                </g>

                {/* Line 3 -> 4 */}
                <path d="M400 340 V380" stroke="#D0D5DD" strokeWidth="2" className={getPathClass(800)} style={{ transitionDelay: '800ms' }} />

                {/* --- 4. RAG DATASET ENGINE --- */}
                <g className={getFlowClass(900)} style={{ transitionDelay: '900ms' }}>
                    <rect x="250" y="380" width="300" height="80" rx="4" className={nodeBaseClass} />
                    <text x="400" y="415" textAnchor="middle" className={textTitleClass}>RAG Dataset Engine</text>
                    <text x="400" y="435" textAnchor="middle" className={textDescClass}>
                        Embedding • Indexing • Retrieval
                    </text>
                </g>

                {/* Connector Split */}
                <path d="M400 460 V500" stroke="#D0D5DD" strokeWidth="2" className={getPathClass(1100)} style={{ transitionDelay: '1100ms' }} />
                <path d="M400 500 H200 V540" stroke="#D0D5DD" strokeWidth="2" className={getPathClass(1300)} style={{ transitionDelay: '1300ms' }} />
                <path d="M400 500 H600 V540" stroke="#D0D5DD" strokeWidth="2" className={getPathClass(1300)} style={{ transitionDelay: '1300ms' }} />

                {/* --- 5A. DATASET MARKETPLACE --- */}
                <g className={getFlowClass(1500)} style={{ transitionDelay: '1500ms' }}>
                    <rect x="80" y="540" width="240" height="80" rx="4" className={nodeBaseClass} />
                    <text x="200" y="575" textAnchor="middle" className={textTitleClass}>Dataset Marketplace</text>
                    <text x="200" y="595" textAnchor="middle" className={textDescClass}>
                        Catalog • Licensing • Access
                    </text>
                </g>

                {/* --- 5B. ADS CREATIVE ENGINE --- */}
                <g className={getFlowClass(1500)} style={{ transitionDelay: '1500ms' }}>
                    <rect x="480" y="540" width="240" height="80" rx="4" className={nodeBaseClass} />
                    <text x="600" y="575" textAnchor="middle" className={textTitleClass}>Ads Creative Engine</text>
                    <text x="600" y="595" textAnchor="middle" className={textDescClass}>
                        Projects • Prompts • Generation
                    </text>
                </g>

                {/* Convergence to Gateway */}
                <path d="M200 620 V660 H400 V680" stroke="#D0D5DD" strokeWidth="2" className={getPathClass(1800)} style={{ transitionDelay: '1800ms' }} />
                <path d="M600 620 V660 H400 V680" stroke="#D0D5DD" strokeWidth="2" className={getPathClass(1800)} style={{ transitionDelay: '1800ms' }} />

                {/* --- 6. API GATEWAY --- */}
                <g className={getFlowClass(2100)} style={{ transitionDelay: '2100ms' }}>
                    <rect x="250" y="680" width="300" height="80" rx="4" className={nodeBaseClass} />
                    <text x="400" y="715" textAnchor="middle" className={textTitleClass}>API Gateway</text>
                    <text x="400" y="735" textAnchor="middle" className={textDescClass}>
                        Datasets • RAG • Ads • Usage
                    </text>
                </g>
            </svg>
        </div>
    );
};

export default SystemFlowDiagram;
