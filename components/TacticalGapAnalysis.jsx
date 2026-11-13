'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Maximize2, 
  X, 
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Flame,
  Target
} from 'lucide-react';

export default function TacticalGapAnalysis({ onSelectPlayerByName }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFigureModal, setShowFigureModal] = useState(false);

  const deficits = [
    {
      num: '01',
      rankTag: 'DEFICIT #1 CRITICAL GAP',
      category: 'Death Batting',
      titleFirst: 'DEATH-OVER',
      titleSecond: 'BATTING CRISIS',
      phase: 'Overs 16–20 Execution Crisis',
      rrStatLabel: 'RR HP STRIKE RATE',
      rrStatValue: '154.80',
      deltaLabel: 'SR DEFICIT',
      deltaValue: '-12.47 SR',
      leagueLabel: 'LEAGUE AVERAGE',
      leagueValue: '167.27',
      targetRatingLabel: 'SOLVER RATING',
      targetRatingValue: '91.1',
      severity: 'Critical Gap',
      severityBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      primaryTarget: 'Tristan Stubbs',
      primaryTargetRole: '#1 Target (91.1 Rating)',
      targetImage: '/images/players/tristan_stubbs.png',
      description: 'While Dhruv Jurel (186.15 IPL HP SR, 48.40 Avg) and Donovan Ferreira (186.11 HP SR) excelled under pressure, Shimron Hetmyer (130.83 HP SR, 15.82 Avg) and Shubham Dubey (108.99 HP SR) stalled in tight finishes.',
      actionText: 'Retain Dhruv Jurel (#4 Batter) as primary finisher; target Tristan Stubbs (#1), David Miller (#3), or high-upside Indian finisher Naman Dhir (#10) if released into the auction pool.',
      secondaryTargets: ['David Miller', 'Dhruv Jurel']
    },
    {
      num: '02',
      rankTag: 'DEFICIT #2 HIGH LEAKAGE',
      category: 'Middle Spin',
      titleFirst: 'MIDDLE-OVER',
      titleSecond: 'SPIN LEAKAGE',
      phase: 'Overs 7–15 Economy Bleed',
      rrStatLabel: 'RR HP ECONOMY',
      rrStatValue: '10.25',
      deltaLabel: 'ECON BLEED',
      deltaValue: '+0.85',
      leagueLabel: 'LEAGUE AVERAGE',
      leagueValue: '9.40',
      targetRatingLabel: 'SOLVER RATING',
      targetRatingValue: '77.5',
      severity: 'High Leakage',
      severityBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      primaryTarget: 'Wanindu Hasaranga',
      primaryTargetRole: '#6 Target (34 HP Wkts)',
      targetImage: '/images/players/wanindu_hasaranga.png',
      description: 'Both Ravi Bishnoi (12.33 HP Econ) and Maheesh Theekshana (12.11 HP Econ) leaked boundaries during defensive middle-over squeezes (21.45 wicket strike rate vs. 18.43 league average).',
      actionText: 'Target attacking wrist-spinner Wanindu Hasaranga (#6 Bowler, 8.16 HP Econ, 34 HP wickets) to choke middle-phase momentum and force wicket pressure.',
      secondaryTargets: ['Mohammad Nawaz', 'Sunil Narine']
    },
    {
      num: '03',
      rankTag: 'DEFICIT #3 PACE DEFICIT',
      category: 'Death Pace',
      titleFirst: 'DEATH PACE',
      titleSecond: 'CLOSING PARTNER',
      phase: 'Overs 18–20 Yorker Support for Archer',
      rrStatLabel: 'RR HP ECONOMY',
      rrStatValue: '11.91',
      deltaLabel: 'ECON BLEED',
      deltaValue: '+0.40',
      leagueLabel: 'LEAGUE AVERAGE',
      leagueValue: '11.51',
      targetRatingLabel: 'SOLVER RATING',
      targetRatingValue: '81.2',
      severity: 'Pace Support',
      severityBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      primaryTarget: 'Nathan Ellis',
      primaryTargetRole: '#4 Target (8.50 HP Econ)',
      targetImage: '/images/players/nathan_ellis.png',
      description: 'Jofra Archer (10.87 HP Econ, 13 wickets) lacked a reliable closing partner (Sandeep Sharma 11.95, Brijesh Sharma 11.65, Tushar Deshpande 11.23).',
      actionText: 'Target death-over change-of-pace specialist Nathan Ellis (#4 Bowler, 8.50 HP Econ, 13 crucial spells) or Josh Hazlewood (#9 Bowler, 44.6% HP dot balls).',
      secondaryTargets: ['Josh Hazlewood', 'Jasprit Bumrah']
    }
  ];

  const activeDeficit = deficits[currentIndex] || deficits[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? deficits.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === deficits.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div id="tactics-gap-audit" className="relative rounded-3xl overflow-hidden rr-hero-bg rr-diagonal-stripes border border-[#3A334E] shadow-2xl mb-8 sm:mb-12 w-full max-w-full min-w-0">
      
      {/* Background Ambience & Glow Rings (Matching Player Showcase) */}
      <div className="absolute -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-rr-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-72 sm:w-[30rem] h-72 sm:h-[30rem] bg-rr-pink/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-4 sm:left-16 top-1/2 -translate-y-1/2 w-60 sm:w-96 h-60 sm:h-96 rounded-full border border-rr-pink/20 pointer-events-none hidden sm:block" />

      {/* Top Header Row: TACTICS & Deficit Toggles (Matching Image 1) */}
      <div className="relative z-10 px-4 sm:px-12 pt-6 sm:pt-8 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        
        {/* TACTICS Title Matching Official RR Players Header */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <h2 className="text-xl sm:text-3xl font-black tracking-wider text-white uppercase font-sans">
            TACTICS
          </h2>
          <span className="text-[10px] sm:text-xs uppercase font-extrabold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-rr-pink/20 text-rr-pink border border-rr-pink/40">
            GAP AUDIT MATRIX
          </span>
        </div>

        {/* 3 Deficit Category Toggles + Figure 3 HD Trigger */}
        <div className="flex items-center space-x-2 sm:space-x-3 self-start sm:self-auto flex-wrap gap-y-2">
          <div className="inline-flex bg-[#272236]/90 p-1 rounded-full border border-[#3A334E]">
            {deficits.map((d, idx) => (
              <button
                key={d.num}
                onClick={() => setCurrentIndex(idx)}
                className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                  currentIndex === idx
                    ? 'bg-rr-pink text-white shadow-rr-pink'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d.category}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFigureModal(true)}
            className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-[#272236] text-slate-300 hover:text-white hover:border-rr-pink/50 border border-[#3A334E] flex items-center gap-1.5 transition-all shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Figure 3 HD</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Stage (Exact Match to Image 1) */}
      <div className="relative z-10 px-4 sm:px-12 py-4 sm:py-6 min-h-[380px] sm:min-h-[460px] flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
        
        {/* Left / Center: Large Target Solver Cutout Image */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative">
          
          {/* Rank & Severity Badge (Matching Image 1 Rank Badge) */}
          <div className="absolute -top-3 left-2 sm:left-12 px-2.5 sm:px-3 py-1 rounded-lg bg-[#1E1B2B] border border-rr-pink/40 text-[10px] sm:text-xs font-black text-white flex items-center gap-1.5 z-20 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-rr-pink animate-ping" />
            <span>{activeDeficit.rankTag}</span>
          </div>

          {/* Player Action Cutout of the Target Solver */}
          <div className="relative w-52 sm:w-80 md:w-96 h-[240px] sm:h-[400px] flex items-end justify-center">
            <img
              key={activeDeficit.primaryTarget}
              src={activeDeficit.targetImage}
              alt={activeDeficit.primaryTarget}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-all duration-500 animate-fadeIn"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeDeficit.primaryTarget)}&size=512&background=272236&color=E41B66&bold=true`;
              }}
            />
          </div>
        </div>

        {/* Right Side: Headline, Meta, 4-Stat Box Grid, and Action Button */}
        <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-left px-1 sm:px-0">
          
          {/* Tactical Headline: First word White, Second word huge RR Pink */}
          <div>
            <div className="text-xl sm:text-3xl lg:text-4xl font-light tracking-wide text-white uppercase font-sans">
              {activeDeficit.titleFirst}
            </div>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-rr-pink uppercase font-sans leading-none mt-0.5 sm:mt-1">
              {activeDeficit.titleSecond}
            </div>
          </div>

          {/* Meta details row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 font-medium pt-0.5">
            <span className="text-white font-semibold">{activeDeficit.phase}</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className={`px-2 py-0.5 rounded text-[11px] sm:text-xs font-bold border ${activeDeficit.severityBg}`}>
              {activeDeficit.severity}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm">
              <span className="text-[#A99EBD]">Target Solver:</span>
              <strong className="text-white font-bold">{activeDeficit.primaryTarget}</strong>
            </span>
          </div>

          {/* Key 4-Stat Box Grid (Exact replication of Image 1: 2x2 on mobile, 4-col on desktop) */}
          <div className="pt-2 sm:pt-3 border-t border-[#3A334E]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              
              <div className="bg-[#1A1624]/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-[#A99EBD]">
                  {activeDeficit.rrStatLabel}
                </div>
                <div className="text-xl sm:text-3xl font-black text-white font-sans mt-0.5">
                  {activeDeficit.rrStatValue}
                </div>
              </div>

              <div className="bg-[#1A1624]/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-rr-pink">
                  {activeDeficit.deltaLabel}
                </div>
                <div className="text-xl sm:text-3xl font-black text-rr-pink font-sans mt-0.5">
                  {activeDeficit.deltaValue}
                </div>
              </div>

              <div className="bg-[#1A1624]/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-[#A99EBD]">
                  {activeDeficit.leagueLabel}
                </div>
                <div className="text-xl sm:text-3xl font-black text-slate-300 font-sans mt-0.5">
                  {activeDeficit.leagueValue}
                </div>
              </div>

              <div className="bg-[#1A1624]/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-rr-gold">
                  {activeDeficit.targetRatingLabel}
                </div>
                <div className="text-xl sm:text-3xl font-black text-rr-gold font-sans mt-0.5">
                  {activeDeficit.targetRatingValue}
                </div>
              </div>

            </div>
          </div>

          {/* Action Button: VIEW TARGET PROFILE (Image 1 style!) */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-4">
            <button
              onClick={() => onSelectPlayerByName && onSelectPlayerByName(activeDeficit.primaryTarget)}
              className="rr-btn-pink w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-rr-pink text-center flex items-center justify-center gap-2"
            >
              <span>Inspect Target: {activeDeficit.primaryTarget}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* Alternative targets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-[#A99EBD] uppercase font-bold hidden sm:inline">Alternatives:</span>
              {activeDeficit.secondaryTargets.map((secName) => (
                <button
                  key={secName}
                  onClick={() => onSelectPlayerByName && onSelectPlayerByName(secName)}
                  className="px-3 py-1.5 bg-[#272236] hover:bg-[#322A42] hover:text-[#E41B66] text-slate-300 text-xs font-bold rounded-lg border border-[#3A334E] transition-all"
                >
                  {secName}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Italic Strategy Directive (Image 1 style quote) */}
          <div className="text-[11px] sm:text-xs text-[#A99EBD] italic leading-relaxed pt-1 max-w-2xl">
            "{activeDeficit.actionText}"
          </div>

        </div>

      </div>

      {/* Carousel Navigation Chevrons (Positioned cleanly beside photo) */}
      <button
        onClick={handlePrev}
        aria-label="Previous Deficit"
        className="absolute left-2 sm:left-4 top-[200px] sm:top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#272236]/90 hover:bg-rr-pink text-white flex items-center justify-center backdrop-blur-md border border-[#3A334E] transition-all z-20 shadow-xl"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Deficit"
        className="absolute right-2 sm:right-4 top-[200px] sm:top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#272236]/90 hover:bg-rr-pink text-white flex items-center justify-center backdrop-blur-md border border-[#3A334E] transition-all z-20 shadow-xl"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Bottom Thumbnail Strip (Matching Image 1 scouted player strip) */}
      <div className="relative z-10 px-3 sm:px-12 py-2.5 sm:py-3 bg-[#1A1624]/95 border-t border-[#3A334E] flex items-center justify-between gap-2 overflow-x-auto scrollbar-none w-full max-w-full min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#A99EBD] uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Tactical Gaps:
          </span>
          {deficits.map((d, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={d.num}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-rr-pink text-white border-rr-pink shadow-rr-pink'
                    : 'bg-[#272236] text-slate-300 border-[#3A334E] hover:border-rr-pink/50'
                }`}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden bg-[#1E1B2B] shrink-0 border border-white/20">
                  <img src={d.targetImage} alt="" className="w-full h-full object-cover" />
                </div>
                <span>#{d.num} {d.category}</span>
              </button>
            );
          })}
        </div>

        {/* Figure 3 Preview Trigger */}
        <button
          onClick={() => setShowFigureModal(true)}
          className="px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold text-[#E5A93C] hover:text-white bg-[#272236] border border-[#3A334E] hover:border-[#E5A93C]/50 flex items-center gap-1.5 shrink-0 whitespace-nowrap ml-2"
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>Figure 3 Chart HD</span>
        </button>
      </div>

      {/* Lightbox Modal for Figure 3 High-Resolution Preview */}
      {showFigureModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-[#181622] rounded-3xl border border-[#3A334E] overflow-hidden shadow-2xl p-5">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">
                Figure 3: Rajasthan Royals (IPL 2025–2026) Tactical Phase Gap Audit
              </h3>
              <button
                onClick={() => setShowFigureModal(false)}
                className="p-1.5 rounded-full bg-[#272236] hover:bg-[#E41B66] text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-[#100D18] rounded-2xl p-2 border border-[#3A334E]">
              <img src="/images/chart3_rr_2025_26_gaps.png" alt="Figure 3 Full Preview" className="max-h-full max-w-full object-contain" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-[#A99EBD]">
                Auditing 30 RR matches vs 9 other IPL franchises
              </span>
              <button
                onClick={() => setShowFigureModal(false)}
                className="rr-btn-pink px-6 py-2.5 text-xs font-bold uppercase rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
