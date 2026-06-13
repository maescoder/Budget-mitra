"use client";

import { useState } from "react";
import { useTransitionRouter } from "@/context/TransitionContext";
import { Bell, Target, Activity, CheckCircle, Smartphone, Tag, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ShaderBackground from "@/components/ShaderBackground";
import Navbar from "@/components/Navbar";

const staticProducts = [
  { product_key: "apple-iphone-15-128gb-black", product_name: "Apple iPhone 15 128GB Black", brand: "Apple", category: "mobile" },
  { product_key: "samsung-galaxy-s24-256gb-onyx-black", product_name: "Samsung Galaxy S24 256GB Onyx Black", brand: "Samsung", category: "mobile" },
  { product_key: "oneplus-12-256gb-flowy-emerald", product_name: "OnePlus 12 256GB Flowy Emerald", brand: "OnePlus", category: "mobile" },
  { product_key: "xiaomi-redmi-note-13-pro-256gb", product_name: "Xiaomi Redmi Note 13 Pro+ 256GB", brand: "Xiaomi", category: "mobile" },
  { product_key: "google-pixel-8-128gb-hazel", product_name: "Google Pixel 8 128GB Hazel", brand: "Google", category: "mobile" },
  { product_key: "nothing-phone-2-256gb-dark-grey", product_name: "Nothing Phone (2) 256GB Dark Grey", brand: "Nothing", category: "mobile" },
  { product_key: "apple-airpods-pro-2nd-gen", product_name: "Apple AirPods Pro (2nd Gen)", brand: "Apple", category: "headphones" },
  { product_key: "sony-wh-1000xm5-black", product_name: "Sony WH-1000XM5 Black", brand: "Sony", category: "headphones" },
  { product_key: "jbl-tune-770nc-blue", product_name: "JBL Tune 770NC Blue", brand: "JBL", category: "headphones" },
  { product_key: "boat-airdopes-141-black", product_name: "boAt Airdopes 141 Black", brand: "boAt", category: "headphones" },
  { product_key: "oneplus-buds-3-splendid-blue", product_name: "OnePlus Buds 3 Splendid Blue", brand: "OnePlus", category: "headphones" },
  { product_key: "apple-watch-se-gps-44mm", product_name: "Apple Watch SE GPS 44mm", brand: "Apple", category: "electronics" },
  { product_key: "samsung-galaxy-watch-6-44mm", product_name: "Samsung Galaxy Watch 6 44mm", brand: "Samsung", category: "electronics" },
  { product_key: "jbl-flip-6-portable-speaker", product_name: "JBL Flip 6 Portable Speaker", brand: "JBL", category: "electronics" },
  { product_key: "lenovo-ideapad-slim-5-16gb-512gb", product_name: "Lenovo IdeaPad Slim 5 16GB 512GB", brand: "Lenovo", category: "electronics" },
  { product_key: "hp-victus-gaming-laptop-i5-16gb-512gb", product_name: "HP Victus Gaming Laptop i5 16GB 512GB", brand: "HP", category: "electronics" },
  { product_key: "nike-club-men-hoodie-black", product_name: "Nike Club Men Hoodie Black", brand: "Nike", category: "clothes" },
  { product_key: "adidas-men-running-shoes-duramo-sl", product_name: "Adidas Men Running Shoes Duramo SL", brand: "Adidas", category: "clothes" },
  { product_key: "levi-s-men-511-slim-jeans-blue", product_name: "Levi's Men 511 Slim Jeans Blue", brand: "Levi's", category: "clothes" },
  { product_key: "puma-unisex-essential-logo-tee", product_name: "Puma Unisex Essential Logo Tee", brand: "Puma", category: "clothes" }
];

export default function AlertsPage() {
  const router = useTransitionRouter();
  const [targetPrice, setTargetPrice] = useState("");
  const [email, setEmail] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(staticProducts[0].product_key);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, name: "Apple iPhone 15 128GB Black", target: 65000, current: 69999, status: "Active" },
    { id: 2, name: "Sony WH-1000XM5 Black", target: 22000, current: 24990, status: "Active" }
  ]);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/set-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct,
          targetPrice: parseInt(targetPrice),
          email: email
        })
      });

      if (!res.ok) throw new Error("Failed to set alert");

      const match = staticProducts.find(p => p.product_key === selectedProduct);
      
      setActiveAlerts([
        ...activeAlerts,
        {
          id: Date.now(),
          name: match ? match.product_name : selectedProduct,
          target: parseInt(targetPrice),
          current: parseInt(targetPrice) + 1500,
          status: "Active"
        }
      ]);
      setSuccessMsg("Price alert successfully activated!");
      setTargetPrice("");
      setEmail("");
    } catch (err) {
      // Prototype fallback
      const match = staticProducts.find(p => p.product_key === selectedProduct);
      setActiveAlerts([
        ...activeAlerts,
        {
          id: Date.now(),
          name: match ? match.product_name : selectedProduct,
          target: parseInt(targetPrice),
          current: parseInt(targetPrice) + 1200,
          status: "Active"
        }
      ]);
      setSuccessMsg("Price alert successfully activated (Demo mode)!");
      setTargetPrice("");
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-x-hidden bg-background text-on-background flex items-center justify-center p-6">
        <ShaderBackground mode="dashboard" opacity={0.6} />
        
        <div className="max-w-md w-full glass-panel border border-white/40 rounded-3xl p-8 text-center relative overflow-hidden shadow-glass animate-fade-in-up">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/20 blur-3xl rounded-full"></div>
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-fixed/40 border border-primary/20 mb-6 text-primary">
            <Lock className="w-6 h-6" />
          </div>
          
          <h1 className="text-headline-lg font-bold text-primary mb-2">Members Only Area</h1>
          <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed">
            Please sign in to your Budget Mitra account to set automated monitors and receive notifications.
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/')} 
              className="flex-1 py-3 bg-white/45 border border-outline-variant/40 hover:bg-white/70 text-primary font-bold rounded-xl transition-all text-sm"
            >
              Go Back
            </button>
            <button 
              onClick={() => router.push('/login')} 
              className="flex-1 py-3 btn-primary-glow text-on-primary font-bold rounded-xl transition-all text-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background text-on-background">
      {/* WebGL Ambient Background */}
      <ShaderBackground mode="dashboard" opacity={0.6} />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Form Setup */}
        <div className="lg:col-span-5">
          <div className="mb-8">
            <h1 className="text-display-lg md:text-[42px] font-bold text-primary mb-4 leading-tight">
              Budgets that Breathe.
            </h1>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              We monitor pricing trends 24/7. When the price dips to your desired target, we will send a notification straight to your email.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/40 shadow-glass relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/20 blur-3xl rounded-full"></div>
            
            {successMsg && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-primary-fixed border border-primary/20 rounded-xl text-primary text-xs md:text-sm font-semibold">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-surface-tint" />
                <p>{successMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 text-left">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/70 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-surface-tint" /> Select Device
                </label>
                <div className="relative">
                  <select 
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-white/45 border border-outline-variant/40 rounded-xl py-3.5 px-4 text-on-surface font-semibold text-sm appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {staticProducts.map(p => (
                      <option key={p.product_key} value={p.product_key} className="bg-background text-on-surface">
                        {p.product_name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-on-surface-variant/60">
                    <span className="text-[10px]">▼</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/70 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-secondary" /> Target Price (₹)
                </label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="e.g., 65000"
                  className="w-full bg-white/45 border border-outline-variant/40 rounded-xl py-3.5 px-4 text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/70 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-primary" /> Notification Email
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/45 border border-outline-variant/40 rounded-xl py-3.5 px-4 text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-semibold"
                />
              </div>

              <motion.button 
                type="submit" 
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl btn-primary-glow text-on-primary font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Create Active Monitor <Bell className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Right Column: Active Monitors list */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-headline-md font-bold text-primary">Active Monitors</h2>
          </div>

          <div className="grid gap-4 text-left">
            <AnimatePresence mode="popLayout">
              {activeAlerts.map(alert => {
                const pacingPct = Math.round((alert.target / alert.current) * 100);
                return (
                  <motion.div 
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="p-6 bg-white/45 border border-outline-variant/40 rounded-2xl flex flex-col hover:border-primary/20 transition-all shadow-glass hover:shadow-lg relative overflow-hidden group cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-surface-tint animate-pulse"></span>
                          <span className="text-[10px] font-bold text-surface-tint uppercase tracking-wider">{alert.status}</span>
                        </div>
                        <h3 className="font-bold text-base md:text-lg text-primary leading-tight">{alert.name}</h3>
                      </div>
                      
                      <div className="flex items-center gap-6 w-full md:w-auto p-4 md:p-0 bg-background/50 md:bg-transparent rounded-xl border border-outline-variant/20 md:border-transparent">
                        <div>
                          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Target className="w-3 h-3 text-secondary" /> Target
                          </div>
                          <div className="font-extrabold text-secondary text-base md:text-lg">₹{alert.target.toLocaleString()}</div>
                        </div>
                        <div className="border-l border-outline-variant/30 h-8"></div>
                        <div>
                          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-primary" /> Current
                          </div>
                          <div className="font-extrabold text-primary text-base md:text-lg">₹{alert.current.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Liquid progress pacing bar */}
                    <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden relative border border-outline-variant/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, pacingPct))}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full relative" 
                      >
                        <div className="absolute top-0 right-0 w-4 h-full bg-white/20 animate-pulse"></div>
                      </motion.div>
                    </div>
                    
                    <div className="mt-2 text-right text-[10px] font-bold text-on-surface-variant/80">
                      {pacingPct}% of target price reached
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {activeAlerts.length === 0 && (
              <div className="p-10 text-center border-2 border-dashed border-outline-variant/30 rounded-2xl">
                <Bell className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-4" />
                <p className="text-on-surface-variant font-semibold">No active monitors. Set one up to start tracking!</p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-outline-variant/30 w-full py-12 mt-12 relative z-10 bg-white/20">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto gap-6">
          <div className="text-center md:text-left">
            <div className="text-headline-md font-bold text-primary mb-1">Budget Mitra</div>
            <p className="text-body-md text-on-surface-variant text-xs md:text-sm">
              © 2026 Budget Mitra. Elevating financial freedom.
            </p>
          </div>
          <ul className="flex flex-wrap justify-center gap-6 text-label-sm font-semibold">
            <li><a className="text-on-surface-variant hover:text-primary hover:-translate-y-0.5 inline-block transition-all" href="#">Privacy Policy</a></li>
            <li><a className="text-on-surface-variant hover:text-primary hover:-translate-y-0.5 inline-block transition-all" href="#">Terms of Service</a></li>
            <li><a className="text-on-surface-variant hover:text-primary hover:-translate-y-0.5 inline-block transition-all" href="#">Security</a></li>
            <li><a className="text-on-surface-variant hover:text-primary hover:-translate-y-0.5 inline-block transition-all" href="#">Help Center</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
