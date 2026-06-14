"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProductAnalyzerIllustrationProps {
  className?: string;
}

export const ProductAnalyzerIllustration: React.FC<ProductAnalyzerIllustrationProps> = ({ 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[400px] flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="absolute inset-0 w-full h-full opacity-40"
      />

      {/* Central Product Box */}
      <motion.div
        className="relative z-10"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative w-48 h-48">
          {/* Main Product Box */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 backdrop-blur-xl border border-emerald-300/30 shadow-2xl"
            style={{
              boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)',
            }}
            animate={{
              rotateY: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Shopping Bag Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-20 h-20 text-emerald-600/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>

            {/* Glass Reflection */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent" />
          </motion.div>

          {/* Checkmark Badge */}
          <motion.div
            className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg border-2 border-white/50"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Orbiting Price Tags */}
      {[0, 120, 240].map((angle, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            rotate: [angle, angle + 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.div
            className="relative"
            style={{
              width: '200px',
              height: '200px',
              marginLeft: '-100px',
              marginTop: '-100px',
            }}
          >
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100/80 to-amber-200/60 backdrop-blur-md border border-amber-300/40 shadow-lg flex items-center justify-center"
              animate={{
                rotate: [0, -360],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="text-center">
                <div className="text-xs font-bold text-emerald-700">₹</div>
                <div className="text-[10px] text-emerald-600/80 font-semibold">
                  {index === 0 ? '999' : index === 1 ? '1299' : '849'}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}

      {/* Marketplace Cards - Background */}
      <motion.div
        className="absolute left-8 top-1/4 w-24 h-32 rounded-xl bg-gradient-to-br from-amber-50/60 to-white/40 backdrop-blur-md border border-emerald-200/30 shadow-lg"
        animate={{
          x: [0, -10, 0],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="p-3 space-y-2">
          <div className="w-full h-2 bg-emerald-300/40 rounded" />
          <div className="w-3/4 h-2 bg-emerald-300/30 rounded" />
          <div className="w-full h-8 bg-emerald-400/20 rounded mt-3" />
        </div>
      </motion.div>

      <motion.div
        className="absolute right-8 top-1/3 w-24 h-32 rounded-xl bg-gradient-to-br from-emerald-50/60 to-white/40 backdrop-blur-md border border-emerald-200/30 shadow-lg"
        animate={{
          x: [0, 10, 0],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <div className="p-3 space-y-2">
          <div className="w-full h-2 bg-emerald-300/40 rounded" />
          <div className="w-2/3 h-2 bg-emerald-300/30 rounded" />
          <div className="w-full h-8 bg-emerald-400/20 rounded mt-3" />
        </div>
      </motion.div>

      {/* Mini Chart */}
      <motion.div
        className="absolute bottom-12 left-1/4 w-32 h-20 rounded-xl bg-gradient-to-br from-white/70 to-emerald-50/50 backdrop-blur-md border border-emerald-300/30 shadow-lg p-3 hidden sm:block"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 50">
          <motion.path
            d="M 5 40 Q 20 30, 35 35 T 65 25 T 95 15"
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Magnifying Glass */}
      <motion.div
        className="absolute bottom-16 right-1/4 w-16 h-16 hidden sm:block"
        animate={{
          rotate: [0, 15, 0, -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-emerald-100/40 backdrop-blur-md border-2 border-emerald-300/40 shadow-lg" />
          <svg
            className="absolute inset-0 w-full h-full p-3 text-emerald-600/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </motion.div>

      {/* Floating Glow Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-20 h-20 rounded-full bg-emerald-400/10 blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-amber-300/10 blur-2xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
};
