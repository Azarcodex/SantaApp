import React from 'react';
import { motion } from 'framer-motion';
import { useSystemHealth } from '../hooks/useSantaData';
import Snowfall from './Snowfall';

const StatusBadge = ({ status }) => {
    const getConfig = (s) => {
        const lower = s.toLowerCase();
        if (lower.includes('good') || lower.includes('clear') || lower.includes('stable') || lower.includes('optimal')) {
            return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', pulse: 'bg-emerald-500' };
        }
        if (lower.includes('warning') || lower.includes('low') || lower.includes('moderate') || lower.includes('snowing')) {
            return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', pulse: 'bg-amber-500' };
        }
        return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', pulse: 'bg-rose-500' };
    };

    const config = getConfig(status);

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${config.bg} ${config.border} ${config.color} text-[10px] font-bold uppercase tracking-wider`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${config.pulse}`}></span>
            {status}
        </div>
    );
};

const HealthCard = ({ title, value, unit, icon, status, children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.1, duration: 0.8 }}
        className="relative group h-full"
    >
        <div className="absolute inset-0 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors rounded-4xl"></div>
        <div className="relative h-full bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-4xl p-8 flex flex-col overflow-hidden shadow-2xl">
            {/* HUD Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <div className="text-4xl bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">{title}</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">{value}</span>
                            <span className="text-slate-500 font-bold text-lg">{unit}</span>
                        </div>
                    </div>
                </div>
                <StatusBadge status={status} />
            </div>

            <div className="relative z-10 flex-1">
                {children}
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/5 rounded-tr-4xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white/5 rounded-bl-4xl pointer-events-none"></div>
        </div>
    </motion.div>
);

const SystemHealth = () => {
    const { data: system, isLoading, error } = useSystemHealth();

    if (isLoading) return (
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
            <div className="relative">
                <div className="w-24 h-24 border-2 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                <div className="mt-8 text-center text-blue-400 font-mono text-sm tracking-widest animate-pulse">BOOTING SLEIGH_OS...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-[calc(100vh-100px)] px-4">
            <div className="bg-rose-950/20 border border-rose-500/30 p-12 rounded-[3rem] text-center backdrop-blur-2xl max-w-md">
                <div className="text-7xl mb-6">📉</div>
                <h2 className="text-3xl font-black text-white mb-4">Telemetry Lost</h2>
                <p className="text-rose-300/60 leading-relaxed mb-8">Critical failure in the North Pole uplink. Reindeer-Sleigh synchronization offline.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                >
                    RETRIANGULATE SIGNAL
                </button>
            </div>
        </div>
    );

    // Dynamic thresholds for statuses
    const fuelStatus = system.sleighFuel > 30 ? 'Stable' : 'Low Fuel';
    const energyStatus = system.reindeerEnergy > 40 ? 'Optimal' : 'Fatigue Warning';
    const weatherStatus = system.weather.toLowerCase().includes('snow') ? 'Heavy Snow' : 'Clear Skies';

    return (
        <div className="relative min-h-[calc(100vh-100px)] p-6 md:p-12 overflow-hidden">
            <Snowfall />

            {/* Frosty Border Effect */}
            <div className="fixed inset-0 pointer-events-none border-30 border-white/5 blur-3xl z-0"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="mb-16">
                    <div className="flex items-center gap-3 text-blue-400 mb-4">
                        <span className="font-mono text-sm tracking-widest">NORTH_POLE.SYS // SLEIGH_VITALS</span>
                        <div className="h-px flex-1 bg-linear-to-r from-blue-500/50 to-transparent"></div>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-white" style={{ fontFamily: '"Mountains of Christmas", cursive' }}>
                        Sleigh <span className="text-blue-500">Diagnostics</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Sleigh Fuel Card */}
                    <HealthCard
                        title="Quantum Cocoa Fuel"
                        value={system.sleighFuel}
                        unit="%"
                        icon="🔋"
                        status={fuelStatus}
                        delay={1}
                    >
                        <div className="space-y-6">
                            <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${system.sleighFuel}%` }}
                                    className={`h-full bg-linear-to-r ${system.sleighFuel > 30 ? 'from-blue-600 to-cyan-400 shadow-[0_0_20px_#2563eb]' : 'from-rose-600 to-rose-400 shadow-[0_0_20px_#e11d48]'}`}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Consumption</div>
                                    <div className="text-white font-mono">2.4m/sec</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Propulsion</div>
                                    <div className="text-white font-mono">Active</div>
                                </div>
                            </div>
                        </div>
                    </HealthCard>

                    {/* Reindeer Energy Card */}
                    <HealthCard
                        title="Reindeer Biometrics"
                        value={system.reindeerEnergy}
                        unit="%"
                        icon="🦌"
                        status={energyStatus}
                        delay={2}
                    >
                        <div className="flex flex-col h-full justify-between gap-6">
                            <div className="grid grid-cols-3 gap-2">
                                {[...Array(9)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + (i * 0.05) }}
                                        className="h-12 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center relative group/deer"
                                    >
                                        <div className="text-xs font-mono text-slate-500">R-{i + 1}</div>
                                        <div
                                            className={`absolute bottom-0 left-0 h-1 bg-emerald-500/50 rounded-full transition-all duration-1000`}
                                            style={{ width: `${system.reindeerEnergy - (i * 2)}%` }}
                                        ></div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                                <span>Collective Stamina</span>
                                <span>{system.reindeerEnergy}%</span>
                            </div>
                        </div>
                    </HealthCard>

                    {/* Weather Card */}
                    <HealthCard
                        title="Meteorological Uplink"
                        value={system.weather.split(' ')[0]}
                        unit=""
                        icon="🛡️"
                        status={weatherStatus}
                        delay={3}
                    >
                        <div className="bg-blue-600/10 rounded-3xl p-6 border border-blue-500/20 relative overflow-hidden group/weather">
                            <motion.div
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute -right-8 -top-8 text-8xl grayscale opacity-20"
                            >
                                ❄️
                            </motion.div>
                            <div className="relative z-10">
                                <div className="text-5xl font-black text-white mb-2">{system.weather}</div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">Visibility</span>
                                        <span className="text-white font-mono">14.2 km</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">Wind Speed</span>
                                        <span className="text-white font-mono">42 knots</span>
                                    </div>
                                    <div className="h-px bg-white/5 my-2"></div>
                                    <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Anti-Freeze Activated</div>
                                </div>
                            </div>
                        </div>
                    </HealthCard>
                </div>

                {/* Bottom Control Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-4xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sleigh Systems Linked</span>
                        </div>
                        <div className="h-8 w-px bg-white/5 hidden md:block"></div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Security Protocol</span>
                            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded text-[10px] font-bold">AES-256 NORTH</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Payload Weight</div>
                            <div className="text-white font-mono font-bold">142,500 Tons</div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-xl cursor-not-allowed grayscale bg-[url('https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=100&auto=format&fit=crop')] bg-cover">
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SystemHealth;
