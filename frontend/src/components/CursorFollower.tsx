"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorFollower() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Position motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring configurations for smooth trailing effect
  const springConfig = { stiffness: 250, damping: 28 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const innerXSpring = useSpring(cursorX, { stiffness: 1000, damping: 45 });
  const innerYSpring = useSpring(cursorY, { stiffness: 1000, damping: 45 });

  useEffect(() => {
    // Only enable on fine-pointer devices (not touchscreens)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      // Offset by half of cursor follower width (16px / 2 = 8px)
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
    };

    window.addEventListener("mousemove", moveCursor);

    // Add event listeners to detect interactive hover states
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll(
        "a, button, select, input, [role='button'], .cursor-pointer"
      );
      
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovered(true));
        el.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    // Run after DOM has rendered and periodically for dynamic elements
    const timer = setTimeout(addHoverListeners, 500);
    
    // Set up a MutationObserver to watch for newly added interactive items
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Spring Follower Ring */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-primary/40 pointer-events-none z-[99999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isHovered ? 1.8 : 1,
          backgroundColor: isHovered ? "rgba(6, 78, 95, 0.05)" : "transparent",
          borderColor: isHovered ? "rgba(0, 53, 39, 0.7)" : "rgba(0, 53, 39, 0.3)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      
      {/* Inner Pinpoint Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[99999] hidden md:block"
        style={{
          x: innerXSpring,
          y: innerYSpring,
          scale: isHovered ? 0.5 : 1,
        }}
      />
    </>
  );
}
