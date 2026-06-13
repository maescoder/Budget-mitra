"use client";

import { useState, useEffect } from "react";
import { useTransitionRouter } from "@/context/TransitionContext";
import { Search, Link as LinkIcon, Type, ArrowRight, TrendingUp, ShieldCheck, Sparkles, LogOut, CheckCircle, Tag, ShoppingCart, Percent, BarChart3, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import ShaderBackground from "@/components/ShaderBackground";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

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

export default function Home() {
  const router = useTransitionRouter();
  const [searchMode, setSearchMode] = useState<'name' | 'url'>('name');
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<typeof staticProducts>([]);
  const [selectedProductKey, setSelectedProductKey] = useState<string | null>(null);

  const { user } = useAuth();

  const normalizeText = (value?: string) => {
    return String(value || "").toLowerCase().trim();
  };

  const normalizeSlug = (value?: string) => {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const extractSearchTextFromUrl = (url?: string) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      const pathSegments = u.pathname.split('/').filter(Boolean);
      const relevant = pathSegments.filter(s => s.length > 3 && s !== 'product' && s !== 'dp' && s !== 'item');
      return relevant.join(' ').replace(/-/g, ' ');
    } catch (e) {
      return url.replace(/https?:\/\//g, '').replace(/www\./g, '').replace(/-/g, ' ').replace(/\//g, ' ');
    }
  };

  const findProductByInput = (input?: string, products: any[] = []) => {
    if (!input || !products || products.length === 0) return null;
    let searchText = normalizeText(input);

    if (searchText.startsWith('http') || searchText.includes('amazon') || searchText.includes('flipkart') || searchText.includes('myntra') || searchText.includes('croma')) {
      searchText = normalizeText(extractSearchTextFromUrl(input));
    }

    const searchSlug = normalizeSlug(searchText);

    let match = products.find(p => p?.product_key && p.product_key === searchSlug);
    if (match) return match;

    match = products.find(p => p?.product_name && normalizeText(p.product_name) === searchText);
    if (match) return match;

    match = products.find(p => {
      if (!p) return false;
      const pSlug = p.product_key ? normalizeSlug(p.product_key) : "";
      const pName = p.product_name ? normalizeText(p.product_name) : "";
      if (pSlug && searchSlug && (pSlug.includes(searchSlug) || searchSlug.includes(pSlug))) return true;
      if (pName && searchText && (pName.includes(searchText) || searchText.includes(pName))) return true;
      return false;
    });

    return match || null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setSelectedProductKey(null);

    if (!val || val.trim() === '') {
      setSuggestions([]);
      return;
    }

    const searchSlug = normalizeSlug(val);
    const searchText = normalizeText(val);

    const filtered = staticProducts.filter(p => {
      const pName = p.product_name ? normalizeText(p.product_name) : "";
      const pId = p.product_key ? normalizeSlug(p.product_key) : "";
      return pName.includes(searchText) || pId.includes(searchSlug);
    });

    const uniqueSuggestions: typeof staticProducts = [];
    const seenKeys = new Set();
    for (const p of filtered) {
      if (!seenKeys.has(p.product_key)) {
        seenKeys.add(p.product_key);
        uniqueSuggestions.push(p);
      }
    }

    setSuggestions(uniqueSuggestions.slice(0, 5));
  };

  const handleSelectProduct = (product: typeof staticProducts[0]) => {
    setInputValue(product.product_name);
    setSelectedProductKey(product.product_key);
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    setIsLoading(true);
    setError("");

    try {
      let match = null;
      if (selectedProductKey) {
        match = staticProducts.find(p => p?.product_key === selectedProductKey);
      }

      if (!match) {
        match = findProductByInput(trimmedInput, staticProducts);
      }

      if (match && match.product_key) {
        router.push(`/product/${match.product_key}`);
      } else {
        // Fallback to first product so it flows smoothly in prototype
        router.push(`/product/${staticProducts[0].product_key}`);
      }
    } catch (err: any) {
      setError("Failed to locate product analysis page.");
      setIsLoading(false);
    }
  };

  // Magnetic Hover animation coordinates
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const handleBtnMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setBtnOffset({ x: x * 0.2, y: y * 0.2 });
  };
  const handleBtnMouseLeave = () => {
    setBtnOffset({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background text-on-background">
      {/* Ambient Shader Background */}
      <ShaderBackground mode="home" opacity={0.65} />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main className="relative pt-36 pb-20 md:pt-48 md:pb-28 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed border border-primary/10 text-primary text-xs md:text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4 text-surface-tint" /> AI Price Intelligence
          </div>

          <h1 className="text-display-lg md:text-[76px] text-primary mb-6 leading-[1.15] font-black tracking-tight">
            Wealth, Refined.
          </h1>

          <p className="text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience financial clarity through an organic blend of human wisdom and technological precision. Manage your future with quiet luxury.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onMouseMove={handleBtnMouseMove}
              onMouseLeave={handleBtnMouseLeave}
              onClick={() => {
                const target = document.getElementById("search-analyzer");
                if (target) target.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)` }}
              className="btn-primary-glow text-on-primary text-sm font-semibold px-8 py-4 rounded-full w-full sm:w-auto transition-transform"
            >
              Start Your Journey
            </button>
            <button 
              onClick={() => router.push("/compare")}
              className="glass-panel text-primary text-sm font-semibold px-8 py-4 rounded-full w-full sm:w-auto hover:bg-white/60 transition-colors soft-shadow border border-white/40"
            >
              Explore Dashboard
            </button>
          </div>
        </motion.div>

        {/* Abstract Sphere Graphics & Interactive Search Box */}
        <div id="search-analyzer" className="relative w-full max-w-5xl mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Sphere & Stats (Visual Goals) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[300px]"
          >
            {/* Soft lighting SVG/CSS background decoration */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-primary/10 to-secondary-container/10 blur-3xl pointer-events-none"></div>
            
            {/* Circular Abstract Graphics mimicking Stitch public representation */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full animate-float-slow opacity-60">
                <defs>
                  <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#064e3b" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="70" fill="url(#glassGrad)" stroke="#ffffff" strokeWidth="0.5" />
                <path d="M 30,100 Q 100,20 170,100" fill="none" stroke="#003527" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 30,100 Q 100,180 170,100" fill="none" stroke="#855300" strokeWidth="1" />
              </svg>

              {/* Floating Data Card Overlay */}
              <div className="absolute top-10 right-0 glass-panel soft-shadow p-5 rounded-2xl w-48 text-left border border-white/40">
                <div className="flex items-center space-x-2.5 mb-1">
                  <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center">
                    <TrendingUp className="text-primary w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Growth</span>
                </div>
                <div className="text-xl font-bold text-primary">+24.8%</div>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Automated savings target reached</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Next.js Search Engine Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 w-full text-left"
          >
            <div className="glass-panel p-8 rounded-[2.5rem] shadow-glass border border-white/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full"></div>
              
              <h2 className="text-headline-lg font-bold text-primary mb-2">Product Analyzer</h2>
              <p className="text-body-md text-on-surface-variant mb-6">Enter a product name or paste an eCommerce URL.</p>

              {/* Mode Selectors */}
              <div className="flex gap-2 p-1 bg-surface-container rounded-xl mb-6 border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => { setSearchMode('name'); setInputValue(""); setSuggestions([]); }}
                  className={cn(
                    "flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all",
                    searchMode === 'name' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant/80 hover:text-on-surface'
                  )}
                >
                  <Type className="w-4 h-4" /> Name
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchMode('url'); setInputValue(""); setSuggestions([]); }}
                  className={cn(
                    "flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all",
                    searchMode === 'url' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant/80 hover:text-on-surface'
                  )}
                >
                  <LinkIcon className="w-4 h-4" /> Paste URL
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-4 relative z-20">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type={searchMode === 'url' ? "url" : "text"}
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                    placeholder={searchMode === 'name' ? "e.g., iPhone 15, Sony WH-1000XM5" : "https://amazon.in/..."}
                    className="w-full bg-white/50 border border-outline-variant/40 rounded-xl py-4 pl-12 pr-4 text-on-background outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                  />

                  {/* Suggestion Dropdown */}
                  {searchMode === 'name' && suggestions.length > 0 && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white/95 backdrop-blur-xl border border-outline-variant/40 rounded-xl shadow-glass overflow-hidden py-1.5 z-50">
                      {suggestions.map((prod) => (
                        <div
                          key={prod.product_key}
                          onMouseDown={(e) => { e.preventDefault(); handleSelectProduct(prod); }}
                          className="px-4 py-2.5 hover:bg-surface-container-low cursor-pointer flex items-center gap-3 transition-colors text-sm text-on-surface-variant hover:text-primary"
                        >
                          <Search className="w-4 h-4 text-on-surface-variant/50 flex-shrink-0" />
                          <span className="truncate font-medium">{prod.product_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-xs font-semibold text-error bg-error-container/20 border border-error-container/30 rounded-xl p-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-sm hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Analyze Value <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Trending Bento Grid Section */}
      <section className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center border border-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-headline-lg font-bold text-primary">Trending Drops Today</h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter auto-rows-[minmax(240px,auto)]">
          {/* Card 1: Double Width (iPhone) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            onClick={() => router.push('/product/apple-iphone-15-128gb-black')}
            className="md:col-span-2 group relative glass-panel rounded-2xl p-8 cursor-pointer hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-glass border border-white/40"
          >
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary-fixed/20 blur-3xl rounded-full group-hover:bg-primary-fixed/30 transition-colors"></div>
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-primary-fixed text-primary text-xs font-bold rounded-lg border border-primary/20">15% SAVINGS</span>
              <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <ArrowUpRight className="w-4 h-4 text-primary group-hover:text-on-primary transition-colors" />
              </div>
            </div>
            <div>
              <h3 className="text-headline-md font-bold text-primary mb-1">Apple iPhone 15</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-on-surface">₹65,999</span>
                <span className="text-sm text-on-surface-variant line-through">₹79,900</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Single Width (Sony) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => router.push('/product/sony-wh-1000xm5-black')}
            className="md:col-span-1 group relative glass-panel rounded-2xl p-8 cursor-pointer hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-glass border border-white/40"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary-container/20 blur-2xl rounded-full group-hover:bg-secondary-container/30 transition-colors"></div>
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-secondary-container/20 text-secondary text-xs font-bold rounded-lg border border-secondary/20">22% SAVINGS</span>
              <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <ArrowUpRight className="w-4 h-4 text-primary group-hover:text-on-primary transition-colors" />
              </div>
            </div>
            <div>
              <h3 className="text-headline-md font-bold text-primary mb-1">Sony WH-1000XM5</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-on-surface">₹24,990</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Triple Width (Samsung) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            onClick={() => router.push('/product/samsung-galaxy-s24-256gb-onyx-black')}
            className="md:col-span-3 group relative glass-panel rounded-2xl p-8 cursor-pointer hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between shadow-glass border border-white/40"
          >
            <div className="absolute left-1/3 -top-10 w-96 h-24 bg-primary-fixed/10 blur-3xl rounded-full"></div>
            <div className="mb-6 md:mb-0">
              <span className="inline-block mb-3 px-3 py-1 bg-secondary-container/20 text-secondary text-xs font-bold rounded-lg border border-secondary/20">LOW STOCK TRIGGER</span>
              <h3 className="text-headline-md font-bold text-primary mb-1">Samsung Galaxy S24</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-on-surface">₹74,999</span>
                <span className="text-sm text-on-surface-variant line-through">₹79,999</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
              <ArrowRight className="w-5 h-5 text-primary group-hover:text-on-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand & Strategy Section (Stitch layout copy) */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-t border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <div className="glass-panel rounded-3xl p-3 relative overflow-hidden soft-shadow border border-white/40 aspect-[4/5] flex items-center justify-center bg-white/20">
              {/* Graphic element representing analytics/growth */}
              <div className="w-[85%] h-[85%] rounded-2xl bg-gradient-to-br from-primary-fixed/20 to-background border border-primary-fixed/30 flex flex-col justify-between p-6">
                <div className="flex justify-between items-center">
                  <div className="text-xs uppercase font-bold text-primary/70 tracking-wider">Live Analytics</div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                {/* SVG Mock Graph */}
                <svg viewBox="0 0 100 50" className="w-full overflow-visible">
                  <path d="M0,45 Q25,25 50,35 T100,5" fill="none" stroke="#003527" strokeWidth="2" />
                  <circle cx="50" cy="35" r="3" fill="#855300" />
                  <circle cx="100" cy="5" r="3" fill="#003527" />
                </svg>
                <div className="flex justify-between text-[10px] text-on-surface-variant font-semibold">
                  <span>Monitored Categories</span>
                  <span>99.4% Uptime</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="md:col-span-1"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-6 space-y-6"
          >
            <h2 className="text-headline-lg font-bold text-primary">The Human Touch in Digital Finance</h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              We reject the concept of AI slop — systems that make decisions on your behalf and generate generic, thoughtless advice. Budget Mitra pairs intelligent analytics with custom-tuned parameters, allowing you to orchestrate your budget with precision and intuition.
            </p>

            <ul className="space-y-4 pt-4">
              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0 text-primary">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-label-md font-bold text-primary mb-0.5">Value Pacing</h3>
                  <p className="text-body-md text-on-surface-variant text-sm">Monitor trends softly in the background and purchase during optimal price windows.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-label-md font-bold text-primary mb-0.5">Confidence Scoring</h3>
                  <p className="text-body-md text-on-surface-variant text-sm">Every prediction is backed by detailed historical analysis and confidence percentages.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

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
