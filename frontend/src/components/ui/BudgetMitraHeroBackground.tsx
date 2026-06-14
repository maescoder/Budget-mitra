"use client"

import * as React from "react"
import { CheckCircle, TrendingDown, ShoppingBag, Tag } from "lucide-react"

interface FloatingElement {
  id: number
  x: number
  y: number
  delay: number
  duration: number
  type: 'card' | 'tag' | 'graph' | 'dot' | 'check' | 'bag'
}

interface GraphLine {
  id: number
  startX: number
  startY: number
  delay: number
}

export function BudgetMitraHeroBackground() {
  const [elements, setElements] = React.useState<FloatingElement[]>([])
  const [graphLines, setGraphLines] = React.useState<GraphLine[]>([])
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const items: FloatingElement[] = []
    let id = 0
    
    // Left side elements
    for (let i = 0; i < 4; i++) {
      items.push({
        id: id++,
        x: Math.random() * 20 + 5,
        y: Math.random() * 80 + 10,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
        type: i % 2 === 0 ? 'card' : 'tag'
      })
    }
    
    // Right side elements
    for (let i = 0; i < 4; i++) {
      items.push({
        id: id++,
        x: Math.random() * 20 + 75,
        y: Math.random() * 80 + 10,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
        type: i % 2 === 0 ? 'bag' : 'tag'
      })
    }
    
    // Bottom elements
    for (let i = 0; i < 3; i++) {
      items.push({
        id: id++,
        x: Math.random() * 60 + 20,
        y: Math.random() * 15 + 75,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
        type: 'card'
      })
    }
    
    // Scattered data points
    for (let i = 0; i < 12; i++) {
      items.push({
        id: id++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 6,
        type: 'dot'
      })
    }
    
    // Check marks
    for (let i = 0; i < 3; i++) {
      items.push({
        id: id++,
        x: Math.random() * 30 + 10,
        y: Math.random() * 60 + 20,
        delay: Math.random() * 5,
        duration: 12 + Math.random() * 8,
        type: 'check'
      })
    }
    
    setElements(items)
    
    setGraphLines(Array.from({ length: 4 }, (_, i) => ({
      id: i,
      startX: Math.random() * 30 + 10,
      startY: Math.random() * 60 + 20,
      delay: i * 3
    })))

    setMounted(true)
  }, [])

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-background to-emerald-50/20" />
      
      {/* Radial glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      
      {/* Graph lines */}
      {graphLines.map((line) => (
        <svg
          key={`graph-${line.id}`}
          className="absolute w-64 h-32 opacity-0"
          style={{
            left: `${line.startX}%`,
            top: `${line.startY}%`,
            animation: `drawGraph 8s ease-in-out ${line.delay}s infinite`
          }}
        >
          <defs>
            <linearGradient id={`gradient-${line.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="rgb(5, 150, 105)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${60 + Math.sin(line.id) * 20} Q 64 ${40 + Math.cos(line.id) * 15}, 128 ${50 + Math.sin(line.id * 2) * 10} T 256 ${45 + Math.cos(line.id * 3) * 15}`}
            fill="none"
            stroke={`url(#gradient-${line.id})`}
            strokeWidth="2"
            strokeDasharray="4 4"
            className="animate-dash"
          />
        </svg>
      ))}
      
      {/* Floating elements */}
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animation: `float ${element.duration}s ease-in-out ${element.delay}s infinite`
          }}
        >
          {element.type === 'card' && (
            <div className="w-32 h-20 rounded-lg bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 backdrop-blur-sm border border-emerald-200/20 shadow-lg p-3 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-2 bg-emerald-500/20 rounded" />
                <div className="w-2 h-2 bg-emerald-500/30 rounded-full animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="w-16 h-1.5 bg-emerald-500/15 rounded" />
                <div className="w-12 h-1.5 bg-emerald-500/10 rounded" />
              </div>
            </div>
          )}
          
          {element.type === 'tag' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-600/15 backdrop-blur-sm border border-emerald-200/20 shadow-md">
              <Tag className="w-3 h-3 text-emerald-600/40" />
              <span className="text-xs font-medium text-emerald-700/30">₹{Math.floor(Math.random() * 9000 + 1000)}</span>
            </div>
          )}
          
          {element.type === 'dot' && (
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500/30 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 w-2 h-2 bg-emerald-500/20 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
            </div>
          )}
          
          {element.type === 'check' && (
            <div className="p-2 rounded-full bg-gradient-to-br from-emerald-500/10 to-emerald-600/15 backdrop-blur-sm border border-emerald-200/20 shadow-lg animate-pulse" style={{ animationDuration: '4s' }}>
              <CheckCircle className="w-4 h-4 text-emerald-600/40" />
            </div>
          )}
          
          {element.type === 'bag' && (
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 backdrop-blur-sm border border-emerald-200/20 shadow-md">
              <ShoppingBag className="w-5 h-5 text-emerald-600/30" />
            </div>
          )}
        </div>
      ))}
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgb(16, 185, 129)" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
      
      {/* Comparison indicators */}
      <div className="absolute left-[15%] top-[30%] opacity-0 animate-fadeInSlow" style={{ animationDelay: '1s' }}>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-600/15 backdrop-blur-sm border border-emerald-200/20 shadow-lg">
          <TrendingDown className="w-4 h-4 text-emerald-600/50" />
          <span className="text-sm font-medium text-emerald-700/40">-23%</span>
        </div>
      </div>
      
      <div className="absolute right-[15%] top-[40%] opacity-0 animate-fadeInSlow" style={{ animationDelay: '2s' }}>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-600/15 backdrop-blur-sm border border-emerald-200/20 shadow-lg">
          <CheckCircle className="w-4 h-4 text-emerald-600/50" />
          <span className="text-sm font-medium text-emerald-700/40">Best Deal</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(-5px) translateX(-5px);
          }
          75% {
            transform: translateY(-15px) translateX(3px);
          }
        }
        
        @keyframes drawGraph {
          0% {
            opacity: 0;
            stroke-dashoffset: 1000;
          }
          20% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.4;
            stroke-dashoffset: 0;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: -8;
          }
        }
        
        @keyframes fadeInSlow {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-dash {
          animation: dash 20s linear infinite;
        }
        
        .animate-fadeInSlow {
          animation: fadeInSlow 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
