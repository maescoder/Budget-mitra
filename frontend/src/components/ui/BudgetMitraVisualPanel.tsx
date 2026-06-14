"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingDown, TrendingUp, Zap, ShoppingCart, DollarSign } from "lucide-react";
import { PriceAnalyticsCard } from "./PriceAnalyticsCard";

interface PriceDataPoint {
  x: number;
  y: number;
}

interface FloatingCardProps {
  delay: number;
  children: React.ReactNode;
  className?: string;
}

function FloatingCard({ delay, children, className = "" }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 2,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface PulseDotProps {
  delay: number;
  x: number;
  y: number;
}

function PulseDot({ delay, x, y }: PulseDotProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 1,
      }}
      className="absolute w-2 h-2 bg-emerald-400 rounded-full"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
}

export function BudgetMitraVisualPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const generatePricePath = (): string => {
    const points: PriceDataPoint[] = [
      { x: 0, y: 60 },
      { x: 15, y: 55 },
      { x: 30, y: 65 },
      { x: 45, y: 40 },
      { x: 60, y: 35 },
      { x: 75, y: 50 },
      { x: 90, y: 45 },
      { x: 100, y: 55 },
    ];

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` Q ${cpx} ${prev.y}, ${curr.x} ${curr.y}`;
    }
    return path;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.section
      ref={containerRef}
      className="w-full py-12 md:py-24"
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={itemVariants}
            className="relative w-full mx-auto flex items-center justify-center lg:justify-start"
          >
            <PriceAnalyticsCard className="w-full max-w-lg" />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6 lg:pl-10">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4" />
                Live Market Analytics
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-display">
              Buy Smarter with Live Price Insights
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Budget Mitra continuously tracks product prices across leading eCommerce platforms, helping you spot genuine deals, avoid fake discounts, and decide the best time to buy. Every recommendation is backed by trend data, comparison logic, and historical pricing signals.
            </p>
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 font-display">Price Trend Tracking</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Monitor how prices move over time and identify the right buying window before you make a purchase.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 font-display">Smart Deal Confidence</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Every match is checked across multiple listings, so you can compare with more clarity and choose the most reliable offer.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
