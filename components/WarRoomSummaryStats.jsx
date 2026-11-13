'use client';

import React from 'react';

export default function WarRoomSummaryStats({ 
  onSelectPlayerByName 
}) {
  const stats = [
    {
      number: '91.1',
      numberColor: 'text-[#E41B66]',
      label: 'Top Clutch Batter',
      sublabel: 'Tristan Stubbs (+41.3 SR Lift)',
      player: 'Tristan Stubbs'
    },
    {
      number: '87.8',
      numberColor: 'text-cyan-400',
      label: 'Top Clutch Bowler',
      sublabel: 'M. Pathirana (40 HP Wickets)',
      player: 'Matheesha Pathirana'
    },
    {
      number: '180.1',
      numberColor: 'text-[#E41B66]',
      label: 'Highest HP Strike Rate',
      sublabel: 'Dhruv Jurel (RR Core Pillar)',
      player: 'Dhruv Jurel'
    },
    {
      number: '-12.5',
      numberColor: 'text-rose-400',
      label: 'Primary Tactical Gap',
      sublabel: 'Death Batting Deficit vs League',
      player: null
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
      {stats.map((s, idx) => (
        <div
          key={idx}
          onClick={() => s.player && onSelectPlayerByName && onSelectPlayerByName(s.player)}
          className={`bg-[#272236] border border-[#3A334E] hover:border-[#E41B66] rounded-2xl p-3 sm:p-4 text-center transition-all ${
            s.player ? 'cursor-pointer hover:-translate-y-0.5' : ''
          }`}
        >
          <div className={`text-2xl sm:text-4xl font-black font-sans leading-none ${s.numberColor}`}>
            {s.number}
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider mt-1 sm:mt-1.5 font-sans">
            {s.label}
          </div>
          <div className="text-[9px] sm:text-[11px] text-[#A99EBD] mt-0.5 font-medium truncate">
            {s.sublabel}
          </div>
        </div>
      ))}
    </div>
  );
}
