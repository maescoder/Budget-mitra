"use client";

import { useState } from "react";
import { useTransitionRouter } from "@/context/TransitionContext";
import { Eye, EyeOff, Mail, Tag, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Input, Label, Button, AnimatedBackground } from "@/components/ui/auth-components";

export default function LoginPage() {
  const router = useTransitionRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5] relative overflow-hidden p-4">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-[#0C5044]/10 shadow-2xl p-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7ED4C1] to-[#0C5044] flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Tag className="w-7 h-7 text-white" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-[#0C5044] text-center mb-2 font-display"
          >
            Welcome Back
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#0C5044]/70 text-center mb-8 text-sm"
          >
            Sign in to manage your tracked products, alerts, and smarter
            shopping.
          </motion.p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {errorMsg && (
              <div className="bg-red-100/50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0C5044]/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0C5044]/40 hover:text-[#0C5044] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-sm text-[#0C5044] hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full group disabled:opacity-70 flex justify-center items-center">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </>
              )}
            </Button>
          </form>

          {/* Bottom Link */}
          <p className="text-center text-sm text-[#0C5044]/70 mt-6">
            Don't have an account?{" "}
            <button 
              onClick={() => router.push('/signup')}
              className="text-[#0C5044] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Create Account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
