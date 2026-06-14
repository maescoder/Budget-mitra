"use client";

import React, { useState } from 'react';
import { useTransitionRouter } from "@/context/TransitionContext";
import { useAuth } from "@/context/AuthContext";
import { Bell, TrendingDown, Target, Plus, Edit2, Pause, Play, Trash2, AlertCircle, Lock, Check } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// Components
import ShaderBackground from "@/components/ShaderBackground";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const staticProducts = [
  { product_key: "apple-iphone-15-128gb-black", product_name: "Apple iPhone 15 128GB Black", brand: "Apple", category: "mobile" },
  { product_key: "samsung-galaxy-s24-256gb-onyx-black", product_name: "Samsung Galaxy S24 256GB Onyx Black", brand: "Samsung", category: "mobile" },
  { product_key: "oneplus-12-256gb-flowy-emerald", product_name: "OnePlus 12 256GB Flowy Emerald", brand: "OnePlus", category: "mobile" },
  { product_key: "xiaomi-redmi-note-13-pro-256gb", product_name: "Xiaomi Redmi Note 13 Pro+ 256GB", brand: "Xiaomi", category: "mobile" },
  { product_key: "google-pixel-8-128gb-hazel", product_name: "Google Pixel 8 128GB Hazel", brand: "Google", category: "mobile" },
  { product_key: "sony-wh-1000xm5-black", product_name: "Sony WH-1000XM5 Black", brand: "Sony", category: "headphones" },
  { product_key: "lenovo-ideapad-slim-5-16gb-512gb", product_name: "Lenovo IdeaPad Slim 5 16GB 512GB", brand: "Lenovo", category: "electronics" }
];

interface Alert {
  id: string;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  status: 'active' | 'paused';
}

