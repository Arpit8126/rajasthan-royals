'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  ChevronRight, 
  Flame, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function AuctionRecommendationPanel({ 
  recommendations = [], 
  onSelectPlayerByName 
}) {
  const [selectedTargetId, setSelectedTargetId] = useState(null);

  // Player image mapping for the recommendation cards
  const playerImageMap = {
    'Tristan Stubbs': '/images/players/tristan_stubbs.png',
    'David Miller': '/images/players/david_miller.png',
    'Wanindu Hasaranga': '/images/players/wanindu_hasaranga.png',
    'Nathan Ellis': '/images/players/nathan_ellis.png',
    'Dhruv Jurel': '/images/players/dhruv_jurel.png'
  };

  const getPriorityBadge = (priority) => {
    if (priority.includes('P0')) {
      return 'bg-rr-pink text-white shadow-rr-pink font-black';
    }
    if (priority.includes('P1')) {
      return 'bg-amber-500 text-navy-950 font-black';
    }
    return 'bg-rr-blue text-blue-200 border border-blue-400/40 font-bold';
  };

  return (
    <div className="rr-card rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rr-cardBorder pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-rr-gold">
            <Sparkles className="w-4 h-4 text-rr-gold" />
            <span>Tactical Solvers & Target Mapping</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 uppercase font-sans">
            AI AUCTION RECOMMENDATION & TARGET DIRECTIVES
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Direct Solvers from Top 10 Pressure Matrix Mapped to RR Tactical Gaps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rr-surface2 border border-rr-cardBorder text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>War Room Match Active</span>
          </span>
        </div>
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recommendations.map((rec, index) => {
          const isSelected = selectedTargetId === rec.player_name;
          const playerImg = playerImageMap[rec.player_name] || '/images/players/dhruv_jurel.png';
          
          return (
            <div
              key={index}
              onClick={() => {
                setSelectedTargetId(rec.player_name);
                if (onSelectPlayerByName) onSelectPlayerByName(rec.player_name);
              }}
              className={`group rounded-2xl p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-rr-surface2 border-2 border-rr-pink shadow-rr-pink scale-[1.01]'
                  : 'bg-rr-cardDark/80 hover:bg-rr-card/90 border border-rr-cardBorder hover:border-rr-pink/60'
              }`}
            >
              {/* Background player cutout silhouette */}
              <div className="absolute right-0 top-0 w-28 h-36 opacity-15 group-hover:opacity-30 transition-opacity pointer-events-none">
                <img src={playerImg} alt="" className="w-full h-full object-contain filter drop-shadow" />
              </div>

              {/* Card Header */}
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded-md ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-rr-gold font-sans">
                    <span>Fit:</span>
                    <span className="text-white bg-rr-surface px-2 py-0.5 rounded border border-rr-cardBorder">
                      {rec.fit_score}
                    </span>
                  </div>
                </div>

                {/* Player Name with mini avatar */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-rr-surface border border-rr-pink/30 overflow-hidden flex items-end justify-center shrink-0">
                    <img src={playerImg} alt={rec.player_name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white group-hover:text-rr-pink transition-colors uppercase font-sans tracking-tight">
                      {rec.player_name}
                    </h4>
                    <div className="text-xs text-slate-400 font-medium">
                      {rec.role}
                    </div>
                  </div>
                </div>

                {/* Target Gap Tag */}
                <div className="bg-rr-surface/90 rounded-xl p-2.5 border border-rr-cardBorder">
                  <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    Targeted RR Deficit
                  </div>
                  <div className="text-xs font-bold text-amber-300 mt-0.5 flex items-center gap-1 font-sans">
                    <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{rec.target_gap}</span>
                  </div>
                </div>

                {/* Key Pressure Metric */}
                <div className="bg-rr-surface/60 rounded-xl p-2.5 border border-rr-cardBorder">
                  <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    High-Pressure Metric
                  </div>
                  <div className="text-xs font-extrabold text-emerald-400 mt-0.5 font-sans">
                    {rec.key_metric}
                  </div>
                </div>

                {/* Strategic Rationale Narrative */}
                <p className="text-xs text-slate-300 leading-relaxed italic bg-rr-surface/40 p-2.5 rounded-xl border border-rr-cardBorder/60">
                  "{rec.strategic_rationale}"
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-rr-cardBorder flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center gap-1 text-slate-400 font-sans">
                  <DollarSign className="w-3.5 h-3.5 text-rr-gold shrink-0" />
                  <span className="text-[11px] font-bold text-rr-gold">
                    {rec.estimated_budget}
                  </span>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[11px] font-black text-rr-pink group-hover:text-pink-300 transition-colors uppercase tracking-wider"
                >
                  <span>Inspect Dossier</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* War Room Action Directives Banner */}
      <div className="bg-gradient-to-r from-rr-card to-rr-surface2 p-5 rounded-2xl border border-rr-cardBorder flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rr-pink/20 border border-rr-pink/50 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-rr-pink" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase font-sans">
              IPL 2027 Auction War Room Strategic Consensus
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Acquiring Tristan Stubbs (or David Miller) + Wanindu Hasaranga shifts RR simulated death batting SR from 154.80 to 171.40 and middle spin economy from 10.25 to 8.65.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onSelectPlayerByName && onSelectPlayerByName('Tristan Stubbs')}
            className="rr-btn-pink px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-rr-pink flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Target #1: Stubbs</span>
          </button>
          <button
            onClick={() => onSelectPlayerByName && onSelectPlayerByName('Wanindu Hasaranga')}
            className="px-4 py-2.5 rounded-lg bg-rr-blue hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-blue-glow transition-all flex items-center gap-1.5"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Target #2: Hasaranga</span>
          </button>
        </div>
      </div>

    </div>
  );
}
