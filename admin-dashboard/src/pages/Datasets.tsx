

const Datasets = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif">Datasets</h1>
                <button className="btn-primary">+ Create Dataset</button>
            </div>

            <div className="card overflow-hidden p-0">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-stone-500">Name</th>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-stone-500">Type</th>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-stone-500">Items</th>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-stone-500">Version</th>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-stone-500">Status</th>
                            <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-stone-500"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {/* Mock Rows */}
                        <Row name="lifestyle-footage-v3" type="Video" count="2,847" ver="v1.2.0" status="Published" />
                        <Row name="product-shots-v2" type="Video" count="1,523" ver="v2.0.1" status="Published" />
                        <Row name="urban-scenes-audio" type="Audio" count="4,210" ver="v1.0.0" status="Draft" />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Row = ({ name, type, count, ver, status }: any) => (
    <tr className="hover:bg-white/5 transition-colors">
        <td className="px-6 py-4 font-medium text-white">{name}</td>
        <td className="px-6 py-4 text-stone-400">{type}</td>
        <td className="px-6 py-4 text-stone-400 font-mono">{count}</td>
        <td className="px-6 py-4 text-stone-400 font-mono">{ver}</td>
        <td className="px-6 py-4">
            <span className={`px-2 py-1 rounded text-xs border ${status === 'Published' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-stone-700/50 border-stone-600 text-stone-400'
                }`}>
                {status}
            </span>
        </td>
        <td className="px-6 py-4 text-right">
            <button className="text-stone-500 hover:text-white">•••</button>
        </td>
    </tr>
);

export default Datasets;