const AlertsPage = () => {
  const router = useTransitionRouter();
  const { user } = useAuth();
  
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      productName: 'Apple iPhone 15 128GB Black',
      targetPrice: 65000,
      currentPrice: 69999,
      status: 'active',
    },
    {
      id: '2',
      productName: 'Sony WH-1000XM5 Black',
      targetPrice: 22000,
      currentPrice: 24990,
      status: 'active',
    },
  ]);

  const [formData, setFormData] = useState({
    product: '',
    targetPrice: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit State
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  const [editTargetPrice, setEditTargetPrice] = useState<string>("");

  const calculateProgress = (target: number, current: number) => {
    return Math.min(100, Math.round((target / current) * 100));
  };

  const calculateGap = (target: number, current: number) => {
    return current - target;
  };

  const totalSavings = alerts.reduce((sum, alert) => sum + calculateGap(alert.targetPrice, alert.currentPrice), 0);
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product || !formData.targetPrice || !formData.email) return;
    
    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/set-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: formData.product,
          targetPrice: parseInt(formData.targetPrice),
          email: formData.email
        })
      });

      if (!res.ok) throw new Error("Failed to set alert");

      const match = staticProducts.find(p => p.product_key === formData.product);
      
      setAlerts([
        ...alerts,
        {
          id: Date.now().toString(),
          productName: match ? match.product_name : formData.product,
          targetPrice: parseInt(formData.targetPrice),
          currentPrice: parseInt(formData.targetPrice) + 1500, // Dummy simulated current price for the UI
          status: 'active'
        }
      ]);
      setFormData({ product: '', targetPrice: '', email: '' });
    } catch (err) {
      // Prototype fallback
      const match = staticProducts.find(p => p.product_key === formData.product);
      setAlerts([
        ...alerts,
        {
          id: Date.now().toString(),
          productName: match ? match.product_name : formData.product,
          targetPrice: parseInt(formData.targetPrice),
          currentPrice: parseInt(formData.targetPrice) + 1200,
          status: 'active'
        }
      ]);
      setFormData({ product: '', targetPrice: '', email: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleTogglePause = (id: string) => {
    setAlerts(alerts.map(a => {
      if (a.id === id) {
        return { ...a, status: a.status === 'active' ? 'paused' : 'active' };
      }
      return a;
    }));
  };

  const startEditing = (alert: Alert) => {
    setEditingAlertId(alert.id);
    setEditTargetPrice(alert.targetPrice.toString());
  };

  const saveEdit = (id: string) => {
    if (!editTargetPrice || isNaN(Number(editTargetPrice))) {
      setEditingAlertId(null);
      return;
    }

    setAlerts(alerts.map(a => {
      if (a.id === id) {
        return { ...a, targetPrice: parseInt(editTargetPrice) };
      }
      return a;
    }));
    setEditingAlertId(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-x-hidden bg-background text-on-background flex items-center justify-center p-6">
        <ShaderBackground mode="dashboard" opacity={0.6} />
        
        <div className="max-w-md w-full glass-panel border border-white/40 rounded-3xl p-8 text-center relative overflow-hidden shadow-glass">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/20 blur-3xl rounded-full"></div>
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-fixed/40 border border-primary/20 mb-6 text-primary">
            <Lock className="w-6 h-6" />
          </div>
          
          <h1 className="text-headline-lg font-bold text-primary mb-2">Members Only Area</h1>
          <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed">
            Please sign in to your Budget Mitra account to set automated monitors and receive notifications.
          </p>
          
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => router.push('/')}>
              Go Back
            </Button>
            <Button className="flex-1" onClick={() => router.push('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background text-on-background pb-20">
      <ShaderBackground mode="dashboard" opacity={0.6} />
      <Navbar />
      
      <div className="relative z-10 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-32">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="default" className="mb-4">
            Smart Price Alerts
          </Badge>
          <h1 className="text-5xl font-bold text-primary mb-4 leading-tight">
            Never Miss a Price Drop
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Create alerts for products you're watching. Budget Mitra monitors prices and notifies you when they reach your target.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <Card>
            <CardContent className="p-6 flex items-center gap-5 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center border border-primary/20">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-black text-primary">{activeAlertsCount}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Active Alerts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-5 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary-container/30 flex items-center justify-center border border-secondary/20">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-3xl font-black text-secondary">₹{totalSavings.toLocaleString()}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Potential Savings</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-5 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center border border-primary/20">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-black text-primary">3</p>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Price Drops Found</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Left Column: Create Alert Card */}
          <div className="lg:col-span-5">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-fixed/30 blur-3xl rounded-full pointer-events-none"></div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Create Price Alert</CardTitle>
                <CardDescription>
                  Choose a product, set your target price, and we'll notify you when the deal is ready.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAlert} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <Label htmlFor="product">Product</Label>
                    <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {staticProducts.map(p => (
                            <SelectItem key={p.product_key} value={p.product_key}>{p.product_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetPrice">Target Price</Label>
                    <Input
                      id="targetPrice"
                      type="number"
                      placeholder="e.g., 65000"
                      value={formData.targetPrice}
                      onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                    />
                    <p className="text-xs text-on-surface-variant/80 ml-1 font-semibold">
                      We'll alert you when the current price drops to this value or lower.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Notification Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4"
                  >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <><Plus className="w-5 h-5" /> Create Alert</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Active Alerts */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                    <Bell className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-headline-md font-bold text-primary">Active Monitors</h2>
            </div>

            {alerts.length === 0 ? (
              <Card className="border-dashed border-2 border-outline-variant/30 bg-white/20">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-4 border border-primary/20">
                    <AlertCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">No price alerts yet</h3>
                  <p className="text-on-surface-variant mb-6 font-semibold">
                    Set your first target price and Budget Mitra will watch the market for you.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                {alerts.map((alert) => {
                  const progress = calculateProgress(alert.targetPrice, alert.currentPrice);
                  const gap = calculateGap(alert.targetPrice, alert.currentPrice);
                  const isEditing = editingAlertId === alert.id;
                  const isActive = alert.status === 'active';

                  return (
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={alert.id}
                    >
                        <Card className={`hover:border-primary/30 transition-all cursor-pointer group ${!isActive ? 'opacity-75 grayscale-[20%]' : ''}`}>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-primary mb-2 leading-tight">
                                {alert.productName}
                                </h3>
                                <div className="flex items-center gap-2">
                                    {isActive ? (
                                        <span className="w-2.5 h-2.5 rounded-full bg-surface-tint animate-pulse"></span>
                                    ) : (
                                        <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                                    )}
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-surface-tint' : 'text-on-surface-variant'}`}>{alert.status}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 p-4 bg-background/50 rounded-xl border border-outline-variant/20 w-full md:w-auto">
                                <div>
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Target className="w-3 h-3 text-secondary" /> Target
                                    </p>
                                    {isEditing ? (
                                        <div className="flex items-center gap-2">
                                          <Input 
                                            type="number" 
                                            value={editTargetPrice} 
                                            onChange={(e) => setEditTargetPrice(e.target.value)} 
                                            className="h-8 w-24 px-2 py-1 text-sm bg-white" 
                                            autoFocus
                                          />
                                        </div>
                                    ) : (
                                        <p className="text-lg font-black text-secondary">
                                        ₹{alert.targetPrice.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <div className="border-l border-outline-variant/30 h-8"></div>
                                <div>
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <TrendingDown className="w-3 h-3 text-primary" /> Current
                                    </p>
                                    <p className="text-lg font-black text-primary">
                                    ₹{alert.currentPrice.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            </div>

                            <div className="mb-6 bg-white/40 p-4 rounded-xl border border-outline-variant/20">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                                    ₹{gap.toLocaleString()} away from target
                                    </p>
                                    <p className="text-xs font-black text-primary">
                                    {progress}%
                                    </p>
                                </div>
                                <Progress value={progress} />
                            </div>

                            <div className="flex items-center gap-2">
                            {isEditing ? (
                                <Button variant="default" size="sm" className="h-10 text-xs px-3 rounded-lg" onClick={() => saveEdit(alert.id)}>
                                    <Check className="w-3.5 h-3.5 mr-1.5" />
                                    Save
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" className="h-10 text-xs px-3 rounded-lg" onClick={() => startEditing(alert)}>
                                    <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                                    Edit
                                </Button>
                            )}
                            
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`h-10 text-xs px-3 rounded-lg hover:text-primary ${!isActive ? 'text-surface-tint' : 'text-on-surface-variant'}`}
                                onClick={() => handleTogglePause(alert.id)}
                            >
                                {isActive ? (
                                    <><Pause className="w-3.5 h-3.5 mr-1.5" /> Pause</>
                                ) : (
                                    <><Play className="w-3.5 h-3.5 mr-1.5" /> Resume</>
                                )}
                            </Button>
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 text-xs px-3 rounded-lg text-error hover:bg-error/10 hover:text-error ml-auto"
                                onClick={() => handleRemoveAlert(alert.id)}
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                Remove
                            </Button>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
