import React from 'react';
import { motion } from 'framer-motion';

export function BubblesBackground() {
    const bubbles = [
        { id: 1, x: '10%', y: '20%', size: 300, delay: 0, duration: 15 }, 
        { id: 2, x: '80%', y: '30%', size: 200, delay: 2, duration: 20 },
        { id: 3, x: '60%', y: '70%', size: 250, delay: 4, duration: 18 }, 
        { id: 4, x: '20%', y: '80%', size: 150, delay: 6, duration: 22 },
    ];
    return (
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            {bubbles.map((bubble) => (
                <motion.div
                    key={bubble.id}
                    className="absolute bg-gradient-to-br from-blue-700 to-purple-700 opacity-50 rounded-full filter blur-3xl"
                    style={{ width: bubble.size, height: bubble.size, top: bubble.y, left: bubble.x }}
                    animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
                    transition={{ duration: bubble.duration, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: bubble.delay }}
                />
            ))}
        </div>
    );
}
