import openpyxl
import json
import os

wb = openpyxl.load_workbook('SupeRR_Selector_S2_Submission.xlsx', data_only=True)

def read_sheet(name):
    sheet = wb[name]
    headers = [cell for cell in next(sheet.iter_rows(values_only=True))]
    rows = []
    for r in sheet.iter_rows(min_row=2, values_only=True):
        row_dict = {}
        for h, v in zip(headers, r):
            if isinstance(v, float):
                v = round(v, 2)
            row_dict[h] = v
        rows.append(row_dict)
    return rows

raw_top_batters = read_sheet('Top_10_Batters')
raw_top_bowlers = read_sheet('Top_10_Bowlers')
raw_all_batters = read_sheet('All_Eligible_Batters')
raw_all_bowlers = read_sheet('All_Eligible_Bowlers')
bat_audit = read_sheet('RR_2025_26_Bat_Audit')
bowl_audit = read_sheet('RR_2025_26_Bowl_Audit')

# Enrich Batters
enriched_batters = []
for b in raw_top_batters[:10]:
    name = b['striker_name']
    team = b['IPL_2026_Team']
    
    # Classify role
    if name in ['Tristan Stubbs', 'David Miller', 'Andre Russell', 'Tim David', 'Rinku Singh', 'Shashank Singh']:
        role = 'Middle-Order Finisher'
    elif name in ['Dhruv Jurel']:
        role = 'Wicketkeeper Finisher'
    elif name in ['Namboori Tilak Varma', 'Suryakumar Yadav']:
        role = 'Middle-Order Anchor/Enforcer'
    else:
        role = 'Middle-Order Batter'
        
    # Franchise status & Auction Feasibility
    if team == 'Rajasthan Royals':
        status = 'RR Retentions'
        feasibility = 'Retained Core Pillar (Key RR Asset)'
    elif team in ['Delhi Capitals', 'Mumbai Indians', 'Punjab Kings', 'Royal Challengers Bengaluru', 'Kolkata Knight Riders']:
        status = 'Target Auction Buys'
        if name in ['David Miller', 'Marcus Stoinis', 'Shashank Singh']:
            feasibility = 'High Feasibility - Potential Auction Release/RTM target'
        elif name in ['Tristan Stubbs', 'Namboori Tilak Varma', 'Suryakumar Yadav', 'Rinku Singh']:
            feasibility = 'Competitive Auction / Mega-Auction Target'
        else:
            feasibility = 'High Value Auction Target'
    else:
        status = 'Target Auction Buys'
        feasibility = 'Direct Auction Entry'

    notes_map = {
        'Tristan Stubbs': 'Supreme clutch accelerator: +41.33 SR lift in overs 16-20 with 99.31 Wicket Survival rating.',
        'Namboori Tilak Varma': 'Elite pressure volume absorber (827 HP balls, 1356 runs) with phenomenal 96.06 survival percentile.',
        'David Miller': 'Proven global finisher: +33.29 SR lift under match-defining pressure, 90.58 pressure lift index.',
        'Dhruv Jurel': 'In-house gem: Staggering 180.07 HP strike rate with a massive +44.06 SR delta over baseline.',
        'Suryakumar Yadav': 'Elite baseline & HP consistency (177.65 HP SR); creates 360-degree field pressure across overs 11-20.',
        'Marcus Stoinis': 'Heavy-ball brute force: +25.55 SR lift, explosive boundary conversion under high required run-rates.',
        'Tim David': 'Death-overs powerhouse: 180.06 HP strike rate, devastating entry tempo against pace and spin alike.',
        'Rinku Singh': 'Cold-blooded crisis manager: 13 crucial innings, +26.19 SR lift, master of high-pressure chases.',
        'Shashank Singh': 'High-impact late-order revelation: 169.16 HP SR with fearless boundary execution.',
        'Andre Russell': 'Ultimate death over weapon: 174.75 HP SR with league-leading boundary percentage.'
    }

    item = {
        'Rank': b['Rank'],
        'Name': name,
        'IPL_Team': team,
        'HP_Balls': b['HP_Balls'],
        'HP_Runs': b['HP_Runs'],
        'HP_SR': b['HP_SR'],
        'Normal_SR': b['Norm_SR'],
        'SR_Lift': b['SR_Delta'],
        'HP_Avg': b['HP_Avg'],
        'Rating': b['Pressure_Rating'],
        # Additional deep-dive attributes
        'Crucial_Innings': b['Crucial_Innings'],
        'HP_Matches': b['HP_Matches'],
        'HP_Boundaries': b['HP_Boundaries'],
        'HP_Boundary_Pct': b['HP_Boundary_Pct'],
        'Bayes_RAA_100B': b['Bayes_RAA_100B'],
        'Sub_Phase_Tempo': b['Sub_Phase_Tempo'],
        'Sub_Wicket_Survival': b['Sub_Wicket_Survival'],
        'Sub_Pressure_Lift': b['Sub_Pressure_Lift'],
        'Sub_Clutch_Freq': b['Sub_Clutch_Freq'],
        'Sub_Workload_Pedigree': b['Sub_Workload_Pedigree'],
        'Role': role,
        'Franchise_Status': status,
        'Acquisition_Feasibility': feasibility,
        'Scouting_Notes': notes_map.get(name, 'Elite high-pressure performer with proven reliability.')
    }
    enriched_batters.append(item)

