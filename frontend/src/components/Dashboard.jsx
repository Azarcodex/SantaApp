import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Package, Map, Users, Activity, Zap, Thermometer, Truck, Gift, Wrench } from 'lucide-react'; // Assumes lucide-react or similar icon set
import { useDashboardData } from '../hooks/useDashboardData';
import { useDeliveries, useElves, useToys, useSystemHealth } from '../hooks/useSantaData';

// ==========================================
// 1. UI PRIMITIVES (Reusable Styling)
// ==========================================

const GlassCard = ({ children, className = "", noPadding = false }) => (
    <div className={`
        relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl 
        overflow-hidden flex flex-col shadow-2xl transition-all duration-300
        hover:border-white/20 hover:bg-slate-900/70
        ${noPadding ? '' : 'p-4'} ${className}
    `}>
        {/* Subtle Noise Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
        <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
);

const CardHeader = ({ title, icon, color = "text-white", subtitle }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            {icon && <span className={`${color} drop-shadow-md`}>{icon}</span>}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 font-mono mt-0.5">{subtitle}</p>}
            </div>
        </div>
        <div className={`h-1.5 w-1.5 rounded-full ${color.replace('text', 'bg')} animate-pulse shadow-[0_0_8px_currentColor]`}></div>
    </div>
);

const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950">
        <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-t-4 border-red-500 rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-t-4 border-green-500 rounded-full animate-spin direction-reverse duration-700"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl animate-bounce">🎅</span>
            </div>
        </div>
        <div className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-red-400 to-green-400 tracking-[0.2em] animate-pulse">
            ESTABLISHING UPLINK...
        </div>
    </div>
);

// ==========================================
// 2. FEATURE COMPONENTS
// ==========================================

const KPICard = ({ label, value, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.1 }}
    >
        <GlassCard className="group">
            <div className={`absolute -right-6 -top-6 text-9xl opacity-5 group-hover:opacity-10 transition-all duration-500 rotate-12 ${color}`}>
                <Icon size={120} />
            </div>

            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${color}`}>
                    <Icon size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
            </div>

            <div className="text-3xl lg:text-4xl font-black text-white tracking-tight mt-2">
                {value}
            </div>

            {/* Decorative progress bar */}
            <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5 + delay * 0.1, duration: 1.5 }}
                    className={`h-full ${color.replace('text', 'bg')} opacity-50`}
                />
            </div>
        </GlassCard>
    </motion.div>
);

