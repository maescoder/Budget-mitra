"use client";

import { usePathname } from "next/navigation";
import { useTransitionRouter } from "@/context/TransitionContext";
import { useAuth } from "@/context/AuthContext";
import { Bell, User, LogOut, Menu, X, GitCompare } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const router = useTransitionRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/compare" },
    { label: "Price Alerts", href: "/alerts" },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 w-[90%] max-w-7xl mx-auto">
      <nav className="bg-surface/70 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 md:px-8 md:py-4 shadow-glass flex justify-between items-center transition-all duration-300">
        {/* Brand Logo */}
        <div 
          onClick={() => router.push("/")} 
          className="text-xl md:text-2xl font-display font-extrabold text-primary cursor-pointer tracking-tight select-none"
        >
          Budget Mitra
        </div>

        {/* Navigation Links (Desktop) */}
        <ul className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <button
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "text-label-md font-medium transition-all duration-300 hover:text-primary hover:scale-105 active:scale-95 py-1 px-2 relative",
                    isActive 
                      ? "text-primary font-bold border-b-2 border-primary" 
                      : "text-on-surface-variant/80"
                  )}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* User / CTA actions */}
        <div className="hidden md:flex items-center space-x-5">
          {user ? (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push("/alerts")}
                className="text-surface-tint hover:text-primary transition-colors p-1.5 hover:bg-surface-container rounded-full"
              >
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 border-l border-outline-variant/30 pl-4">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center border border-primary/10">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-on-surface">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-on-surface-variant/70 hover:text-error p-1.5 hover:bg-error-container/20 rounded-full transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push("/login")}
                className="text-on-surface-variant hover:text-primary text-sm font-bold transition-all px-4 py-2"
              >
                Sign In
              </button>
              <button 
                onClick={() => router.push("/signup")}
                className="btn-primary-glow text-on-primary text-xs md:text-sm font-semibold px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          {!user && (
            <button 
              onClick={() => router.push("/signup")}
              className="btn-primary-glow text-on-primary text-xs font-semibold px-4 py-2 rounded-full"
            >
              Get Started
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-primary hover:bg-surface-container rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto w-full bg-surface/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-glass animate-fade-in-up">
          <ul className="space-y-4 mb-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      router.push(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left py-2 px-4 rounded-xl text-base font-semibold transition-all",
                      isActive 
                        ? "bg-primary-fixed text-primary" 
                        : "text-on-surface hover:bg-surface-container"
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-outline-variant/30 pt-4">
            {user ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3 px-4">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-on-surface">{user.name}</div>
                    <div className="text-xs text-on-surface-variant">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-center text-error font-bold rounded-xl hover:bg-error-container/20 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    router.push("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 text-center border border-outline text-on-surface rounded-xl font-bold hover:bg-surface-container"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    router.push("/signup");
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 text-center btn-primary-glow text-on-primary rounded-xl font-bold"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
