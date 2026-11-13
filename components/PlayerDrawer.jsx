'use client';

import React from 'react';
import { 
  X, 
  Sparkles, 
  Flame, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Award,
  ShieldCheck,
  CheckCircle2,
  Quote
} from 'lucide-react';

export default function PlayerDrawer({ player, type = 'batter', isOpen, onClose }) {
  if (!isOpen || !player) return null;

  const isBatter = type === 'batter';
  const isRR = player.IPL_Team === 'Rajasthan Royals';

  const subComponents = isBatter ? [
    { label: 'Phase & Pace Tempo', val: player.Sub_Phase_Tempo || 85, weight: '30%', desc: 'Runs Above Average (RAA/100B) adjusted for phase' },
    { label: 'Wicket Survival', val: player.Sub_Wicket_Survival || 90, weight: '25%', desc: 'High-pressure runs per dismissal in crisis' },
    { label: 'Pressure Lift Delta', val: player.Sub_Pressure_Lift || 88, weight: '20%', desc: 'Performance acceleration over baseline situation' },
    { label: 'Clutch Frequency', val: player.Sub_Clutch_Freq || 86, weight: '15%', desc: 'Match-defining crucial innings conversion rate' },
    { label: 'Workload & Pedigree', val: player.Sub_Workload_Pedigree || 82, weight: '10%', desc: 'Sample volume & top-tier IPL opposition quality' }
  ] : [
    { label: 'Run Containment', val: player.Sub_Containment || 88, weight: '30%', desc: 'Runs saved per over in pressure phases' },
    { label: 'Wicket Threat', val: player.Sub_Wicket_Threat || 85, weight: '25%', desc: 'Wickets per 4 overs under pressure' },
    { label: 'Dot Ball Control', val: player.Sub_Dot_Control || 82, weight: '20%', desc: 'Percentage of boundary & single-free deliveries' },
    { label: 'Workload & Pedigree', val: player.Sub_Workload_Pedigree || 78, weight: '15%', desc: 'High-pressure exposure & tournament strength' },
    { label: 'Pressure Hold Delta', val: player.Sub_Pressure_Hold || 84, weight: '10%', desc: 'Containment lift over normal baseline' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fadeIn flex justify-end">
      {/* Click outside to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel container */}
      <div className="relative w-full max-w-xl bg-[#181622] border-l border-[#352D47] shadow-2xl h-full overflow-y-auto text-slate-100 z-10 flex flex-col font-sans">
        
        {/* 1. Hero Player Showcase Header */}
        <div className="relative bg-gradient-to-b from-[#2A213B] to-[#1E1B2B] p-4 sm:p-6 border-b border-[#352D47] overflow-hidden">
          
          {/* Subtle RR Crown Watermark */}
          <div className="absolute right-4 top-2 text-5xl sm:text-6xl text-white/5 font-serif pointer-events-none select-none">
            👑
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-xl bg-[#181622]/80 hover:bg-[#E41B66] text-slate-400 hover:text-white transition-all z-20 shadow-md"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Row: Large Player Cutout + Name Details */}
          <div className="flex items-end space-x-3.5 sm:space-x-5 relative z-10">
            
            {/* Player Waist-Up Cutout */}
            <div className="w-24 h-32 sm:w-32 sm:h-40 flex items-end justify-center shrink-0">
              <img
                src={player.image_url}
                alt={player.Name}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]"
              />
            </div>

            {/* Player Identity */}
            <div className="space-y-1 sm:space-y-1.5 pb-1 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] sm:text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#E41B66]/20 text-[#E41B66] border border-[#E41B66]/40">
                  RANK #{player.Rank}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase ${
                  isRR ? 'bg-[#E41B66] text-white' : 'bg-[#272236] text-slate-300 border border-[#3A334E]'
                }`}>
                  {player.IPL_Team}
                </span>
              </div>

              <div>
                <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">
                  {player.first_name || player.Name.split(' ')[0]}
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-[#E41B66] uppercase tracking-tight leading-none mt-0.5">
                  {player.last_name || player.Name.split(' ').slice(1).join(' ')}
                </h2>
              </div>

              <div className="text-[11px] sm:text-xs text-[#A99EBD] font-medium pt-0.5">
                {player.Role} • {player.country_flag || '🏏'} {player.country}
              </div>
            </div>

          </div>
        </div>

        {/* 2. Drawer Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 bg-[#181622]">
          
          {/* Composite Reliability Index Banner */}
          <div className="bg-[#211C2E] border border-[#352D47] rounded-2xl p-3.5 sm:p-5 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[#E5A93C] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Composite Reliability Index</span>
              </span>
              <div className="text-2xl sm:text-4xl font-black text-white font-sans mt-0.5">
                {player.Rating.toFixed(1)}
                <span className="text-xs sm:text-sm font-normal text-[#A99EBD]"> / 100</span>
              </div>
              <div className="text-[11px] sm:text-xs text-[#A99EBD] mt-0.5">
                Bayesian Empirical CDF Percentile
              </div>
            </div>

            <div className="text-right">
              <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {player.Rating >= 85 ? 'Tier 1 Elite' : 'High Impact'}
              </span>
              <div className="text-[10px] sm:text-[11px] text-[#A99EBD] mt-1.5 sm:mt-2 font-mono">
                {player.HP_Matches} High-Pressure Matches
              </div>
            </div>
          </div>

          {/* Performance Diagnostics (Normal vs High-Pressure) */}
          <div className="bg-[#211C2E] border border-[#352D47] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#352D47] pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                {isBatter ? <Flame className="w-4 h-4 text-[#E41B66]" /> : <Target className="w-4 h-4 text-cyan-400" />}
                <span>Pressure vs. Baseline Diagnostics</span>
              </h4>
              <span className="text-[10px] text-[#A99EBD] uppercase font-bold">Context Delta</span>
            </div>

            {/* Side-by-Side Comparison */}
            {isBatter ? (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="bg-[#1A1624] p-2.5 sm:p-3.5 rounded-xl border border-[#2E273D] text-center">
                  <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#A99EBD]">Normal Strike Rate</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-300 font-sans mt-0.5 sm:mt-1">
                    {player.Normal_SR.toFixed(1)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-[#6E6482] mt-0.5">Baseline Phase</div>
                </div>

                <div className="bg-[#1A1624] p-2.5 sm:p-3.5 rounded-xl border border-[#E41B66]/40 text-center relative overflow-hidden">
                  <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#E41B66]">High-Pressure SR</div>
                  <div className="text-xl sm:text-2xl font-black text-white font-sans mt-0.5 sm:mt-1">
                    {player.HP_SR.toFixed(1)}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-emerald-400 mt-0.5">
                    +{player.SR_Lift.toFixed(1)} SR Lift
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="bg-[#1A1624] p-2.5 sm:p-3.5 rounded-xl border border-[#2E273D] text-center">
                  <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#A99EBD]">Normal Economy</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-300 font-sans mt-0.5 sm:mt-1">
                    {player.Norm_Econ?.toFixed(2) || (player.HP_Econ + 0.35).toFixed(2)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-[#6E6482] mt-0.5">Standard Overs</div>
                </div>

                <div className="bg-[#1A1624] p-2.5 sm:p-3.5 rounded-xl border border-cyan-500/40 text-center relative overflow-hidden">
                  <div className="text-[9px] sm:text-[10px] uppercase font-bold text-cyan-400">High-Pressure Econ</div>
                  <div className="text-xl sm:text-2xl font-black text-white font-sans mt-0.5 sm:mt-1">
                    {player.HP_Econ.toFixed(2)}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-emerald-400 mt-0.5">
                    {player.HP_Dot_Pct.toFixed(1)}% Dot Balls
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Stats Row */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-[#1A1624] p-2.5 rounded-xl border border-[#2E273D]">
                <div className="text-[10px] uppercase font-bold text-[#A99EBD]">HP Balls</div>
                <div className="text-sm font-black text-white font-sans mt-0.5">{player.HP_Balls}</div>
              </div>

              <div className="bg-[#1A1624] p-2.5 rounded-xl border border-[#2E273D]">
                <div className="text-[10px] uppercase font-bold text-[#A99EBD]">
                  {isBatter ? 'HP Runs' : 'HP Wickets'}
                </div>
                <div className="text-sm font-black text-white font-sans mt-0.5">
                  {isBatter ? player.HP_Runs : player.HP_Wkts}
                </div>
              </div>

              <div className="bg-[#1A1624] p-2.5 rounded-xl border border-[#2E273D]">
                <div className="text-[10px] uppercase font-bold text-[#A99EBD]">
                  {isBatter ? 'HP Average' : 'Crucial Spells'}
                </div>
                <div className="text-sm font-black text-[#E5A93C] font-sans mt-0.5">
                  {isBatter ? player.HP_Avg.toFixed(1) : player.Crucial_Spells || 11}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Metric Component Weights (Unified Clean Styling, No Rainbows) */}
          <div className="bg-[#211C2E] border border-[#352D47] rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#352D47] pb-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Sub-Metric Percentile Breakdown
              </h4>
              <span className="text-[10px] text-[#A99EBD]">Percentile</span>
            </div>

            <div className="space-y-3">
              {subComponents.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">
                      {item.label} <span className="text-[10px] text-[#A99EBD]">({item.weight})</span>
                    </span>
                    <span className="font-black text-white font-sans">{item.val.toFixed(1)}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-[#181622] rounded-full overflow-hidden border border-[#352D47]">
                    <div 
                      className="h-full bg-[#E41B66] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, item.val))}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#A99EBD]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Scout Directive */}
          <div className="bg-[#211C2E] border border-[#352D47] rounded-2xl p-4 flex items-start space-x-3">
            <Quote className="w-5 h-5 text-[#E41B66] shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                War Room Scouting Directive
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic mt-0.5">
                "{player.Scouting_Notes}"
              </p>
            </div>
          </div>

        </div>

        {/* 3. Footer */}
        <div className="p-4 bg-[#1A1826] border-t border-[#352D47]">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rr-btn-pink rounded-xl text-xs font-black uppercase tracking-wider shadow-sm"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
}
