"use client";

import { useState } from "react";
import { useTransitionRouter } from "@/context/TransitionContext";
import { ArrowLeft, GitCompare, Zap, Search, Brain, Activity, Target, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import ShaderBackground from "@/components/ShaderBackground";
import Navbar from "@/components/Navbar";

const staticProducts = [
  { product_key: "apple-iphone-15-128gb-black", product_name: "Apple iPhone 15 128GB Black", brand: "Apple", current_price: 69999, platform: "Amazon", historic_low: 62000, recommendation: "WAIT", specs: { storage: "128GB", display: "6.1\" Super Retina XDR", camera: "48MP Main", battery: "3349 mAh" }, review_summary: "Users generally love the iPhone 15 for its refined design and great cameras, though the 60Hz display is a sticking point at this price." },
  { product_key: "samsung-galaxy-s24-256gb-onyx-black", product_name: "Samsung Galaxy S24 256GB Onyx Black", brand: "Samsung", current_price: 79999, platform: "Flipkart", historic_low: 74000, recommendation: "BUY", specs: { storage: "256GB", display: "6.2\" Dynamic AMOLED 2X", camera: "50MP Main", battery: "4000 mAh" }, review_summary: "The Galaxy S24 remains a strong contender for those wanting a compact, powerful Android device. Fast performance and good battery life." },
  { product_key: "oneplus-12-256gb-flowy-emerald", product_name: "OnePlus 12 256GB Flowy Emerald", brand: "OnePlus", current_price: 64999, platform: "Amazon", historic_low: 58000, recommendation: "WAIT", specs: { storage: "256GB", display: "6.82\" LTPO AMOLED", camera: "50MP Main", battery: "5400 mAh" }, review_summary: "Reviewers praise the OnePlus 12 as a true flagship killer offering incredible value, performance, and superfast charging." },
  { product_key: "google-pixel-8-128gb-hazel", product_name: "Google Pixel 8 128GB Hazel", brand: "Google", current_price: 59999, platform: "Croma", historic_low: 49999, recommendation: "WAIT", specs: { storage: "128GB", display: "6.2\" OLED", camera: "50MP Main", battery: "4575 mAh" }, review_summary: "The Pixel 8 is loved for its software and cameras, but power users might find the battery lacking." }
];

export default function ComparePage() {
  const router = useTransitionRouter();
  const [product1Key, setProduct1Key] = useState(staticProducts[0].product_key);
  const [product2Key, setProduct2Key] = useState(staticProducts[1].product_key);

  const product1 = staticProducts.find(p => p.product_key === product1Key);
  const product2 = staticProducts.find(p => p.product_key === product2Key);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background text-on-background">
      {/* WebGL Ambient Background */}
      <ShaderBackground mode="dashboard" opacity={0.6} />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-20">
        
        {/* Header Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-display-lg md:text-[52px] font-bold text-primary mb-4 leading-tight">
            Compare Head-to-Head
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Select two devices from our catalog to instantly evaluate prices, historical lows, and AI purchase recommendations side-by-side.
          </p>
        </div>

        {/* Dropdowns Selector Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Select Product 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/40 shadow-glass flex flex-col space-y-2 relative group">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-wider ml-1">First Device</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-on-surface-variant/60 group-focus-within:text-primary transition-colors" />
              </div>
              <select 
                value={product1Key}
                onChange={(e) => setProduct1Key(e.target.value)}
                className="w-full bg-white/45 border border-outline-variant/40 rounded-xl py-3.5 pl-11 pr-8 text-on-surface font-semibold text-sm appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
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

          {/* Select Product 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/40 shadow-glass flex flex-col space-y-2 relative group">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider ml-1">Second Device</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-on-surface-variant/60 group-focus-within:text-secondary transition-colors" />
              </div>
              <select 
                value={product2Key}
                onChange={(e) => setProduct2Key(e.target.value)}
                className="w-full bg-white/45 border border-outline-variant/40 rounded-xl py-3.5 pl-11 pr-8 text-on-surface font-semibold text-sm appearance-none outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all cursor-pointer"
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
        </div>

        {/* Matrix Container */}
        {(product1 && product2) && (
          <div className="glass-panel border border-white/40 rounded-[2.5rem] overflow-hidden shadow-glass">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant/20">
              
              {/* Product 1 Details */}
              <div className="p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-primary-container bg-primary-fixed border border-primary/10 px-3 py-1 rounded-full inline-block mb-3 uppercase tracking-wider">
                    {product1.brand}
                  </div>
                  <h2 className="text-headline-md font-bold text-primary mb-10 leading-tight">
                    {product1.product_name}
                  </h2>

                  <div className="space-y-8">
                    {/* Price */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-on-surface-variant text-sm font-semibold">
                          <Zap className="w-4 h-4 text-secondary" /> Current Offer
                        </div>
                        <span className="px-2 py-0.5 bg-primary-fixed/40 text-primary text-xs font-bold rounded border border-primary/20">
                          {product1.platform}
                        </span>
                      </div>
                      <div className="text-3xl font-black text-on-surface">₹{product1.current_price.toLocaleString()}</div>
                    </div>

                    {/* Low Price */}
                    <div>
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm font-semibold mb-2">
                        <Activity className="w-4 h-4 text-surface-tint" /> Historic Low
                      </div>
                      <div className="text-2xl font-bold text-surface-tint">₹{product1.historic_low.toLocaleString()}</div>
                    </div>

                    {/* Recommendation */}
                    <div className="pt-6 border-t border-outline-variant/20">
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm font-semibold mb-4">
                        <Brain className="w-4 h-4 text-primary" /> AI Purchase Advisor
                      </div>
                      <div className={cn(
                        "inline-block px-4 py-1.5 rounded-xl border text-sm font-bold tracking-wider",
                        product1.recommendation === "BUY"
                          ? "bg-primary-fixed text-primary border-primary/10"
                          : "bg-secondary-container/20 text-secondary border-secondary/20"
                      )}>
                        {product1.recommendation === "BUY" ? "✓ STRONG BUY NOW" : "⚠ WAIT FOR DROP"}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="pt-6 border-t border-outline-variant/20">
                      <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" /> Sentiment Analysis
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed italic border-l-2 border-primary pl-3">
                        &ldquo;{product1.review_summary}&rdquo;
                      </p>
                    </div>

                    {/* Specs */}
                    <div className="pt-6 border-t border-outline-variant/20 space-y-3">
                      <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Specs Overview</div>
                      <div className="flex justify-between text-sm py-1 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant">Storage</span>
                        <span className="font-semibold text-primary">{product1.specs.storage}</span>
                      </div>
                      <div className="flex justify-between text-sm py-1 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant">Display</span>
                        <span className="font-semibold text-primary">{product1.specs.display}</span>
                      </div>
                      <div className="flex justify-between text-sm py-1 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant">Camera</span>
                        <span className="font-semibold text-primary">{product1.specs.camera}</span>
                      </div>
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-on-surface-variant">Battery</span>
                        <span className="font-semibold text-primary">{product1.specs.battery}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <button 
                    onClick={() => router.push(`/product/${product1.product_key}`)}
                    className="w-full py-3.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm"
                  >
                    View Product Details
                  </button>
                </div>
              </div>

              {/* Product 2 Details */}
              <div className="p-8 md:p-12 flex flex-col justify-between bg-white/10">
                <div>
                  <div className="text-xs font-bold text-secondary bg-secondary-container/20 border border-secondary/20 px-3 py-1 rounded-full inline-block mb-3 uppercase tracking-wider">
                    {product2.brand}
                  </div>
                  <h2 className="text-headline-md font-bold text-primary mb-10 leading-tight">
                    {product2.product_name}
                  </h2>

                  <div className="space-y-8">
                    {/* Price */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-on-surface-variant text-sm font-semibold">
                          <Zap className="w-4 h-4 text-secondary" /> Current Offer
                        </div>
                        <span className="px-2 py-0.5 bg-primary-fixed/40 text-primary text-xs font-bold rounded border border-primary/20">
                          {product2.platform}
                        </span>
                      </div>
                      <div className="text-3xl font-black text-on-surface">₹{product2.current_price.toLocaleString()}</div>
                    </div>

                    {/* Low Price */}
                    <div>
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm font-semibold mb-2">
                        <Activity className="w-4 h-4 text-surface-tint" /> Historic Low
                      </div>
                      <div className="text-2xl font-bold text-surface-tint">₹{product2.historic_low.toLocaleString()}</div>
                    </div>

                    {/* Recommendation */}
                    <div className="pt-6 border-t border-outline-variant/20">
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm font-semibold mb-4">
                        <Brain className="w-4 h-4 text-primary" /> AI Purchase Advisor
                      </div>
                      <div className={cn(
                        "inline-block px-4 py-1.5 rounded-xl border text-sm font-bold tracking-wider",
                        product2.recommendation === "BUY"
                          ? "bg-primary-fixed text-primary border-primary/10"
                          : "bg-secondary-container/20 text-secondary border-secondary/20"
                      )}>
                        {product2.recommendation === "BUY" ? "✓ STRONG BUY NOW" : "⚠ WAIT FOR DROP"}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="pt-6 border-t border-outline-variant/20">
                      <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" /> Sentiment Analysis
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed italic border-l-2 border-secondary pl-3">
                        &ldquo;{product2.review_summary}&rdquo;
                      </p>
                    </div>

                    {/* Specs */}
                    <div className="pt-6 border-t border-outline-variant/20 space-y-3">
                      <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Specs Overview</div>
                      <div className="flex justify-between text-sm py-1 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant">Storage</span>
                        <span className="font-semibold text-primary">{product2.specs.storage}</span>
                      </div>
                      <div className="flex justify-between text-sm py-1 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant">Display</span>
                        <span className="font-semibold text-primary">{product2.specs.display}</span>
                      </div>
                      <div className="flex justify-between text-sm py-1 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant">Camera</span>
                        <span className="font-semibold text-primary">{product2.specs.camera}</span>
                      </div>
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-on-surface-variant">Battery</span>
                        <span className="font-semibold text-primary">{product2.specs.battery}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <button 
                    onClick={() => router.push(`/product/${product2.product_key}`)}
                    className="w-full py-3.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm"
                  >
                    View Product Details
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

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
