import React, { useEffect, useRef } from 'react';

const Snowfall = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const particles = [];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                density: Math.random() * particleCount,
                speed: Math.random() * 1 + 0.5,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.beginPath();
            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
            }
            ctx.fill();
            update();
        };

        const update = () => {
            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];
                p.y += p.speed;
                p.x += Math.sin(p.y / 30) * 0.5;

                if (p.y > canvas.height) {
                    particles[i] = {
                        x: Math.random() * canvas.width,
                        y: -10,
                        radius: p.radius,
                        density: p.density,
                        speed: p.speed,
                    };
                }
            }
        };

        const render = () => {
            draw();
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.4 }}
        />
    );
};

export default Snowfall;
