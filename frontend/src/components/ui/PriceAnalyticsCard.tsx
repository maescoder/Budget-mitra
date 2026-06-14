"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { TrendingDown, DollarSign, ShoppingCart } from "lucide-react";

interface PriceAnalyticsCardProps {
  className?: string;
}

export const PriceAnalyticsCard: React.FC<PriceAnalyticsCardProps> = ({ className = "" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const rotateX = useTransform(mouseY, [0, 500], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 500], [-5, 5]);

  const springConfig = { stiffness: 200, damping: 25 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const glowX = useTransform(mouseX, [0, 500], [0, 100]);
  const glowY = useTransform(mouseY, [0, 500], [0, 100]);
  const glowOpacity = useTransform(mouseX, [0, 500], [0, 0.3]);

  const pricePoints = [
    { x: 10, y: 60, price: 899 },
    { x: 25, y: 55, price: 849 },
    { x: 40, y: 45, price: 799 },
    { x: 55, y: 30, price: 699, isBest: true },
    { x: 70, y: 40, price: 749 },
    { x: 85, y: 50, price: 799 },
  ];

  const pathData = pricePoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full aspect-square max-w-[500px] ${className}`}
    >
      <div
        style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
        className="relative h-full w-full rounded-3xl border border-emerald-200/40 bg-gradient-to-br from-stone-50 via-emerald-50/30 to-stone-100 shadow-2xl backdrop-blur-xl overflow-hidden"
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0"
          style={{
            opacity: glowOpacity,
            background: `radial-gradient(120px at ${glowX}% ${glowY}%, rgba(16, 185, 129, 0.3), transparent 60%)`,
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98112_1px,transparent_1px),linear-gradient(to_bottom,#10b98112_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]" />

        <div className="relative z-10 flex h-full flex-col p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium text-emerald-800/70 tracking-wider uppercase mb-1">
                Live Price Analytics
              </h3>
              <div className="flex items-center gap-2 text-emerald-900">
                <TrendingDown className="h-5 w-5" />
                <span className="text-xs font-semibold">DEAL SIGNALS</span>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
            />
          </div>

          <div className="relative flex-1 mt-8">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{ transform: "translateZ(30px)" }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#065f46" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#6ee7b7" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <motion.path
                d={pathData}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="0.8"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
              />

              {pricePoints.map((point, index) => (
                <motion.g key={index}>
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={point.isBest ? 2.5 : 1.2}
                    fill={point.isBest ? "#fbbf24" : "#10b981"}
                    animate={{
                      scale: point.isBest ? [1, 1.3, 1] : [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                  {point.isBest && (
                    <motion.circle
                      cx={point.x}
                      cy={point.y}
                      r={4}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="0.5"
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.8, 0, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.g>
              ))}
            </svg>

            <motion.div
              style={{ transform: "translateZ(40px)" }}
              animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[15%] right-[10%] rounded-xl bg-white/90 backdrop-blur-sm border border-emerald-200/50 shadow-lg p-3 w-32"
            >
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="h-3 w-3 text-emerald-600" />
                <span className="text-[10px] font-semibold text-emerald-900">Amazon</span>
              </div>
              <div className="text-lg font-bold text-emerald-700">₹14,999</div>
              <div className="text-[9px] text-emerald-600">Best Price</div>
            </motion.div>

            <motion.div
              style={{ transform: "translateZ(35px)" }}
              animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[40%] left-[5%] rounded-xl bg-white/80 backdrop-blur-sm border border-stone-200/50 shadow-md p-2.5 w-28"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="h-3 w-3 text-stone-600" />
                <span className="text-[9px] font-semibold text-stone-700">Flipkart</span>
              </div>
              <div className="text-base font-bold text-stone-700">₹15,999</div>
            </motion.div>

            <motion.div
              style={{ transform: "translateZ(35px)" }}
              animate={{ y: [0, -6, 0], x: [0, 3, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[25%] right-[15%] rounded-xl bg-white/80 backdrop-blur-sm border border-stone-200/50 shadow-md p-2.5 w-28"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="h-3 w-3 text-stone-600" />
                <span className="text-[9px] font-semibold text-stone-700">Myntra</span>
              </div>
              <div className="text-base font-bold text-stone-700">₹15,499</div>
            </motion.div>

            <motion.div
              style={{ transform: "translateZ(50px)" }}
              className="absolute top-[25%] left-[50%] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 px-4 py-2 shadow-xl shadow-amber-500/30"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 20px 25px -5px rgba(251, 191, 36, 0.3)",
                  "0 20px 25px -5px rgba(251, 191, 36, 0.5)",
                  "0 20px 25px -5px rgba(251, 191, 36, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-[10px] font-bold text-amber-950 text-center whitespace-nowrap">
                BEST TIME TO BUY
              </div>
            </motion.div>
          </div>

          <div className="flex justify-between items-center mt-auto pt-6 border-t border-emerald-200/30">
            <div>
              <div className="text-xs text-emerald-700/70 font-medium">Tracked Listings</div>
              <div className="text-2xl font-bold text-emerald-900">1,247</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-700/70 font-medium">Best Buy Signal</div>
              <div className="text-2xl font-bold text-amber-600">Active</div>
            </div>
          </div>
        </div>

        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 rounded-full bg-emerald-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
            }}
            animate={{
              y: [-10, -500],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
