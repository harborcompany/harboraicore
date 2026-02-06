import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { jobs } from '../data/jobs';
import { Search, MapPin, Clock, DollarSign, Filter } from 'lucide-react';
import { Helmet } from 'react-helmet';

const Jobs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState<string>('All');

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'All' || job.department === selectedDept;
        return matchesSearch && matchesDept;
    });

    const departments = ['All', ...new Set(jobs.map(j => j.department))];

    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            <Helmet>
                <title>Careers at Harbor | Help Build the Future of AI</title>
                <meta name="description" content="Join Harbor's distributed team of contributors. Build models, record voice data, and create art to train the next generation of artificial intelligence." />
            </Helmet>

            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-semibold text-[#111] mb-4">Join the Harbor Network</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        We are looking for creative builders, artists, and voice talents to contribute high-quality training data for next-gen AI models.
                    </p>
                </div>
            </div>


            {/* Search & Filter */}
            <div className="max-w-6xl mx-auto px-6 -mt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search roles (e.g. 'Builder', 'Voice', 'Remote')"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full md:w-auto">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 appearance-none bg-white text-sm"
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Job List */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid gap-4">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <Link key={job.id} to={`/jobs/${job.id}`} className="group block bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-400 hover:shadow-md transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#111] bg-gray-100 px-2 py-1 rounded">
                                                {job.department}
                                            </span>
                                            <span className="text-xs text-gray-500 font-medium px-2 py-1 border border-gray-200 rounded">
                                                {job.type}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#111] group-hover:text-black mb-1">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" /> {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" /> {job.rate}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-[#111] font-medium text-sm">
                                        Apply Now →
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No roles found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobs;
