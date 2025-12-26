import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- Sub-Components ---

const Snowflake = ({ delay, duration, left, size }) => (
    <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{
            y: "110vh",
            opacity: [1, 0.8, 0.2],
            rotate: 360
        }}
        transition={{
            duration: duration,
            repeat: Infinity,
            delay: delay,
            ease: "linear"
        }}
        className="absolute text-white pointer-events-none z-0"
        style={{ left: left, fontSize: size }}
    >
        ❄
    </motion.div>
);

const FlyingSanta = () => (
    <motion.div
        initial={{ x: "-20vw", y: "10vh", rotate: -5 }}
        animate={{
            x: "120vw",
            y: ["10vh", "5vh", "10vh"], // Bobbing up and down
            rotate: [-5, 0, 5, 0, -5]
        }}
        transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
        }}
        className="absolute top-20 text-6xl opacity-80 z-10 filter drop-shadow-lg grayscale-0"
    >
        🦌🦌🛷🎅
    </motion.div>
);

const SantaButton = ({ onClick }) => (
    <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95, y: 10 }}
        onClick={onClick}
        className="relative group overflow-hidden bg-[#D42426] text-white font-bold text-4xl py-6 px-20 rounded-full border-none cursor-pointer outline-none"
        style={{
            boxShadow: '0 10px 0 #8B0000, 0 10px 20px rgba(0,0,0,0.5), 0 0 20px #D42426',
            fontFamily: '"Mountains of Christmas", cursive'
        }}
    >
        {/* The White Fur Trim */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-white/90 blur-[2px] rounded-t-full" />

        {/* The Black Belt */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4 bg-gray-900 z-0" />

        {/* The Text */}
        <span className="relative z-10 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
            ENTER
        </span>
    </motion.button>
);

const SantaHat = () => (
    <motion.div
        animate={{ rotate: [-20, -10, -20], y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -left-10 text-6xl transform -rotate-12 z-20"
    >
        🎅
    </motion.div>
);

// --- Main Component ---

const Home = () => {
    const navigate = useNavigate();
    const [snowflakes, setSnowflakes] = useState([]);

    // Generate snowflakes on mount
    useEffect(() => {
        const flakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}vw`,
            size: `${Math.random() * 20 + 10}px`,
            delay: Math.random() * 5,
            duration: Math.random() * 5 + 5
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[radial-gradient(circle_at_bottom,_#2b3266_0%,_#0d1021_100%)]">

            {/* Inject Font */}
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap');`}
            </style>

            {/* Background Elements */}
            {snowflakes.map(flake => (
                <Snowflake key={flake.id} {...flake} />
            ))}
            <FlyingSanta />

            {/* Decorative Corners (Candy Cane borders) */}
            <div className="absolute top-5 left-5 w-32 h-32 border-t-[10px] border-l-[10px] border-t-[#D42426] border-l-white rounded-tl-3xl opacity-60 z-20" />
            <div className="absolute bottom-5 right-5 w-32 h-32 border-b-[10px] border-r-[10px] border-b-white border-r-[#D42426] rounded-br-3xl opacity-60 z-20" />

            {/* Main Content */}
            <div className="relative z-30 h-full flex flex-col items-center justify-center text-center p-4">

                {/* Title Section */}
                <div className="relative mb-8">
                    <SantaHat />
                    <motion.h1
                        animate={{
                            textShadow: [
                                "0 0 10px #D42426, 0 0 20px #FFD700",
                                "0 0 30px #D42426, 0 0 60px #FFD700"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="text-6xl md:text-8xl text-white m-0 relative"
                        style={{ fontFamily: '"Mountains of Christmas", cursive' }}
                    >
                        Santa Control Center
                    </motion.h1>
                </div>

                {/* Subtitle */}
                <div
                    className="text-2xl md:text-3xl text-[#FFD700] tracking-widest mb-16 px-8 py-3 bg-black/30 rounded-xl border-y-2 border-dashed border-white/30 backdrop-blur-sm"
                    style={{ fontFamily: '"Mountains of Christmas", cursive' }}
                >
                    Managing Christmas all over the world
                </div>

                {/* Action Button */}
                <SantaButton onClick={() => navigate('/admin/dashboard')} />

            </div>
        </div>
    );
};

export default Home;