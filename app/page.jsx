'use client';

import React, { useState, useEffect } from 'react';
import CommandBar from '../components/CommandBar';
import OfficialRRPlayerShowcase from '../components/OfficialRRPlayerShowcase';
import WarRoomSummaryStats from '../components/WarRoomSummaryStats';
import PlayerCard from '../components/PlayerCard';
import RRPointsTableAndMatches from '../components/RRPointsTableAndMatches';
import WarRoomAnalyticsDashboard from '../components/WarRoomAnalyticsDashboard';
import TacticalGapAnalysis from '../components/TacticalGapAnalysis';
import PlayerDrawer from '../components/PlayerDrawer';

// Static JSON
import topBattersJson from '../public/data/top_batters.json';
import topBowlersJson from '../public/data/top_bowlers.json';

import { Flame } from 'lucide-react';

export default function WarRoomDashboard() {
  const [batters, setBatters] = useState(topBattersJson || []);
  const [bowlers, setBowlers] = useState(topBowlersJson || []);

  // Selected Player for Deep-Dive Slide-Over Drawer
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerType, setSelectedPlayerType] = useState('batter');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Dynamic fetch
  useEffect(() => {
    async function loadData() {
      try {
        const [batRes, bowlRes] = await Promise.all([
          fetch('/data/top_batters.json'),
          fetch('/data/top_bowlers.json')
        ]);
        if (batRes.ok) setBatters(await batRes.json());
        if (bowlRes.ok) setBowlers(await bowlRes.json());
      } catch (err) {
        console.warn('Using pre-bundled local data:', err);
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleSelectPlayer = (player, type) => {
    setSelectedPlayer(player);
    setSelectedPlayerType(type);
    setIsDrawerOpen(true);
  };

  const handleSelectPlayerByName = (name) => {
    const foundBatter = batters.find(b => b.Name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(b.Name.toLowerCase()));
    if (foundBatter) {
      handleSelectPlayer(foundBatter, 'batter');
      return;
    }
    const foundBowler = bowlers.find(w => w.Name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(w.Name.toLowerCase()));
    if (foundBowler) {
      handleSelectPlayer(foundBowler, 'bowler');
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#181622] text-slate-100 flex flex-col selection:bg-[#E41B66] selection:text-white pb-20">
      
      {/* 1. Header with Scroll Navigation Links (No Cluttered Dropdowns) */}
      <CommandBar />

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 w-full space-y-8 sm:space-y-12">
        
        {/* 2. Official RR Hero Showcase (Image 1 Style) */}
        <section id="players-showcase">
          <OfficialRRPlayerShowcase
            batters={batters}
            bowlers={bowlers}
            onSelectPlayer={handleSelectPlayer}
          />
        </section>

        {/* 3. Stat Cards Row (Image 4 Top Style) */}
        <WarRoomSummaryStats 
          onSelectPlayerByName={handleSelectPlayerByName}
        />

        {/* 4. Section A: The Player Cards (Image 4 Bottom Style) */}
        <section id="section-a" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3A334E] pb-3">
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#E41B66]">
                <Flame className="w-4 h-4 text-[#E41B66]" />
                <span>Executive Shortlist</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-sans mt-0.5">
                TOP 10 HIGH-PRESSURE PLAYERS
              </h2>
            </div>

            <div className="text-xs font-bold text-[#A99EBD] font-sans">
              Pool: <span className="text-white">10 Batters</span> • <span className="text-white">10 Bowlers</span>
            </div>
          </div>

          {/* Cards Grid: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Left: Batters */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E41B66]"></span>
                  <span>Top 10 Batters (Min 180 HP Balls)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {batters.map((batter) => (
                  <PlayerCard
                    key={`bat-${batter.Rank}-${batter.Name}`}
                    player={batter}
                    type="batter"
                    isSelected={selectedPlayer?.Name === batter.Name}
                    onSelect={handleSelectPlayer}
                  />
                ))}
              </div>
            </div>

            {/* Right: Bowlers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span>Top 10 Bowlers (Min 180 HP Balls)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {bowlers.map((bowler) => (
                  <PlayerCard
                    key={`bowl-${bowler.Rank}-${bowler.Name}`}
                    player={bowler}
                    type="bowler"
                    isSelected={selectedPlayer?.Name === bowler.Name}
                    onSelect={handleSelectPlayer}
                  />
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 5. Points Table & Matches (Image 3 Style) */}
        <section id="points-table">
          <RRPointsTableAndMatches
            batters={batters}
            bowlers={bowlers}
            onSelectPlayerByName={handleSelectPlayerByName}
          />
        </section>

        {/* 6. Dashboard: Batting & Bowling Pressure Matrices (Zero-Flicker Tooltips) */}
        <section id="dashboard-matrix">
          <WarRoomAnalyticsDashboard
            batters={batters}
            bowlers={bowlers}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={handleSelectPlayer}
          />
        </section>

        {/* 7. Tactics & Gap Audit with Figure 3 and Exact Strategy Directives */}
        <section id="tactics-gap-audit">
          <TacticalGapAnalysis 
            onSelectPlayerByName={handleSelectPlayerByName}
          />
        </section>

      </main>

      {/* Slide-Over Drawer */}
      <PlayerDrawer
        player={selectedPlayer}
        type={selectedPlayerType}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Official RR Footer */}
      <footer className="mt-20 border-t border-[#3A334E] py-8 text-center text-xs text-[#A99EBD] bg-[#1E1B2B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img src="/images/rr_logo.png" alt="" className="h-8 w-auto object-contain" />
            <div className="text-left">
              <div className="font-black text-white uppercase tracking-wider font-sans">
                Rajasthan Royals War Room
              </div>
              <div className="text-[10px] text-[#A99EBD]">
                SupeRR Selector Season 2 • High-Pressure Reliability Matrix
              </div>
            </div>
          </div>

          <div className="text-slate-400 text-[11px] font-sans">
            Designed to match the Official Rajasthan Royals Franchise War Room Specification
          </div>
        </div>
      </footer>

    </div>
  );
}
