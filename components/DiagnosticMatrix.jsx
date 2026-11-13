'use client';

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Flame, 
  Target, 
  Sparkles, 
  Info 
} from 'lucide-react';

export default function DiagnosticMatrix({ 
  batters = [], 
  bowlers = [], 
  selectedPlayer,
  onSelectPlayer 
}) {
  const [matrixView, setMatrixView] = useState('batters'); // 'batters' | 'bowlers'

  const batterData = batters.map(b => ({
    name: b.Name,
    rank: b.Rank,
    team: b.IPL_Team,
    rating: b.Rating,
    role: b.Role,
    x: Number(b.Normal_SR),
    y: Number(b.HP_SR),
    z: Number(b.HP_Balls),
    delta: Number(b.SR_Lift),
    balls: b.HP_Balls,
    runs: b.HP_Runs,
    avg: b.HP_Avg,
    img: b.image_url,
    raw: b
  }));

  const bowlerData = bowlers.map(w => ({
    name: w.Name,
    rank: w.Rank,
    team: w.IPL_Team,
    rating: w.Rating,
    role: w.Role,
    x: Number(w.Norm_Econ || (w.HP_Econ + 0.3)),
    y: Number(w.HP_Econ),
    z: Number(w.HP_Wkts * 15),
    delta: Number(w.Containment_Lift || (w.Norm_Econ ? w.Norm_Econ - w.HP_Econ : 0.4)),
    balls: w.HP_Balls,
    wkts: w.HP_Wkts,
    dotPct: w.HP_Dot_Pct,
    img: w.image_url,
    raw: w
  }));

  const isBatters = matrixView === 'batters';
  const currentData = isBatters ? batterData : bowlerData;

  const getNodeColor = (item) => {
    if (item.team === 'Rajasthan Royals') return '#E41B66'; // Official RR Pink
    if (item.rank === 1) return '#E5A93C'; // Gold #1
    if (item.rating >= 85) return '#FF3B82'; // Radiant Pink
    if (item.rating >= 80) return '#004BA0'; // Royal Blue
    return '#10B981'; // Emerald
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-rr-surface/95 border border-rr-pink/40 p-3.5 rounded-2xl shadow-2xl text-xs max-w-xs backdrop-blur-md z-50">
          <div className="flex items-center space-x-3 mb-2 pb-2 border-b border-rr-cardBorder">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-rr-card border border-rr-pink/50 shrink-0">
              <img src={data.img} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-rr-pink">#{data.rank}</span>
                <span className="font-black text-white text-sm">{data.name}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{data.team}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Composite Rating:</span>
              <span className="font-bold text-rr-gold">{data.rating.toFixed(1)} / 100</span>
            </div>

            {isBatters ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Normal SR:</span>
                  <span className="text-slate-300 font-sans">{data.x.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">High-Pressure SR:</span>
                  <span className="font-bold text-white font-sans">{data.y.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-rr-cardBorder text-emerald-400 font-bold">
                  <span>Pressure SR Lift:</span>
                  <span>+{data.delta.toFixed(1)} SR</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Normal Econ:</span>
                  <span className="text-slate-300 font-sans">{data.x.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">High-Pressure Econ:</span>
                  <span className="font-bold text-cyan-300 font-sans">{data.y.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-rr-cardBorder text-emerald-400 font-bold">
                  <span>Dot Ball Squeeze:</span>
                  <span>{data.dotPct.toFixed(1)}% ({data.wkts} Wkts)</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-2 pt-1 text-[10px] text-rr-pink font-semibold flex items-center justify-between">
            <span>Click to inspect full dossier</span>
            <span>→</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rr-card rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rr-blue/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-rr-pink">
            <TrendingUp className="w-4 h-4 text-rr-pink" />
            <span>Section B: Diagnostic Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 uppercase font-sans">
            PRESSURE VS. BASELINE DIAGNOSTIC MATRIX
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Scatter & Bubble Mapping: Baseline Performance vs. High-Pressure Execution
          </p>
        </div>

        {/* View Switcher Toggle */}
        <div className="inline-flex bg-rr-surface2/90 p-1 rounded-full border border-rr-cardBorder shadow-inner">
          <button
            onClick={() => setMatrixView('batters')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isBatters 
                ? 'bg-rr-pink text-white shadow-rr-pink' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Batters (SR Lift)</span>
          </button>
          <button
            onClick={() => setMatrixView('bowlers')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              !isBatters 
                ? 'bg-rr-blue text-white shadow-blue-glow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Bowlers (Economy & Wkts)</span>
          </button>
        </div>
      </div>

      {/* Matrix Sub-Banner */}
      <div className="mb-4 bg-rr-surface2/60 border border-rr-cardBorder rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-rr-gold shrink-0" />
          <span>
            {isBatters ? (
              <>
                <strong className="text-white">Clutch Outlier Zone:</strong> Players in the upper-left (e.g. <strong>Dhruv Jurel +44.1</strong>, <strong>Tristan Stubbs +41.3</strong>) show massive strike rate spikes when pressure escalates.
              </>
            ) : (
              <>
                <strong className="text-white">Suffocation Zone:</strong> Bowlers with low HP Economy & high Dot % (e.g. <strong>Mohammad Nawaz 6.43</strong>, <strong>Pathirana 40 Wkts</strong>) throttle opponent chase momentum.
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-gold-glow"></span>
            <span>#1 Ranked</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rr-pink shadow-rr-pink"></span>
            <span>RR Core</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Target Buy</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-80 sm:h-96 relative bg-rr-surface/50 rounded-2xl p-2 border border-rr-cardBorder">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 25, bottom: 25, left: 10 }}>
            <XAxis 
              type="number" 
              dataKey="x" 
              name={isBatters ? 'Normal Strike Rate' : 'Normal Economy'} 
              domain={isBatters ? [120, 180] : [6.0, 9.5]}
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => isBatters ? `${v} SR` : `${v} Econ`}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={isBatters ? 'High-Pressure Strike Rate' : 'High-Pressure Economy'} 
              domain={isBatters ? [155, 185] : [6.0, 9.8]}
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => isBatters ? `${v} HP SR` : `${v} HP Econ`}
            />
            <ZAxis 
              type="number" 
              dataKey="z" 
              range={[120, 550]} 
              name="Volume" 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#E41B66' }} />

            {isBatters ? (
              <>
                <ReferenceLine x={140} stroke="#371E6B" strokeDasharray="4 4" label={{ value: 'Norm SR Median (140.0)', fill: '#94A3B8', fontSize: 10 }} />
                <ReferenceLine y={168} stroke="#371E6B" strokeDasharray="4 4" label={{ value: 'HP SR Elite (168.0)', fill: '#94A3B8', fontSize: 10 }} />
              </>
            ) : (
              <>
                <ReferenceLine x={7.8} stroke="#371E6B" strokeDasharray="4 4" label={{ value: 'Norm Econ (7.80)', fill: '#94A3B8', fontSize: 10 }} />
                <ReferenceLine y={8.2} stroke="#371E6B" strokeDasharray="4 4" label={{ value: 'HP Econ Avg (8.20)', fill: '#94A3B8', fontSize: 10 }} />
              </>
            )}

            <Scatter 
              name={isBatters ? "Batters" : "Bowlers"} 
              data={currentData} 
              onClick={(e) => onSelectPlayer && onSelectPlayer(e.raw, isBatters ? 'batter' : 'bowler')}
              cursor="pointer"
            >
              {currentData.map((entry, index) => {
                const isSelected = selectedPlayer?.Name === entry.name;
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getNodeColor(entry)}
                    stroke={isSelected ? '#FFFFFF' : '#0B0518'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-all hover:opacity-100 hover:scale-125"
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Thumbnail Chips */}
      <div className="mt-4 pt-3 border-t border-rr-cardBorder flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Focus:
        </span>
        {currentData.map((p) => (
          <button
            key={p.rank}
            onClick={() => onSelectPlayer && onSelectPlayer(p.raw, isBatters ? 'batter' : 'bowler')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedPlayer?.Name === p.name
                ? 'bg-rr-pink text-white border-rr-pink shadow-rr-pink'
                : 'bg-rr-surface2 text-slate-300 border-rr-cardBorder hover:border-rr-pink/50'
            }`}
          >
            <div className="w-4 h-4 rounded-full overflow-hidden bg-rr-purple shrink-0">
              <img src={p.img} alt="" className="w-full h-full object-cover" />
            </div>
            <span>#{p.rank} {p.name.split(' ').pop()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