# Enrich Bowlers
enriched_bowlers = []
for w in raw_top_bowlers[:10]:
    name = w['bowler_name']
    team = w['IPL_2026_Team']
    
    # Classify role
    if name in ['Matheesha Pathirana', 'Nathan Ellis', 'Haris Rauf', 'Shaheen Afridi', 'Jasprit Bumrah', 'Josh Hazlewood']:
        if name in ['Matheesha Pathirana', 'Nathan Ellis']:
            role = 'Death Bowlers'
        elif name in ['Shaheen Afridi', 'Josh Hazlewood']:
            role = 'Powerplay / Death Bowler'
        elif name in ['Jasprit Bumrah']:
            role = 'All-Phase Enforcer'
        else:
            role = 'Death Bowlers'
    elif name in ['Mohammad Nawaz', 'Wanindu Hasaranga', 'Sunil Narine', 'Abrar Ahmed']:
        role = 'Spinners'
    else:
        role = 'Bowler'

    # Franchise status & Auction Feasibility
    if team == 'Rajasthan Royals':
        status = 'RR Retentions'
        feasibility = 'Retained RR Core'
    elif team in ['Kolkata Knight Riders', 'Chennai Super Kings', 'Mumbai Indians', 'Lucknow Super Giants', 'Royal Challengers Bengaluru']:
        status = 'Target Auction Buys'
        if name in ['Wanindu Hasaranga', 'Nathan Ellis']:
            feasibility = 'High Feasibility - Primary War Room Auction Target'
        elif name in ['Matheesha Pathirana', 'Jasprit Bumrah', 'Sunil Narine']:
            feasibility = 'Franchise Core - RTM or Trade Opportunity'
        else:
            feasibility = 'Auction Scouting Target'
    else:
        status = 'Target Auction Buys'
        feasibility = 'Overseas / Marquee Auction Availability'

    notes_map = {
        'Matheesha Pathirana': 'Deadly sling-arm yorkers: 40 HP wickets with 98.41 wicket-threat rating in high-stakes death overs.',
        'Mohammad Nawaz': 'Elite run-strangulation specialist: phenomenal 6.43 HP Economy with 97.10 containment score.',
        'Haris Rauf': 'High-velocity death enforcer: 33 HP wickets, 39.16% dot balls under critical pressure.',
        'Nathan Ellis': 'Master of death-over deception: 8.50 HP Econ with exceptional change of pace and dipping yorkers.',
        'Shaheen Afridi': 'Dominant new-ball & death wicket taker: 39.69% dot ball rate and lethal toe-crushers.',
        'Jasprit Bumrah': 'The gold standard benchmark: 7.64 HP Econ across 687 high-pressure balls; 99.38 containment rating.',
        'Wanindu Hasaranga': 'Premier middle-over spin weapon: 33 HP wickets, 8.18 Econ, ideal fix for RR middle-phase leakage.',
        'Sunil Narine': 'Unrivalled middle-phase suffocation: 7.08 HP Econ across 312 pressure balls with 99.38 containment.',
        'Josh Hazlewood': 'Laser precision dot-ball machine: 44.42% dot ball rate (highest among all qualifiers) under pressure.',
        'Abrar Ahmed': 'Mystery spin choke: 6.77 HP Economy, 40.40% dot balls, high deception against attacking batters.'
    }

    item = {
        'Rank': w['Rank'],
        'Name': name,
        'IPL_Team': team,
        'HP_Balls': w['HP_Balls'],
        'HP_Wkts': w['HP_Wkts'],
        'HP_Econ': w['HP_Econ'],
        'HP_Dot_Pct': w['HP_Dot_Pct'],
        'Rating': w['Pressure_Rating'],
        # Additional deep-dive attributes
        'Norm_Econ': w['Norm_Econ'],
        'HP_Matches': w['HP_Matches'],
        'HP_Dots': w['HP_Dots'],
        'Crucial_Spells': w['Crucial_Spells'],
        'HP_Wkt_Per_4Ov': w['HP_Wkt_Per_4Ov'],
        'Containment_Lift': w['Containment_Lift'],
        'Sub_Containment': w['Sub_Containment'],
        'Sub_Wicket_Threat': w['Sub_Wicket_Threat'],
        'Sub_Dot_Control': w['Sub_Dot_Control'],
        'Sub_Workload_Pedigree': w['Sub_Workload_Pedigree'],
        'Sub_Pressure_Hold': w['Sub_Pressure_Hold'],
        'Role': role,
        'Franchise_Status': status,
        'Acquisition_Feasibility': feasibility,
        'Scouting_Notes': notes_map.get(name, 'World-class pressure bowler with elite phase execution.')
    }
    enriched_bowlers.append(item)

