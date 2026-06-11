/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Link as LinkIcon, Type, ArrowRight, PlayCircle, TrendingUp, ShieldCheck, Zap, Sparkles, CalendarClock, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuroraBackground } from "@/components/ui/aurora-background";

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

const upcomingSales = [
  { name: "Summer Sale", platform: "Amazon", month: 4 },
  { name: "End of Reason Sale", platform: "Myntra", month: 5 },
  { name: "Prime Day", platform: "Amazon", month: 6 },
  { name: "Big Saving Days", platform: "Flipkart", month: 7 },
  { name: "Big Billion Days", platform: "Flipkart", month: 8 },
  { name: "Great Indian Festival", platform: "Amazon", month: 9 },
  { name: "Black Friday", platform: "Global", month: 10 },
  { name: "Year End Sale", platform: "Multiple", month: 11 }
];

export default function Home() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'name' | 'url'>('name');
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<typeof staticProducts>([]);
  const [selectedProductKey, setSelectedProductKey] = useState<string | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);
  
  const { user, logout } = useAuth();
  const currentMonth = new Date().getMonth();
  const nextSale = upcomingSales.find(s => s.month >= currentMonth) || upcomingSales[0];
  const monthsAway = nextSale.month >= currentMonth ? nextSale.month - currentMonth : (12 - currentMonth + nextSale.month);
  
  // Deterministic days left so it doesn't jump on re-renders
  const estimatedDays = monthsAway * 30 + 12;

  // Mouse interaction and Time state for animated background & 3D floating
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const updateTime = () => {
      setTime(Date.now() / 1000);
      animationFrameId = requestAnimationFrame(updateTime);
    };
    updateTime();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 100,
        y: (e.clientY / window.innerHeight - 0.5) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
    setSelectedProductName(null);

    try {
      if (!val || val.trim() === '') {
        setSuggestions([]);
        return;
      }

      const searchSlug = normalizeSlug(val);
      const searchText = normalizeText(val);

      if (staticProducts && staticProducts.length > 0) {
        const filtered = staticProducts.filter(p => {
          if (!p) return false;
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
      }
    } catch (e) {
      setSuggestions([]);
    }
  };

  const handleSelectProduct = (product: { product_key: string, product_name: string }) => {
    setInputValue(product.product_name);
    setSelectedProductKey(product.product_key);
    setSelectedProductName(product.product_name);
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
        if (staticProducts && staticProducts.length > 0 && staticProducts[0].product_key) {
          router.push(`/product/${staticProducts[0].product_key}`);
        } else {
          setError("No products available in dataset.");
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      setError("Failed to extract product safely.");
      setIsLoading(false);
    }
  };

  return (

    <div className="bg-surface text-on-surface min-h-screen flex flex-col antialiased">
      <header className="bg-surface dark:bg-surface-dim shadow-[8px_8px_16px_#B8C2D0,-8px_-8px_16px_#FFFFFF] dark:shadow-none w-full sticky top-0 z-50 transition-all duration-300">
<div className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-container-max mx-auto">
{/*  Brand  */}
<div className="flex items-center gap-4">
<a className="text-headline-md font-headline-md font-bold text-on-surface dark:text-surface-bright flex items-center gap-2" href="#">
<div className="w-10 h-10 rounded-full flex items-center justify-center btn-neu text-primary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>account_balance_wallet</span>
</div>
                    Budget Mitra
                </a>
</div>
{/*  Navigation Links (Desktop)  */}
<nav className="hidden md:flex items-center gap-8">
{/*  Intent: Home/Explore -> Default to no specific active state based on provided labels, but 'Deals' or 'Compare' might be closest to landing page. Will leave inactive for general landing, or highlight first if forced. Leaving inactive as it&apos;s a general landing.  */}
<a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-label-md text-label-md px-4 py-2 rounded-lg hover:shadow-neu-inset" href="#">Compare</a>
<a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-label-md text-label-md px-4 py-2 rounded-lg hover:shadow-neu-inset" href="#">Price Alerts</a>
<a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-label-md text-label-md px-4 py-2 rounded-lg hover:shadow-neu-inset" href="#">Deals</a>
<a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-label-md text-label-md px-4 py-2 rounded-lg hover:shadow-neu-inset" href="#">Calculators</a>
</nav>
{/*  Actions  */}
<div className="flex items-center gap-4">
<a className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-label-md text-label-md hidden sm:block px-4 py-2 rounded-lg hover:shadow-neu-inset" href="#">Log In</a>
<a className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-full btn-neu shadow-neu-extruded hover:shadow-neu-floating transition-shadow" href="#">Get Started</a>
</div>
</div>
</header>
      <main className="flex-grow">
        
{/*  Hero Section  */}
<section className="relative pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col items-center justify-center text-center overflow-hidden">
{/*  Subtle motion background could be a shader, but using CSS gradients for pure HTML structural request, or assuming placeholder if needed. Will use structural subtle blobs for neumorphic feel  */}
<div className="absolute inset-0 z-[-1] overflow-hidden opacity-30 pointer-events-none">
<div className="absolute top-10 left-1/4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
<div className="absolute top-10 right-1/4 w-96 h-96 bg-tertiary-fixed-dim/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
<div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-primary-fixed-dim/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
</div>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-6 max-w-3xl">
                Compare prices. Track trends. <br /><span className="text-secondary">Buy smarter.</span>
</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl">
                Your ultimate financial tool for smart shopping. We monitor millions of products so you never overpay again.
            </p>
{/*  Neumorphic Search Bar  */}
<div className="w-full max-w-2xl relative">
<div className="input-neu rounded-full flex items-center p-2 pl-6 pr-2 h-16 w-full group transition-all duration-300">
<span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">search</span>
<input 
    className="bg-transparent border-none w-full h-full text-body-lg font-body-lg text-on-surface placeholder:text-outline-variant focus:ring-0 px-4" 
    placeholder="Paste product URL or search..." 
    type="text" 
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
  />
<button 
    onClick={handleSubmit}
    className="btn-neu bg-secondary text-on-secondary w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
  >
<span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
</section>
{/*  Trusted Platforms (Extruded Cards)  */}
<section className="py-16 bg-surface px-margin-mobile md:px-margin-desktop">
<div className="max-w-container-max mx-auto text-center">
<p className="font-label-md text-label-md text-outline mb-8 uppercase tracking-widest">Tracking prices across</p>
<div className="flex flex-wrap justify-center gap-6 md:gap-12">
{/*  Placeholder logos represented by neumorphic blocks  */}
<div className="card-neu w-32 h-16 flex items-center justify-center text-primary-container font-label-md font-bold grayscale hover:grayscale-0 transition-all duration-300 hover:-translate-y-1">
                        Amazon
                    </div>
<div className="card-neu w-32 h-16 flex items-center justify-center text-secondary font-label-md font-bold grayscale hover:grayscale-0 transition-all duration-300 hover:-translate-y-1">
                        Flipkart
                    </div>
<div className="card-neu w-32 h-16 flex items-center justify-center text-tertiary-container font-label-md font-bold grayscale hover:grayscale-0 transition-all duration-300 hover:-translate-y-1">
                        Myntra
                    </div>
<div className="card-neu w-32 h-16 flex items-center justify-center text-on-primary-fixed-variant font-label-md font-bold grayscale hover:grayscale-0 transition-all duration-300 hover:-translate-y-1">
                        Chroma
                    </div>
</div>
</div>
</section>
{/*  Trending Price Drops (Grid)  */}
<section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
<div className="flex justify-between items-end mb-12">
<div>
<h2 className="font-headline-md text-headline-md text-primary mb-2">Trending Price Drops</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Real-time steals you shouldn&apos;t miss.</p>
</div>
<button className="btn-neu px-6 py-2 rounded-full font-label-md text-label-md text-secondary bg-surface hidden sm:block">View All</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
{/*  Product Card 1  */}
<div className="card-neu p-6 flex flex-col h-full hover:shadow-neu-floating transition-shadow duration-300 cursor-pointer group">
<div className="w-full aspect-square rounded-xl shadow-neu-inset bg-surface flex items-center justify-center mb-6 relative overflow-hidden">
<span className="material-symbols-outlined text-6xl text-outline-variant group-hover:scale-110 transition-transform duration-500">smartphone</span>
<div className="absolute top-3 left-3 bg-tertiary-fixed-dim text-on-tertiary-fixed text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            -24%
                        </div>
</div>
<div className="flex-grow">
<p className="font-label-sm text-label-sm text-outline mb-1">Electronics</p>
<h3 className="font-label-md text-label-md text-primary mb-2 line-clamp-2">Premium Noise-Cancelling Headphones Pro</h3>
<div className="flex items-center gap-2 mb-4">
<span className="font-headline-sm text-headline-sm text-secondary">₹14,999</span>
<span className="font-body-md text-body-md text-outline line-through">₹19,999</span>
</div>
</div>
<button className="w-full py-3 rounded-xl font-label-md text-label-md text-primary bg-surface shadow-neu-extruded group-hover:bg-primary group-hover:text-on-primary transition-colors active:shadow-neu-inset mt-auto">View Deal</button>
</div>
{/*  Product Card 2  */}
<div className="card-neu p-6 flex flex-col h-full hover:shadow-neu-floating transition-shadow duration-300 cursor-pointer group">
<div className="w-full aspect-square rounded-xl shadow-neu-inset bg-surface flex items-center justify-center mb-6 relative overflow-hidden">
<span className="material-symbols-outlined text-6xl text-outline-variant group-hover:scale-110 transition-transform duration-500">watch</span>
<div className="absolute top-3 left-3 bg-tertiary-fixed-dim text-on-tertiary-fixed text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            -15%
                        </div>
</div>
<div className="flex-grow">
<p className="font-label-sm text-label-sm text-outline mb-1">Wearables</p>
<h3 className="font-label-md text-label-md text-primary mb-2 line-clamp-2">Smart Fitness Watch Series 5</h3>
<div className="flex items-center gap-2 mb-4">
<span className="font-headline-sm text-headline-sm text-secondary">₹3,499</span>
<span className="font-body-md text-body-md text-outline line-through">₹4,199</span>
</div>
</div>
<button className="w-full py-3 rounded-xl font-label-md text-label-md text-primary bg-surface shadow-neu-extruded group-hover:bg-primary group-hover:text-on-primary transition-colors active:shadow-neu-inset mt-auto">View Deal</button>
</div>
{/*  Product Card 3  */}
<div className="card-neu p-6 flex flex-col h-full hover:shadow-neu-floating transition-shadow duration-300 cursor-pointer group">
<div className="w-full aspect-square rounded-xl shadow-neu-inset bg-surface flex items-center justify-center mb-6 relative overflow-hidden">
<span className="material-symbols-outlined text-6xl text-outline-variant group-hover:scale-110 transition-transform duration-500">laptop_mac</span>
<div className="absolute top-3 left-3 bg-tertiary-fixed-dim text-on-tertiary-fixed text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            -10%
                        </div>
</div>
<div className="flex-grow">
<p className="font-label-sm text-label-sm text-outline mb-1">Computers</p>
<h3 className="font-label-md text-label-md text-primary mb-2 line-clamp-2">Ultra-Thin Work Laptop M2</h3>
<div className="flex items-center gap-2 mb-4">
<span className="font-headline-sm text-headline-sm text-secondary">₹89,999</span>
<span className="font-body-md text-body-md text-outline line-through">₹99,999</span>
</div>
</div>
<button className="w-full py-3 rounded-xl font-label-md text-label-md text-primary bg-surface shadow-neu-extruded group-hover:bg-primary group-hover:text-on-primary transition-colors active:shadow-neu-inset mt-auto">View Deal</button>
</div>
{/*  Product Card 4  */}
<div className="card-neu p-6 flex flex-col h-full hover:shadow-neu-floating transition-shadow duration-300 cursor-pointer group">
<div className="w-full aspect-square rounded-xl shadow-neu-inset bg-surface flex items-center justify-center mb-6 relative overflow-hidden">
<span className="material-symbols-outlined text-6xl text-outline-variant group-hover:scale-110 transition-transform duration-500">blender</span>
<div className="absolute top-3 left-3 bg-tertiary-fixed-dim text-on-tertiary-fixed text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            -32%
                        </div>
</div>
<div className="flex-grow">
<p className="font-label-sm text-label-sm text-outline mb-1">Home Appliances</p>
<h3 className="font-label-md text-label-md text-primary mb-2 line-clamp-2">Smart High-Speed Blender Pro Max</h3>
<div className="flex items-center gap-2 mb-4">
<span className="font-headline-sm text-headline-sm text-secondary">₹4,299</span>
<span className="font-body-md text-body-md text-outline line-through">₹6,499</span>
</div>
</div>
<button className="w-full py-3 rounded-xl font-label-md text-label-md text-primary bg-surface shadow-neu-extruded group-hover:bg-primary group-hover:text-on-primary transition-colors active:shadow-neu-inset mt-auto">View Deal</button>
</div>
</div>
<button className="btn-neu w-full mt-8 py-3 rounded-full font-label-md text-label-md text-secondary bg-surface sm:hidden">View All Deals</button>
</section>
{/*  Feature Grid (Bento Style Neumorphism)  */}
<section className="py-24 bg-surface-container-low px-margin-mobile md:px-margin-desktop">
<div className="max-w-container-max mx-auto">
<div className="text-center mb-16">
<h2 className="font-headline-md text-headline-md text-primary mb-4">Smart Shopping Arsenal</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Equip yourself with data. Our tools are designed to give you the advantage in every purchase.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/*  Feature 1: Alerts  */}
<div className="card-neu p-8 flex flex-col items-center text-center">
<div className="w-20 h-20 rounded-2xl shadow-neu-inset flex items-center justify-center mb-6">
<div className="w-12 h-12 rounded-full shadow-neu-extruded flex items-center justify-center bg-surface text-secondary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>notifications_active</span>
</div>
</div>
<h3 className="font-headline-sm text-headline-sm text-primary mb-3">Real-time Price Alerts</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Set your target price and we&apos;ll notify you the second it drops. Never miss a deal.</p>
</div>
{/*  Feature 2: History  */}
<div className="card-neu p-8 flex flex-col items-center text-center md:-translate-y-8">
<div className="w-20 h-20 rounded-2xl shadow-neu-inset flex items-center justify-center mb-6">
<div className="w-12 h-12 rounded-full shadow-neu-extruded flex items-center justify-center bg-surface text-tertiary-fixed-dim">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>monitoring</span>
</div>
</div>
<h3 className="font-headline-sm text-headline-sm text-primary mb-3">Historical Data</h3>
<p className="font-body-md text-body-md text-on-surface-variant">View up to 12 months of price history charts to know if it&apos;s genuinely a good time to buy.</p>
{/*  Mini visual representation of a chart  */}
<div className="w-full mt-6 h-16 shadow-neu-inset rounded-lg p-2 flex items-end justify-between px-4">
<div className="w-2 bg-secondary rounded-t-sm h-1/4"></div>
<div className="w-2 bg-secondary rounded-t-sm h-2/4"></div>
<div className="w-2 bg-secondary rounded-t-sm h-1/3"></div>
<div className="w-2 bg-secondary rounded-t-sm h-3/4"></div>
<div className="w-2 bg-tertiary-fixed-dim rounded-t-sm h-full"></div>
</div>
</div>
{/*  Feature 3: Compare  */}
<div className="card-neu p-8 flex flex-col items-center text-center">
<div className="w-20 h-20 rounded-2xl shadow-neu-inset flex items-center justify-center mb-6">
<div className="w-12 h-12 rounded-full shadow-neu-extruded flex items-center justify-center bg-surface text-primary-fixed-dim">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>compare_arrows</span>
</div>
</div>
<h3 className="font-headline-sm text-headline-sm text-primary mb-3">Smart Comparison</h3>
<p className="font-body-md text-body-md text-on-surface-variant">We instantly check multiple retailers to find you the lowest price including shipping.</p>
</div>
</div>
</div>
</section>

      </main>
      {/* Footer is now globally handled in layout.tsx */}
    </div>

  );
}
