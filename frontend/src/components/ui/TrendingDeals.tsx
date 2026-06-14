"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface DealCardProps {
  productName: string;
  currentPrice: string;
  oldPrice: string;
  discount: string;
  platform: string;
  signal: string;
  isBestDeal?: boolean;
  productSlug?: string;
}

const DealCard: React.FC<DealCardProps> = ({
  productName,
  currentPrice,
  oldPrice,
  discount,
  platform,
  signal,
  isBestDeal = false,
  productSlug,
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => productSlug && router.push(`/product/${productSlug}`)}
      className={cn(
        "relative bg-white/60 backdrop-blur-md rounded-2xl border border-emerald-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] hover:border-emerald-200 transition-all duration-300 cursor-pointer",
        "flex flex-col gap-4"
      )}
    >
      {isBestDeal && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-amber-300">
          Best Deal
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-bold text-gray-900 text-lg leading-tight flex-1">
          {productName}
        </h3>
        <motion.div
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center"
        >
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </motion.div>
      </div>

      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-3xl font-black text-emerald-900">{currentPrice}</span>
        <span className="text-sm font-medium text-gray-400 line-through">{oldPrice}</span>
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="inline-flex items-center w-fit"
      >
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
          {discount}
        </span>
      </motion.div>

      <div className="flex items-center justify-between pt-4 mt-2 border-t border-emerald-100/50">
        <span className="text-sm font-semibold text-gray-700">{platform}</span>
        <span className="text-xs font-medium text-emerald-600">{signal}</span>
      </div>
    </motion.div>
  );
};

interface TrendingDealsProps {
  deals?: DealCardProps[];
}

export const TrendingDeals: React.FC<TrendingDealsProps> = ({ deals = [] }) => {
  const defaultDeals: DealCardProps[] = [
    {
      productName: "Apple iPhone 15",
      currentPrice: "₹65,999",
      oldPrice: "₹79,900",
      discount: "17% Drop",
      platform: "Amazon",
      signal: "Lowest this week",
      isBestDeal: false,
      productSlug: "apple-iphone-15-128gb-black"
    },
    {
      productName: "Sony WH-1000XM5",
      currentPrice: "₹24,990",
      oldPrice: "₹34,990",
      discount: "29% Drop",
      platform: "Flipkart",
      signal: "Popular deal",
      isBestDeal: true,
      productSlug: "sony-wh-1000xm5-black"
    },
    {
      productName: "Samsung Galaxy S24",
      currentPrice: "₹74,999",
      oldPrice: "₹89,999",
      discount: "16% Drop",
      platform: "Croma",
      signal: "Worth tracking",
      isBestDeal: false,
      productSlug: "samsung-galaxy-s24-256gb-onyx-black"
    },
  ];

  const displayDeals = deals.length > 0 ? deals : defaultDeals;

  return (
    <section className="w-full relative z-10 pb-24">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h2 className="text-headline-lg font-bold font-display text-primary mb-2">
              Trending Deals Today
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl">
              Fresh price drops and smart deal signals picked for quick
              comparison.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayDeals.map((deal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <DealCard {...deal} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
