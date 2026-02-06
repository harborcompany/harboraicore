import React from 'react';
import { DataOverview } from '../../components/app/enterprise/DataOverview';
import { LivePipelines } from '../../components/app/enterprise/LivePipelines';
import { DataQuality } from '../../components/app/enterprise/DataQuality';
import { WorkflowList } from '../../components/app/enterprise/WorkflowList';
import { IntegrationCenter } from '../../components/app/enterprise/IntegrationCenter';
import { ActivityLog } from '../../components/app/enterprise/ActivityLog';
import { ResourceUsage } from '../../components/app/enterprise/ResourceUsage';
import { DocsWidget } from '../../components/app/enterprise/DocsWidget';

import { uiStore } from '../../lib/uiStore';

const EnterpriseDashboard: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-[#111] tracking-tight mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 font-light">
                        Monitor your datasets, workflows, and integrations in real time.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => uiStore.openApiDocs('start')}
                        className="px-5 py-2.5 bg-white text-[#111] text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        View API Documentation
                    </button>
                    <button className="px-5 py-2.5 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors border border-[#111]">
                        Create Workflow
                    </button>
                </div>
            </div>

            {/* Row 1: Data Overview (Full Width / Hero) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <DataOverview />
                </div>
                <div className="lg:col-span-1">
                    <LivePipelines />
                </div>
            </div>

            {/* Row 2: Quality & Workflows */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <DataQuality />
                </div>
                <div className="lg:col-span-2">
                    <WorkflowList />
                </div>
            </div>

            {/* Row 3: Integrations (Full Width) */}
            <div>
                <IntegrationCenter />
            </div>

            {/* Row 4: Activity, Usage, Docs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ActivityLog />
                <ResourceUsage />
                <DocsWidget />
            </div>
        </div>
    );
};

export default EnterpriseDashboard;