# Build RR Gaps & Tactical Analysis
rr_bat_dict = {row['phase']: row for row in bat_audit if row['RR_vs_League_Bat'] == 'Rajasthan Royals'}
lq_bat_dict = {row['phase']: row for row in bat_audit if row['RR_vs_League_Bat'] == 'Other 9 IPL Teams'}

rr_bowl_dict = {(row['phase'], row['pace_or_spin']): row for row in bowl_audit if row['RR_vs_League_Bowl'] == 'Rajasthan Royals'}
lq_bowl_dict = {(row['phase'], row['pace_or_spin']): row for row in bowl_audit if row['RR_vs_League_Bowl'] == 'Other 9 IPL Teams'}

gaps_data = {
    'summary': {
        'title': 'Rajasthan Royals 2025–2026 Tactical Audit & Gap Diagnostics',
        'subtitle': 'Phase-by-Phase Performance vs. Other 9 IPL Franchises',
        'core_vulnerabilities': [
            {
                'id': 'gap_death_bat',
                'area': 'Death-Over Batting Strike Rate Deficit',
                'severity': 'Critical',
                'phase': 'Death (Overs 16-20)',
                'rr_metric': '154.80 HP SR / 15.45 HP Avg',
                'league_metric': '167.27 HP SR / 18.77 HP Avg',
                'delta': '-12.47 SR (-3.32 Avg)',
                'narrative': 'RR batters average 12.47 fewer runs per 100 balls during death-overs pressure compared to league rivals, losing wickets rapidly (15.45 average vs 18.77 league).',
                'primary_targets': ['Tristan Stubbs (#1 Batter, +41.3 SR Lift)', 'David Miller (#3 Batter, +33.3 SR Lift)', 'Shashank Singh (#9 Batter, +18.7 SR Lift)'],
                'target_names': ['Tristan Stubbs', 'David Miller', 'Shashank Singh']
            },
            {
                'id': 'gap_mid_spin_bowl',
                'area': 'Middle-Over Spin Economy Leakage',
                'severity': 'High',
                'phase': 'Middle (Overs 7-15)',
                'rr_metric': '10.25 HP Econ / 21.45 Wkt SR',
                'league_metric': '9.40 HP Econ / 18.43 Wkt SR',
                'delta': '+0.85 Econ Conceded (+3.02 Wkt SR)',
                'narrative': 'RR spinners concede 0.85 more runs per over in the middle phase while taking wickets less frequently (21.5 balls per wicket vs 18.4 league average), allowing opponents to build match-winning momentum.',
                'primary_targets': ['Wanindu Hasaranga (#7 Bowler, 8.18 HP Econ, 33 Wkts)', 'Sunil Narine (#8 Bowler, 7.08 HP Econ)', 'Mohammad Nawaz (#2 Bowler, 6.43 HP Econ)'],
                'target_names': ['Wanindu Hasaranga', 'Sunil Narine', 'Mohammad Nawaz']
            },
            {
                'id': 'gap_death_pace_bowl',
                'area': 'Death-Over Pace Execution & Yorker Containment',
                'severity': 'Medium',
                'phase': 'Death (Overs 16-20)',
                'rr_metric': '11.91 HP Econ / 14.39 Wkt SR',
                'league_metric': '11.51 HP Econ / 13.54 Wkt SR',
                'delta': '+0.40 Econ Conceded',
                'narrative': 'RR pace attack bleeds 11.91 runs per over in high-pressure death overs, lacking consistent defensive dot-ball execution in overs 18-20.',
                'primary_targets': ['Matheesha Pathirana (#1 Bowler, 40 Wkts, 38.3% Dots)', 'Nathan Ellis (#4 Bowler, 8.50 HP Econ, 36.7% Dots)', 'Josh Hazlewood (#9 Bowler, 44.4% Dots)'],
                'target_names': ['Matheesha Pathirana', 'Nathan Ellis', 'Josh Hazlewood']
            },
            {
                'id': 'strength_pp_bat',
                'area': 'Powerplay Batting Dominance',
                'severity': 'Strength',
                'phase': 'Powerplay (Overs 1-6)',
                'rr_metric': '182.61 HP SR / 36.00 HP Avg',
                'league_metric': '122.07 HP SR / 24.48 HP Avg',
                'delta': '+60.54 SR (+11.52 Avg)',
                'narrative': 'Rajasthan Royals hold the most lethal high-pressure powerplay batting lineup in the IPL, outpacing the competition by over 60 runs per 100 balls.',
                'primary_targets': ['Maintain In-House Core: Sanju Samson & Yashasvi Jaiswal & Dhruv Jurel (#4 Batter)'],
                'target_names': ['Dhruv Jurel']
            }
        ]
    },
    'phase_comparisons': {
        'batting': [
            {
                'phase': 'Powerplay (1-6)',
                'rr_sr': rr_bat_dict.get('PP', {}).get('HP_SR', 182.61),
                'league_sr': lq_bat_dict.get('PP', {}).get('HP_SR', 122.07),
                'rr_avg': rr_bat_dict.get('PP', {}).get('HP_Avg', 36.0),
                'league_avg': lq_bat_dict.get('PP', {}).get('HP_Avg', 24.48),
                'status': 'Elite Surplus (+60.54 SR)'
            },
            {
                'phase': 'Middle (7-15)',
                'rr_sr': rr_bat_dict.get('Middle', {}).get('HP_SR', 131.61),
                'league_sr': lq_bat_dict.get('Middle', {}).get('HP_SR', 132.41),
                'rr_avg': rr_bat_dict.get('Middle', {}).get('HP_Avg', 25.47),
                'league_avg': lq_bat_dict.get('Middle', {}).get('HP_Avg', 28.42),
                'status': 'Parity / Slight Deficit (-0.80 SR)'
            },
            {
                'phase': 'Death (16-20)',
                'rr_sr': rr_bat_dict.get('Death', {}).get('HP_SR', 154.80),
                'league_sr': lq_bat_dict.get('Death', {}).get('HP_SR', 167.27),
                'rr_avg': rr_bat_dict.get('Death', {}).get('HP_Avg', 15.45),
                'league_avg': lq_bat_dict.get('Death', {}).get('HP_Avg', 18.77),
                'status': 'Severe Deficit (-12.47 SR)'
            }
        ],
        'bowling': [
            {
                'category': 'PP Pace',
                'phase': 'Powerplay',
                'type': 'Pace',
                'rr_econ': rr_bowl_dict.get(('PP', 'Pace'), {}).get('HP_Econ', 10.57),
                'league_econ': lq_bowl_dict.get(('PP', 'Pace'), {}).get('HP_Econ', 10.94),
                'rr_wkt_sr': rr_bowl_dict.get(('PP', 'Pace'), {}).get('HP_Wkt_SR', 37.0),
                'league_wkt_sr': lq_bowl_dict.get(('PP', 'Pace'), {}).get('HP_Wkt_SR', 24.33),
                'status': 'Low Wicket Penetration (37.0 B/W)'
            },
            {
                'category': 'Middle Spin',
                'phase': 'Middle',
                'type': 'Spin',
                'rr_econ': rr_bowl_dict.get(('Middle', 'Spin'), {}).get('HP_Econ', 10.25),
                'league_econ': lq_bowl_dict.get(('Middle', 'Spin'), {}).get('HP_Econ', 9.40),
                'rr_wkt_sr': rr_bowl_dict.get(('Middle', 'Spin'), {}).get('HP_Wkt_SR', 21.45),
                'league_wkt_sr': lq_bowl_dict.get(('Middle', 'Spin'), {}).get('HP_Wkt_SR', 18.43),
                'status': 'Run Leakage (+0.85 Econ)'
            },
            {
                'category': 'Middle Pace',
                'phase': 'Middle',
                'type': 'Pace',
                'rr_econ': rr_bowl_dict.get(('Middle', 'Pace'), {}).get('HP_Econ', 10.73),
                'league_econ': lq_bowl_dict.get(('Middle', 'Pace'), {}).get('HP_Econ', 10.26),
                'rr_wkt_sr': rr_bowl_dict.get(('Middle', 'Pace'), {}).get('HP_Wkt_SR', 25.17),
                'league_wkt_sr': lq_bowl_dict.get(('Middle', 'Pace'), {}).get('HP_Wkt_SR', 27.93),
                'status': 'Moderate (+0.47 Econ)'
            },
            {
                'category': 'Death Pace',
                'phase': 'Death',
                'type': 'Pace',
                'rr_econ': rr_bowl_dict.get(('Death', 'Pace'), {}).get('HP_Econ', 11.91),
                'league_econ': lq_bowl_dict.get(('Death', 'Pace'), {}).get('HP_Econ', 11.51),
                'rr_wkt_sr': rr_bowl_dict.get(('Death', 'Pace'), {}).get('HP_Wkt_SR', 14.39),
                'league_wkt_sr': lq_bowl_dict.get(('Death', 'Pace'), {}).get('HP_Wkt_SR', 13.54),
                'status': 'Death Leakage (+0.40 Econ)'
            },
            {
                'category': 'Death Spin',
                'phase': 'Death',
                'type': 'Spin',
                'rr_econ': rr_bowl_dict.get(('Death', 'Spin'), {}).get('HP_Econ', 12.26),
                'league_econ': lq_bowl_dict.get(('Death', 'Spin'), {}).get('HP_Econ', 11.70),
                'rr_wkt_sr': rr_bowl_dict.get(('Death', 'Spin'), {}).get('HP_Wkt_SR', 13.80),
                'league_wkt_sr': lq_bowl_dict.get(('Death', 'Spin'), {}).get('HP_Wkt_SR', 13.19),
                'status': 'Spin Leakage (+0.56 Econ)'
            }
        ]
    },
    'auction_recommendations': [
        {
            'player_name': 'Tristan Stubbs',
            'role': 'Middle-Order Finisher / Wicketkeeper',
            'target_gap': 'Death-Over Batting Deficit',
            'pressure_rating': 91.10,
            'fit_score': '98/100',
            'key_metric': '168.49 HP SR (+41.33 Lift)',
            'strategic_rationale': 'Direct solution to RR death phase drop-off. Boasts highest pressure rating among all batters in modern T20 cricket, able to reverse RR negative -12.47 death SR gap in overs 17-20.',
            'estimated_budget': '12.0 - 14.5 Cr',
            'priority': 'P0 (Must-Buy)'
        },
        {
            'player_name': 'David Miller',
            'role': 'Left-Handed Middle-Order Finisher',
            'target_gap': 'Death-Over Batting Deficit',
            'pressure_rating': 86.21,
            'fit_score': '94/100',
            'key_metric': '165.08 HP SR (+33.29 Lift)',
            'strategic_rationale': 'Experienced veteran left-hander who balances the middle order. Offers unmatched composure with 90.58 pressure lift rating and established IPL clutch history.',
            'estimated_budget': '8.0 - 10.5 Cr',
            'priority': 'P1 (High Priority)'
        },
        {
            'player_name': 'Wanindu Hasaranga',
            'role': 'Leg-Spin Bowling All-Rounder',
            'target_gap': 'Middle-Over Spin Choke & Wickets',
            'pressure_rating': 77.50,
            'fit_score': '96/100',
            'key_metric': '8.18 HP Econ | 33 HP Wkts',
            'strategic_rationale': 'Plugs RR critical middle-phase spin leakage (10.25 Econ down to 8.18). Delivers strike-bowling penetration with 33 high-pressure wickets and lower-order hitting.',
            'estimated_budget': '8.5 - 11.0 Cr',
            'priority': 'P0 (Must-Buy)'
        },
        {
            'player_name': 'Nathan Ellis',
            'role': 'Specialist Death Seamer',
            'target_gap': 'Death Bowling Execution & Yorker Control',
            'pressure_rating': 81.19,
            'fit_score': '92/100',
            'key_metric': '8.50 HP Econ | 36.7% Dots',
            'strategic_rationale': 'Elite death specialist with a low 8.50 pressure economy. Exceptional slower balls and pinpoint yorkers to partner Sandeep Sharma / Trent Boult.',
            'estimated_budget': '6.0 - 8.0 Cr',
            'priority': 'P1 (High Priority)'
        },
        {
            'player_name': 'Dhruv Jurel',
            'role': 'Finisher / Wicketkeeper',
            'target_gap': 'In-House Core Retain & Elevate',
            'pressure_rating': 85.28,
            'fit_score': '99/100',
            'key_metric': '180.07 HP SR (+44.06 Lift)',
            'strategic_rationale': 'Already retained in RR core. Dashboard reveals he holds the single highest HP strike rate (180.07) and greatest SR delta (+44.06) among all top qualifiers. Must bat higher in overs 14-20.',
            'estimated_budget': 'Retained Core',
            'priority': 'Franchise Core'
        }
    ]
}

# Write out JSON files
with open('public/data/top_batters.json', 'w') as f:
    json.dump(enriched_batters, f, indent=2)

with open('public/data/top_bowlers.json', 'w') as f:
    json.dump(enriched_bowlers, f, indent=2)

with open('public/data/rr_gaps.json', 'w') as f:
    json.dump(gaps_data, f, indent=2)

# Also write full lists for deep matrix analysis
with open('public/data/all_batters.json', 'w') as f:
    json.dump(raw_all_batters, f, indent=2)

with open('public/data/all_bowlers.json', 'w') as f:
    json.dump(raw_all_bowlers, f, indent=2)

print("Export completed successfully!")
print(f"Generated top_batters.json ({len(enriched_batters)} items)")
print(f"Generated top_bowlers.json ({len(enriched_bowlers)} items)")
print(f"Generated rr_gaps.json")

