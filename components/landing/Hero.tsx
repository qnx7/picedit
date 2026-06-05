'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, Instagram, ArrowRight, Zap } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium backdrop-blur-sm">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          AI-powered preset editing
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
            Make your{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Instagram feed
              </span>
            </span>
            <br />
            look consistent
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload your photos, choose an aesthetic style, and let AI transform your images into a
            cohesive, stunning feed — in seconds.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: '🖤', label: 'Dark Aesthetic' },
            { icon: '✨', label: 'Soft Glow' },
            { icon: '🍂', label: 'Luxury Beige' },
            { icon: '📽️', label: 'Film Grain' },
            { icon: '⚡', label: 'High Contrast' },
          ].map((item) => (
            <span
              key={item.label}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm"
            >
              {item.icon} {item.label}
            </span>
          ))}
          <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm">
            +5 more
          </span>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={onStart}
            className="text-base px-8 py-4 h-auto rounded-2xl shadow-2xl shadow-purple-500/30"
          >
            <Sparkles className="w-5 h-5" />
            Start editing
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Instagram className="w-4 h-4" />
            Free to try · No account needed
          </div>
        </div>

        {/* Social proof strip */}
        <div className="flex items-center justify-center gap-6 pt-4 text-sm text-gray-600">
          <span>10 style presets</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>Batch editing</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>Instant download</span>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
        <span className="text-xs">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-gray-700 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-gray-600 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
