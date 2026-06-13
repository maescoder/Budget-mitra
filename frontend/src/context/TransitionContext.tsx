"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter as useNextRouter, usePathname } from "next/navigation";
import Loading from "@/app/loading";

interface TransitionContextType {
  push: (href: string) => void;
  isPending: boolean;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useNextRouter();
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);

  // Automatically close loading screen when pathname changes
  useEffect(() => {
    setIsPending(false);
  }, [pathname]);

  const push = (href: string) => {
    if (pathname === href) return;
    setIsPending(true);
    
    // Allow the coin drop animation to play fully before starting navigation
    setTimeout(() => {
      router.push(href);
    }, 950);
  };

  return (
    <TransitionContext.Provider value={{ push, isPending }}>
      {isPending && <Loading />}
      <div className={isPending ? "pointer-events-none opacity-50 transition-opacity duration-300" : ""}>
        {children}
      </div>
    </TransitionContext.Provider>
  );
}

export function useTransitionRouter() {
  const context = useContext(TransitionContext);
  const nextRouter = useNextRouter();
  
  if (!context) {
    return {
      push: (href: string) => nextRouter.push(href),
      isPending: false
    };
  }
  
  return context;
}
