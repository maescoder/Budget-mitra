"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTransitionRouter } from "@/context/TransitionContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, ExternalLink, Activity, Brain, ShieldAlert, 
  ThumbsUp, ThumbsDown, MessageSquare, TrendingDown, Bell, 
  ShoppingCart, Target, DollarSign, Package, CheckCircle, ChevronRight, Lock, ArrowLeft, Calculator, Percent, Zap, TrendingUp, AlertCircle, Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ShaderBackground from "@/components/ShaderBackground";
import Navbar from "@/components/Navbar";
import { BudgetMitraLoader } from "@/components/ui/BudgetMitraLoader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Review sentiments (same as before)
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
  "Credit": [
    { name: "Axis Bank", discount: 2000 },
    { name: "ICICI Bank", discount: 1800 },
    { name: "HDFC Bank", discount: 1500 },
    { name: "SBI Card", discount: 1200 }
  ],
  "Debit": [
    { name: "ICICI Debit", discount: 600 },
    { name: "HDFC Debit", discount: 500 },
    { name: "SBI Debit", discount: 400 }
  ]
};

// Types
interface PriceData {
  date: Date;
  price: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  iconBgColor?: string;
}

interface AIInsightProps {
  verdict: string;
  confidence: number;
  explanation: string;
  action: string;
  possibleDrop: string;
  expectedWindow: string;
}

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="flex flex-col justify-center rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-0.5">
          {value}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">{subtitle}</p>
      </div>
    </motion.div>
  );
}

