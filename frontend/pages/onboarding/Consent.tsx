import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Shield, Check } from 'lucide-react';
import OnboardingLayout from '../../components/layouts/OnboardingLayout';
import { authStore } from '../../lib/authStore';

const Consent: React.FC = () => {
    const navigate = useNavigate();
    const [hasDataRights, setHasDataRights] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleContinue = () => {
        if (hasDataRights && acceptedTerms) {
            authStore.acceptConsent();
            navigate('/onboarding/complete');
        }
    };

    const canContinue = hasDataRights && acceptedTerms;

    return (
        <OnboardingLayout currentStep={4} totalSteps={4} title="Data usage and rights">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-stone-600" />
                </div>
                <p className="text-stone-500 text-sm max-w-md mx-auto">
                    Harbor operates on explicit permissions and clear licensing. You retain control over your data, and usage is governed by transparent terms.
                </p>
            </div>

            <div className="space-y-4">
                {/* Data Rights Checkbox */}
                <label className="flex items-start gap-3 p-4 rounded-xl bg-white border border-stone-200 cursor-pointer hover:border-stone-300 transition-colors">
                    <button
                        onClick={() => setHasDataRights(!hasDataRights)}
                        className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${hasDataRights
                            ? 'bg-[#1A1A1A] text-white'
                            : 'border border-stone-300'
                            }`}
                    >
                        {hasDataRights && <Check size={14} />}
                    </button>
                    <span className="text-stone-700 text-sm">
                        I confirm I have rights to upload and use this data, or am licensing data under Harbor's terms.
                    </span>
                </label>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 p-4 rounded-xl bg-white border border-stone-200 cursor-pointer hover:border-stone-300 transition-colors">
                    <button
                        onClick={() => setAcceptedTerms(!acceptedTerms)}
                        className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${acceptedTerms
                            ? 'bg-[#1A1A1A] text-white'
                            : 'border border-stone-300'
                            }`}
                    >
                        {acceptedTerms && <Check size={14} />}
                    </button>
                    <span className="text-stone-700 text-sm">
                        I agree to Harbor's{' '}
                        <Link to="/terms" className="text-[#1A1A1A] underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-[#1A1A1A] underline">Data Policy</Link>.
                    </span>
                </label>
            </div>

            <button
                onClick={handleContinue}
                disabled={!canContinue}
                className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Accept and Continue
            </button>
        </OnboardingLayout>
    );
};

export default Consent;
