"use client";

import React, { useEffect, useState } from 'react';
import { Tag, TrendingDown } from 'lucide-react';

interface LoadingAnimationProps {
  className?: string;
  text?: string;
}

export const BudgetMitraLoader: React.FC<LoadingAnimationProps> = ({ 
  className = '',
  text = 'Loading Budget Mitra...'
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 ${className}`}>
      <div className="flex flex-col items-center gap-8">
        {/* Coin Container */}
        <div className="relative">
          {/* Soft shadow beneath */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 bg-emerald-900/10 rounded-full blur-md" />
          
          {/* Flipping Coin */}
          <div className="relative w-24 h-24" style={{ perspective: '1000px' }}>
            <div
              className={`relative w-full h-full transition-transform duration-700 ease-in-out`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front Side - Price Tag / Deal Symbol */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-lg flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl" />
                  <Tag className="w-12 h-12 text-[#FFFEF9] relative z-10" strokeWidth={1.5} />
                </div>
              </div>

              {/* Back Side - Savings / Smart Buy Symbol */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg flex items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-300/20 rounded-full blur-xl" />
                  <TrendingDown className="w-12 h-12 text-[#FFFEF9] relative z-10" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl animate-pulse" />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-emerald-900 text-lg font-bold font-display tracking-wide">
            {text}
          </p>
          
          {/* Animated dots */}
          <div className="flex justify-center gap-1 mt-3">
            <span
              className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
              style={{ animationDelay: '0ms', animationDuration: '1s' }}
            />
            <span
              className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
              style={{ animationDelay: '150ms', animationDuration: '1s' }}
            />
            <span
              className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
              style={{ animationDelay: '300ms', animationDuration: '1s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
