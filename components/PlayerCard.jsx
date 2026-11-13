'use client';

import React from 'react';
import { 
  ChevronRight, 
  Sparkles,
  Award
} from 'lucide-react';

export default function PlayerCard({ 
  player, 
  type = 'batter', 
  isSelected = false, 
  onSelect 
}) {
  const isBatter = type === 'batter';
  const isRR = player.IPL_Team === 'Rajasthan Royals';

  return (
    <div
      onClick={() => onSelect(player, type)}
      className={`group relative rounded-2xl p-3.5 sm:p-5 cursor-pointer transition-all duration-300 overflow-hidden flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3.5 sm:gap-5 w-full max-w-full min-w-0 ${
        isSelected 
          ? 'bg-[#2E2840] border-2 border-[#E41B66] shadow-rr-pink scale-[1.01]' 
          : 'rr-player-card hover:border-[#E41B66] hover:bg-[#2C263D]'
      }`}
    >
      {/* 0. Big Standalone Rank Number (No rectangular card, no 'RANK' text) */}
      <div className="absolute top-2.5 sm:top-4 left-3 sm:left-5 z-10 select-none pointer-events-none">
        <span className={`text-4xl sm:text-6xl font-black font-sans leading-none tracking-tighter drop-shadow-md ${
          player.Rank === 1 
            ? 'text-[#E5A93C]' 
            : player.Rank <= 3 
              ? 'text-[#E41B66]' 
              : 'text-white/35'
        }`}>
          {player.Rank}
        </span>
      </div>

      {/* 1. Left: Waist-Up Cutout Image (Exact Match to Image 4) */}
      <div className="w-28 h-36 sm:w-40 sm:h-52 relative flex items-end justify-center shrink-0">
        <img
          src={player.image_url}
          alt={player.Name}
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.Name)}&size=256&background=272236&color=E41B66&bold=true`;
          }}
        />
      </div>

      {/* 2. Right: Player Headline, Stats, and Boxes (Exact Match to Image 4) */}
      <div className="flex-1 w-full space-y-2 sm:space-y-3">
        
        {/* Top Highlight Stat: Huge Pink Number + White Label */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1.5 sm:space-x-2">
            <span className="text-2xl sm:text-4xl font-black text-[#E41B66] font-sans leading-none">
              {isBatter ? player.HP_SR.toFixed(1) : player.HP_Econ.toFixed(2)}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-sans">
              {isBatter ? 'HP Strike Rate' : 'HP Economy'}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className={`px-2 sm:px-2.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase ${
              isRR 
                ? 'bg-[#E41B66] text-white shadow-sm' 
                : 'bg-[#332B45] text-[#A99EBD] border border-[#453A5A]'
            }`}>
              {player.IPL_Team}
            </span>
          </div>
        </div>

        {/* Player Name & Role */}
        <div>
          <h3 className="text-lg sm:text-2xl font-black text-white group-hover:text-[#E41B66] transition-colors font-sans tracking-tight">
            {player.Name}
          </h3>
          <div className="text-[11px] sm:text-xs text-[#A99EBD] font-medium mt-0.5">
            {player.Role} • {player.country_flag || '🏏'} {player.country}
          </div>
        </div>

        {/* 3 Stat Boxes (Exact replication of Image 4: Matches | Average | Strike Rate) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-1 text-center">
          {isBatter ? (
            <>
              <div className="rr-stat-box p-1.5 sm:p-2">
                <div className="text-xs sm:text-base font-black text-white font-sans">
                  {player.Normal_SR.toFixed(1)}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#A99EBD] tracking-wider mt-0.5">
                  Normal SR
                </div>
              </div>

              <div className="rr-stat-box p-1.5 sm:p-2 border-[#E41B66]/40">
                <div className="text-xs sm:text-base font-black text-[#E41B66] font-sans">
                  +{player.SR_Lift.toFixed(1)}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#A99EBD] tracking-wider mt-0.5">
                  SR Lift
                </div>
              </div>

              <div className="rr-stat-box p-1.5 sm:p-2">
                <div className="text-xs sm:text-base font-black text-[#E5A93C] font-sans">
                  {player.Rating.toFixed(1)}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#A99EBD] tracking-wider mt-0.5">
                  Rating
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rr-stat-box p-1.5 sm:p-2">
                <div className="text-xs sm:text-base font-black text-white font-sans">
                  {player.HP_Wkts}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#A99EBD] tracking-wider mt-0.5">
                  HP Wickets
                </div>
              </div>

              <div className="rr-stat-box p-1.5 sm:p-2">
                <div className="text-xs sm:text-base font-black text-amber-300 font-sans">
                  {player.HP_Dot_Pct.toFixed(1)}%
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#A99EBD] tracking-wider mt-0.5">
                  Dot Ball %
                </div>
              </div>

              <div className="rr-stat-box p-1.5 sm:p-2">
                <div className="text-xs sm:text-base font-black text-[#E5A93C] font-sans">
                  {player.Rating.toFixed(1)}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#A99EBD] tracking-wider mt-0.5">
                  Rating
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer: View Profile Trigger */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-[10px] sm:text-[11px] text-[#A99EBD] italic truncate max-w-[60%] sm:max-w-[75%]">
            "{player.Scouting_Notes}"
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-[#E41B66] group-hover:text-pink-400 flex items-center gap-0.5 shrink-0">
            <span>View Profile</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

      </div>
    </div>
  );
}
