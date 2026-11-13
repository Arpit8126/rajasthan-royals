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
    <header className="sticky top-0 z-40 bg-[#1A1826]/95 backdrop-blur-md border-b border-[#322C42] shadow-xl w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Official Rajasthan Royals Logo & Title */}
          <div className="flex items-center justify-between sm:justify-start space-x-2.5 sm:space-x-3.5 cursor-pointer" onClick={() => scrollTo('players-showcase')}>
            <div className="flex items-center space-x-2.5 sm:space-x-3.5">
              <div className="h-8 sm:h-12 flex items-center justify-center shrink-0">
                <img
                  src="/images/rr_logo.png"
                  alt="Rajasthan Royals"
                  className="h-full w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                />
              </div>

              <div className="border-l border-[#322C42] pl-2 sm:pl-3">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="text-xs sm:text-base font-black tracking-tight text-white font-sans">
                    RR WAR ROOM
                  </span>
                  <span className="text-[#6E6482]">•</span>
                  <span className="text-[10px] sm:text-sm font-extrabold tracking-tight text-[#E41B66] font-sans">
                    AUCTION SCOUTING
                  </span>
                </div>
                <div className="text-[8px] sm:text-[11px] text-[#A99EBD] font-medium leading-none mt-0.5 truncate">
                  SupeRR Selector S2 • Reliability Matrix
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation: 5 buttons (sm:flex hidden) */}
          <nav className="hidden sm:flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => scrollTo('players-showcase')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-[#272236] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Users className="w-3.5 h-3.5 text-[#E41B66]" />
              <span>Showcase</span>
            </button>

            <button
              onClick={() => scrollTo('section-a')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-[#272236] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => scrollTo('points-table')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-[#272236] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => scrollTo('dashboard-matrix')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-[#272236] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => scrollTo('tactics-gap-audit')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#E41B66] text-white hover:bg-[#C21353] shadow-rr-pink transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ml-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Tactics</span>
            </button>
          </nav>

          {/* Mobile Navigation: Exactly 4 Menus (Home, Leaderboard, Dashboard, Tactics) - Fits 100% of screen without horizontal scroll! */}
          <nav className="grid grid-cols-4 sm:hidden w-full gap-1 pt-1 border-t border-[#322C42]/50">
            <button
              onClick={() => scrollTo('players-showcase')}
              className="py-1.5 px-1 rounded-lg text-[10px] font-bold text-slate-200 hover:text-white bg-[#272236]/80 flex flex-col items-center justify-center gap-0.5 text-center transition-all"
            >
              <Home className="w-3.5 h-3.5 text-[#E41B66]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => scrollTo('points-table')}
              className="py-1.5 px-1 rounded-lg text-[10px] font-bold text-slate-200 hover:text-white bg-[#272236]/80 flex flex-col items-center justify-center gap-0.5 text-center transition-all"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => scrollTo('dashboard-matrix')}
              className="py-1.5 px-1 rounded-lg text-[10px] font-bold text-slate-200 hover:text-white bg-[#272236]/80 flex flex-col items-center justify-center gap-0.5 text-center transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => scrollTo('tactics-gap-audit')}
              className="py-1.5 px-1 rounded-lg text-[10px] font-black uppercase text-white bg-[#E41B66] shadow-sm flex flex-col items-center justify-center gap-0.5 text-center transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Tactics</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
}
