import React from 'react';
import { useSystemHealth } from '../hooks/useSantaData';

const SystemHealth = () => {
    const { data: system, isLoading, error } = useSystemHealth();

    if (isLoading) return <div className="p-8 text-white">Scanning sleigh...</div>;
    if (error) return <div className="p-8 text-red-500">System offline!</div>;

    return (
        <div className="p-8 text-white">
            <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: '"Mountains of Christmas", cursive' }}>Sleigh Status</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {/* Fuel Gauge */}
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-600">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        ⛽ Magic Fuel
                    </h2>
                    <div className="w-full h-8 bg-slate-700 rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-linear-to-r from-red-500 to-yellow-500 transition-all duration-1000"
                            style={{ width: `${system.sleighFuel}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center font-bold text-shadow">
                            {system.sleighFuel}%
                        </span>
                    </div>
                </div>

                {/* Reindeer Energy */}
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-600">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        🦌 Reindeer Energy
                    </h2>
                    <div className="w-full h-8 bg-slate-700 rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-linear-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                            style={{ width: `${system.reindeerEnergy}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center font-bold text-shadow">
                            {system.reindeerEnergy}%
                        </span>
                    </div>
                </div>

                {/* Weather Report */}
                <div className="md:col-span-2 bg-blue-900/30 p-8 rounded-xl border border-blue-500/30 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-200">North Pole Weather</h2>
                        <div className="text-4xl font-bold mt-2 text-white">{system.weather}</div>
                    </div>
                    <div className="text-6xl">🌨️</div>
                </div>
            </div>
        </div>
    );
};

export default SystemHealth;
