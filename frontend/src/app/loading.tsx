"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f8faf6]">
      {/* Dynamic Background Grid Decoration */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, #064e3b 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }}
      />
      
      <div className="relative flex flex-col items-center">
        {/* Bouncing/Dropping Coin Animation Container */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Shadow below the coin */}
          <div className="absolute bottom-2 w-16 h-2 bg-primary/10 rounded-full blur-md animate-shadow-scale"></div>

          {/* Falling and Bouncing Coin */}
          <div className="animate-coin-drop flex items-center justify-center">
            {/* 3D Spinning Golden-Green Coin */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-secondary-container via-[#fbbf24] to-secondary border-2 border-primary/20 shadow-md flex items-center justify-center animate-coin-spin relative">
              {/* Inner ring */}
              <div className="absolute inset-1.5 rounded-full border border-white/30 flex items-center justify-center bg-gradient-to-br from-white/20 to-transparent">
                {/* Currency Symbol */}
                <span className="font-serif font-black text-2xl text-primary select-none select-none-all">₹</span>
              </div>
              
              {/* Shimmer overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer-fast"></div>
            </div>
          </div>
        </div>

        {/* Loading text with Newsreader font pairing */}
        <h2 className="text-xl md:text-2xl font-serif font-bold text-primary mt-6 tracking-wide animate-pulse">
          Allocating Wealth...
        </h2>
        <p className="text-xs text-on-surface-variant/80 font-medium tracking-wider uppercase mt-2">
          Budget Mitra Price Engine
        </p>
      </div>

      <style jsx global>{`
        @keyframes shadow-scale {
          0%, 100% { transform: scaleX(1); opacity: 0.8; }
          50% { transform: scaleX(0.4); opacity: 0.2; }
        }
        @keyframes coin-drop {
          0% { transform: translateY(-100px) scaleY(1.1); }
          45% { transform: translateY(0px) scaleY(0.9); }
          50% { transform: translateY(0px) scaleY(0.85); }
          55% { transform: translateY(0px) scaleY(0.9); }
          65% { transform: translateY(-35px) scaleY(1.05); }
          78% { transform: translateY(0px) scaleY(0.95); }
          82% { transform: translateY(0px) scaleY(0.9); }
          87% { transform: translateY(-12px) scaleY(1.02); }
          95% { transform: translateY(0px) scaleY(0.98); }
          100% { transform: translateY(0px) scaleY(1); }
        }
        @keyframes coin-spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes shimmer-fast {
          100% { transform: translateX(100%); }
        }
        .animate-shadow-scale {
          animation: shadow-scale 1.8s infinite ease-in-out;
        }
        .animate-coin-drop {
          animation: coin-drop 1.8s infinite ease-in-out;
          transform-origin: bottom center;
        }
        .animate-coin-spin {
          animation: coin-spin 1.2s infinite linear;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        .animate-shimmer-fast {
          animation: shimmer-fast 1.5s infinite ease-out;
        }
      `}</style>
    </div>
  );
}
