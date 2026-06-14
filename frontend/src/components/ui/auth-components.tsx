"use client";

import * as React from "react";
import { useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Tag, IndianRupee, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ==================== Input Component ====================
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  const radius = 100;
  const [visible, setVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
            rgba(12, 80, 68, 0.15),
            transparent 80%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group/input rounded-2xl p-[1px] transition duration-300"
    >
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-[#0C5044]/20 bg-[#FFFBF5] px-4 py-2 text-sm text-[#0C5044] transition duration-400 placeholder:text-[#0C5044]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C5044]/30 focus-visible:border-[#0C5044] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    </motion.div>
  );
});
Input.displayName = "Input";

// ==================== Label Component ====================
export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-[#0C5044]/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});
Label.displayName = "Label";

// ==================== Button Component ====================
export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0C5044] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#0C5044]/90 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C5044]/50 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

// ==================== Background Animation ====================
export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dotted Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern
            id="dotGrid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#0C5044" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
      </svg>

      {/* Floating Price Tags */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`tag-${i}`}
          className="absolute"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            opacity: 0.1,
          }}
          animate={{
            y: [
              Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            ],
            x: [
              Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            ],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Tag className="w-6 h-6 text-[#0C5044]" />
        </motion.div>
      ))}

      {/* Floating Rupee Symbols */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`rupee-${i}`}
          className="absolute"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            opacity: 0.08,
          }}
          animate={{
            y: [
              Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            ],
            x: [
              Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            ],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 25 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <IndianRupee className="w-5 h-5 text-[#0C5044]" />
        </motion.div>
      ))}

      {/* Floating Price Drop Arrows */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`arrow-${i}`}
          className="absolute"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            opacity: 0.1,
          }}
          animate={{
            y: [
              Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            ],
            x: [
              Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            ],
            opacity: [0.1, 0.18, 0.1],
          }}
          transition={{
            duration: 18 + Math.random() * 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <TrendingDown className="w-6 h-6 text-[#0C5044]" />
        </motion.div>
      ))}

      {/* Glowing Dots */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 rounded-full bg-[#0C5044]"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            opacity: 0.1,
            scale: 0.5,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Curved Price Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.path
          d="M 0 200 Q 400 100 800 200 T 1600 200"
          stroke="#0C5044"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 0 400 Q 400 300 800 400 T 1600 400"
          stroke="#0C5044"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
        />
      </svg>
    </div>
  );
};
