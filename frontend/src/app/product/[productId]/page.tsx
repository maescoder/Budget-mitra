"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTransitionRouter } from "@/context/TransitionContext";
import { motion } from "framer-motion";
import { 
  Star, ExternalLink, Activity, Brain, ShieldAlert, 
  ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Bell, Zap, 
  ShoppingBag, Calculator, Percent, Lock, ArrowLeft
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import ShaderBackground from "@/components/ShaderBackground";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

// Review sentiments
const reviewsData: Record<string, any> = {
    "apple-iphone-15-128gb-black": ["Highly Positive", "Excellent display | Fast performance | Amazing camera", "Expensive | No charger in box | 60Hz screen", "Heating during heavy gaming", "Users generally love the iPhone 15 for its refined design and great cameras, though the 60Hz display is a sticking point at this price.", "Wait for a major sale event if you want maximum value."],
    "samsung-galaxy-s24-256gb-onyx-black": ["Positive", "Compact design | Great display | Good battery life", "Exynos chip in some regions | Pricey", "Slight camera lag", "The Galaxy S24 remains a strong contender for those wanting a compact, powerful Android device.", "Solid buy right now, but watch out for festival discounts."],
    "oneplus-12-256gb-flowy-emerald": ["Highly Positive", "Stunning design | Blazing fast | Superfast charging", "No IP68 rating | Large size", "Curved screen accidental touches", "Reviewers praise the OnePlus 12 as a true flagship killer offering incredible value and performance.", "Excellent value for money, buy now."],
    "xiaomi-redmi-note-13-pro-256gb": ["Mixed", "Great value | Fast charging | Crisp display", "Bloatware | Average low-light camera", "Software updates are slow", "A very solid mid-ranger that covers all the basics well, despite some heavy UI elements.", "Wait for a discount before purchasing."],
    "google-pixel-8-128gb-hazel": ["Positive", "Amazing camera | Clean UI | Long software support", "Battery life is average | Slow charging", "Fingerprint sensor can be finicky", "The Pixel 8 is loved for its software and cameras, but power users might find the battery lacking.", "Wait for a price drop."],
    "nothing-phone-2-256gb-dark-grey": ["Highly Positive", "Unique glyph interface | Smooth UI | Good battery", "Average cameras | Expensive", "Slightly bulky", "A breath of fresh air in design with super smooth software, though cameras are just average.", "Buy if you value design and software experience."],
    "apple-airpods-pro-2nd-gen": ["Highly Positive", "Incredible ANC | Seamless ecosystem | Great fit", "Very expensive | Lightning port on older stock", "Occasional connection drops on non-Apple devices", "Considered the gold standard for wireless earbuds if you are in the Apple ecosystem.", "A solid buy, especially during seasonal sales."],
    "sony-wh-1000xm5-black": ["Highly Positive", "Industry-leading ANC | Great comfort | Long battery life", "Cannot fold | Expensive", "Gets warm on ears after long use", "The WH-1000XM5 are phenomenal over-ear headphones with top-tier noise cancellation.", "Highly recommended for travelers and audiophiles."],
    "jbl-tune-770nc-blue": ["Positive", "Good bass | Affordable ANC | Comfortable", "Build feels slightly plasticky | Micro-USB on some variants", "ANC is basic", "A great budget choice for bass lovers wanting decent noise cancellation.", "Wait for a sale to get it at a bargain."],
    "boat-airdopes-141-black": ["Mixed", "Very cheap | Bass-heavy | Long battery", "Flimsy case | Call quality is poor", "Disconnection issues", "Decent for the price, but mostly suited for casual listening and workouts.", "Buy now, it's usually always cheap."],
    "oneplus-buds-3-splendid-blue": ["Positive", "Great sound | Dual connection | Good battery", "Touch controls are sensitive | Glossy case scratches easily", "Average ANC", "A strong mid-range earbud offering features usually found in premium models.", "Great value, solid buy."],
    "apple-watch-se-gps-44mm": ["Positive", "Smooth performance | Great fitness tracking | Value", "No always-on display | Battery life is 1 day", "Screen scratches easily", "The best entry point into the Apple Watch ecosystem without breaking the bank.", "Wait for a sale if price is an issue, otherwise a solid buy right now."],
    "samsung-galaxy-watch-6-44mm": ["Positive", "Beautiful display | Great health tracking | Slim bezels", "Battery life | Slow charging", "Some lag on complex watch faces", "A great companion for Android users with a beautiful, vivid screen.", "Wait for bundling offers with phones."],
    "jbl-flip-6-portable-speaker": ["Highly Positive", "Punchy sound | Waterproof | Portable", "No aux input | No built-in mic", "Battery drains fast at max volume", "A rugged, fantastic sounding portable speaker perfect for outdoor use.", "Solid buy right now."],
    "lenovo-ideapad-slim-5-16gb-512gb": ["Positive", "Good performance | Premium look | Good keyboard", "Average battery life | Screen could be brighter", "Fans get loud under load", "A reliable daily driver laptop for students and professionals.", "Wait for back-to-school or festive sales."],
    "hp-victus-gaming-laptop-i5-16gb-512gb": ["Mixed", "Good 1080p gaming | Clean design | Affordable", "Screen wobble | Average color gamut", "Battery life is very poor", "An entry-level gaming laptop that gets the job done, but compromises on screen quality.", "Buy during big electronic sales."],
    "nike-club-men-hoodie-black": ["Positive", "Very comfortable | Classic design | Durable", "Runs slightly small | Fades after many washes", "Lint sticks to it easily", "A classic, cozy staple for casual wear, though you might want to size up.", "Buy now, very popular item."],
    "adidas-men-running-shoes-duramo-sl": ["Mixed", "Lightweight | Good for casual running | Affordable", "Not very durable | Narrow fit", "Sole wears out quickly on hard surfaces", "A decent pair of entry-level running shoes, but not for serious marathon runners.", "Wait for 40-50% off sales, very common."],
    "levi-s-men-511-slim-jeans-blue": ["Highly Positive", "Great fit | Classic style | Durable denim", "Sizing inconsistency between colors | Requires break-in", "Pockets are slightly shallow", "A timeless classic that offers a great slim (but not skinny) fit.", "Wait for seasonal sales to grab multiple pairs."],
    "puma-unisex-essential-logo-tee": ["Mixed", "Soft cotton | Casual fit | Inexpensive", "Neck stretches out | Thin material", "Logo fades over time", "A basic everyday t-shirt that is comfortable but may not last years.", "Buy during clearance sales for maximum value."]
};

const staticProducts = [
  { product_key: "apple-iphone-15-128gb-black", product_name: "Apple iPhone 15 128GB Black", brand: "Apple", category: "mobile", image: "/images/apple-iphone-15-128gb-black.jpg" },
  { product_key: "samsung-galaxy-s24-256gb-onyx-black", product_name: "Samsung Galaxy S24 256GB Onyx Black", brand: "Samsung", category: "mobile", image: "/images/samsung-galaxy-s24-256gb-onyx-black.jpg" },
  { product_key: "oneplus-12-256gb-flowy-emerald", product_name: "OnePlus 12 256GB Flowy Emerald", brand: "OnePlus", category: "mobile", image: "/images/oneplus-12-256gb-flowy-emerald.jpg" },
  { product_key: "xiaomi-redmi-note-13-pro-256gb", product_name: "Xiaomi Redmi Note 13 Pro+ 256GB", brand: "Xiaomi", category: "mobile", image: "/images/xiaomi-redmi-note-13-pro-256gb.jpg" },
  { product_key: "google-pixel-8-128gb-hazel", product_name: "Google Pixel 8 128GB Hazel", brand: "Google", category: "mobile", image: "/images/google-pixel-8-128gb-hazel.jpg" },
  { product_key: "nothing-phone-2-256gb-dark-grey", product_name: "Nothing Phone (2) 256GB Dark Grey", brand: "Nothing", category: "mobile", image: "/images/nothing-phone-2-256gb-dark-grey.jpg" },
  { product_key: "apple-airpods-pro-2nd-gen", product_name: "Apple AirPods Pro (2nd Gen)", brand: "Apple", category: "headphones", image: "/images/apple-airpods-pro-2nd-gen.jpg" },
  { product_key: "sony-wh-1000xm5-black", product_name: "Sony WH-1000XM5 Black", brand: "Sony", category: "headphones", image: "/images/sony-wh-1000xm5-black.jpg" },
  { product_key: "jbl-tune-770nc-blue", product_name: "JBL Tune 770NC Blue", brand: "JBL", category: "headphones", image: "/images/jbl-tune-770nc-blue.jpg" },
  { product_key: "boat-airdopes-141-black", product_name: "boAt Airdopes 141 Black", brand: "boAt", category: "headphones", image: "/images/boat-airdopes-141-black.jpg" },
  { product_key: "oneplus-buds-3-splendid-blue", product_name: "OnePlus Buds 3 Splendid Blue", brand: "OnePlus", category: "headphones", image: "/images/oneplus-buds-3-splendid-blue.jpg" },
  { product_key: "apple-watch-se-gps-44mm", product_name: "Apple Watch SE GPS 44mm", brand: "Apple", category: "electronics", image: "/images/apple-watch-se-gps-44mm.jpg" },
  { product_key: "samsung-galaxy-watch-6-44mm", product_name: "Samsung Galaxy Watch 6 44mm", brand: "Samsung", category: "electronics", image: "/images/samsung-galaxy-watch-6-44mm.jpg" },
  { product_key: "jbl-flip-6-portable-speaker", product_name: "JBL Flip 6 Portable Speaker", brand: "JBL", category: "electronics", image: "/images/jbl-flip-6-portable-speaker.jpg" },
  { product_key: "lenovo-ideapad-slim-5-16gb-512gb", product_name: "Lenovo IdeaPad Slim 5 16GB 512GB", brand: "Lenovo", category: "electronics", image: "/images/lenovo-ideapad-slim-5-16gb-512gb.jpg" },
  { product_key: "hp-victus-gaming-laptop-i5-16gb-512gb", product_name: "HP Victus Gaming Laptop i5 16GB 512GB", brand: "HP", category: "electronics", image: "/images/hp-victus-gaming-laptop-i5-16gb-512gb.jpg" },
  { product_key: "nike-club-men-hoodie-black", product_name: "Nike Club Men Hoodie Black", brand: "Nike", category: "clothes", image: "/images/nike-club-men-hoodie-black.jpg" },
  { product_key: "adidas-men-running-shoes-duramo-sl", product_name: "Adidas Men Running Shoes Duramo SL", brand: "Adidas", category: "clothes", image: "/images/adidas-men-running-shoes-duramo-sl.jpg" },
  { product_key: "levi-s-men-511-slim-jeans-blue", product_name: "Levi's Men 511 Slim Jeans Blue", brand: "Levi's", category: "clothes", image: "/images/levi-s-men-511-slim-jeans-blue.jpg" },
  { product_key: "puma-unisex-essential-logo-tee", product_name: "Puma Unisex Essential Logo Tee", brand: "Puma", category: "clothes", image: "/images/puma-unisex-essential-logo-tee.jpg" }
];

const paymentOptionsData = {
  "UPI": [
    { name: "Google Pay", discount: 300 },
    { name: "PhonePe", discount: 250 },
    { name: "Paytm", discount: 200 }
  ],
  "Credit Card": [
    { name: "Axis Bank", discount: 2000 },
    { name: "ICICI Bank", discount: 1800 },
    { name: "HDFC Bank", discount: 1500 },
    { name: "SBI Card", discount: 1200 }
  ],
  "Debit Card": [
    { name: "ICICI Debit", discount: 600 },
    { name: "HDFC Debit", discount: 500 },
    { name: "SBI Debit", discount: 400 }
  ]
};

export default function ProductPage() {
  const params = useParams();
  const router = useTransitionRouter();
  const productId = params.productId as string;
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [historyStats, setHistoryStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Credit Card" | "Debit Card">("UPI");
  const [selectedGateway, setSelectedGateway] = useState(paymentOptionsData["UPI"][0]);

  const handlePaymentMethodChange = (method: "UPI" | "Credit Card" | "Debit Card") => {
    setPaymentMethod(method);
    setSelectedGateway(paymentOptionsData[method][0]);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const normalizeSlug = (value: any) => {
          return String(value || "")
            .toLowerCase()
            .trim()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
        };

        const slug = decodeURIComponent(productId);

        let matchedRow = staticProducts.find(
          (p) => normalizeSlug(p.product_key) === normalizeSlug(slug)
        );

        if (!matchedRow) {
          matchedRow = staticProducts.find(
            (p) => normalizeSlug(p.product_name) === normalizeSlug(slug)
          );
        }

        if (!matchedRow && staticProducts.length > 0) {
          matchedRow = staticProducts[0];
        }

        let finalProductId = matchedRow ? matchedRow.product_key : "";

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const [prodRes, searchRes, histRes, recRes] = await Promise.all([
          fetch(`${baseUrl}/api/get-product?productId=${finalProductId}`),
          fetch(`${baseUrl}/api/search-products?productId=${finalProductId}`),
          fetch(`${baseUrl}/api/get-history?productId=${finalProductId}`),
          fetch(`${baseUrl}/api/get-recommendation?productId=${finalProductId}`),
        ]);

        if (!prodRes.ok) throw new Error("Product not found");

        const [prodData, searchData, histData, recData] = await Promise.all([
          prodRes.json(),
          searchRes.json(),
          histRes.json(),
          recRes.json(),
        ]);

        let allPrices: number[] = [];
        if (histData.history) {
            Object.values(histData.history).forEach((platformHistory: any) => {
                platformHistory.forEach((item: any) => allPrices.push(parseFloat(item.price)));
            });
        }
        
        const sortedPlatforms = searchData.sort((a: any, b: any) => a.price - b.price);
        const currentPrice = sortedPlatforms.length > 0 ? sortedPlatforms[0].price : 0;
        const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
        const highestPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
        const averagePrice = allPrices.length > 0 ? Math.round(allPrices.reduce((a,b)=>a+b,0)/allPrices.length) : 0;

        setProduct({ ...prodData, ...matchedRow });
        setPlatforms(sortedPlatforms);
        setHistoryStats({ current: currentPrice, lowest: lowestPrice, highest: highestPrice, average: averagePrice });
        setRecommendation(recData);

        if (histData.history && histData.history["Amazon"]) {
          const formatted = histData.history["Amazon"].map((item: any) => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
            price: item.price
          }));
          setChartData(formatted);
        } else {
          const firstPlatform = Object.keys(histData.history || {})[0];
          if (firstPlatform) {
            const formatted = histData.history[firstPlatform].map((item: any) => ({
              date: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
              price: item.price
            }));
            setChartData(formatted);
          }
        }

      } catch (err: any) {
        setError(err.message || "Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    }

    if (productId) {
      fetchData();
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary">
        <ShaderBackground mode="dashboard" opacity={0.6} />
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-on-surface-variant font-bold text-sm">Analyzing market intelligence...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-on-background px-6 text-center">
        <ShaderBackground mode="dashboard" opacity={0.6} />
        <ShieldAlert className="w-16 h-16 text-error mb-4" />
        <h2 className="text-headline-lg font-bold text-primary mb-2">Analysis Failed</h2>
        <p className="text-on-surface-variant mb-6">{error || "Could not retrieve product data."}</p>
        <button onClick={() => router.push('/')} className="px-6 py-3 btn-primary-glow text-on-primary font-bold rounded-xl text-sm">Go Back</button>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score <= 35) return "text-surface-tint";
    if (score <= 70) return "text-secondary";
    return "text-error";
  };
  const riskScore = Math.floor(Math.random() * 30) + 20; // Simulated risk

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background text-on-background">
      {/* Ambient Dashboard Shader */}
      <ShaderBackground mode="dashboard" opacity={0.6} />

      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-20">
        
        {/* Breadcrumb Back */}
        <div className="mb-8 text-left">
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-on-surface-variant/80 hover:text-primary transition-all text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </button>
        </div>

        {/* Product Meta Header card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 rounded-3xl border border-white/40 shadow-glass flex flex-col md:flex-row gap-8 mb-10 items-start md:items-center text-left"
        >
          <div className="w-28 h-28 md:w-36 md:h-36 bg-white border border-outline-variant/30 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden relative group">
            {product.image ? (
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80`;
                    }}
                />
            ) : (
                <ShoppingBag className="w-12 h-12 text-outline" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="px-3 py-1 bg-primary-fixed text-primary border border-primary/10 rounded-full text-[10px] font-bold uppercase tracking-wider">{product.brand}</span>
              <span className="px-3 py-1 bg-secondary-container/20 text-secondary border border-secondary/20 rounded-full text-[10px] font-bold uppercase tracking-wider">{product.category}</span>
            </div>
            <h1 className="text-display-lg md:text-[42px] font-bold text-primary mb-4 leading-tight">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 bg-white/50 px-3.5 py-1.5 rounded-xl border border-outline-variant/30 text-sm">
                <Star className="w-4.5 h-4.5 text-secondary fill-secondary" />
                <span className="font-bold text-primary">{product.rating}</span>
                <span className="text-on-surface-variant/80">({product.reviews?.toLocaleString()} reviews)</span>
              </div>
              {user ? (
                <motion.button 
                  onClick={() => router.push('/alerts')}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-fixed text-primary hover:bg-primary-fixed-dim border border-primary/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-surface-tint" /> Monitor Price
                </motion.button>
              ) : (
                <motion.button 
                  onClick={() => router.push('/login')}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/40 text-on-surface-variant/80 border border-outline-variant/30 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/70 transition-colors cursor-pointer"
                >
                  <Lock className="w-4 h-4" /> Sign In to Track
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Column (5/12) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* AI Recommendation Engine Card */}
            <div className="p-8 bg-white/45 backdrop-blur-xl border border-white/40 rounded-3xl shadow-glass relative overflow-hidden">
              <div className={cn(
                "absolute top-0 left-0 w-full h-1.5",
                recommendation?.recommendation === 'BUY' ? 'bg-primary' : 'bg-secondary'
              )}></div>
              
              <div className="flex items-center gap-2 text-on-surface-variant/80 font-bold text-xs uppercase tracking-wider mb-6">
                <Brain className="w-4.5 h-4.5 text-primary" /> AI Purchase Advisor
              </div>
              
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Recommendation</div>
                  <div className={cn(
                    "text-3xl md:text-4xl font-black",
                    recommendation?.recommendation === 'BUY' ? 'text-primary' : 'text-secondary'
                  )}>
                    {recommendation?.recommendation || "ANALYZING"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Confidence</div>
                  <div className="text-2xl md:text-3xl font-black text-primary">{recommendation?.confidence ? Math.round(recommendation.confidence * 100) : 0}%</div>
                </div>
              </div>
              
              <div className="p-4 bg-background/50 rounded-xl border border-outline-variant/20 mb-5 text-sm leading-relaxed text-on-surface-variant">
                &ldquo;{recommendation?.explanation || recommendation?.reason}&rdquo;
              </div>
              
              {recommendation?.recommendation !== 'BUY' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 rounded-xl p-3.5 border border-outline-variant/20">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Est. Drop Value</div>
                    <div className="text-base font-extrabold text-primary">
                      ₹{historyStats?.current > historyStats?.lowest ? (historyStats.current - historyStats.lowest).toLocaleString() : Math.round((historyStats?.current || 0) * 0.12).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-background/50 rounded-xl p-3.5 border border-outline-variant/20">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Est. Drop Window</div>
                    <div className="text-base font-extrabold text-secondary">{recommendation?.expectedDropWindow || 'N/A'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Market Deals Card */}
            <div className="p-8 bg-white/45 backdrop-blur-xl border border-white/40 rounded-3xl shadow-glass relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-primary font-bold text-base md:text-lg">
                  <Zap className="w-5 h-5 text-secondary" /> Live Market Offers
                </div>
                <span className="px-2 py-0.5 bg-primary-fixed text-primary text-[10px] font-bold rounded-lg border border-primary/20">LIVE METRIC</span>
              </div>
              
              <div className="relative">
                {!user && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/75 backdrop-blur-md rounded-2xl border border-outline-variant/20 p-6 text-center">
                    <Lock className="w-7 h-7 text-primary mb-3" />
                    <h3 className="text-base font-bold text-primary mb-1">Locked Market Data</h3>
                    <p className="text-xs text-on-surface-variant/80 mb-4 px-2">Sign in to unlock active platform listings & discount matrices.</p>
                    <button onClick={() => router.push('/signup')} className="px-5 py-2 btn-primary-glow text-on-primary text-xs font-bold rounded-full transition-all">
                      Unlock Now
                    </button>
                  </div>
                )}
                
                <div className={cn("space-y-3", !user && 'opacity-30 blur-sm pointer-events-none')}>
                  {platforms.map((p, i) => {
                    const inStock = p.inStock ?? true;
                    return (
                      <div key={i} className={cn(
                        "flex items-center justify-between p-4 rounded-xl border",
                        i === 0 ? 'bg-primary-fixed/30 border-primary/20 shadow-sm' : 'bg-background/50 border-outline-variant/20'
                      )}>
                        <div>
                          <div className="font-bold text-primary text-sm mb-0.5">{p.platform}</div>
                          <div className="flex items-center gap-2">
                            <div className={cn("text-[10px] font-bold uppercase", inStock ? 'text-surface-tint' : 'text-error')}>
                              {inStock ? "IN STOCK" : "OUT OF STOCK"}
                            </div>
                            {p.rating && (
                              <div className="flex items-center text-[10px] font-bold text-secondary">
                                <Star className="w-3 h-3 fill-secondary mr-0.5" /> {p.rating}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-extrabold text-primary mb-1">₹{p.price.toLocaleString()}</div>
                          <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-surface-tint hover:text-primary transition-all">
                            View Deal <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* True Cost Calculator */}
            <div className="p-8 bg-white/45 backdrop-blur-xl border border-white/40 rounded-3xl shadow-glass">
              <div className="flex items-center gap-2 text-primary font-bold text-base md:text-lg mb-6">
                <Calculator className="w-5 h-5 text-surface-tint" /> True Cost Calculator
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4 bg-background/50 p-1 rounded-xl border border-outline-variant/20">
                {(["UPI", "Credit Card", "Debit Card"] as const).map(method => (
                  <button 
                    key={method}
                    onClick={() => handlePaymentMethodChange(method)}
                    className={cn(
                      "py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                      paymentMethod === method 
                        ? 'bg-white text-primary shadow-sm' 
                        : 'text-on-surface-variant/80 hover:text-primary'
                    )}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {paymentOptionsData[paymentMethod].map((gateway) => (
                  <button
                    key={gateway.name}
                    onClick={() => setSelectedGateway(gateway)}
                    className={cn(
                      "whitespace-nowrap px-4 py-1.5 text-xs font-bold rounded-full border transition-all",
                      selectedGateway.name === gateway.name 
                        ? 'bg-primary-fixed/50 text-primary border-primary/20' 
                        : 'bg-white/40 text-on-surface-variant border-outline-variant/30 hover:bg-white/60'
                    )}
                  >
                    {gateway.name} <span className="opacity-70 font-normal ml-0.5">(-₹{gateway.discount})</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-b border-outline-variant/20 pb-6 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Base Platform Cost</span>
                  <span className="font-semibold text-primary">₹{platforms[0]?.price?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Merchant Taxes & Charges</span>
                  <span className="font-semibold text-primary">Included</span>
                </div>
                <div className="flex justify-between text-surface-tint font-bold">
                  <span>{selectedGateway.name} Rebate</span>
                  <span>-₹{selectedGateway.discount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="text-on-surface-variant/85 text-xs uppercase font-bold tracking-wider">Estimated Payable</span>
                <span className="text-2xl md:text-3xl font-black text-primary">
                  ₹{((platforms[0]?.price || 0) - selectedGateway.discount).toLocaleString()}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column (7/12) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Price History & Recharts Chart */}
            <div className="p-8 bg-white/45 backdrop-blur-xl border border-white/40 rounded-3xl shadow-glass">
              <div className="flex items-center gap-2 text-primary font-bold text-base md:text-lg mb-8">
                <Activity className="w-5 h-5 text-primary" /> Price Trajectory
              </div>

              {/* Stat Widgets */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-background/50 border border-outline-variant/20 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Current</div>
                  <div className="text-base font-extrabold text-primary">₹{historyStats?.current?.toLocaleString() || 0}</div>
                </div>
                <div className="bg-background/50 border border-outline-variant/20 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 font-serif text-surface-tint">Lowest</div>
                  <div className="text-base font-extrabold text-surface-tint">₹{historyStats?.lowest?.toLocaleString() || 0}</div>
                </div>
                <div className="bg-background/50 border border-outline-variant/20 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 font-serif text-error">Highest</div>
                  <div className="text-base font-extrabold text-error">₹{historyStats?.highest?.toLocaleString() || 0}</div>
                </div>
                <div className="bg-background/50 border border-outline-variant/20 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Average</div>
                  <div className="text-base font-extrabold text-secondary">₹{historyStats?.average?.toLocaleString() || 0}</div>
                </div>
              </div>

              {/* Chart container */}
              <div className="h-[320px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#064e3b" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e0" vertical={false} />
                    <XAxis dataKey="date" stroke="#707974" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#707974" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} dx={-10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        border: '1px solid #bfc9c3', 
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(6, 78, 59, 0.08)',
                        backdropFilter: 'blur(10px)'
                      }}
                      itemStyle={{ color: '#003527', fontWeight: 'bold' }}
                      labelStyle={{ color: '#707974', fontWeight: '600', fontSize: '11px', marginBottom: '4px' }}
                      formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Price']}
                    />
                    <ReferenceLine x="Oct" stroke="#fea619" strokeDasharray="3 3" label={{ position: 'top', value: 'Festival Season Discount', fill: '#855300', fontSize: 9, fontWeight: 'bold' }} />
                    <ReferenceLine x="May" stroke="#003527" strokeDasharray="3 3" label={{ position: 'top', value: 'Summer Markdown', fill: '#003527', fontSize: 9, fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="price" stroke="#003527" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Volatility Risk Card */}
              <div className="p-8 bg-white/45 backdrop-blur-xl border border-white/40 rounded-3xl shadow-glass">
                <div className="flex items-center gap-2 text-primary font-bold text-base mb-6">
                  <Percent className="w-5 h-5 text-secondary" /> Volatility Risk
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-on-surface-variant text-xs uppercase font-bold tracking-wider">Purchase Volatility</div>
                  <div className={cn("font-black text-lg", getRiskColor(riskScore))}>{riskScore}/100</div>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2.5 mb-6 overflow-hidden border border-outline-variant/10">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      riskScore <= 35 ? 'bg-surface-tint' : riskScore <= 70 ? 'bg-secondary' : 'bg-error'
                    )} 
                    style={{ width: `${riskScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {riskScore <= 35 
                    ? "Low price fluctuations detected. Highly stable buying window." 
                    : riskScore <= 70 
                      ? "Moderate market fluctuation. Consider setting an alert." 
                      : "Elevated market volatility. We advise waiting for corrections."}
                </p>
              </div>

              {/* Sentiment Summary Card */}
              <div className="p-8 bg-white/45 backdrop-blur-xl border border-white/40 rounded-3xl shadow-glass">
                <div className="flex items-center gap-2 text-primary font-bold text-base mb-6">
                  <MessageSquare className="w-5 h-5 text-surface-tint" /> Review Consensus
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <ThumbsUp className="w-4 h-4 text-surface-tint mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-on-surface-variant">
                      {reviewsData[product.product_key]?.[1] || "Solid hardware performance and display parameters."}
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <ThumbsDown className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-on-surface-variant">
                      {reviewsData[product.product_key]?.[2] || "Average charging velocity and accessory availability."}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/20">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Consensus Verdict</div>
                    <div className="text-sm font-semibold text-primary">
                      {reviewsData[product.product_key]?.[4] || "A highly practical device suited for most consumers."}
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