const CircularGauge = ({ value, label, color, icon: Icon }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center relative group">
            {/* Glow Effect */}
            <div className={`absolute inset-0 ${color.replace('text', 'bg')} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500 rounded-full`}></div>

            <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                    <circle
                        cx="56"
                        cy="56"
                        r={radius}
                        className="stroke-slate-800/50"
                        strokeWidth="10"
                        fill="transparent"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="56"
                        cy="56"
                        r={radius}
                        className={`transition-all duration-1000 ease-out ${color} stroke-current`}
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                {/* Icon/Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Icon size={20} className={`${color} mb-1`} />
                    <span className="text-2xl font-black text-white tracking-tighter">{value}%</span>
                </div>
            </div>
            <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
        </div>
    );
};

const SystemHealthPanel = ({ system }) => (
    <GlassCard>
        <CardHeader title="System Vitals" icon={<Activity />} color="text-red-400" subtitle="Sleigh Telemetry" />
        <div className="flex-1 flex items-center justify-around pb-2">
            <CircularGauge
                value={system.sleighFuel}
                label="Fusion Core"
                color={system.sleighFuel < 20 ? "text-red-500" : "text-blue-500"}
                icon={Zap}
            />
            <div className="w-px h-24 bg-white/5"></div>
            <CircularGauge
                value={system.reindeerEnergy}
                label="Bio-Stamina"
                color="text-emerald-500"
                icon={Activity}
            />
        </div>
    </GlassCard>
);

const ProductionPanel = ({ toys }) => (
    <GlassCard>
        <CardHeader title="Production Line" icon={<Package />} color="text-amber-400" subtitle="Workshop Output" />

        <div className="flex-1 flex flex-col gap-5 justify-center">
            {/* Stage 1: Manufacturing */}
            <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition-all group-hover:scale-110">
                    <Wrench size={18} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-bold uppercase tracking-wide">Assembling</span>
                        <span className="text-orange-400 font-mono font-bold">{toys.production}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${toys.production}%` }}
                            className="h-full bg-linear-to-r from-orange-600 to-amber-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                        />
                    </div>
                </div>
            </div>

            {/* Stage 2: Packaging */}
            <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-all group-hover:scale-110">
                    <Gift size={18} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-bold uppercase tracking-wide">Wrapping</span>
                        <span className="text-blue-400 font-mono font-bold">{toys.packed}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${toys.packed}%` }}
                            className="h-full bg-linear-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        />
                    </div>
                </div>
            </div>

            {/* Stage 3: Logistics */}
            <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-all group-hover:scale-110">
                    <Truck size={18} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-bold uppercase tracking-wide">Loading Dock</span>
                        <span className="text-emerald-400 font-mono font-bold">{toys.ready}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${toys.ready}%` }}
                            className="h-full bg-linear-to-r from-emerald-600 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    </GlassCard>
);

const DeliveryFeed = ({ deliveries }) => (
    <GlassCard noPadding className="h-full">
        <div className="p-6 pb-2 border-b border-white/5">
            <CardHeader title="Live Uplink" icon={<Map />} color="text-blue-400" subtitle="Real-time Route Tracking" />
        </div>

        <div className="overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-xs text-slate-500 uppercase font-mono sticky top-0 backdrop-blur-md">
                    <tr>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Coordinates</th>
                        <th className="px-6 py-3 text-right font-medium">Payload</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                    {deliveries.map((d) => (
                        <tr key={d.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-3">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border
                                    ${d.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        d.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                    {d.status}
                                </span>
                            </td>
                            <td className="px-6 py-3 font-medium text-slate-300 group-hover:text-white transition-colors">
                                {d.country}
                            </td>
                            <td className="px-6 py-3 text-right font-mono text-slate-400 group-hover:text-blue-300">
                                {d.giftsDelivered.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </GlassCard>
);

const ElfRoster = ({ elves }) => (
    <GlassCard noPadding className="h-full">
        <div className="p-6 pb-2 border-b border-white/5 flex justify-between items-start">
            <CardHeader title="Active Personnel" icon={<Users />} color="text-yellow-400" subtitle="Workshop Beta Team" />
            <span className="text-xs font-mono bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded border border-yellow-400/20">
                {elves.length} ON DUTY
            </span>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-2 custom-scrollbar">
            {elves.map((elf) => (
                <div key={elf.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg border border-white/10 group-hover:border-yellow-400/50 transition-colors">
                            🧝
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${['Working', 'Active'].includes(elf.status) ? 'bg-green-500' : 'bg-slate-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate group-hover:text-yellow-400 transition-colors">{elf.name}</div>
                        <div className="text-xs text-slate-500 font-mono truncate">{elf.role}</div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-600">ID-{elf.id}</div>
                </div>
            ))}
        </div>
    </GlassCard>
);

// ==========================================
// 3. MAIN DASHBOARD LAYOUT
// ==========================================

const Dashboard = () => {
    const { data: dash, isLoading: loadDash } = useDashboardData();
    const { data: deliveries, isLoading: loadDel } = useDeliveries();
    const { data: elves, isLoading: loadElves } = useElves();
    const { data: toys, isLoading: loadToys } = useToys();
    const { data: system, isLoading: loadSys } = useSystemHealth();

    const isLoading = loadDash || loadDel || loadElves || loadToys || loadSys;

    if (isLoading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-red-500/30 selection:text-white pb-8">
            {/* Background Ambient Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

            <div className="relative max-w-[1800px] mx-auto p-4 md:p-8 space-y-6">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-red-500 animate-pulse">●</span>
                            <span className="text-xs font-mono text-red-400 tracking-widest">DEFCON 1 // CHRISTMAS EVE</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                            NORAD <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-400">COMMAND</span>
                        </h1>
                    </div>

                    <GlassCard className="!p-3 !flex-row items-center gap-6 min-w-fit" noPadding>
                        <div className="flex flex-col px-2">
                            <span className="text-[10px] text-slate-500 uppercase font-mono">Latitude</span>
                            <span className="text-sm font-bold text-white">90.0000° N</span>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="flex flex-col px-2">
                            <span className="text-[10px] text-slate-500 uppercase font-mono">Temp</span>
                            <span className="text-sm font-bold text-blue-300 flex items-center gap-1">
                                <Thermometer size={12} /> {system.weather}
                            </span>
                        </div>
                    </GlassCard>
                </header>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard delay={1} label="Gifts Prepared" value={dash.giftsPrepared.toLocaleString()} icon={Package} color="text-pink-500" />
                    <KPICard delay={2} label="Delivered" value={dash.giftsDelivered.toLocaleString()} icon={Package} color="text-emerald-500" />
                    <KPICard delay={3} label="Global Coverage" value={dash.countriesCovered} icon={Map} color="text-blue-500" />
                    <KPICard delay={4} label="Queued" value={dash.pendingDeliveries.toLocaleString()} icon={AlertCircle} color="text-amber-500" />
                </div>

                {/* Main Operations Area: Bento Box Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[650px]">

                    {/* Left Col: Vitals & Prod (Top), Feed (Bottom) */}
                    <div className="lg:col-span-8 flex flex-col gap-4 h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                            <SystemHealthPanel system={system} />
                            <ProductionPanel toys={toys} />
                        </div>
                        <div className="flex-1 min-h-0">
                            <DeliveryFeed deliveries={deliveries} />
                        </div>
                    </div>

                    {/* Right Col: Elves (Full Height) */}
                    <div className="lg:col-span-4 h-full">
                        <ElfRoster elves={elves} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;