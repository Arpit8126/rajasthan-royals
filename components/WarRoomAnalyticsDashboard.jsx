'use client';

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  BarChart,
  Bar,
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
  Info,
  Maximize2,
  X,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export default function WarRoomAnalyticsDashboard({ 
  batters = [], 
  bowlers = [], 
  selectedPlayer,
  onSelectPlayer 
}) {
  const [activeTab, setActiveTab] = useState('batting'); // 'batting' | 'bowling'
  const [modalImage, setModalImage] = useState(null); // Lightbox for figures
  const [hoveredFigure, setHoveredFigure] = useState(null); // Hover tooltip image

  // 1. Batting Data
  const batterData = batters.map(b => ({
    name: b.Name,
    rank: b.Rank,
    team: b.IPL_Team,
    rating: b.Rating,
    role: b.Role,
    normSR: Number(b.Normal_SR),
    hpSR: Number(b.HP_SR),
    deltaSR: Number(b.SR_Lift),
    balls: b.HP_Balls,
    runs: b.HP_Runs,
    avg: b.HP_Avg,
    img: b.image_url,
    raw: b
  }));

  // Batters SR Lift Chart Data
  const batterLiftData = [...batters].reverse().map(b => ({
    name: `#${b.Rank} ${b.Name.split(' ').pop()}`,
    fullName: b.Name,
    rank: b.Rank,
    team: b.IPL_Team,
    normSR: Number(b.Normal_SR),
    hpSR: Number(b.HP_SR),
    delta: Number(b.SR_Lift),
    rating: b.Rating,
    img: b.image_url,
    raw: b
  }));

  // 2. Bowling Data
  const bowlerData = bowlers.map(w => ({
    name: w.Name,
    rank: w.Rank,
    team: w.IPL_Team,
    rating: w.Rating,
    role: w.Role,
    econ: Number(w.HP_Econ),
    normEcon: Number(w.Norm_Econ || (w.HP_Econ + 0.3)),
    dotPct: Number(w.HP_Dot_Pct),
    wkts: w.HP_Wkts,
    balls: w.HP_Balls,
    img: w.image_url,
    raw: w
  }));

  // Color mapper
  const getNodeColor = (item) => {
    if (item.team === 'Rajasthan Royals') return '#E41B66'; // Official RR Pink
    if (item.rank === 1) return '#E5A93C'; // Gold #1
    if (item.rating >= 85) return '#FF3B82'; // Radiant Pink
    if (item.rating >= 80) return '#004BA0'; // Royal Blue
    return '#10B981'; // Emerald
  };

  // ZERO-FLICKERING Custom Tooltip (pointer-events: none, no animation jitter)
  const CustomScatterTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;

    return (
      <div className="pointer-events-none select-none bg-[#1A1826]/95 border border-[#E41B66]/60 p-3.5 rounded-2xl shadow-2xl text-xs max-w-xs backdrop-blur-md z-50">
        <div className="flex items-center space-x-2.5 mb-2 pb-2 border-b border-[#3A334E]">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#272236] border border-[#E41B66] shrink-0">
            <img src={data.img} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-sans">
              <span className="text-[10px] font-bold text-[#E41B66]">#{data.rank}</span>
              <span className="font-black text-white text-sm">{data.name}</span>
            </div>
            <span className="text-[10px] text-[#A99EBD]">{data.team}</span>
          </div>
        </div>

        <div className="space-y-1.5 font-sans">
          <div className="flex justify-between items-center">
            <span className="text-[#A99EBD]">Composite Rating:</span>
            <span className="font-bold text-[#E5A93C]">{data.rating.toFixed(1)} / 100</span>
          </div>

          {activeTab === 'batting' ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-[#A99EBD]">Normal SR:</span>
                <span className="text-slate-300">{data.normSR.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A99EBD]">High-Pressure SR:</span>
                <span className="font-black text-white">{data.hpSR.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#3A334E] text-emerald-400 font-bold">
                <span>SR Delta Lift:</span>
                <span>+{data.deltaSR.toFixed(1)} SR</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-[#A99EBD]">High-Pressure Econ:</span>
                <span className="font-black text-cyan-300">{data.econ.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A99EBD]">Dot Ball %:</span>
                <span className="font-bold text-amber-300">{data.dotPct.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#3A334E] text-[#E41B66] font-bold">
                <span>HP Wickets:</span>
                <span>{data.wkts} Wickets</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Tooltip for Batting Lift Bar Chart
  const CustomLiftTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;

    return (
      <div className="pointer-events-none select-none bg-[#1A1826]/95 border border-[#E41B66]/60 p-3 rounded-xl shadow-2xl text-xs max-w-xs z-50">
        <div className="font-bold text-white mb-1.5 flex items-center justify-between border-b border-[#3A334E] pb-1">
          <span>{data.fullName}</span>
          <span className="text-[#E41B66]">#{data.rank}</span>
        </div>
        <div className="space-y-1 font-sans">
          <div className="flex justify-between text-slate-300">
            <span>Normal SR:</span>
            <span className="font-bold text-slate-400">{data.normSR}</span>
          </div>
          <div className="flex justify-between text-white font-bold">
            <span>High-Pressure SR:</span>
            <span className="text-[#E41B66]">{data.hpSR}</span>
          </div>
          <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-[#3A334E]">
            <span>Net SR Lift:</span>
            <span>+{data.delta} SR</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="dashboard-matrix" className="rr-player-card p-4 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 relative w-full max-w-full overflow-hidden min-w-0">
      
      {/* Top Header & Interactive Dashboard Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-[#3A334E] pb-4 sm:pb-5">
        <div>
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#E41B66]">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E41B66]" />
            <span>High-Pressure Analytics Terminal</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase font-sans mt-0.5">
            WAR ROOM DIAGNOSTIC DASHBOARDS
          </h2>
          <p className="text-xs sm:text-sm text-[#A99EBD]">
            Interactive Pressure & Containment Matrices: Normal Baseline vs. Match-Defining Execution
          </p>
        </div>

        {/* Dashboard Switchers & Figure Tooltip Trigger */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="grid grid-cols-2 sm:flex bg-[#1E1B2B] p-1 rounded-xl border border-[#3A334E] w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('batting')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
                activeTab === 'batting'
                  ? 'bg-[#E41B66] text-white shadow-rr-pink'
                  : 'text-[#A99EBD] hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Batting SR Lift</span>
            </button>

            <button
              onClick={() => setActiveTab('bowling')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
                activeTab === 'bowling'
                  ? 'bg-[#004BA0] text-white shadow-md'
                  : 'text-[#A99EBD] hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Bowling Matrix</span>
            </button>
          </div>

          {/* Interactive Figure Hover Tooltip + Click to Expand */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredFigure(activeTab === 'batting' ? '/images/fig1_batters_pressure_lift.png' : '/images/fig2_bowlers_pressure_matrix.png')}
            onMouseLeave={() => setHoveredFigure(null)}
          >
            <button
              onClick={() => setModalImage(activeTab === 'batting' ? '/images/fig1_batters_pressure_lift.png' : '/images/fig2_bowlers_pressure_matrix.png')}
              className="w-full sm:w-auto px-3 sm:px-3.5 py-1.5 bg-[#2E2840] hover:bg-[#38314F] text-slate-200 text-[11px] sm:text-xs font-bold rounded-xl border border-[#453A5A] transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>{activeTab === 'batting' ? 'Figure 1: Batters Lift' : 'Figure 2: Bowlers Matrix'}</span>
              <Maximize2 className="w-3 h-3 text-[#A99EBD]" />
            </button>

            {/* Hover Tooltip Picture Preview (Desktop only) */}
            {hoveredFigure && (
              <div className="hidden sm:block absolute right-0 top-full mt-2 z-50 w-80 bg-[#1A1826] border-2 border-[#E41B66] rounded-2xl p-2 shadow-2xl pointer-events-none animate-fadeIn">
                <div className="text-[10px] uppercase font-bold text-[#A99EBD] mb-1 px-1 flex items-center justify-between">
                  <span>Report Figure Asset Preview</span>
                  <span className="text-[#E41B66]">Click to Expand</span>
                </div>
                <img src={hoveredFigure} alt="Report Figure" className="w-full rounded-xl object-contain bg-[#100D18]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TAB 1: BATTING DASHBOARD (Strike Rate Lift & Normal vs HP Matrix) */}
      {activeTab === 'batting' && (
        <div className="space-y-6">
          
          {/* Key Insights Banner */}
          <div className="bg-[#1E1B2B] border border-[#3A334E] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Info className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <span>
                <strong className="text-white">Clutch Lift Leader:</strong> <strong>Dhruv Jurel</strong> holds the highest SR Lift in modern cricket (<strong>+44.06 SR Delta</strong>, 180.07 HP SR), followed by <strong>Tristan Stubbs (+41.33 SR)</strong> and <strong>David Miller (+33.29 SR)</strong>.
              </span>
            </div>

            <span className="text-[11px] font-bold text-[#E41B66]">
              Interactive Tooltips Active (Zero-Flicker)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full min-w-0">
            
            {/* Chart A: Batters Normal vs HP Strike Rate Lift (Figure 1 Interactive) */}
            <div className="lg:col-span-7 bg-[#1E1B2B] p-3.5 sm:p-5 rounded-2xl border border-[#3A334E] space-y-3 w-full max-w-full min-w-0 overflow-hidden">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 font-sans">
                  <Flame className="w-4 h-4 text-[#E41B66]" />
                  <span>Strike Rate Comparison: Normal SR vs. High-Pressure SR</span>
                </h4>
                <div className="flex items-center gap-3 text-[10px] text-[#A99EBD]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-slate-500" />
                    <span>Normal SR</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-[#E41B66]" />
                    <span>High-Pressure SR</span>
                  </span>
                </div>
              </div>

              <div className="w-full h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical"
                    data={batterLiftData}
                    margin={{ top: 10, right: 20, bottom: 10, left: 15 }}
                  >
                    <XAxis type="number" domain={[110, 190]} stroke="#877C9E" fontSize={11} tickLine={false} tickFormatter={(v) => `${v} SR`} />
                    <YAxis type="category" dataKey="name" stroke="#877C9E" fontSize={11} tickLine={false} />
                    <Tooltip 
                      content={<CustomLiftTooltip />} 
                      isAnimationActive={false}
                      cursor={{ fill: 'rgba(228, 27, 102, 0.08)' }}
                      wrapperStyle={{ pointerEvents: 'none', zIndex: 1000 }}
                    />
                    <Bar dataKey="normSR" fill="#4B4261" barSize={10} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="hpSR" fill="#E41B66" barSize={10} radius={[0, 4, 4, 0]}>
                      {batterLiftData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.raw.IPL_Team === 'Rajasthan Royals' ? '#E41B66' : entry.rank === 1 ? '#E5A93C' : '#FF3B82'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart B: Pressure vs Baseline Scatter Plot */}
            <div className="lg:col-span-5 bg-[#1E1B2B] p-3.5 sm:p-5 rounded-2xl border border-[#3A334E] space-y-3 w-full max-w-full min-w-0 overflow-hidden">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-white font-sans">
                  Pressure Scatter & Volume
                </h4>
                <span className="text-[10px] text-[#E5A93C] font-mono">Bubble Size = HP Balls</span>
              </div>

              <div className="w-full h-72 sm:h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 15, right: 15, bottom: 15, left: 0 }}>
                    <XAxis type="number" dataKey="normSR" domain={[120, 180]} stroke="#877C9E" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}`} />
                    <YAxis type="number" dataKey="hpSR" domain={[155, 185]} stroke="#877C9E" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}`} />
                    <ZAxis type="number" dataKey="balls" range={[120, 480]} />
                    <Tooltip 
                      content={<CustomScatterTooltip />} 
                      isAnimationActive={false}
                      offset={20}
                      wrapperStyle={{ pointerEvents: 'none', zIndex: 1000 }}
                    />
                    <ReferenceLine x={140} stroke="#3A334E" strokeDasharray="3 3" />
                    <ReferenceLine y={168} stroke="#3A334E" strokeDasharray="3 3" />
                    <Scatter 
                      data={batterData}
                      onClick={(e) => onSelectPlayer && onSelectPlayer(e.raw, 'batter')}
                      cursor="pointer"
                    >
                      {batterData.map((entry, idx) => (
                        <Cell 
                          key={`bcell-${idx}`} 
                          fill={getNodeColor(entry)}
                          stroke={selectedPlayer?.Name === entry.name ? '#FFFFFF' : '#1A1826'}
                          strokeWidth={selectedPlayer?.Name === entry.name ? 3 : 1.5}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: BOWLING DASHBOARD (Containment vs Dot-Ball Squeeze Matrix) */}
      {activeTab === 'bowling' && (
        <div className="space-y-6">
          
          {/* Key Insights Banner */}
          <div className="bg-[#1E1B2B] border border-[#3A334E] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong className="text-white">Suffocation Leader:</strong> <strong>Mohammad Nawaz</strong> boasts a <strong>6.43 HP Economy</strong> (lowest in modern cricket), while <strong>Josh Hazlewood (44.42% Dots)</strong> and <strong>Matheesha Pathirana (40 HP Wickets)</strong> represent elite strike and dot control.
              </span>
            </div>

            <span className="text-[11px] font-bold text-cyan-400">
              Figure 2 Matrix Reconstructed
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full min-w-0">
            
            {/* Chart A: Scatter Matrix of Economy vs Dot % */}
            <div className="lg:col-span-8 bg-[#1E1B2B] p-3.5 sm:p-5 rounded-2xl border border-[#3A334E] space-y-3 w-full max-w-full min-w-0 overflow-hidden">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-white font-sans flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>Top 10 Bowlers: High-Pressure Economy vs. Dot Ball %</span>
                </h4>
                <span className="text-[10px] text-[#A99EBD]">Bubble Size = HP Wickets</span>
              </div>

              <div className="w-full h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 25, bottom: 20, left: 10 }}>
                    <XAxis type="number" dataKey="econ" name="Economy" domain={[6.0, 10.0]} stroke="#877C9E" fontSize={11} tickLine={false} tickFormatter={(v) => `${v} Econ`} />
                    <YAxis type="number" dataKey="dotPct" name="Dot %" domain={[33, 46]} stroke="#877C9E" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <ZAxis type="number" dataKey="wkts" range={[150, 600]} />
                    <Tooltip 
                      content={<CustomScatterTooltip />} 
                      isAnimationActive={false}
                      offset={20}
                      wrapperStyle={{ pointerEvents: 'none', zIndex: 1000 }}
                    />
                    <ReferenceLine x={8.2} stroke="#3A334E" strokeDasharray="3 3" label={{ value: 'Avg Econ (8.20)', fill: '#877C9E', fontSize: 10 }} />
                    <ReferenceLine y={39.0} stroke="#3A334E" strokeDasharray="3 3" label={{ value: 'Avg Dot% (39.0%)', fill: '#877C9E', fontSize: 10 }} />
                    <Scatter 
                      data={bowlerData}
                      onClick={(e) => onSelectPlayer && onSelectPlayer(e.raw, 'bowler')}
                      cursor="pointer"
                    >
                      {bowlerData.map((entry, idx) => (
                        <Cell 
                          key={`wcell-${idx}`} 
                          fill={getNodeColor(entry)}
                          stroke={selectedPlayer?.Name === entry.name ? '#FFFFFF' : '#1A1826'}
                          strokeWidth={selectedPlayer?.Name === entry.name ? 3 : 1.5}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart B: Top Bowlers Wickets Breakdown */}
            <div className="lg:col-span-4 bg-[#1E1B2B] p-3.5 sm:p-5 rounded-2xl border border-[#3A334E] space-y-3 w-full max-w-full min-w-0 overflow-hidden">
              <h4 className="text-xs font-black uppercase tracking-wider text-white font-sans">
                HP Wickets Leaderboard
              </h4>

              <div className="space-y-2 pt-1 max-h-72 overflow-y-auto pr-1">
                {bowlers.map((w) => (
                  <div
                    key={w.Name}
                    onClick={() => onSelectPlayer && onSelectPlayer(w, 'bowler')}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#272236] hover:bg-[#312B43] cursor-pointer transition-all border border-[#3A334E]"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded bg-[#332B45] text-[#A99EBD] text-[10px] font-bold flex items-center justify-center">
                        #{w.Rank}
                      </span>
                      <span className="text-xs font-bold text-white">{w.Name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-cyan-300 font-sans">{w.HP_Wkts} Wkts</span>
                      <span className="text-[10px] text-[#A99EBD] block font-mono">{w.HP_Econ.toFixed(2)} Econ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Lightbox Modal for Inspecting Official Matplotlib Figures */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-[#181622] rounded-3xl border border-[#3A334E] overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">
                Official Report Asset Preview
              </h3>
              <button
                onClick={() => setModalImage(null)}
                className="p-1.5 rounded-full bg-[#272236] hover:bg-[#E41B66] text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-[#100D18] rounded-2xl p-2 border border-[#3A334E]">
              <img src={modalImage} alt="Figure Preview" className="max-h-full max-w-full object-contain" />
            </div>

            <div className="mt-3 text-right">
              <button
                onClick={() => setModalImage(null)}
                className="rr-btn-pink px-5 py-2 text-xs font-bold uppercase"
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
