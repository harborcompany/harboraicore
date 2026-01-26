import { Database, Video, Tag, DollarSign, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
];

const DashboardHome = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif">Overview</h1>
                <button className="btn-primary">+ New Upload</button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card icon={Database} label="Datasets" value="24" trend="+3 this week" color="text-blue-500" />
                <Card icon={Video} label="Media Assets" value="12,847" trend="+428 this week" color="text-emerald-500" />
                <Card icon={Tag} label="Annotations" value="89,231" trend="+2.1k this week" color="text-amber-500" />
                <Card icon={DollarSign} label="Revenue" value="$47.2k" trend="+12% MTD" color="text-rose-500" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card h-[400px]">
                    <h3 className="text-lg font-medium mb-6">Ingestion Activity</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#f43f5e" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="card">
                    <h3 className="text-lg font-medium mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        <ActivityItem title="New dataset ingested" desc="lifestyle-footage-v3" time="2 min ago" />
                        <ActivityItem title="Annotation batch completed" desc="product-shots-v2" time="15 min ago" />
                        <ActivityItem title="New license activated" desc="Acme Corp Enterprise" time="1 hour ago" />
                        <ActivityItem title="Ad creative approved" desc="Summer Campaign" time="2 hours ago" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Card = ({ icon: Icon, label, value, trend, color }: any) => (
    <div className="card">
        <div className="flex items-center gap-3 mb-4">
            <Icon size={20} className={color} />
            <span className="text-xs font-mono uppercase tracking-widest text-stone-500">{label}</span>
        </div>
        <div className="text-3xl font-serif text-white mb-2">{value}</div>
        <div className="text-xs text-stone-400 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            {trend}
        </div>
    </div>
);

const ActivityItem = ({ title, desc, time }: any) => (
    <div className="flex gap-4">
        <div className="w-2 h-2 rounded-full bg-stone-700 mt-2"></div>
        <div>
            <h4 className="text-sm font-medium text-white">{title}</h4>
            <p className="text-xs text-stone-500 mt-0.5">{desc}</p>
            <span className="text-[10px] uppercase tracking-wide text-stone-600 mt-2 block">{time}</span>
        </div>
    </div>
);

export default DashboardHome;
