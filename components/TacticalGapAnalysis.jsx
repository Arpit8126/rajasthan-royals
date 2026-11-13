'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Maximize2, 
  X, 
  ArrowUpRight,
  ShieldAlert,
  Flame,
  Target,
  Zap,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export default function TacticalGapAnalysis({ onSelectPlayerByName }) {
  const [showFigureModal, setShowFigureModal] = useState(false);

  const deficits = [
    {
      num: '01',
      title: 'Death-Over Batting Deficit',
      subtitle: 'Overs 16–20 Batting Crisis',
      rrStat: '154.80 HP SR',
      leagueStat: '167.27 League',
      delta: '-12.47 SR Gap',
      deltaType: 'deficit',
      severity: 'Critical Gap',
      severityBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      description: 'While Dhruv Jurel (186.15 IPL HP SR, 48.40 Avg) and Donovan Ferreira (186.11 HP SR) excelled under pressure, Shimron Hetmyer (130.83 HP SR, 15.82 Avg) and Shubham Dubey (108.99 HP SR) stalled in tight finishes.',
      actionTitle: 'Strategic Auction Action',
      actionText: 'Retain Dhruv Jurel (#4 Batter) as primary finisher; target Tristan Stubbs (#1), David Miller (#3), or high-upside Indian finisher Naman Dhir (#10) if released.',
      targets: [
        { name: 'Tristan Stubbs', role: '#1 Target (91.1 Rtg)' },
        { name: 'Dhruv Jurel', role: '#4 Retained Pillar' }
      ]
    },
    {
      num: '02',
      title: 'Middle-Over Spin Containment',
      subtitle: 'Overs 7–15 Economy Leakage',
      rrStat: '10.25 HP Econ',
      leagueStat: '9.40 League',
      delta: '+0.85 Econ Bleed',
      deltaType: 'leakage',
      severity: 'High Leakage',
      severityBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      description: 'Both Ravi Bishnoi (12.33 HP Econ) and Maheesh Theekshana (12.11 HP Econ) leaked boundaries during defensive middle-over squeezes (21.45 wicket strike rate vs. 18.43 league average).',
      actionTitle: 'Strategic Auction Action',
      actionText: 'Target attacking wrist-spinner Wanindu Hasaranga (#6 Bowler, 8.16 HP Econ, 34 HP wickets) to choke middle-phase momentum.',
      targets: [
        { name: 'Wanindu Hasaranga', role: '#6 Target (34 Wkts)' }
      ]
    },
    {
      num: '03',
      title: 'Death Pace Partner for Jofra Archer',
      subtitle: 'Overs 18–20 Yorker & Change-of-Pace Execution',
      rrStat: '11.91 HP Econ',
      leagueStat: '11.51 League',
      delta: '+0.40 Econ Deficit',
      deltaType: 'deficit',
      severity: 'Pace Support',
      severityBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'Jofra Archer (10.87 HP Econ, 13 wickets) lacked a reliable closing partner (Sandeep Sharma 11.95, Brijesh Sharma 11.65, Tushar Deshpande 11.23).',
      actionTitle: 'Strategic Auction Action',
      actionText: 'Target death-over change-of-pace specialist Nathan Ellis (#4 Bowler, 8.50 HP Econ, 13 crucial spells) or Josh Hazlewood (#9 Bowler, 44.6% HP dot balls).',
      targets: [
        { name: 'Nathan Ellis', role: '#4 Target (8.50 Econ)' },
        { name: 'Josh Hazlewood', role: '#9 Target (44.6% Dots)' }
      ]
    }
  ];

  return (
    <div id="tactics-gap-audit" className="bg-[#211C2E] border border-[#352D47] rounded-3xl p-4 sm:p-9 shadow-2xl space-y-6 sm:space-y-8">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 border-b border-[#352D47] pb-4 sm:pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#E41B66]">
            <ShieldAlert className="w-4 h-4 text-[#E41B66]" />
            <span>Tactical Diagnosis & Franchise Strategy</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase font-sans mt-1">
            Rajasthan Royals Gap Audit & Auction Strategy
          </h2>
          <p className="text-xs sm:text-sm text-[#A99EBD] mt-1 max-w-3xl leading-relaxed">
            Auditing Rajasthan Royals' 30 IPL matches across 2025 and 2026 against the other 9 franchises pinpoints three specific high-pressure deficits and maps them to actionable IPL 2027 targets.
          </p>
        </div>

        <button
          onClick={() => setShowFigureModal(true)}
          className="w-full sm:w-auto justify-center px-4 py-2.5 bg-[#2B243B] hover:bg-[#362E4A] text-slate-200 text-xs font-bold rounded-xl border border-[#43395C] flex items-center gap-2 transition-all shrink-0 shadow-sm"
        >
          <Maximize2 className="w-4 h-4 text-[#E5A93C]" />
          <span>Expand Figure 3 HD</span>
        </button>
      </div>

      {/* 2. Figure 3 Preview Card */}
      <div className="bg-[#1A1624] rounded-2xl p-3 sm:p-5 border border-[#322A42] space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
          <span className="flex items-center gap-2 text-white uppercase font-sans tracking-wide text-[11px] sm:text-xs">
            <BarChart3 className="w-4 h-4 text-[#E41B66]" />
            <span>Figure 3: Rajasthan Royals (IPL 2025–2026) Tactical Phase Gap Audit</span>
          </span>
          <span className="text-[#A99EBD] text-[11px] font-medium hidden sm:inline">Click to enlarge</span>
        </div>

        <div 
          onClick={() => setShowFigureModal(true)}
          className="w-full rounded-xl overflow-hidden cursor-pointer hover:border-[#E41B66]/80 border border-[#322A42] transition-all bg-[#120F1C] flex items-center justify-center p-2 group"
        >
          <img 
            src="/images/chart3_rr_2025_26_gaps.png" 
            alt="Figure 3: Rajasthan Royals Gap Audit" 
            className="w-full max-h-[220px] sm:max-h-[340px] object-contain rounded-lg filter drop-shadow group-hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      </div>

      {/* 3. The 3 Clean Deficit Cards (Replaced Cluttered Design) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {deficits.map((d, idx) => (
          <div
            key={idx}
            className="bg-[#1A1624] border border-[#322A42] hover:border-[#E41B66]/60 rounded-2xl p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 space-y-4 sm:space-y-5 shadow-lg group hover:-translate-y-1"
          >
            {/* Card Header: Number & Severity Tag */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black font-mono text-[#E41B66] bg-[#E41B66]/10 px-2 sm:px-2.5 py-1 rounded-lg border border-[#E41B66]/20">
                  DEFICIT #{d.num}
                </span>
                <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${d.severityBg}`}>
                  {d.severity}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#E41B66] transition-colors font-sans tracking-tight leading-snug">
                  {d.title}
                </h3>
                <div className="text-[11px] text-[#A99EBD] font-medium mt-0.5">
                  {d.subtitle}
                </div>
              </div>

              {/* Clean Metric Delta Pill */}
              <div className="bg-[#241F33] rounded-xl p-2.5 sm:p-3 border border-[#372E4C] flex items-center justify-between text-xs">
                <div>
                  <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#A99EBD]">RR Conceded / SR</div>
                  <div className="text-xs sm:text-sm font-black text-white font-sans mt-0.5">{d.rrStat}</div>
                </div>

                <div className="text-right">
                  <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#A99EBD]">League Average</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-300 font-sans mt-0.5">{d.leagueStat}</div>
                </div>
              </div>

              {/* Narrative Prose */}
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-sans">
                {d.description}
              </p>
            </div>

            {/* Strategic Action Callout & Clean Target Buttons */}
            <div className="pt-3 sm:pt-4 border-t border-[#322A42] space-y-2.5 sm:space-y-3">
              <div className="bg-[#241F33]/80 rounded-xl p-2.5 sm:p-3 border border-[#352D47]">
                <div className="text-[10px] uppercase font-bold text-[#E5A93C] tracking-wider font-sans">
                  {d.actionTitle}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-200 font-medium leading-relaxed mt-1">
                  {d.actionText}
                </p>
              </div>

              {/* Target Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {d.targets.map((tgt, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => onSelectPlayerByName && onSelectPlayerByName(tgt.name)}
                    className="flex-1 min-w-[110px] sm:min-w-[120px] px-2.5 sm:px-3 py-2 bg-[#2E2840] hover:bg-[#E41B66] text-white text-[11px] sm:text-xs font-bold rounded-lg border border-[#43395C] hover:border-[#E41B66] transition-all flex items-center justify-between shadow-sm group/btn"
                  >
                    <span>{tgt.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#A99EBD] group-hover/btn:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Lightbox Modal for Figure 3 */}
      {showFigureModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-[#181622] rounded-3xl border border-[#3A334E] overflow-hidden shadow-2xl p-5">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">
                Figure 3: Rajasthan Royals Tactical Gap Audit (High Resolution)
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

            <div className="mt-4 text-right">
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
