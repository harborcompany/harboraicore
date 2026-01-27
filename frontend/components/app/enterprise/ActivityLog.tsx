import React from 'react';
import { Activity } from 'lucide-react';

export const ActivityLog: React.FC = () => {
    const events = [
        { action: "Dataset updated", detail: "Retail Ads Q3", time: "10m ago" },
        { action: "Annotation batch approved", detail: "Batch #4092", time: "1h ago" },
        { action: "API key generated", detail: "Service Account: Training", time: "2h ago" },
        { action: "Stream connected", detail: "Production Video Pipeline", time: "5h ago" },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium text-[#111]">Recent Activity</h3>
                </div>
                <button className="text-xs font-medium text-stone-500 hover:text-[#111] transition-colors">View All</button>
            </div>

            <div className="relative border-l border-gray-100 ml-3 space-y-6">
                {events.map((event, i) => (
                    <div key={i} className="pl-6 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-200 border-2 border-white"></div>
                        <p className="text-sm font-medium text-[#111]">{event.action}</p>
                        <p className="text-xs text-gray-500">{event.detail} • <span className="text-gray-400">{event.time}</span></p>
                    </div>
                ))}
            </div>
        </div>
    );
};
