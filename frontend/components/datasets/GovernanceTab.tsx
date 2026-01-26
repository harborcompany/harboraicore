import React from 'react';
import { GovernanceProfile } from '../../types';
import { Shield, Map, Clock, FileText } from 'lucide-react';

interface Props {
    profile?: GovernanceProfile;
}

const GovernanceTab: React.FC<Props> = ({ profile }) => {
    if (!profile) {
        return (
            <div className="p-8 text-center bg-stone-50 rounded-lg border border-stone-200 border-dashed">
                <Shield className="mx-auto h-12 w-12 text-stone-300 mb-3" />
                <h3 className="text-stone-900 font-medium">No Governance Profile</h3>
                <p className="text-stone-500 text-sm">This dataset does not have attached governance metadata.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h3 className="font-medium text-[#1A1A1A]">Usage Rights</h3>
                        <p className="text-xs text-stone-500">Legal permissions framework</p>
                    </div>
                </div>
                <div className="prose prose-sm max-w-none text-stone-600">
                    <p>{profile.usageRights || "Standard Commercial License"}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="font-medium text-[#1A1A1A]">Consent Source</h3>
                        <p className="text-xs text-stone-500">Origin of data collection</p>
                    </div>
                </div>
                <div className="text-sm text-stone-600">
                    {profile.consentSource || "Direct Collection"}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                        <Map size={20} />
                    </div>
                    <div>
                        <h3 className="font-medium text-[#1A1A1A]">Geographic Restrictions</h3>
                        <p className="text-xs text-stone-500">Regional compliance</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {profile.geoRestrictions && profile.geoRestrictions.length > 0 ? (
                        profile.geoRestrictions.map((geo, i) => (
                            <span key={i} className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs font-mono border border-stone-200">
                                {geo}
                            </span>
                        ))
                    ) : (
                        <span className="text-stone-400 text-sm italic">No restrictions</span>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h3 className="font-medium text-[#1A1A1A]">Retention Policy</h3>
                        <p className="text-xs text-stone-500">Data lifecycle management</p>
                    </div>
                </div>
                <div className="text-sm text-stone-600">
                    {profile.retentionPolicy || "Indefinite"}
                </div>
            </div>
        </div>
    );
};

export default GovernanceTab;
