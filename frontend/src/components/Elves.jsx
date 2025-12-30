import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useElves, useElfMutations } from '../hooks/useSantaData';

// --- UTILITY COMPONENTS ---

const Badge = ({ children, status }) => {
    const colors = {
        Active: 'bg-green-500/20 text-green-400 border-green-500/30',
        Idle: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        Overloaded: 'bg-red-500/20 text-red-400 border-red-500/30',
        'Off-Duty': 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    return (
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${colors[status] || colors.Idle}`}>
            {children}
        </span>
    );
};

// --- ELF CARD ---

const ElfCard = ({ elf, onClick }) => {
    const fatigueColor = elf.fatigueLevel > 80 ? 'bg-red-500' : elf.fatigueLevel > 50 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <motion.div
            layoutId={`card-${elf._id}`}
            onClick={() => onClick(elf)}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-xl p-5 cursor-pointer hover:border-white/30 transition-all relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-slate-700 border-2 ${elf.status === 'Overloaded' ? 'border-red-500 animate-pulse' : 'border-slate-500'}`}>
                        {elf.role === 'Toy Maker' ? '🔨' : elf.role === 'QA' ? '🔍' : elf.role === 'Logistics' ? '📦' : '🚚'}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{elf.name}</h3>
                        <p className="text-xs text-slate-400">{elf.role}</p>
                    </div>
                </div>
                <Badge status={elf.status}>{elf.status}</Badge>
            </div>

            <div className="space-y-3">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-900/50 p-2 rounded">
                        <div className="text-slate-500 text-[10px] uppercase">Tasks Assigned</div>
                        <div className="font-mono text-white font-bold">{elf.tasksAssigned}</div>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded">
                        <div className="text-slate-500 text-[10px] uppercase">Finished Today</div>
                        <div className="font-mono text-white font-bold">{elf.tasksCompletedToday}</div>
                    </div>
                </div>

                {/* Fatigue Bar */}
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Fatigue</span>
                        <span className={`${elf.fatigueLevel > 80 ? 'text-red-400' : 'text-slate-400'}`}>{elf.fatigueLevel}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${fatigueColor} transition-all duration-500`}
                            style={{ width: `${elf.fatigueLevel}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Location Footer */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-slate-500">
                <span>📍</span> {elf.location}
            </div>
        </motion.div>
    );
};

// --- ELF DRAWER (DETAILS) ---

