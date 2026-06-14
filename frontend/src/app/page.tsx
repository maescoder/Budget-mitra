"use client";

import { useState, useEffect } from "react";
import { useTransitionRouter } from "@/context/TransitionContext";
import { Search, Link as LinkIcon, Type, ArrowRight, TrendingUp, ShieldCheck, Sparkles, LogOut, CheckCircle, Tag, ShoppingCart, Percent, BarChart3, ArrowUpRight, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import ShaderBackground from "@/components/ShaderBackground";
import Navbar from "@/components/Navbar";
import { ProductAnalyzerIllustration } from "@/components/ui/ProductAnalyzerIllustration";
import { BudgetMitraVisualPanel } from "@/components/ui/BudgetMitraVisualPanel";
import { BudgetMitraHeroBackground } from "@/components/ui/BudgetMitraHeroBackground";
import { TrendingDeals } from "@/components/ui/TrendingDeals";
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
      {/* Navigation */}
      <Navbar />

      {/* Hero Section Wrapper with constrained background */}
      <div className="relative w-full overflow-hidden">
        {/* Ambient Animated Background */}
        <BudgetMitraHeroBackground />

        {/* Hero Section */}
        <main className="relative z-10 pt-36 pb-20 md:pt-48 md:pb-28 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 border border-emerald-200 mb-4 backdrop-blur-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-800">Smart Price Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-primary leading-tight font-display tracking-tight">
            Never Overpay Again with{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Budget Mitra
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mt-6">
            Track prices across platforms, compare deals in real-time, and get notified when your favorite products hit their lowest price.
          </p>


        </motion.div>

        {/* Abstract Sphere Graphics & Interactive Search Box */}
        <div id="search-analyzer" className="relative w-full max-w-5xl mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Product Analyzer Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[400px]"
          >
            {/* Soft lighting SVG/CSS background decoration */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-primary/10 to-secondary-container/10 blur-3xl pointer-events-none"></div>
            
            <ProductAnalyzerIllustration className="w-full max-w-lg z-10" />
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
              
              <h2 className="text-headline-lg font-bold font-display text-primary mb-2">Product Analyzer</h2>
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
      </div>

      {/* Trending Deals Section */}
      <TrendingDeals />

      {/* Visual Panel Section */}
      <BudgetMitraVisualPanel />

      {/* Footer */}
      <footer className="glass-panel border-t border-outline-variant/30 w-full py-12 mt-12 relative z-10 bg-white/20">
        <div className="flex flex-col items-start px-margin-desktop max-w-container-max mx-auto gap-1">
          <div className="text-left">
            <div className="text-headline-md font-display font-bold text-primary flex items-center justify-start gap-3">
              <div className="h-10 md:h-12 flex items-center justify-center">
                <img src="/images/logo.png" alt="Budget Mitra Logo" className="h-full w-auto object-contain pointer-events-none drop-shadow-sm" />
              </div>
              Budget Mitra
            </div>
            <p className="text-body-md text-on-surface-variant text-xs md:text-sm mt-2 leading-tight">
              © 2026 Budget Mitra. Made for smarter online shoppers.<br />
              Project by The GC Coders
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
