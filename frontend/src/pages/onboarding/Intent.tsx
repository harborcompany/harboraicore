import React from 'react';
import SmartOnboardingModal from '../../components/onboarding/SmartOnboardingModal';

const Intent: React.FC = () => {
    // efficient pass-through to modal
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
            <SmartOnboardingModal onComplete={() => { }} />
        </div>
    );
};

export default Intent;
