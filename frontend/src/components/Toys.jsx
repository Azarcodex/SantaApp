import React from 'react';
import { useToys } from '../hooks/useSantaData';

const Toys = () => {
    const { data: toys, isLoading, error } = useToys();

    if (isLoading) return <div className="p-8 text-white">Counting toys...</div>;
    if (error) return <div className="p-8 text-red-500">Toy machine broken!</div>;

    return (
        <div className="p-8 text-white">
            <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: '"Mountains of Christmas", cursive' }}>Toy Production</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-purple-900/40 p-8 rounded-2xl border-2 border-purple-500/50 text-center">
                    <div className="text-5xl mb-4">🏭</div>
                    <div className="text-6xl font-bold text-white mb-2">{toys.production}%</div>
                    <div className="text-purple-300 uppercase tracking-widest text-sm">Manufacturing</div>
                </div>
                <div className="bg-blue-900/40 p-8 rounded-2xl border-2 border-blue-500/50 text-center">
                    <div className="text-5xl mb-4">🎁</div>
                    <div className="text-6xl font-bold text-white mb-2">{toys.packed}%</div>
                    <div className="text-blue-300 uppercase tracking-widest text-sm">Packed</div>
                </div>
                <div className="bg-green-900/40 p-8 rounded-2xl border-2 border-green-500/50 text-center">
                    <div className="text-5xl mb-4">🛷</div>
                    <div className="text-6xl font-bold text-white mb-2">{toys.ready}%</div>
                    <div className="text-green-300 uppercase tracking-widest text-sm">Ready to Fly</div>
                </div>
            </div>
        </div>
    );
};

export default Toys;