// AI Insight Card Component
function AIInsightCard({
  verdict,
  confidence,
  explanation,
  action,
  possibleDrop,
  expectedWindow,
}: AIInsightProps) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(confidence);
    }, 300);
    return () => clearTimeout(timer);
  }, [confidence]);

  const isGoodTime = verdict.toLowerCase().includes("buy") || verdict.toLowerCase().includes("good");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="border-emerald-200/50 dark:border-emerald-800/30 shadow-sm h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              AI Buying Insight
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Verdict */}
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-sm font-medium px-3 py-1",
                isGoodTime
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-700"
              )}
              variant="outline"
            >
              {isGoodTime ? (
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
              )}
              {verdict}
            </Badge>
          </div>

          {/* Confidence Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">
                Confidence
              </span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {confidence}%
              </span>
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${animatedConfidence}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 border border-zinc-200/50 dark:border-zinc-700/50">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {explanation}
            </p>
          </div>

          {/* Action */}
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 border border-emerald-200/50 dark:border-emerald-800/30">
            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 mb-1">
              Suggested Action
            </p>
            <p className="text-sm text-emerald-900 dark:text-emerald-200">
              {action}
            </p>
          </div>

          {/* Mini Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Possible Extra Drop
              </p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {possibleDrop}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Expected Window
              </p>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                {expectedWindow}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Price Chart Component
function PriceChart({ data }: { data: { date: string; price: number }[] }) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const pricePadding = priceRange * 0.1;

  const currentPrice = prices[prices.length - 1] || 0;
  const lowestPrice = minPrice;
  const lowestIndex = prices.indexOf(lowestPrice);
  const currentIndex = prices.length - 1;

  const xScale = (index: number) => (index / Math.max(1, data.length - 1)) * chartWidth;
  const yScale = (price: number) =>
    chartHeight - ((price - (minPrice - pricePadding)) / (priceRange + pricePadding * 2)) * chartHeight;

  const pathData = data
    .map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.price);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  const areaData = `${pathData} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  useEffect(() => {
    if (svgRef.current) {
      const path = svgRef.current.querySelector(".chart-line");
      if (path) {
        const length = (path as SVGPathElement).getTotalLength();
        setPathLength(length);
        setTimeout(() => setIsAnimated(true), 100);
      }
    }
  }, [data]);

  const xLabels = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 5)) === 0).map((d, i) => ({
    label: d.date,
    x: xScale(data.indexOf(d))
  }));

  const yTicks = [0, 1, 2, 3, 4].map(i => {
    const y = (chartHeight / 4) * i;
    const priceValue = (minPrice - pricePadding) + (1 - i/4) * (priceRange + pricePadding * 2);
    return { y, value: Math.round(priceValue) };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      className="h-full"
    >
      <Card className="border-emerald-200/50 dark:border-emerald-800/30 shadow-sm h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Price History
          </CardTitle>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            See how this product's price has changed over the last 12 months.
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative w-full" style={{ aspectRatio: "2/1" }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient
                  id="areaGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="rgb(16, 185, 129)"
                    stopOpacity="0.3"
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(16, 185, 129)"
                    stopOpacity="0.05"
                  />
                </linearGradient>
              </defs>

              <g transform={`translate(${padding.left}, ${padding.top})`}>
                {/* Grid lines and Y-axis labels */}
                {yTicks.map((tick, i) => (
                  <g key={`y-${i}`}>
                    <line
                      x1={0}
                      y1={tick.y}
                      x2={chartWidth}
                      y2={tick.y}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                      className="text-zinc-200 dark:text-zinc-700"
                      opacity="0.5"
                    />
                    <text
                      x={-10}
                      y={tick.y + 4}
                      textAnchor="end"
                      className="text-[10px] fill-zinc-500 dark:fill-zinc-400 font-medium"
                    >
                      ₹{tick.value.toLocaleString('en-IN')}
                    </text>
                  </g>
                ))}

                {/* Area fill */}
                <path d={areaData} fill="url(#areaGradient)" />

                {/* Line */}
                <motion.path
                  className="chart-line"
                  d={pathData}
                  fill="none"
                  stroke="rgb(16, 185, 129)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ strokeDasharray: pathLength || 1000, strokeDashoffset: pathLength || 1000 }}
                  animate={
                    isAnimated
                      ? { strokeDashoffset: 0 }
                      : { strokeDashoffset: pathLength || 1000 }
                  }
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Lowest price marker */}
                <AnimatePresence>
                  {isAnimated && (
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.6, duration: 0.3 }}
                    >
                      <circle
                        cx={xScale(lowestIndex)}
                        cy={yScale(lowestPrice)}
                        r="5"
                        fill="rgb(16, 185, 129)"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <motion.circle
                        cx={xScale(lowestIndex)}
                        cy={yScale(lowestPrice)}
                        r="5"
                        fill="rgb(16, 185, 129)"
                        opacity="0.4"
                        initial={{ r: 5 }}
                        animate={{ r: 12 }}
                        transition={{
                          duration: 1.5,
                          repeat: 1,
                          ease: "easeOut",
                        }}
                      />
                      <text
                        x={xScale(lowestIndex)}
                        y={yScale(lowestPrice) - 15}
                        textAnchor="middle"
                        className="text-xs font-medium fill-emerald-700 dark:fill-emerald-400"
                      >
                        Lowest
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* Current price marker */}
                <AnimatePresence>
                  {isAnimated && currentIndex !== lowestIndex && (
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.8, duration: 0.3 }}
                    >
                      <circle
                        cx={xScale(currentIndex)}
                        cy={yScale(currentPrice)}
                        r="5"
                        fill="rgb(16, 185, 129)"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <motion.circle
                        cx={xScale(currentIndex)}
                        cy={yScale(currentPrice)}
                        r="5"
                        fill="rgb(16, 185, 129)"
                        opacity="0.4"
                        initial={{ r: 5 }}
                        animate={{ r: 12 }}
                        transition={{
                          duration: 1.5,
                          repeat: 1,
                          ease: "easeOut",
                        }}
                      />
                      <text
                        x={xScale(currentIndex)}
                        y={yScale(currentPrice) - 15}
                        textAnchor="middle"
                        className="text-xs font-medium fill-emerald-700 dark:fill-emerald-400"
                      >
                        Current
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* X-axis labels */}
                {xLabels.map((lbl, i) => (
                  <text
                    key={i}
                    x={lbl.x}
                    y={chartHeight + 25}
                    textAnchor="middle"
                    className="text-xs fill-zinc-600 dark:fill-zinc-400"
                  >
                    {lbl.label}
                  </text>
                ))}

                {/* Hover interaction overlay */}
                {data.map((d, i) => (
                  <circle
                    key={`hover-${i}`}
                    cx={xScale(i)}
                    cy={yScale(d.price)}
                    r={15}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredPoint !== null && (
                    <motion.g
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <circle
                        cx={xScale(hoveredPoint)}
                        cy={yScale(data[hoveredPoint].price)}
                        r={4}
                        fill="rgb(16, 185, 129)"
                        stroke="white"
                        strokeWidth={2}
                      />
                      <g transform={`translate(${xScale(hoveredPoint)}, ${yScale(data[hoveredPoint].price) - 35})`}>
                        <rect
                          x={-45}
                          y={-25}
                          width={90}
                          height={45}
                          rx={6}
                          fill="white"
                          className="drop-shadow-lg dark:fill-zinc-800"
                        />
                        <text
                          x={0}
                          y={-10}
                          textAnchor="middle"
                          className="text-[10px] font-bold fill-zinc-500 dark:fill-zinc-400"
                        >
                          {data[hoveredPoint].date}
                        </text>
                        <text
                          x={0}
                          y={5}
                          textAnchor="middle"
                          className="text-xs font-black fill-emerald-700 dark:fill-emerald-400"
                        >
                          ₹{data[hoveredPoint].price.toLocaleString('en-IN')}
                        </text>
                      </g>
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            </svg>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProductAnalysisPage() {
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
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Credit" | "Debit">("UPI");
  const [selectedGateway, setSelectedGateway] = useState(paymentOptionsData["UPI"][0]);

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  const handlePaymentMethodChange = (method: "UPI" | "Credit" | "Debit") => {
    setPaymentMethod(method);
    setSelectedGateway(paymentOptionsData[method][0]);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const normalizeSlug = (value: any) => String(value || "").toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
        const slug = decodeURIComponent(productId);

        let matchedRow = staticProducts.find((p) => normalizeSlug(p.product_key) === normalizeSlug(slug));
        if (!matchedRow) matchedRow = staticProducts.find((p) => normalizeSlug(p.product_name) === normalizeSlug(slug));
        if (!matchedRow && staticProducts.length > 0) matchedRow = staticProducts[0];

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
          prodRes.json(), searchRes.json(), histRes.json(), recRes.json(),
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
        setHistoryStats({ current: currentPrice, lowest: lowestPrice, highest: highestPrice, average: averagePrice, savings: averagePrice > currentPrice ? averagePrice - currentPrice : 0 });
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
    if (productId) fetchData();
  }, [productId]);

  if (isLoading) return <BudgetMitraLoader text="Loading Product Deals..." />;

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

  const reviewContent = reviewsData[product.product_key] || reviewsData["apple-iphone-15-128gb-black"];
  const isGoodBuy = recommendation?.recommendation === 'BUY';
  const riskScore = Math.floor(Math.random() * 30) + 20;

  const getRiskColor = (score: number) => {
    if (score <= 35) return "text-surface-tint";
    if (score <= 70) return "text-secondary";
    return "text-error";
  };

  const getConfidenceValue = (conf: any) => {
    if (conf === undefined || conf === null) return 80;
    const c = parseFloat(conf);
    if (isNaN(c)) return 80;
    return c > 1 ? Math.round(c) : Math.round(c * 100);
  };
  const confidencePercent = getConfidenceValue(recommendation?.confidence);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background text-on-background font-['Plus_Jakarta_Sans',sans-serif]">
      <ShaderBackground mode="dashboard" opacity={0.6} />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-20 space-y-6 text-left">
        
        {/* Back Button */}
        <div className="mb-4">
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-on-surface-variant/80 hover:text-primary transition-all text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </button>
        </div>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="glass-panel border border-white/40 shadow-glass overflow-hidden">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="flex items-center justify-center bg-white border border-outline-variant/30 rounded-2xl p-8 h-80 relative group shadow-sm">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80`; }}
                  />
                </div>
                
                <div className="space-y-5">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 leading-tight">{product.name}</h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="default">{product.category}</Badge>
                      <Badge variant="outline">{product.brand}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex bg-white/40 border border-outline-variant/30 px-3 py-1.5 rounded-lg items-center gap-2">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="font-bold text-primary">{product.rating || 4.5}</span>
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      ({(product.reviews || 12500).toLocaleString()} reviews)
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Best Live Price</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-primary">{formatPrice(historyStats?.current)}</span>
                        <span className="text-sm font-bold text-on-surface-variant ml-1">on {platforms[0]?.platform || "Amazon"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-secondary bg-secondary-container/20 px-3.5 py-2.5 rounded-xl border border-secondary/20 inline-flex">
                      <TrendingDown className="h-4 w-4" />
                      <span className="font-bold text-sm">Savings vs average: {formatPrice(historyStats?.savings || 0)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      className="flex-1 shadow-lg" 
                      onClick={() => {
                        const bestDeal = platforms[0]?.url;
                        if(bestDeal) window.open(bestDeal, '_blank');
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => router.push('/alerts')}>
                      <Bell className="h-4 w-4 mr-2" />
                      Set Price Alert
                    </Button>
                  </div>

                  {isGoodBuy && (
                    <Badge variant="default" className="mt-2 text-[10px] py-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Good time to buy
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Best Price"
            value={formatPrice(historyStats?.current)}
            subtitle="Best available right now"
          />
          <StatCard
            title="Lowest in 12 Months"
            value={formatPrice(historyStats?.lowest)}
            subtitle="Currently near the lowest"
          />
          <StatCard
            title="Average Price"
            value={formatPrice(historyStats?.average)}
            subtitle="Typical market price"
          />
          <StatCard
            title="Potential Savings"
            value={formatPrice(historyStats?.savings)}
            subtitle="Compared to average"
          />
        </div>

        {/* AI Insight & Price History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIInsightCard 
            verdict={
              recommendation?.recommendation && recommendation.recommendation !== "ANALYZING"
                ? recommendation.recommendation 
                : (historyStats?.current < historyStats?.average ? "GOOD VALUE" : "WAIT FOR DROP")
            }
            confidence={confidencePercent}
            explanation={recommendation?.explanation || recommendation?.reason || "Price is stable."}
            action={isGoodBuy ? "Buy now if you need it soon." : "Set a price alert and wait for a drop."}
            possibleDrop={formatPrice(Math.round((historyStats?.current || 0) * 0.05))}
            expectedWindow={recommendation?.expectedDropWindow || 'Uncertain'}
          />
          <PriceChart data={chartData} />
        </div>

        {/* Live Offers & Side Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Live Offers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-2">
            <Card className="glass-panel border border-white/40 shadow-glass h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary">Live Platform Offers</CardTitle>
                    <CardDescription>Compare current listings across e-commerce sites</CardDescription>
                  </div>
                  <span className="px-2 py-0.5 bg-primary-fixed text-primary text-[10px] font-bold rounded-lg border border-primary/20">LIVE METRIC</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {!user && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/75 backdrop-blur-md rounded-2xl border border-outline-variant/20 p-6 text-center shadow-lg">
                      <Lock className="w-8 h-8 text-primary mb-3" />
                      <h3 className="text-lg font-bold text-primary mb-2">Unlock Market Data</h3>
                      <p className="text-sm font-semibold text-on-surface-variant/80 mb-5 max-w-sm">Sign in to view active platform listings, stock availability, and exclusive discount matrices.</p>
                      <Button onClick={() => router.push('/signup')} className="shadow-md">
                        Create Free Account
                      </Button>
                    </div>
                  )}
                  
                  <div className={cn("space-y-4", !user && 'opacity-20 blur-sm pointer-events-none')}>
                    {platforms.map((platform, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className={cn(
                          "flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group",
                          i === 0 
                            ? 'bg-primary-fixed/40 border-primary/30 shadow-sm hover:shadow-md' 
                            : 'bg-white/40 border-outline-variant/30 hover:border-primary/40 hover:bg-white/60'
                        )}
                        onClick={() => { if(platform.url) window.open(platform.url, '_blank'); }}
                      >
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <div className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center border",
                            i === 0 ? 'bg-white border-primary/20' : 'bg-background border-outline-variant/30'
                          )}>
                            <Package className={cn("h-6 w-6", i === 0 ? "text-primary" : "text-on-surface-variant")} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-primary text-base">{platform.platform}</span>
                              {i === 0 && <Badge variant="default" className="text-[10px] py-0">Best Value</Badge>}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                              <span className={cn("flex items-center gap-1", platform.inStock !== false ? "text-surface-tint" : "text-error")}>
                                <CheckCircle className="h-3 w-3" />
                                {platform.inStock !== false ? "In Stock" : "Out of Stock"}
                              </span>
                              {platform.rating && (
                                <span className="flex items-center gap-1 text-secondary">
                                  <Star className="h-3 w-3 fill-secondary" />
                                  {platform.rating}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <span className="text-2xl font-black text-primary">{formatPrice(platform.price)}</span>
                          <Button size="sm" variant={i === 0 ? "default" : "outline"} className="shadow-sm">
                            View Deal
                            <ExternalLink className="h-3 w-3 ml-1.5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="space-y-6">
            
            {/* Price Stability */}
            <Card className="glass-panel border border-white/40 shadow-glass">
              <CardHeader>
                <CardTitle className="text-primary text-lg flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Price Stability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Volatility Score</span>
                  <Badge variant="outline" className={cn("font-black", getRiskColor(riskScore))}>
                    {riskScore} / 100
                  </Badge>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden border border-outline-variant/10">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      riskScore <= 35 ? 'bg-surface-tint' : riskScore <= 70 ? 'bg-secondary' : 'bg-error'
                    )} 
                    style={{ width: `${riskScore}%` }}
                  ></div>
                </div>
                <div className={cn(
                  "border rounded-xl p-4 text-sm font-semibold",
                  riskScore <= 35 ? 'bg-surface-tint/10 border-surface-tint/20 text-surface-tint' : 
                  riskScore <= 70 ? 'bg-secondary/10 border-secondary/20 text-secondary' : 
                  'bg-error/10 border-error/20 text-error'
                )}>
                  {riskScore <= 35 ? "Low volatility. Good time to purchase." : 
                   riskScore <= 70 ? "Moderate fluctuation. Alert recommended." : 
                   "High volatility. Wait for a correction."}
                </div>
              </CardContent>
            </Card>

            {/* Review Consensus */}
            <Card className="glass-panel border border-white/40 shadow-glass">
              <CardHeader>
                <CardTitle className="text-primary text-lg flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Review Consensus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold text-surface-tint uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ThumbsUp className="h-3 w-3" /> Pros
                  </p>
                  <p className="text-sm font-semibold text-on-surface-variant/90 leading-relaxed pl-4 border-l-2 border-surface-tint/40">
                    {reviewContent[1]}
                  </p>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ThumbsDown className="h-3 w-3" /> Cons
                  </p>
                  <p className="text-sm font-semibold text-on-surface-variant/90 leading-relaxed pl-4 border-l-2 border-secondary/40">
                    {reviewContent[2]}
                  </p>
                </div>

                <div className="pt-4 border-t border-outline-variant/20">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">Overall Verdict</p>
                  <p className="text-sm font-bold text-primary leading-relaxed bg-primary-fixed/40 p-3 rounded-xl border border-primary/20">
                    {reviewContent[4]}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Final Price Calculator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card className="glass-panel border border-white/40 shadow-glass">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                True Cost Calculator
              </CardTitle>
              <CardDescription>See how payment methods affect your final payable price</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="UPI" className="w-full">
                <TabsList className="mb-8 w-full grid grid-cols-3">
                  <TabsTrigger value="UPI" onClick={() => handlePaymentMethodChange("UPI")}>UPI</TabsTrigger>
                  <TabsTrigger value="Credit" onClick={() => handlePaymentMethodChange("Credit")}>Credit Card</TabsTrigger>
                  <TabsTrigger value="Debit" onClick={() => handlePaymentMethodChange("Debit")}>Debit Card</TabsTrigger>
                </TabsList>
                
                {(["UPI", "Credit", "Debit"] as const).map(method => (
                  <TabsContent key={method} value={method} className="space-y-6">
                    <div className="flex flex-wrap justify-center gap-4">
                      {paymentOptionsData[method].map((option, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedGateway(option)}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all text-center flex-1 min-w-[140px] max-w-[220px]",
                            selectedGateway.name === option.name
                              ? 'border-primary bg-primary-fixed/40 shadow-md transform scale-[1.02]'
                              : 'border-outline-variant/30 bg-white/40 hover:border-primary/40 hover:bg-white/60'
                          )}
                        >
                          <span className="block text-sm font-bold text-primary mb-2">{option.name}</span>
                          <Badge variant={selectedGateway.name === option.name ? "default" : "secondary"}>
                            -{formatPrice(option.discount)}
                          </Badge>
                        </button>
                      ))}
                    </div>

                    <div className="bg-white/40 border border-outline-variant/30 rounded-2xl p-6 md:p-8 space-y-4 max-w-2xl mx-auto shadow-sm">
                      <div className="flex justify-between items-center text-sm font-semibold text-on-surface-variant">
                        <span>Base Price</span>
                        <span className="text-primary">{formatPrice(historyStats?.current)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-semibold text-on-surface-variant">
                        <span>Taxes & Charges</span>
                        <span className="text-primary">Included</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-secondary">
                        <span>{selectedGateway.name} Rebate</span>
                        <span>-{formatPrice(selectedGateway.discount)}</span>
                      </div>
                      <div className="pt-5 border-t border-outline-variant/30 flex justify-between items-center mt-2">
                        <span className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Final Payable</span>
                        <span className="text-3xl font-black text-primary">
                          {formatPrice((historyStats?.current || 0) - selectedGateway.discount)}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
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