const ElfDrawer = ({ elf, onClose, mutations }) => {
    if (!elf) return null;

    const handleAction = async (action, payload) => {
        try {
            if (action === 'status') {
                await mutations.updateStatus.mutateAsync({ id: elf._id, status: payload });
            } else if (action === 'reassign') {
                await mutations.reassign.mutateAsync({ id: elf._id, amount: payload });
            } else if (action === 'assign') {
                await mutations.assign.mutateAsync({ id: elf._id, amount: payload });
            }
            onClose(); // Close drawer on success
        } catch (error) {
            // Error is handled by global axios interceptor
            console.error("Action failed:", error);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
                layoutId={`card-${elf._id}`}
                className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-slate-900 border-l border-white/10 z-50 p-8 overflow-y-auto shadow-2xl"
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white">✕ ESC</button>

                <div className="mt-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-4xl border-2 border-white/10">
                            🧝
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">{elf.name}</h2>
                            <div className="flex gap-2">
                                <Badge status={elf.status}>{elf.status}</Badge>
                                <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">{elf.role}</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
                            <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Efficiency</div>
                            <div className="text-2xl font-bold text-white">{(100 - elf.errorRate).toFixed(1)}%</div>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
                            <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Tasks Pending</div>
                            <div className="text-2xl font-bold text-white">{elf.tasksAssigned}</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Management Actions</h3>
                    <div className="space-y-3">
                        {elf.status !== 'Off-Duty' && (
                            <button
                                onClick={() => handleAction('status', 'Off-Duty')}
                                className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl text-left flex items-center justify-between group transition-all"
                            >
                                <div>
                                    <div className="font-bold text-white">Force Rest</div>
                                    <div className="text-xs text-slate-400">Set status to Off-Duty and clear fatigue</div>
                                </div>
                                <span className="text-xl group-hover:scale-110 transition-transform">🛌</span>
                            </button>
                        )}

                        {elf.tasksAssigned > 0 && (
                            <button
                                onClick={() => handleAction('reassign', 1)}
                                className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl text-left flex items-center justify-between group transition-all"
                            >
                                <div>
                                    <div className="font-bold text-white">Reassign Task</div>
                                    <div className="text-xs text-slate-400">Move 1 task to general queue</div>
                                </div>
                                <span className="text-xl group-hover:scale-110 transition-transform">📤</span>
                            </button>
                        )}

                        {elf.status !== 'Off-Duty' && (
                            <button
                                onClick={() => handleAction('assign', 1)}
                                className="w-full p-4 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 rounded-xl text-left flex items-center justify-between group transition-all"
                            >
                                <div>
                                    <div className="font-bold text-blue-200">Assign New Task</div>
                                    <div className="text-xs text-blue-400">Add 1 task (Increases Fatigue)</div>
                                </div>
                                <span className="text-xl group-hover:scale-110 transition-transform">📥</span>
                            </button>
                        )}

                        {elf.status === 'Overloaded' && (
                            <button
                                onClick={() => handleAction('status', 'Active')}
                                className="w-full p-4 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 rounded-xl text-left flex items-center justify-between group transition-all"
                            >
                                <div>
                                    <div className="font-bold text-red-200">Reset Status</div>
                                    <div className="text-xs text-red-400">Force override Overloaded status</div>
                                </div>
                                <span className="text-xl group-hover:scale-110 transition-transform">⚠️</span>
                            </button>
                        )}

                        {elf.status === 'Off-Duty' && (
                            <button
                                onClick={() => handleAction('status', 'Idle')}
                                className="w-full p-4 bg-green-900/30 hover:bg-green-900/50 border border-green-500/30 rounded-xl text-left flex items-center justify-between group transition-all"
                            >
                                <div>
                                    <div className="font-bold text-green-200">Return to Duty</div>
                                    <div className="text-xs text-green-400">Set status to Idle</div>
                                </div>
                                <span className="text-xl group-hover:scale-110 transition-transform">✅</span>
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
};

// --- MAIN PAGE ---

const Elves = () => {
    const [filters, setFilters] = useState({
        role: '',
        status: '',
        fatigueAbove: '',
        overloadedOnly: false
    });
    const [selectedElf, setSelectedElf] = useState(null);

    const { data: elves = [], isLoading } = useElves(filters);
    const mutations = useElfMutations();

    // Derived Metrics
    const metrics = useMemo(() => {
        if (!elves.length) return { active: 0, overloaded: 0, avgFatigue: 0 };
        const active = elves.filter(e => e.status === 'Active' || e.status === 'Working').length; // Handle legacy 'Working' if exists
        const overloaded = elves.filter(e => e.status === 'Overloaded').length;
        const avgFatigue = Math.round(elves.reduce((acc, curr) => acc + curr.fatigueLevel, 0) / elves.length);
        return { active, overloaded, avgFatigue };
    }, [elves]);

    const handleAutoBalance = () => {
        mutations.autoBalance.mutate();
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: '"Mountains of Christmas", cursive' }}>
                        🧝 Elf Roster
                    </h1>
                    <p className="text-slate-400">Manage workforce assignments and health</p>
                </div>

                <div className="flex gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-2xl font-bold text-white">{metrics.active}</div>
                        <div className="text-xs text-green-400 uppercase">Active</div>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-2xl font-bold text-white">{metrics.overloaded}</div>
                        <div className="text-xs text-red-400 uppercase">Overloaded</div>
                    </div>
                    <button
                        onClick={handleAutoBalance}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all text-sm h-fit self-center"
                    >
                        Auto-Balance Teams ⚖️
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 mb-8 flex flex-wrap gap-4 items-center">
                <select
                    className="bg-slate-800 border border-white/10 text-white px-3 py-2 rounded focus:outline-none focus:border-indigo-500"
                    value={filters.role}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                >
                    <option value="">All Roles</option>
                    <option value="Toy Maker">Toy Maker</option>
                    <option value="QA">QA</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Delivery Support">Delivery Support</option>
                </select>

                <select
                    className="bg-slate-800 border border-white/10 text-white px-3 py-2 rounded focus:outline-none focus:border-indigo-500"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Idle">Idle</option>
                    <option value="Overloaded">Overloaded</option>
                    <option value="Off-Duty">Off-Duty</option>
                </select>

                <label className="flex items-center gap-2 text-white cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={filters.overloadedOnly}
                        onChange={(e) => setFilters(prev => ({ ...prev, overloadedOnly: e.target.checked }))}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-600 focus:ring-red-500 text-red-500"
                    />
                    <span className="text-sm">Overloaded Only</span>
                </label>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="text-center py-20 text-slate-500 animate-pulse">Scanning tags...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {elves.map(elf => (
                            <ElfCard key={elf._id || elf.id} elf={elf} onClick={setSelectedElf} />
                        ))}
                    </AnimatePresence>
                    {elves.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed border-white/5 rounded-xl">
                            No elves found matching filters.
                        </div>
                    )}
                </div>
            )}

            {/* Drawer */}
            <AnimatePresence>
                {selectedElf && (
                    <ElfDrawer
                        elf={selectedElf}
                        onClose={() => setSelectedElf(null)}
                        mutations={mutations}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Elves;
