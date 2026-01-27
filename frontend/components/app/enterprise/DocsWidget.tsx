import React from 'react';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { uiStore } from '../../../lib/uiStore';

export const DocsWidget: React.FC = () => {
    return (
        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 h-full flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-medium text-[#111] mb-4">Resources</h3>
                <ul className="space-y-3">
                    <li
                        onClick={() => uiStore.openApiDocs('reference')}
                        className="flex items-center justify-between text-sm text-gray-600 hover:text-[#111] cursor-pointer group"
                    >
                        API Documentation
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </li>
                    <li className="flex items-center justify-between text-sm text-gray-600 hover:text-[#111] cursor-pointer group">
                        Dataset Schema Reference
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </li>
                    <li className="flex items-center justify-between text-sm text-gray-600 hover:text-[#111] cursor-pointer group">
                        Compliance Overview
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </li>
                </ul>
            </div>

            <button
                onClick={() => uiStore.openApiDocs('overview')}
                className="w-full mt-6 bg-white border border-gray-200 text-[#111] py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
                <BookOpen size={14} />
                View Documentation
            </button>
        </div>
    );
};
