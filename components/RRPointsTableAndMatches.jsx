'use client';

import React, { useState } from 'react';
import {
  Target,
  Flame,
  ChevronRight,
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function RRPointsTableAndMatches({
  batters = [],
  bowlers = [],
  onSelectPlayerByName
}) {
  const [tableTab, setTableTab] = useState('batters'); // 'batters' | 'bowlers'

  const currentList = tableTab === 'batters' ? batters : bowlers;
  const isBat = tableTab === 'batters';

  // Tactical Gap cards (matching Image 3 Matches carousel)
  const gapCards = [
    {
      title: 'Death Batting Deficit',
      subtitle: 'Critical Tactical Gap',
      tag: 'CRITICAL',
      tagBg: 'bg-rose-500',
      rrMetric: '154.80 HP SR',
      leagueMetric: '167.27 League',
      delta: '-12.47 SR Gap',
      solverName: 'Tristan Stubbs',
      solverRating: '91.1 Rating',
      action: 'RESOLVE GAP'
    },
    {
      title: 'Middle Spin Leakage',
      subtitle: 'Economy Containment Bleed',
      tag: 'HIGH DEFICIT',
      tagBg: 'bg-amber-500',
      rrMetric: '10.25 HP Econ',
      leagueMetric: '9.40 League',
      delta: '+0.85 Econ Bleed',
      solverName: 'Wanindu Hasaranga',
      solverRating: '77.5 Rating',
      action: 'RESOLVE GAP'
    },
    {
      title: 'Powerplay Blitz',
      subtitle: 'Elite Core Strength',
      tag: 'ELITE SURPLUS',
      tagBg: 'bg-emerald-500',
      rrMetric: '182.61 HP SR',
      leagueMetric: '122.07 League',
      delta: '+60.54 SR Surplus',
      solverName: 'Dhruv Jurel',
      solverRating: '85.3 Rating',
      action: 'ELEVATE CORE'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-8">

      {/* 1. Left Side: Tactical Matches / Gap Solvers (Exact Match to Image 3 Left) */}
      <div className="lg:col-span-5 space-y-4">

        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white uppercase font-sans tracking-tight">
            Tactical Matches
          </h3>
          <span className="text-xs font-bold text-[#A99EBD] hover:text-[#E41B66] cursor-pointer transition-colors">
            View More
          </span>
        </div>

        {/* Card Stack */}
        <div className="space-y-3 sm:space-y-3.5">
          {gapCards.map((gap, idx) => (
            <div
              key={idx}
              className="bg-[#272236] border border-[#3A334E] hover:border-[#E41B66] rounded-2xl p-4 sm:p-5 shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <span className={`px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-white rounded-md ${gap.tagBg}`}>
                  {gap.tag}
                </span>
                <span className="text-xs font-bold text-white font-sans">
                  {gap.title}
                </span>
              </div>

              {/* Delta Comparison Row */}
              <div className="flex items-center justify-between py-2 border-y border-[#3A334E]/60 text-xs my-2">
                <div>
                  <div className="text-[9px] sm:text-[10px] text-[#A99EBD] uppercase font-bold">RR Performance</div>
                  <div className="text-sm sm:text-base font-black text-white font-sans">{gap.rrMetric}</div>
                </div>
                <div className="text-center font-bold text-[#E41B66] px-2 py-0.5 sm:py-1 rounded bg-[#332B45] text-[11px] sm:text-xs">
                  {gap.delta}
                </div>
                <div className="text-right">
                  <div className="text-[9px] sm:text-[10px] text-[#A99EBD] uppercase font-bold">League Avg</div>
                  <div className="text-sm sm:text-base font-bold text-slate-300 font-sans">{gap.leagueMetric}</div>
                </div>
              </div>

              {/* Action Button: MATCHCENTRE (Image 3 Style) */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-[#A99EBD]">
                  Target: <strong className="text-white">{gap.solverName}</strong>
                </span>

                <button
                  onClick={() => onSelectPlayerByName && onSelectPlayerByName(gap.solverName)}
                  className="rr-btn-pink px-3.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm"
                >
                  {gap.action}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 2. Right Side: Points Table / High-Pressure Leaderboard (Exact Match to Image 3 Right) */}
      <div className="lg:col-span-7 space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <h3 className="text-lg sm:text-xl font-black text-white uppercase font-sans tracking-tight">
              Points Table
            </h3>
            <span className="text-[10px] sm:text-xs uppercase font-extrabold px-2 sm:px-2.5 py-0.5 rounded bg-[#332B45] text-[#E41B66] border border-[#453A5A]">
              Reliability Leaderboard
            </span>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => setTableTab('batters')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${isBat ? 'bg-[#E41B66] text-white' : 'bg-[#272236] text-[#A99EBD] hover:text-white'
                }`}
            >
              Batters
            </button>
            <button
              onClick={() => setTableTab('bowlers')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${!isBat ? 'bg-[#E41B66] text-white' : 'bg-[#272236] text-[#A99EBD] hover:text-white'
                }`}
            >
              Bowlers
            </button>
          </div>
        </div>

        {/* Table Container (Exact Layout from Image 3) */}
        <div className="bg-[#272236] border border-[#3A334E] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-xs font-sans min-w-[500px] sm:min-w-full">
              <thead className="bg-[#1E1B2B] text-[#A99EBD] uppercase text-[10px] tracking-wider border-b border-[#3A334E]">
                <tr>
                  <th className="py-2.5 sm:py-3 px-3 sm:px-3.5 text-center">#</th>
                  <th className="py-2.5 sm:py-3 px-3 sm:px-4">PLAYER</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-3">TEAM</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-3 text-right">{isBat ? 'HP SR' : 'HP ECON'}</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-3 text-right">{isBat ? 'DELTA' : 'WKTS'}</th>
                  <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right">RATING</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A334E]/50">
                {currentList.map((player) => {
                  const isRR = player.IPL_Team === 'Rajasthan Royals';

                  return (
                    <tr
                      key={player.Rank}
                      onClick={() => onSelectPlayerByName && onSelectPlayerByName(player.Name)}
                      className={`cursor-pointer transition-colors ${isRR
                          ? 'bg-[#E41B66] text-white font-bold hover:bg-[#C21353]' // Highlighted Pink Row exactly like Image 3!
                          : 'hover:bg-[#312B43] text-slate-200'
                        }`}
                    >
                      <td className="py-3 px-3.5 text-center font-bold font-mono">
                        {player.Rank}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1E1B2B] shrink-0 border border-white/20">
                            <img src={player.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold tracking-tight">
                              {player.Name}
                            </div>
                            <div className={`text-[10px] ${isRR ? 'text-pink-100' : 'text-[#A99EBD]'}`}>
                              {player.Role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${isRR ? 'bg-white/20 text-white' : 'bg-[#332B45] text-slate-300'
                          }`}>
                          {player.IPL_Team}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-black font-mono">
                        {isBat ? player.HP_SR.toFixed(1) : player.HP_Econ.toFixed(2)}
                      </td>
                      <td className={`py-3 px-3 text-right font-bold font-mono ${isRR ? 'text-white' : isBat ? 'text-emerald-400' : 'text-cyan-300'
                        }`}>
                        {isBat ? `+${player.SR_Lift.toFixed(1)}` : player.HP_Wkts}
                      </td>
                      <td className="py-3 px-4 text-right font-black font-mono text-sm">
                        {player.Rating.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

