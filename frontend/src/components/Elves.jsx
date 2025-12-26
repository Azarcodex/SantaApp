import React from 'react';
import { useElves } from '../hooks/useSantaData';

const Elves = () => {
    const { data: elves, isLoading, error } = useElves();

    if (isLoading) return <div className="p-8 text-white">Checking on the elves...</div>;
    if (error) return <div className="p-8 text-red-500">Elves are hiding!</div>;

    return (
        <div className="p-8 text-white">
            <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: '"Mountains of Christmas", cursive' }}>Elf Roster</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {elves.map((elf) => (
                    <div key={elf.id} className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center gap-4">
                        <div className="text-4xl bg-slate-700 p-3 rounded-full">🧝</div>
                        <div>
                            <h2 className="text-xl font-bold text-[#FFD700]">{elf.name}</h2>
                            <p className="text-sm text-slate-400">{elf.role}</p>
                            <p className={`text-xs mt-1 uppercase tracking-wider font-semibold 
                                ${elf.status === 'Working' ? 'text-green-400' : 'text-blue-400'}`}>
                                {elf.status}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Elves;
