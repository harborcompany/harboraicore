import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import OnboardingLayout from '../../components/layouts/OnboardingLayout';
import { authStore } from '../../lib/authStore';

const companySizes = ['1–10', '11–50', '51–200', '200+'];
const industries = [
    'Technology & AI',
    'Media & Entertainment',
    'Defense & Intelligence',
    'Automotive & Robotics',
    'Healthcare & Life Sciences',
    'Public Sector',
    'Manufacturing & Industrial',
    'Other'
];

const Organization: React.FC = () => {
    const navigate = useNavigate();
    const [orgName, setOrgName] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [industry, setIndustry] = useState('');
    const [teammates, setTeammates] = useState<string[]>([]);
    const [newTeammate, setNewTeammate] = useState('');

    const handleAddTeammate = () => {
        if (newTeammate && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newTeammate)) {
            setTeammates([...teammates, newTeammate]);
            setNewTeammate('');
        }
    };

    const handleRemoveTeammate = (email: string) => {
        setTeammates(teammates.filter(t => t !== email));
    };

    const handleContinue = () => {
        if (orgName) {
            authStore.setOrganization({
                name: orgName,
                size: companySize,
                industry
            });
            navigate('/onboarding/data-types');
        }
    };

    return (
        <OnboardingLayout currentStep={2} totalSteps={4} title="Enterprise Configuration">
            <div className="space-y-6">
                {/* Organization Name */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                        Organization Name
                    </label>
                    <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                        placeholder="Acme Inc."
                    />
                </div>

                {/* Company Size */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                        Company Size
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {companySizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setCompanySize(size)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${companySize === size
                                    ? 'bg-[#1A1A1A] text-white'
                                    : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Industry */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                        Industry
                    </label>
                    <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors appearance-none"
                    >
                        <option value="">Select industry...</option>
                        {industries.map((ind) => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                </div>

                {/* Invite Teammates */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                        Invite teammates (optional)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={newTeammate}
                            onChange={(e) => setNewTeammate(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTeammate()}
                            className="flex-1 bg-white border border-stone-200 rounded-lg px-4 py-3 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                            placeholder="teammate@company.com"
                        />
                        <button
                            onClick={handleAddTeammate}
                            className="bg-stone-100 border border-stone-200 rounded-lg px-4 text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    {teammates.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {teammates.map((email) => (
                                <span
                                    key={email}
                                    className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {email}
                                    <button onClick={() => handleRemoveTeammate(email)} className="hover:text-[#1A1A1A]">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleContinue}
                disabled={!orgName}
                className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Create Organization
            </button>
        </OnboardingLayout>
    );
};

export default Organization;
