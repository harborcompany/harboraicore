import React from 'react';

export const HeroSchematic: React.FC = () => {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full text-black" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Container Background - subtle grid */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      {/* Main Border */}
      <rect x="10" y="10" width="380" height="280" stroke="#e5e5e5" />

      {/* Video Track */}
      <g transform="translate(40, 50)">
        <text x="0" y="-10" className="text-[8px] font-mono fill-gray-400 border-none stroke-none">VIDEO_TRACK_01</text>
        <rect width="320" height="40" stroke="#333" fill="#f9f9f9" />
        {/* Frames */}
        <line x1="40" y1="0" x2="40" y2="40" stroke="#ddd" />
        <line x1="80" y1="0" x2="80" y2="40" stroke="#ddd" />
        <line x1="120" y1="0" x2="120" y2="40" stroke="#ddd" />
        <line x1="160" y1="0" x2="160" y2="40" stroke="#ddd" />
        <line x1="200" y1="0" x2="200" y2="40" stroke="#ddd" />
        <line x1="240" y1="0" x2="240" y2="40" stroke="#ddd" />
        <line x1="280" y1="0" x2="280" y2="40" stroke="#ddd" />
        
        {/* Annotation Region */}
        <rect x="120" y="5" width="80" height="30" fill="rgba(0,0,0,0.05)" stroke="black" strokeDasharray="4 2" />
      </g>

      {/* Audio Waveform */}
      <g transform="translate(40, 120)">
        <text x="0" y="-10" className="text-[8px] font-mono fill-gray-400 border-none stroke-none">AUDIO_SIGNAL_L/R</text>
        <rect width="320" height="60" stroke="#e5e5e5" fill="none" />
        <path d="M0,30 L10,25 L20,35 L30,20 L40,40 L50,15 L60,45 L70,30 L80,30 L90,28 L100,32 L110,25 L120,35 L130,10 L140,50 L150,20 L160,40 L170,25 L180,35 L190,28 L200,32 L210,30 L220,30 L230,25 L240,35 L250,20 L260,40 L270,15 L280,45 L290,30 L300,30 L310,28 L320,32" stroke="black" fill="none" />
      </g>

      {/* Dataset Nodes */}
      <g transform="translate(40, 210)">
         <text x="0" y="-10" className="text-[8px] font-mono fill-gray-400 border-none stroke-none">NODE_GRAPH</text>
         
         <circle cx="20" cy="30" r="4" fill="black" />
         <circle cx="100" cy="15" r="4" fill="white" stroke="black" />
         <circle cx="100" cy="45" r="4" fill="white" stroke="black" />
         <circle cx="180" cy="30" r="4" fill="black" />
         <circle cx="260" cy="30" r="4" fill="white" stroke="black" />

         <line x1="24" y1="30" x2="96" y2="15" stroke="#999" />
         <line x1="24" y1="30" x2="96" y2="45" stroke="#999" />
         <line x1="104" y1="15" x2="176" y2="30" stroke="#999" />
         <line x1="104" y1="45" x2="176" y2="30" stroke="#999" />
         <line x1="184" y1="30" x2="256" y2="30" stroke="#999" />
      </g>

      {/* Cursor Line */}
      <line x1="170" y1="40" x2="170" y2="280" stroke="black" strokeWidth="1" />
      <text x="175" y="275" className="text-[8px] font-mono fill-black border-none stroke-none">00:12:04:18</text>
    </svg>
  );
};

export const WaveformIcon: React.FC = () => (
  <svg viewBox="0 0 100 40" className="w-full h-auto text-black" fill="none" stroke="currentColor">
    <path d="M0,20 Q10,5 20,20 T40,20 T60,20 T80,20 T100,20" strokeWidth="2" />
  </svg>
);

export const VideoIcon: React.FC = () => (
  <svg viewBox="0 0 100 60" className="w-full h-auto text-black" fill="none" stroke="currentColor">
    <rect x="5" y="10" width="90" height="40" strokeWidth="2" />
    <line x1="25" y1="10" x2="25" y2="50" strokeWidth="1" />
    <line x1="75" y1="10" x2="75" y2="50" strokeWidth="1" />
  </svg>
);