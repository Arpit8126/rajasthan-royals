'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Target, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function OfficialRRPlayerShowcase({ 
  batters = [], 
  bowlers = [], 
  onSelectPlayer 
}) {
  const [activeType, setActiveType] = useState('batters'); // 'batters' | 'bowlers'
  const [currentIndex, setCurrentIndex] = useState(0);

  const playersList = activeType === 'batters' ? batters : bowlers;
  const activePlayer = playersList[currentIndex] || playersList[0];

  const handleTypeChange = (type) => {
    setActiveType(type);
    setCurrentIndex(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? playersList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === playersList.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playersList.length]);

  if (!activePlayer) return null;

  const isBatter = activeType === 'batters';
  const isRR = activePlayer.IPL_Team === 'Rajasthan Royals';

  return (
    <div className="relative rounded-3xl overflow-hidden rr-hero-bg rr-diagonal-stripes border border-[#3A334E] shadow-2xl mb-8 sm:mb-12">
      
      {/* Background Ambience & Glow Rings */}
      <div className="absolute -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-rr-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-72 sm:w-[30rem] h-72 sm:h-[30rem] bg-rr-pink/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Decorative Oval Ring on Left */}
      <div className="absolute left-4 sm:left-16 top-1/2 -translate-y-1/2 w-60 sm:w-96 h-60 sm:h-96 rounded-full border border-rr-pink/20 pointer-events-none hidden sm:block" />

      {/* Top Header Row: PLAYERS & View More / Type Toggles */}
      <div className="relative z-10 px-4 sm:px-12 pt-6 sm:pt-8 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        
        {/* PLAYERS title matching official site */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <h2 className="text-xl sm:text-3xl font-black tracking-wider text-white uppercase font-sans">
            PLAYERS
          </h2>
          <span className="text-[10px] sm:text-xs uppercase font-extrabold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-rr-pink/20 text-rr-pink border border-rr-pink/40">
            WAR ROOM MATRIX
          </span>
        </div>

        {/* Category Toggles (Batters vs Bowlers) */}
        <div className="flex items-center space-x-2 sm:space-x-3 self-start sm:self-auto">
          <div className="inline-flex bg-[#272236]/90 p-1 rounded-full border border-[#3A334E]">
            <button
              onClick={() => handleTypeChange('batters')}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                activeType === 'batters'
                  ? 'bg-rr-pink text-white shadow-rr-pink'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Batters (10)
            </button>
            <button
              onClick={() => handleTypeChange('bowlers')}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                activeType === 'bowlers'
                  ? 'bg-rr-blue text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bowlers (10)
            </button>
          </div>

          <a 
            href="#section-a" 
            className="text-xs font-bold text-slate-300 hover:text-rr-pink transition-colors hidden sm:flex items-center gap-1"
          >
            <span>View All</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* Main Showcase Stage */}
      <div className="relative z-10 px-4 sm:px-12 py-4 sm:py-6 min-h-[380px] sm:min-h-[460px] flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
        
        {/* Left / Center: Large Player Action Photo Cutout */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative">
          
          {/* Rank Badge */}
          <div className="absolute -top-3 left-2 sm:left-12 px-2.5 sm:px-3 py-1 rounded-lg bg-[#1E1B2B] border border-rr-pink/40 text-[10px] sm:text-xs font-black text-white flex items-center gap-1.5 z-20 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-rr-pink animate-ping" />
            <span>RANK #{activePlayer.Rank} {isBatter ? 'CLUTCH BATTER' : 'CLUTCH BOWLER'}</span>
          </div>

          {/* Player Cutout Image */}
          <div className="relative w-56 sm:w-80 md:w-96 h-[260px] sm:h-[400px] flex items-end justify-center">
            <img
              key={activePlayer.Name}
              src={activePlayer.image_url}
              alt={activePlayer.Name}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-all duration-500 animate-fadeIn"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activePlayer.Name)}&size=512&background=272236&color=E41B66&bold=true`;
              }}
            />
          </div>
        </div>

        {/* Right Side: Player Name, Meta, Big Stats Row, and View Profile Button */}
        <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-left">
          
          {/* Name Header - First Name white, Last Name huge RR Pink */}
          <div>
            <div className="text-xl sm:text-3xl lg:text-4xl font-light tracking-wide text-white uppercase">
              {activePlayer.first_name || activePlayer.Name.split(' ')[0]}
            </div>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-rr-pink uppercase font-sans leading-none mt-0.5 sm:mt-1">
              {activePlayer.last_name || activePlayer.Name.split(' ').slice(1).join(' ')}
            </div>
          </div>

          {/* Role, Status & Nationality Meta */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 font-medium pt-0.5">
            <span className="text-white font-semibold">{activePlayer.Role}</span>
            <span className="text-slate-600">|</span>
            <span className={`px-2 py-0.5 rounded text-[11px] sm:text-xs font-bold ${
              isRR 
                ? 'bg-rr-pink text-white font-black' 
                : 'bg-[#272236] text-slate-300 border border-[#3A334E]'
            }`}>
              {activePlayer.IPL_Team}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm">
              <span>{activePlayer.country_flag || '🇮🇳'}</span>
              <span>{activePlayer.country || 'India'}</span>
            </span>
          </div>

          {/* Key Stats Row - 2 columns on mobile phones, 4 on desktop */}
          <div className="pt-2 sm:pt-3 border-t border-[#3A334E]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              
              {isBatter ? (
                <>
                  <div className="bg-[#1A1624]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                    <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-[#A99EBD]">
                      HP STRIKE RATE
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-white font-sans mt-0.5">
                      {activePlayer.HP_SR.toFixed(1)}
                    </div>
                  </div>

                  <div className="bg-[#1A1624]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                    <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-rr-pink">
                      SR LIFT
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-rr-pink font-sans mt-0.5">
                      +{activePlayer.SR_Lift.toFixed(1)}
                    </div>
                  </div>

                  <div className="bg-[#1A1624]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                    <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-[#A99EBD]">
                      HP AVERAGE
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-white font-sans mt-0.5">
                      {activePlayer.HP_Avg.toFixed(1)}
                    </div>
                  </div>

                  <div className="bg-[#1A1624]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                    <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-rr-gold">
                      RATING
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-rr-gold font-sans mt-0.5">
                      {activePlayer.Rating.toFixed(1)}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-[#1A1624]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                    <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-[#A99EBD]">
                      HP ECONOMY
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-cyan-400 font-sans mt-0.5">
                      {activePlayer.HP_Econ.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-[#1A1624]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                    <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-rr-pink">
                      HP WICKETS
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-white font-sans mt-0.5">
                      {activePlayer.HP_Wkts}
                    </div>
                  </div>

                  <div className="bg-[#1A1624]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                    <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-[#A99EBD]">
                      DOT BALL %
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-amber-300 font-sans mt-0.5">
                      {activePlayer.HP_Dot_Pct.toFixed(1)}%
                    </div>
                  </div>

                  <div className="bg-[#1A1624]/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                    <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-rr-gold">
                      RATING
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-rr-gold font-sans mt-0.5">
                      {activePlayer.Rating.toFixed(1)}
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Action Button: View Profile */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-4">
            <button
              onClick={() => onSelectPlayer(activePlayer, isBatter ? 'batter' : 'bowler')}
              className="rr-btn-pink w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-rr-pink text-center"
            >
              <span>View Profile</span>
            </button>

            <span className="text-[11px] sm:text-xs text-[#A99EBD] italic truncate max-w-full sm:max-w-md">
              "{activePlayer.Scouting_Notes}"
            </span>
          </div>

        </div>

      </div>

      {/* Carousel Navigation Buttons */}
      <button
        onClick={handlePrev}
        aria-label="Previous Player"
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#272236]/80 hover:bg-rr-pink text-white flex items-center justify-center backdrop-blur-md border border-[#3A334E] transition-all z-20 shadow-lg"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Player"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#272236]/80 hover:bg-rr-pink text-white flex items-center justify-center backdrop-blur-md border border-[#3A334E] transition-all z-20 shadow-lg"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Bottom Thumbnail Strip */}
      <div className="relative z-10 px-3 sm:px-12 py-2.5 sm:py-3 bg-[#1A1624]/95 border-t border-[#3A334E] flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] sm:text-[11px] font-bold text-[#A99EBD] uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
          Scouted:
        </span>
        {playersList.map((p, idx) => {
          const isSelected = idx === currentIndex;
          return (
            <button
              key={p.Name}
              onClick={() => setCurrentIndex(idx)}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                isSelected
                  ? 'bg-rr-pink text-white border-rr-pink shadow-rr-pink'
                  : 'bg-[#272236] text-slate-300 border-[#3A334E] hover:border-rr-pink/50'
              }`}
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden bg-[#1E1B2B] shrink-0 border border-white/20">
                <img src={p.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <span>#{p.Rank} {p.Name.split(' ').pop()}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
