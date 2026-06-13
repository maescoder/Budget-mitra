"use client";

import { useState } from "react";
import { useTransitionRouter } from "@/context/TransitionContext";
import { Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ShaderBackground from "@/components/ShaderBackground";

export default function LoginPage() {
  const router = useTransitionRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { login } = useAuth();

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-background text-on-background">
      {/* Ambient Shader Background */}
      <ShaderBackground mode="dashboard" opacity={0.6} />

      {/* Floating 3D/ambient accents */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-primary-fixed/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[60%] right-[15%] w-40 h-40 bg-secondary-container/10 rounded-full blur-3xl"></div>
      </div>

      {/* Back button */}
      <button 
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant/80 hover:text-primary transition-colors z-50 group font-bold text-xs uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Home
      </button>

      {/* 3D Perspective Form Card */}
      <div 
        className="relative z-10 w-full max-w-md p-6"
        style={{ perspective: "1000px" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { setIsHovering(false); setMousePos({ x: 0, y: 0 }); }}
      >
        <div 
          className="relative w-full h-full p-8 bg-white/45 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-glass transition-all duration-300 ease-out"
          style={{
            transform: isHovering 
              ? `rotateY(${mousePos.x * 15}deg) rotateX(${-mousePos.y * 15}deg) translateZ(10px)`
              : 'rotateY(0deg) rotateX(0deg) translateZ(0px)',
            boxShadow: isHovering 
              ? `0 20px 40px rgba(6,78,59,0.06), 0 0 30px rgba(255,255,255,0.4) inset` 
              : '0 8px 32px rgba(6, 78, 59, 0.04)'
          }}
        >
          {/* Card Border Glow */}
          <div className="absolute inset-0 rounded-[2.5rem] border border-primary/10 pointer-events-none"></div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-fixed/50 border border-primary/10 mb-6 text-primary shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-headline-lg font-bold text-primary mb-1.5">Welcome Back</h1>
            <p className="text-on-surface-variant text-xs font-semibold">Sign in securely to manage your price monitors</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {errorMsg && (
              <div className="bg-error-container/20 border border-error-container/40 text-error text-xs font-semibold px-4 py-3 rounded-xl text-center">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-2 relative group">
              <label className="text-[10px] font-bold text-primary/75 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4.5 h-4.5 text-on-surface-variant/60 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/50 border border-outline-variant/40 rounded-xl py-3.5 pl-11 pr-4 text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-primary/75 uppercase tracking-wider">Password</label>
                <a href="#" className="text-[10px] font-bold text-surface-tint hover:text-primary">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4.5 h-4.5 text-on-surface-variant/60 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/50 border border-outline-variant/40 rounded-xl py-3.5 pl-11 pr-11 text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-semibold font-mono"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant/60 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 mt-4 rounded-xl btn-primary-glow text-on-primary font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-on-surface-variant/80">
            Don&apos;t have an account? <button onClick={() => router.push('/signup')} className="font-bold text-surface-tint hover:text-primary">Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
