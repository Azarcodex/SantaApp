import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Helper to check active state
    const isActive = (path) => {
        // Simple check: precise match or starts with path (if nested)
        if (path === '/admin') return currentPath === '/admin' || currentPath === '/admin/dashboard';
        return currentPath.includes(path);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden bg-[#0d1021] text-white selection:bg-[#D42426] selection:text-white">

            {/* --- Festive Fonts --- */}
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap');`}
            </style>

            {/* --- Mobile Header --- */}
            <div className="md:hidden flex items-center justify-between p-4 bg-[#1a472a] shadow-md z-30 relative">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🎅</span>
                    <span className="text-xl font-bold text-[#FFD700]" style={{ fontFamily: '"Mountains of Christmas", cursive' }}>Santa Admin</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <span className="text-2xl">☰</span>
                </button>
            </div>

            {/* --- Mobile Overlay --- */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* --- Sidebar (The Elf Control Panel) --- */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 flex flex-col 
                transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0
                shadow-[10px_0_30px_rgba(0,0,0,0.5)]
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>

                {/* Background of Sidebar with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a472a] to-[#0f2b1d] border-r-4 border-[#D42426]"></div>

                {/* Candy Cane Stripe Detail on the border */}
                <div className="absolute top-0 bottom-0 right-0 w-1 h-full z-30"
                    style={{
                        background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 10px, #D42426 10px, #D42426 20px)'
                    }}
                />

                <div className="relative z-10 p-6 flex flex-col h-full">

                    {/* Mobile Close Button */}
                    <div className="md:hidden flex justify-end mb-2">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-white/60 hover:text-white"
                        >
                            ✕ Close
                        </button>
                    </div>

                    {/* Header with "Snow" on top */}
                    <div className="mb-10 relative hidden md:block">
                        <div className="absolute -top-4 -left-2 text-2xl animate-bounce">🎅</div>
                        <h2 className="text-4xl font-bold text-[#FFD700] drop-shadow-md" style={{ fontFamily: '"Mountains of Christmas", cursive' }}>
                            Santa Admin
                        </h2>
                        <div className="text-xs text-green-200 tracking-widest uppercase opacity-80 mt-1">North Pole System v25.12</div>

                        {/* Decorative divider */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mt-4 opacity-50"></div>
                    </div>

                    {/* Mobile Header Version (Simplified) */}
                    <div className="mb-6 relative md:hidden">
                        <h2 className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: '"Mountains of Christmas", cursive' }}>
                            Menu
                        </h2>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2 flex-1">
                        <NavItem to="dashboard" icon="🎄" label="Dashboard" active={isActive('dashboard')} onClick={() => setMobileMenuOpen(false)} />
                        <NavItem to="map" icon="🗺️" label="Delivery Map" active={isActive('map')} onClick={() => setMobileMenuOpen(false)} />
                        <NavItem to="elves" icon="🧝" label="Elf Roster" active={isActive('elves')} onClick={() => setMobileMenuOpen(false)} />
                        <NavItem to="toys" icon="🧸" label="Toy Inventory" active={isActive('toys')} onClick={() => setMobileMenuOpen(false)} />
                        <NavItem to="health" icon="⚙️" label="Sleigh Health" active={isActive('health')} onClick={() => setMobileMenuOpen(false)} />
                    </nav>

                    {/* Footer / Exit */}
                    <div className="mt-auto pt-6 border-t border-white/10">
                        <Link to="/" className="group flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-red-900/50 text-red-300 hover:text-white border border-transparent hover:border-red-500/30">
                            <span className="text-xl group-hover:-translate-x-1 transition-transform">🚪</span>
                            <span className="font-medium">Exit System</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* --- Main Content (The Night Sky) --- */}
            <main className="flex-1 relative h-[calc(100vh-64px)] md:h-screen overflow-auto">
                {/* Background Styling */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#2b3266_0%,_#0d1021_100%)] z-0"></div>

                {/* Subtle Snow Background Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none z-0"
                    style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
                </div>

                {/* Content Wrapper */}
                <div className="relative z-10 p-4 md:p-8">
                    {/* A glowing header bar for the current page context could go here */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// --- Sub-Component: Navigation Item ---
const NavItem = ({ to, icon, label, active, onClick }) => {
    return (
        <Link to={to} onClick={onClick} className="group relative overflow-hidden rounded-xl transition-all duration-300">
            {/* Active Background State (Gold/Green Glow) */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-20'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 to-transparent"></div>
            </div>

            {/* Link Content */}
            <div className={`relative flex items-center gap-4 p-3 ${active ? 'text-[#FFD700]' : 'text-gray-300 group-hover:text-white'}`}>
                {/* Icon Wrapper */}
                <span className={`text-xl transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]' : 'group-hover:rotate-12'}`}>
                    {icon}
                </span>

                {/* Label */}
                <span className={`font-medium tracking-wide ${active ? 'font-bold' : ''}`}>
                    {label}
                </span>

                {/* Active Indicator (Cookie) */}
                {active && (
                    <span className="absolute right-3 text-sm animate-pulse">🍪</span>
                )}
            </div>

            {/* Active Left Border Indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[#FFD700] shadow-[0_0_10px_#FFD700] transition-transform duration-300 ${active ? 'scale-y-100' : 'scale-y-0'}`}></div>
        </Link>
    );
};

export default Layout;