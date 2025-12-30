import React from 'react';
import { motion } from 'framer-motion';
import { useToys, useElves } from '../hooks/useSantaData';
import Snowfall from './Snowfall';

const ProgressBar = ({ label, value, color, icon, description }) => {
    return (
        <div className="relative group mb-12">
            <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-slate-900/50 border border-white/10 text-2xl shadow-lg shadow-${color}-500/10 group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{label}</h3>
                        <p className="text-sm text-slate-400 font-medium">{description}</p>
                    </div>
                </div>
                <div className="text-right">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-4xl font-black text-transparent bg-clip-text bg-linear-to-r ${color === 'red' ? 'from-red-400 to-rose-600' : color === 'blue' ? 'from-blue-400 to-indigo-600' : 'from-emerald-400 to-green-600'}`}
                    >
                        {value}%
                    </motion.span>
                </div>
            </div>

            <div className="relative h-6 bg-slate-900/80 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm p-1">
                {/* Track Glow */}
                <div className={`absolute inset-0 opacity-10 bg-${color}-500 blur-md`}></div>

                {/* Progress Fill */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`relative h-full rounded-full bg-linear-to-r ${color === 'red' ? 'from-red-600 to-rose-500' : color === 'blue' ? 'from-blue-600 to-indigo-500' : 'from-emerald-600 to-green-500'} shadow-[0_0_20px_rgba(255,255,255,0.2)]`}
                >
                    {/* Interior Shine */}
                    <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent"></div>

                    {/* Scanning Light Effect */}
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    />
                </motion.div>
            </div>

            {/* Particles/Glow follow */}
            <motion.div
                initial={{ left: 0 }}
                animate={{ left: `${value}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`absolute bottom-[-10px] w-4 h-4 bg-${color}-400 blur-lg opacity-50 -translate-x-1/2`}
            />
        </div>
    );
};

const StatCard = ({ label, value, icon, subtext }) => (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-300 group">
        <div className="flex items-center gap-4">
            <div className="text-3xl bg-slate-800/50 p-3 rounded-2xl group-hover:bg-slate-700/50 transition-colors">
                {icon}
            </div>
            <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
                <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
                {subtext && <div className="text-[10px] text-green-400 font-medium mt-1 uppercase">{subtext}</div>}
            </div>
        </div>
    </div>
);

const Toys = () => {
    const { data: toys, isLoading, error } = useToys();
    const { data: elves } = useElves();

    if (isLoading) return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-red-400 font-bold tracking-widest">INITIALIZING INVENTORY...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-3xl text-center backdrop-blur-md">
                <div className="text-6xl mb-4">⚠️</div>
                <div className="text-2xl font-bold text-red-500 mb-2">Inventory Sync Failed</div>
                <div className="text-red-300/60 max-w-xs mx-auto">The North Pole orbital link is currently experiencing solar interference.</div>
            </div>
        </div>
    );

    const activeElves = elves?.filter(e => ['Working', 'Active'].includes(e.status)).length || 0;
    const idleElves = (elves?.length || 0) - activeElves;

    return (
        <div className="relative min-h-[calc(100vh-100px)]">
            <Snowfall />

            <div className="relative z-10 max-w-5xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold text-red-400 tracking-[0.3em] uppercase">Operations Live</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white" style={{ fontFamily: '"Mountains of Christmas", cursive' }}>
                            Toy Inventory <span className="text-red-500 text-3xl md:text-4xl ml-2">Control</span>
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-slate-900/60 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Current Shift</div>
                            <div className="text-white font-mono flex items-center gap-2">
                                <span className="text-green-400">●</span> Night Ops
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard
                        label="Active Workforce"
                        value={`${activeElves} Elves`}
                        icon="🧝"
                        subtext={`${Math.round((activeElves / (elves?.length || 1)) * 100)}% Efficiency`}
                    />
                    <StatCard
                        label="Factory Load"
                        value="Heavy"
                        icon="🏭"
                        subtext="Phase 4 active"
                    />
                    <StatCard
                        label="Est. Completion"
                        value="14h 22m"
                        icon="⏳"
                        subtext="Ahead of schedule"
                    />
                </div>

                {/* Production Bars */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 blur-[100px] -z-10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] -z-10 rounded-full"></div>

                    <div className="relative z-10">
                        <ProgressBar
                            label="Toys in Production"
                            value={toys.production}
                            color="blue"
                            icon="⚙️"
                            description="Units currently on the main assembly line"
                        />
                        <ProgressBar
                            label="Toys Packed"
                            value={toys.packed}
                            color="red"
                            icon="🎁"
                            description="Gifts wrapped and marked for delivery"
                        />
                        <ProgressBar
                            label="Toys Ready to Ship"
                            value={toys.ready}
                            color="emerald"
                            icon="🚀"
                            description="Final inspection passed, pending sleigh loading"
                        />
                    </div>

                    {/* Factory Floor Indicators */}
                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-8 justify-center">
                        <div className="flex items-center gap-3 text-slate-500">
                            <span className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/50"></span>
                            <span className="text-xs font-bold uppercase tracking-widest">Assembly</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                            <span className="w-4 h-4 rounded bg-red-500/20 border border-red-500/50"></span>
                            <span className="text-xs font-bold uppercase tracking-widest">Wrapping</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                            <span className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50"></span>
                            <span className="text-xs font-bold uppercase tracking-widest">Logistics</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toys;
