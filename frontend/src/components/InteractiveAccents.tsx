"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Tag, ShoppingCart, BarChart3, IndianRupee, Percent, Sparkles } from "lucide-react";

export default function InteractiveAccents() {
  // Motion values for raw mouse coordinates relative to center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs to add weight and physics to the movement
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate: -0.5 to 0.5 relative to window dimensions
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(normX * 100); // Shift range -50 to 50
      mouseY.set(normY * 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Different translation ranges to create a layered parallax depth effect
  const layer1X = useTransform(springX, (val) => val * -0.5);
  const layer1Y = useTransform(springY, (val) => val * -0.5);

  const layer2X = useTransform(springX, (val) => val * 0.8);
  const layer2Y = useTransform(springY, (val) => val * 0.8);

  const layer3X = useTransform(springX, (val) => val * -1.2);
  const layer3Y = useTransform(springY, (val) => val * -1.2);

  // Floating decoration configuration
  const items = [
    // Layer 1 - Deep background, slow opposite shift
    { 
      Icon: IndianRupee, 
      className: "top-[15%] left-[8%] w-12 h-12 text-primary/10",
      x: layer1X, y: layer1Y,
      duration: 10, delay: 0
    },
    { 
      Icon: ShoppingCart, 
      className: "bottom-[20%] right-[10%] w-14 h-14 text-secondary/10",
      x: layer1X, y: layer1Y,
      duration: 12, delay: 1
    },
    // Layer 2 - Midground, fast forward shift
    { 
      Icon: Tag, 
      className: "top-[45%] right-[8%] w-10 h-10 text-surface-tint/10",
      x: layer2X, y: layer2Y,
      duration: 8, delay: 2
    },
    { 
      Icon: Percent, 
      className: "bottom-[35%] left-[12%] w-10 h-10 text-primary/10",
      x: layer2X, y: layer2Y,
      duration: 9, delay: 0.5
    },
    // Layer 3 - Foreground, very fast opposite shift
    { 
      Icon: BarChart3, 
      className: "top-[25%] right-[22%] w-8 h-8 text-secondary/15",
      x: layer3X, y: layer3Y,
      duration: 7, delay: 3
    },
    { 
      Icon: Sparkles, 
      className: "bottom-[15%] left-[28%] w-7 h-7 text-primary/15",
      x: layer3X, y: layer3Y,
      duration: 6, delay: 1.5
    }
  ];

  return (
    <div className="fixed inset-0 z-[-5] pointer-events-none overflow-hidden select-none">
      {items.map((item, index) => {
        const { Icon, className, x, y, duration, delay } = item;
        return (
          <motion.div
            key={index}
            style={{ x, y }}
            className={`absolute ${className} hidden md:block`}
          >
            {/* Statically floating animation overlayed on mouse parallax */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full"
            >
              <Icon className="w-full h-full stroke-[1.2]" />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
