import React from 'react';
import { motion } from 'framer-motion';
import { useDashboardData } from '../hooks/useDashboardData';
import { useDeliveries, useElves, useToys, useSystemHealth } from '../hooks/useSantaData';

const Dashboard = () => {
    // 1. Fetching Data from our different hooks
    const { data: dashboardData, isLoading: loadDash } = useDashboardData();
    const { data: deliveries, isLoading: loadDel } = useDeliveries();
    const { data: elves, isLoading: loadElves } = useElves();
    const { data: toys, isLoading: loadToys } = useToys();
    const { data: system, isLoading: loadSys } = useSystemHealth();

    // Loading State
    const isLoading = loadDash || loadDel || loadElves || loadToys || loadSys;
    if (isLoading) return <div className="p-12 text-white text-2xl animate-pulse">Scanning North Pole Data... ❄️</div>;

    // --- Components for the Dashboard Sections ---

    // 1. Top Section: Key Performance Indicators (KPIs)
    const StatsCard = ({ label, value, icon, color, subColor }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl p-6 bg-slate-800/80 backdrop-blur-md border border-white/10 shadow-lg`}
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 text-6xl ${color} grayscale-[0.5]`}>{icon}</div>
            <div className="relative z-10">
                <div className={`text-sm uppercase tracking-widest font-bold ${subColor}`}>{label}</div>
                <div className="text-4xl font-black text-white mt-2 drop-shadow-md">{value}</div>
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1 ${color.replace('text', 'bg')}`}></div>
        </motion.div>
    );

    // 2. Middle Section: System Health & Production
    const SystemCard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Sleigh Fuel */}
            <div className="bg-slate-800/60 rounded-xl p-5 border border-white/5 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-400 text-sm font-bold">SLEIGH FUEL ⛽</span>
                    <span className="text-xl font-mono text-red-400">{system.sleighFuel}%</span>
                </div>
                <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${system.sleighFuel}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-red-600 to-orange-500"
                    />
                </div>
            </div>
            {/* Reindeer Energy */}
            <div className="bg-slate-800/60 rounded-xl p-5 border border-white/5 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-400 text-sm font-bold">REINDEER ENERGY 🦌</span>
                    <span className="text-xl font-mono text-green-400">{system.reindeerEnergy}%</span>
                </div>
                <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${system.reindeerEnergy}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-green-600 to-emerald-400"
                    />
                </div>
            </div>
        </div>
    );

    const ProductionCard = () => (
        <div className="bg-[#1e1b4b]/60 rounded-2xl p-6 border border-indigo-500/20 flex flex-col h-full">
            <h3 className="text-indigo-200 font-bold mb-4 flex items-center gap-2">🏭 TOY PRODUCTION LINE</h3>
            <div className="flex-1 flex items-center justify-between gap-2">
                <div className="text-center">
                    <div className="text-3xl font-bold text-white">{toys.production}%</div>
                    <div className="text-xs text-indigo-400 mt-1">Manufactured</div>
                </div>
                <div className="text-2xl text-gray-600">→</div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-white">{toys.packed}%</div>
                    <div className="text-xs text-blue-400 mt-1">Packed</div>
                </div>
                <div className="text-2xl text-gray-600">→</div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{toys.ready}%</div>
                    <div className="text-xs text-green-600 mt-1">Ready</div>
                </div>
            </div>
        </div>
    );

    // 3. Right Side: Elf Status
    const ElvesList = () => (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-white/10 h-full overflow-auto custom-scrollbar">
            <h3 className="text-yellow-500 font-bold mb-4 flex items-center gap-2">🧝 ACTIVE ELF ROSTER</h3>
            <div className="space-y-4">
                {elves.map(elf => (
                    <div key={elf.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className={`w-3 h-3 rounded-full ${elf.status === 'Working' ? 'bg-green-500 animate-pulse' : 'bg-blue-400'}`}></div>
                        <div>
                            <div className="text-white font-bold">{elf.name}</div>
                            <div className="text-xs text-slate-400">{elf.role}</div>
                        </div>
                        <div className="ml-auto text-xs font-mono opacity-50 border px-2 py-1 rounded bg-black/20">
                            {elf.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 min-h-screen">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: '"Mountains of Christmas", cursive' }}>
                        Mission Control
                    </h1>
                    <p className="text-slate-400">Live Data from North Pole Operations • Weather: <span className="text-blue-300 font-bold">{system.weather}</span></p>
                </div>
                <div className="px-6 py-2 bg-red-900/30 border border-red-500/50 rounded-full text-red-200 animate-pulse text-sm font-bold tracking-wider">
                    LIVE FEED ACTIVE
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="Gifts Prepared"
                    value={dashboardData.giftsPrepared.toLocaleString()}
                    icon="🎁"
                    color="text-pink-500"
                    subColor="text-pink-300"
                />
                <StatsCard
                    label="Successful Drops"
                    value={dashboardData.giftsDelivered.toLocaleString()}
                    icon="🛷"
                    color="text-green-500"
                    subColor="text-green-300"
                />
                <StatsCard
                    label="Global Reach"
                    value={`${dashboardData.countriesCovered} Countries`}
                    icon="🌍"
                    color="text-blue-500"
                    subColor="text-blue-300"
                />
                <StatsCard
                    label="Pending Drops"
                    value={dashboardData.pendingDeliveries.toLocaleString()}
                    icon="⏳"
                    color="text-yellow-500"
                    subColor="text-yellow-300"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">

                {/* Left Column (2/3 width) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Top: System Health & Toys */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                        <SystemCard />
                        <ProductionCard />
                    </div>

                    {/* Bottom: Live Delivery Feed */}
                    <div className="bg-black/30 rounded-2xl p-6 border border-white/10 flex-1 overflow-auto custom-scrollbar min-h-[300px]">
                        <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">🎄 LIVE DELIVERY TRACKER</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {deliveries.map(d => (
                                <div key={d.id} className="bg-slate-800 p-4 rounded-lg flex flex-col justify-between border-b-2 border-slate-600 hover:border-[#D42426] transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-lg text-white">{d.country}</span>
                                        {d.status === 'Delivered' && <span className="text-green-500">✓</span>}
                                        {d.status === 'In Progress' && <span className="text-yellow-500 animate-spin">⟳</span>}
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        {d.giftsDelivered.toLocaleString()} Gifts
                                    </div>
                                    <div className={`mt-2 text-xs uppercase font-bold ${d.status === 'Delivered' ? 'text-green-400' :
                                        d.status === 'In Progress' ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
                                        {d.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (1/3 width) - Elves */}
                <div className="lg:col-span-1 h-full">
                    <ElvesList />
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
