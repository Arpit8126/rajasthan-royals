'use client';

import React from 'react';
import { 
  Home,
  Users, 
  LayoutGrid, 
  Trophy, 
  BarChart3, 
  ShieldAlert
} from 'lucide-react';

export default function CommandBar() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#161320]/95 backdrop-blur-md border-b border-[#2C263A] shadow-lg w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          
          {/* Top Row / Left: Official Rajasthan Royals Brand Identity */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
            <div 
              className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none group" 
              onClick={() => scrollTo('players-showcase')}
            >
              {/* RR Vector Crest Logo */}
              <div className="h-9 sm:h-11 flex items-center justify-center shrink-0">
                <img
                  src="/images/rr_logo.png"
                  alt="Rajasthan Royals"
                  className="h-full w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(228,27,102,0.35)] group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Title Lockup */}
              <div className="border-l border-[#322C42] pl-2.5 sm:pl-3">
                <div className="text-[10px] sm:text-xs font-black tracking-widest text-[#E5A93C] uppercase font-sans leading-none">
                  RAJASTHAN ROYALS
                </div>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="text-sm sm:text-base font-black tracking-tight text-white font-sans">
                    WAR ROOM
                  </span>
                  <span className="text-[#6E6482] text-xs">•</span>
                  <span className="text-[10px] sm:text-xs font-black tracking-wider text-[#E41B66] uppercase font-sans">
                    IPL 2027
                  </span>
                </div>
              </div>
            </div>

            {/* Live Terminal Badge on Mobile Right */}
            <div className="flex items-center sm:hidden">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E41B66]/15 border border-[#E41B66]/30 text-[9px] font-black text-[#E41B66] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E41B66] animate-pulse" />
                <span>Live Scout</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation: Sleek Single Row (sm:flex hidden) */}
          <nav className="hidden sm:flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => scrollTo('players-showcase')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#272236] transition-all flex items-center gap-1.5 shrink-0"
            >
              <Users className="w-3.5 h-3.5 text-[#E41B66]" />
              <span>Showcase</span>
            </button>

            <button
              onClick={() => scrollTo('section-a')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#272236] transition-all flex items-center gap-1.5 shrink-0"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => scrollTo('points-table')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#272236] transition-all flex items-center gap-1.5 shrink-0"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => scrollTo('dashboard-matrix')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#272236] transition-all flex items-center gap-1.5 shrink-0"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => scrollTo('tactics-gap-audit')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#E41B66] text-white hover:bg-[#C21353] shadow-rr-pink transition-all flex items-center gap-1.5 shrink-0 ml-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Tactics</span>
            </button>
          </nav>

          {/* Mobile Navigation: Ultra-Sleek Segmented Capsule Bar (sm:hidden) */}
          <div className="w-full sm:hidden">
            <nav className="grid grid-cols-4 bg-[#120F1C] p-1 rounded-xl border border-[#2B253B] shadow-inner">
              <button
                onClick={() => scrollTo('players-showcase')}
                className="py-1.5 px-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white active:bg-[#251E33] flex items-center justify-center gap-1 transition-all"
              >
                <Home className="w-3.5 h-3.5 text-[#E41B66]" />
                <span>Home</span>
              </button>

              <button
                onClick={() => scrollTo('points-table')}
                className="py-1.5 px-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white active:bg-[#251E33] flex items-center justify-center gap-1 transition-all"
              >
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span>Leaderboard</span>
              </button>

              <button
                onClick={() => scrollTo('dashboard-matrix')}
                className="py-1.5 px-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white active:bg-[#251E33] flex items-center justify-center gap-1 transition-all"
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => scrollTo('tactics-gap-audit')}
                className="py-1.5 px-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white active:bg-[#251E33] flex items-center justify-center gap-1 transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#E41B66]" />
                <span>Tactics</span>
              </button>
            </nav>
          </div>

        </div>
      </div>
    </header>
  );
}
