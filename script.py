import pandas as pd
import numpy as np
from scipy.stats import norm
import matplotlib.pyplot as plt

# ==============================================================================
# 1. USER-TUNABLE CONFIGURATION (Modify these parameters & explain why in report)
# ==============================================================================
CONFIG = {
    # Pressure Threshold (0-100 scale; deliveries >= threshold are High Pressure)
    "HP_THRESHOLD": 50.0,

    # Minimum Sample Size & Opposition Pedigree Filters (Fairness Controls)
    "MIN_HP_BALLS_BAT": 180,
    "MIN_HP_MATCHES_BAT": 14,
    "MIN_HP_BALLS_BOWL": 180,
    "MIN_HP_MATCHES_BOWL": 14,
    "MIN_PEDIGREE_SCORE": 0.82,  # 1.0 = IPL, 0.85 = Top-10 T20I, 0.40 = Associate T20I

    # Empirical Bayes Shrinkage Priors (prevents small-sample flukes)
    "BAYES_PRIOR_BALLS": 180,
    "BAYES_PRIOR_OUTS": 8,

    # Batting Composite Rating Weights (Must sum to 1.00)
    "BAT_WEIGHTS": {
        "phase_tempo": 0.30,      # Phase & Format Adjusted Runs Above Average (RAA/100B)
        "wicket_survival": 0.25,  # High-Pressure Batting Average (Runs/Dismissal)
        "pressure_lift": 0.20,    # Delta: HP RAA/100B minus Normal RAA/100B
        "clutch_freq": 0.15,      # Crucial Innings Rate (25+ runs & +5 RAA, or 35+ HP runs)
        "workload_pedigree": 0.10 # Log(HP Balls) * Competition Pedigree
    },

    # Bowling Composite Rating Weights (Must sum to 1.00)
    "BOWL_WEIGHTS": {
        "containment": 0.30,      # Phase & Format Adjusted Runs Saved per Over
        "wicket_threat": 0.25,    # High-Pressure Wickets per 4 Overs
        "dot_control": 0.20,      # High-Pressure Dot Ball %
        "workload_pedigree": 0.15,# Log(HP Balls) * Competition Pedigree
        "pressure_hold": 0.10     # Delta: HP Runs Saved/Ov minus Normal Runs Saved/Ov
    }
}

# ==============================================================================
# 2. LOAD & RELATE ALL 6 CSV DATASETS
# ==============================================================================
print("Loading datasets...")
bbb = pd.read_csv("ball_by_ball.csv")
matches = pd.read_csv("matches.csv")
comps = pd.read_csv("competitions.csv")
teams = pd.read_csv("teams.csv")
p11 = pd.read_csv("playing_eleven.csv")
mapping = pd.read_csv("competition_team_player_mapping.csv")

# Map IPL 2026 Franchise Status (comp_id = 3298)
ipl26_map = (
    mapping[mapping["comp_id"] == 3298][["player_id", "team_name"]]
    .drop_duplicates("player_id")
    .rename(columns={"team_name": "IPL_2026_Team"})
)

# Filter to regular innings (1 & 2) and merge match/competition context
df = bbb[bbb["innings"].isin([1, 2])].copy()
df = df.merge(
    matches[[
        "match_id", "comp_id", "match_date", "stage", "home_team_id", "home_team",
        "away_team_id", "away_team", "first_inn_revised_overs", "second_inn_revised_overs",
        "revised_target", "knock_out", "win_team_id", "result"
    ]],
    on="match_id", how="left"
)
df = df.merge(comps[["comp_id", "comp_name", "match_format", "season"]], on="comp_id", how="left")
df = df.merge(
    p11[["match_id", "player_id", "is_captain", "is_wk", "is_impact"]],
    left_on=["match_id", "striker_id"], right_on=["match_id", "player_id"], how="left"
).drop(columns=["player_id"])

df = df.sort_values(["match_id", "innings", "innings_ball_num"]).reset_index(drop=True)

# ==============================================================================
# 3. CRICKET-ACCURATE RUNS, EXTRAS, LEGAL BALLS & WICKETS
# ==============================================================================
has_extra = df["extras_type"].isin(["wide", "Overstep", "other", "legbyes", "byes", "Penalty"])
df["extra_runs_actual"] = np.where(has_extra, 1 + df["extras_2_runs"].fillna(0), df["extras_2_runs"].fillna(0))
df["total_runs"] = df["runs"] + df["extra_runs_actual"]

# Bowler conceded runs exclude byes & legbyes
is_bye_lb = df["extras_type"].isin(["byes", "legbyes"])
df["bowler_runs"] = np.where(is_bye_lb, 0, df["total_runs"])

is_wide = df["extras_type"] == "wide"
is_noball = df["extras_type"].isin(["Overstep", "other"])
df["is_legal_ball"] = (~is_wide) & (~is_noball)
df["is_batter_ball"] = ~is_wide

bowler_dismissals = ["Caught", "Bowled", "LBW", "Stump", "Hit Wicket"]
df["is_bowler_wicket"] = df["is_wicket"] & (df["dismissal_type"].isin(bowler_dismissals))

# ==============================================================================
# 4. RECONSTRUCT LIVE MATCH STATE & ENTRY CONTEXT
# ==============================================================================
df["cum_runs_before"] = df.groupby(["match_id", "innings"])["total_runs"].cumsum() - df["total_runs"]
df["cum_wickets_before"] = df.groupby(["match_id", "innings"])["is_wicket"].cumsum() - df["is_wicket"].astype(int)
df["wickets_in_hand"] = 10 - df["cum_wickets_before"]
df["legal_balls_before"] = df.groupby(["match_id", "innings"])["is_legal_ball"].cumsum() - df["is_legal_ball"].astype(int)

# DLS-aware max overs & balls remaining
df["max_overs"] = np.where(
    df["innings"] == 1,
    df["first_inn_revised_overs"].fillna(20),
    df["second_inn_revised_overs"].fillna(20)
)
df["max_balls"] = (df["max_overs"] * 6).astype(int)
df["balls_remaining"] = (df["max_balls"] - df["legal_balls_before"]).clip(lower=1)
df["overs_completed"] = df["legal_balls_before"] / 6.0
df["crr"] = np.where(df["overs_completed"] > 0, df["cum_runs_before"] / df["overs_completed"], 6.5)

# 2nd Innings Target & Required Run Rate (RRR)
inn1_totals = df[df["innings"] == 1].groupby("match_id")["total_runs"].sum().reset_index().rename(columns={"total_runs": "inn1_total"})
df = df.merge(inn1_totals, on="match_id", how="left")
df["target"] = np.where(df["innings"] == 2, df["revised_target"].fillna(df["inn1_total"] + 1), np.nan)
df["runs_needed"] = df["target"] - df["cum_runs_before"]
df["rrr"] = np.where(df["innings"] == 2, (df["runs_needed"] / df["balls_remaining"]) * 6.0, np.nan)

# Recent collapse momentum (wickets in last 18 balls) & prior over runs
df["wickets_last_18"] = df.groupby(["match_id", "innings"])["is_wicket"].transform(
    lambda s: s.shift(1, fill_value=0).rolling(18, min_periods=1).sum()
)
over_runs = df.groupby(["match_id", "innings", "overid"])["total_runs"].sum().reset_index().rename(columns={"total_runs": "this_over_runs"})
over_runs["prev_over_runs"] = over_runs.groupby(["match_id", "innings"])["this_over_runs"].shift(1).fillna(0)
df = df.merge(over_runs[["match_id", "innings", "overid", "prev_over_runs"]], on=["match_id", "innings", "overid"], how="left")

# ==============================================================================
# 5. COMPETITION PEDIGREE & PHASE-ADJUSTED EXPECTED RUNS (PAR)
# ==============================================================================
df["phase"] = np.where(df["overid"] <= 6, "PP", np.where(df["overid"] <= 15, "Middle", "Death"))
is_ipl = df["comp_name"].str.contains("IPL", case=False, na=False)
df["format_tier"] = np.where(is_ipl, "IPL", "T20I")

top_t20i = {
    "India", "Australia", "England", "South Africa", "New Zealand",
    "West Indies", "Pakistan", "Sri Lanka", "Afghanistan", "Bangladesh"
}
is_top_t20i = df["home_team"].isin(top_t20i) & df["away_team"].isin(top_t20i)
is_knockout = (df["knock_out"] == 1) | (~df["stage"].isin(["League", np.nan]))

df["quality_score"] = np.clip(
    np.where(is_ipl, 1.0, np.where(is_top_t20i, 0.85, 0.40)) + np.where(is_knockout, 0.15, 0.0),
    0, 1.15
)

# Expected runs per ball within (Format, Phase)
df["expected_bat_runs"] = df.groupby(["format_tier", "phase"])["runs"].transform(
    lambda s: s[df.loc[s.index, "is_batter_ball"]].mean()
)
df["bat_raa"] = np.where(df["is_batter_ball"], df["runs"] - df["expected_bat_runs"], 0.0)

df["expected_bowl_runs"] = df.groupby(["format_tier", "phase"])["bowler_runs"].transform(
    lambda s: s[df.loc[s.index, "is_legal_ball"]].mean()
)
df["bowl_runs_saved"] = np.where(df["is_legal_ball"], df["expected_bowl_runs"] - df["bowler_runs"], -df["bowler_runs"])

# ==============================================================================
# 6. BALL-LEVEL PRESSURE INDEX (0 TO 100)
# ==============================================================================
# Batting Pressure
wicket_pressure_bat = np.clip(
    (df["cum_wickets_before"] * 5.0) +
    np.where((df["overid"] <= 6) & (df["cum_wickets_before"] >= 2), 15.0, 0.0) +
    np.where(df["wickets_last_18"] >= 2, 12.0, 0.0),
    0, 40
)
alive_chase = (df["innings"] == 2) & (df["rrr"] <= 24.0) & (df["wickets_in_hand"] >= 2)
rrr_pressure = np.where(
    alive_chase,
    np.clip((df["rrr"] - 8.0) * 5.0 + np.maximum(0, df["rrr"] - df["crr"]) * 3.0, 0, 45),
    0.0
)
inn1_pressure = np.where(
    df["innings"] == 1,
    np.where(df["overid"] >= 16, 25.0 + (df["cum_wickets_before"] * 2.0),
             np.where(df["cum_wickets_before"] >= 3, 22.0, 8.0)),
    0.0
)
stage_pressure_bat = np.where(is_knockout, 10.0, 0.0) + np.where(df["overid"] >= 17, 5.0, 0.0)
df["bat_pressure_score"] = np.clip(wicket_pressure_bat + rrr_pressure + inn1_pressure + stage_pressure_bat, 0, 100)
df["is_bat_hp"] = df["bat_pressure_score"] >= CONFIG["HP_THRESHOLD"]

# Bowling Pressure
tight_defense = (df["innings"] == 2) & (df["rrr"].between(7.5, 14.0)) & (df["wickets_in_hand"] >= 3)
bowl_chase_pressure = np.where(
    tight_defense,
    35.0 + np.clip((12.0 - np.abs(df["rrr"] - 10.0)) * 2.0, 0, 10),
    np.where((df["innings"] == 2) & (df["rrr"] > 14.0) & (df["overid"] >= 17), 25.0, 0.0)
)
bowl_phase_pressure = np.where(
    df["innings"] == 1,
    np.where(df["overid"] >= 16, 35.0, np.where(df["overid"] <= 6, 22.0, 10.0)),
    np.where(~tight_defense & (df["overid"] >= 16), 30.0, np.where(df["overid"] <= 6, 20.0, 10.0))
)
momentum_pressure = np.clip(
    np.where(df["prev_over_runs"] >= 14, 18.0, np.where(df["prev_over_runs"] >= 10, 8.0, 0.0)) +
    np.where((df["overid"] >= 12) & (df["wickets_in_hand"] >= 7), 15.0, 0.0),
    0, 35
)
stage_pressure_bowl = np.where(is_knockout, 12.0, 0.0) + np.where(df["overid"] >= 18, 8.0, 0.0)
df["bowl_pressure_score"] = np.clip(np.maximum(bowl_chase_pressure, bowl_phase_pressure) + momentum_pressure + stage_pressure_bowl, 0, 100)
df["is_bowl_hp"] = df["bowl_pressure_score"] >= CONFIG["HP_THRESHOLD"]

# ==============================================================================
# 7. NORMAL CDF SCALING & COMPOSITE PLAYER SCORECARDS
# ==============================================================================
def to_rating_100(series):
    z = (series - series.mean()) / (series.std() + 1e-9)
    return norm.cdf(np.clip(z, -2.5, 2.5)) * 100.0

# --- BATTING SCORECARD ---
df["is_dot_bat"] = (df["runs"] == 0) & df["is_batter_ball"]
df["is_bnd_bat"] = df["is_four"] | df["is_six"]
df["is_striker_out"] = df["is_wicket"] & (df["dismissed_player_id"] == df["striker_id"])

bat_hp = df[df["is_bat_hp"]].groupby(["striker_id", "striker_name"]).agg(
    HP_Matches=("match_id", "nunique"),
    HP_Balls=("is_batter_ball", "sum"),
    HP_Runs=("runs", "sum"),
    HP_Outs=("is_striker_out", "sum"),
    HP_Boundaries=("is_bnd_bat", "sum"),
    HP_Dots=("is_dot_bat", "sum"),
    HP_RAA_Total=("bat_raa", "sum"),
    Pedigree_Avg=("quality_score", "mean")
).reset_index()

bat_norm = df[~df["is_bat_hp"]].groupby(["striker_id", "striker_name"]).agg(
    Norm_Balls=("is_batter_ball", "sum"),
    Norm_Runs=("runs", "sum"),
    Norm_RAA_Total=("bat_raa", "sum")
).reset_index()

bat_inn = df[df["is_bat_hp"]].groupby(["striker_id", "match_id"]).agg(
    inn_runs=("runs", "sum"), inn_raa=("bat_raa", "sum")
).reset_index()
bat_inn["crucial"] = ((bat_inn["inn_runs"] >= 25) & (bat_inn["inn_raa"] >= 5.0)) | (bat_inn["inn_runs"] >= 35)

bat = bat_hp.merge(bat_norm, on=["striker_id", "striker_name"], how="left").merge(
    bat_inn.groupby("striker_id")["crucial"].sum().reset_index().rename(columns={"crucial": "Crucial_Innings"}),
    on="striker_id", how="left"
)
bat["Crucial_Innings"] = bat["Crucial_Innings"].fillna(0).astype(int)
bat["HP_SR"] = bat["HP_Runs"] / bat["HP_Balls"].clip(lower=1) * 100
bat["Norm_SR"] = bat["Norm_Runs"] / bat["Norm_Balls"].clip(lower=1) * 100
bat["SR_Delta"] = bat["HP_SR"] - bat["Norm_SR"]
bat["HP_Avg"] = bat["HP_Runs"] / bat["HP_Outs"].clip(lower=1)
bat["HP_Boundary_Pct"] = bat["HP_Boundaries"] / bat["HP_Balls"].clip(lower=1) * 100
bat["RAA_Lift_100B"] = (bat["HP_RAA_Total"] / bat["HP_Balls"].clip(lower=1) - bat["Norm_RAA_Total"].fillna(0) / bat["Norm_Balls"].clip(lower=1)) * 100
bat["Crucial_Rate"] = bat["Crucial_Innings"] / bat["HP_Matches"].clip(lower=1)

eb = bat[
    (bat["HP_Balls"] >= CONFIG["MIN_HP_BALLS_BAT"]) &
    (bat["HP_Matches"] >= CONFIG["MIN_HP_MATCHES_BAT"]) &
    (bat["Pedigree_Avg"] >= CONFIG["MIN_PEDIGREE_SCORE"])
].copy()

prior_b = CONFIG["BAYES_PRIOR_BALLS"]
prior_o = CONFIG["BAYES_PRIOR_OUTS"]
eb["Bayes_RAA_100B"] = (eb["HP_RAA_Total"] * 100 + prior_b * (eb["HP_RAA_Total"].sum() / eb["HP_Balls"].sum() * 100)) / (eb["HP_Balls"] + prior_b)
eb["Bayes_HP_Avg"] = (eb["HP_Runs"] + prior_o * (eb["HP_Runs"].sum() / eb["HP_Outs"].sum())) / (eb["HP_Outs"] + prior_o)

eb["Sub_Phase_Tempo"] = to_rating_100(eb["Bayes_RAA_100B"])
eb["Sub_Wicket_Survival"] = to_rating_100(eb["Bayes_HP_Avg"])
eb["Sub_Pressure_Lift"] = to_rating_100(eb["RAA_Lift_100B"])
eb["Sub_Clutch_Freq"] = to_rating_100(eb["Crucial_Rate"])
eb["Sub_Workload_Pedigree"] = to_rating_100(np.log1p(eb["HP_Balls"]) * eb["Pedigree_Avg"])

bw = CONFIG["BAT_WEIGHTS"]
eb["Pressure_Rating"] = (
    bw["phase_tempo"] * eb["Sub_Phase_Tempo"] +
    bw["wicket_survival"] * eb["Sub_Wicket_Survival"] +
    bw["pressure_lift"] * eb["Sub_Pressure_Lift"] +
    bw["clutch_freq"] * eb["Sub_Clutch_Freq"] +
    bw["workload_pedigree"] * eb["Sub_Workload_Pedigree"]
)
eb["Equal_Weight_Rating"] = (
    eb["Sub_Phase_Tempo"] + eb["Sub_Wicket_Survival"] + eb["Sub_Pressure_Lift"] +
    eb["Sub_Clutch_Freq"] + eb["Sub_Workload_Pedigree"]
) / 5.0

eb = eb.sort_values("Pressure_Rating", ascending=False).reset_index(drop=True)
eb.insert(0, "Rank", eb.index + 1)
eb = eb.merge(ipl26_map, left_on="striker_id", right_on="player_id", how="left").drop(columns=["player_id"])
eb["IPL_2026_Team"] = eb["IPL_2026_Team"].fillna("Not in IPL 2026")

# --- BOWLING SCORECARD ---
df["is_dot_bowl"] = (df["bowler_runs"] == 0) & df["is_legal_ball"]
bowl_hp = df[df["is_bowl_hp"]].groupby(["bowler_id", "bowler_name"]).agg(
    HP_Matches=("match_id", "nunique"),
    HP_Balls=("is_legal_ball", "sum"),
    HP_Runs=("bowler_runs", "sum"),
    HP_Wkts=("is_bowler_wicket", "sum"),
    HP_Dots=("is_dot_bowl", "sum"),
    HP_Saved=("bowl_runs_saved", "sum"),
    Pedigree_Avg=("quality_score", "mean")
).reset_index()

bowl_norm = df[~df["is_bowl_hp"]].groupby(["bowler_id", "bowler_name"]).agg(
    Norm_Balls=("is_legal_ball", "sum"),
    Norm_Runs=("bowler_runs", "sum"),
    Norm_Saved=("bowl_runs_saved", "sum")
).reset_index()

bowl_inn = df[df["is_bowl_hp"]].groupby(["bowler_id", "match_id"]).agg(
    inn_balls=("is_legal_ball", "sum"), inn_wkts=("is_bowler_wicket", "sum"), inn_saved=("bowl_runs_saved", "sum")
).reset_index()
bowl_inn["crucial"] = (bowl_inn["inn_wkts"] >= 2) | ((bowl_inn["inn_balls"] >= 12) & (bowl_inn["inn_saved"] >= 2.5))

bowl = bowl_hp.merge(bowl_norm, on=["bowler_id", "bowler_name"], how="left").merge(
    bowl_inn.groupby("bowler_id")["crucial"].sum().reset_index().rename(columns={"crucial": "Crucial_Spells"}),
    on="bowler_id", how="left"
)
bowl["Crucial_Spells"] = bowl["Crucial_Spells"].fillna(0).astype(int)
bowl["HP_Econ"] = bowl["HP_Runs"] / (bowl["HP_Balls"].clip(lower=1) / 6.0)
bowl["Norm_Econ"] = bowl["Norm_Runs"] / (bowl["Norm_Balls"].clip(lower=1) / 6.0)
bowl["HP_Wkt_Per_4Ov"] = (bowl["HP_Wkts"] / bowl["HP_Balls"].clip(lower=1)) * 24.0
bowl["HP_Dot_Pct"] = bowl["HP_Dots"] / bowl["HP_Balls"].clip(lower=1) * 100
bowl["Containment_Lift"] = (bowl["HP_Saved"] / bowl["HP_Balls"].clip(lower=1) * 6.0) - (bowl["Norm_Saved"].fillna(0) / bowl["Norm_Balls"].clip(lower=1) * 6.0)

ew = bowl[
    (bowl["HP_Balls"] >= CONFIG["MIN_HP_BALLS_BOWL"]) &
    (bowl["HP_Matches"] >= CONFIG["MIN_HP_MATCHES_BOWL"]) &
    (bowl["Pedigree_Avg"] >= CONFIG["MIN_PEDIGREE_SCORE"])
].copy()

ew["Bayes_Saved_Ov"] = (ew["HP_Saved"] * 6.0 + prior_b * (ew["HP_Saved"].sum() / (ew["HP_Balls"].sum() / 6.0))) / (ew["HP_Balls"] + prior_b)
ew["Bayes_Wkt_4Ov"] = (ew["HP_Wkts"] * 24.0 + prior_b * (ew["HP_Wkts"].sum() / ew["HP_Balls"].sum() * 24.0)) / (ew["HP_Balls"] + prior_b)

ew["Sub_Containment"] = to_rating_100(ew["Bayes_Saved_Ov"])
ew["Sub_Wicket_Threat"] = to_rating_100(ew["Bayes_Wkt_4Ov"])
ew["Sub_Dot_Control"] = to_rating_100(ew["HP_Dot_Pct"])
ew["Sub_Workload_Pedigree"] = to_rating_100(np.log1p(ew["HP_Balls"]) * ew["Pedigree_Avg"])
ew["Sub_Pressure_Hold"] = to_rating_100(ew["Containment_Lift"])

ww = CONFIG["BOWL_WEIGHTS"]
ew["Pressure_Rating"] = (
    ww["containment"] * ew["Sub_Containment"] +
    ww["wicket_threat"] * ew["Sub_Wicket_Threat"] +
    ww["dot_control"] * ew["Sub_Dot_Control"] +
    ww["workload_pedigree"] * ew["Sub_Workload_Pedigree"] +
    ww["pressure_hold"] * ew["Sub_Pressure_Hold"]
)
ew["Equal_Weight_Rating"] = (
    ew["Sub_Containment"] + ew["Sub_Wicket_Threat"] + ew["Sub_Dot_Control"] +
    ew["Sub_Workload_Pedigree"] + ew["Sub_Pressure_Hold"]
) / 5.0

ew = ew.sort_values("Pressure_Rating", ascending=False).reset_index(drop=True)
ew.insert(0, "Rank", ew.index + 1)
ew = ew.merge(ipl26_map, left_on="bowler_id", right_on="player_id", how="left").drop(columns=["player_id"])
ew["IPL_2026_Team"] = ew["IPL_2026_Team"].fillna("Not in IPL 2026")

# ==============================================================================
# 8. RAJASTHAN ROYALS (IPL 2025 & 2026) TACTICAL GAP AUDIT
# ==============================================================================
ipl_25_26 = df[df["comp_id"].isin([2725, 3298])].copy()
ipl_25_26["RR_vs_League_Bat"] = np.where(ipl_25_26["batting_team_id"] == 3, "Rajasthan Royals", "Other 9 IPL Teams")
ipl_25_26["RR_vs_League_Bowl"] = np.where(ipl_25_26["bowling_team_id"] == 3, "Rajasthan Royals", "Other 9 IPL Teams")

rr_bat_audit = ipl_25_26[ipl_25_26["is_bat_hp"]].groupby(["RR_vs_League_Bat", "phase"]).agg(
    Balls=("is_batter_ball", "sum"), Runs=("runs", "sum"), Outs=("is_wicket", "sum")
).reset_index()
rr_bat_audit["HP_SR"] = rr_bat_audit["Runs"] / rr_bat_audit["Balls"] * 100
rr_bat_audit["HP_Avg"] = rr_bat_audit["Runs"] / rr_bat_audit["Outs"].clip(lower=1)

rr_bowl_audit = ipl_25_26[ipl_25_26["is_bowl_hp"]].groupby(["RR_vs_League_Bowl", "phase", "pace_or_spin"]).agg(
    Balls=("is_legal_ball", "sum"), Runs=("bowler_runs", "sum"), Wkts=("is_bowler_wicket", "sum")
).reset_index()
rr_bowl_audit["HP_Econ"] = rr_bowl_audit["Runs"] / (rr_bowl_audit["Balls"] / 6.0)
rr_bowl_audit["HP_Wkt_SR"] = rr_bowl_audit["Balls"] / rr_bowl_audit["Wkts"].clip(lower=1)

# ==============================================================================
# 9. EXPORT EXCEL WORKBOOK & REPORT CHARTS
# ==============================================================================
with pd.ExcelWriter("SupeRR_Selector_S2_Submission.xlsx", engine="openpyxl") as writer:
    eb.head(10).round(2).to_excel(writer, sheet_name="Top_10_Batters", index=False)
    ew.head(10).round(2).to_excel(writer, sheet_name="Top_10_Bowlers", index=False)
    eb.round(2).to_excel(writer, sheet_name="All_Eligible_Batters", index=False)
    ew.round(2).to_excel(writer, sheet_name="All_Eligible_Bowlers", index=False)
    rr_bat_audit.round(2).to_excel(writer, sheet_name="RR_2025_26_Bat_Audit", index=False)
    rr_bowl_audit.round(2).to_excel(writer, sheet_name="RR_2025_26_Bowl_Audit", index=False)

# Chart 1: Top 10 Batters SR Lift
RR_PINK, RR_BLUE = "#EA1A85", "#004BA0"
fig, ax = plt.subplots(figsize=(10.5, 5.8), dpi=180)
top10_b = eb.head(10).iloc[::-1]
y_pos = np.arange(len(top10_b))
ax.hlines(y=y_pos, xmin=top10_b["Norm_SR"], xmax=top10_b["HP_SR"], color="#94A3B8", linewidth=2.5)
ax.scatter(top10_b["Norm_SR"], y_pos, color=RR_BLUE, s=95, label="Normal Situation SR", zorder=3)
ax.scatter(top10_b["HP_SR"], y_pos, color=RR_PINK, s=115, label="High-Pressure SR", zorder=4)
for i, r in enumerate(top10_b.itertuples()):
    ax.text(r.HP_SR + 1.5, i, f"+{r.SR_Delta:.1f} SR (Rating: {r.Pressure_Rating:.1f})", va="center", fontsize=8.5, fontweight="bold")
ax.set_yticks(y_pos)
ax.set_yticklabels([f"#{r.Rank} {r.striker_name}" for r in top10_b.itertuples()], fontsize=9.5, fontweight="bold")
ax.set_xlabel("Strike Rate (Runs per 100 Balls)", fontsize=10, fontweight="bold")
ax.set_title("Top 10 Batters Under Pressure: Strike Rate Lift (Normal vs. High Pressure)", fontsize=12, fontweight="bold", color=RR_BLUE, pad=28)
ax.set_xlim(115, 222)
ax.grid(axis="x", linestyle="--", alpha=0.5)
ax.legend(loc="upper center", bbox_to_anchor=(0.5, 1.07), ncol=2, frameon=True)
plt.tight_layout()
plt.savefig("fig1_batters_pressure_lift.png")
plt.close()

# Chart 2: Top 10 Bowlers Containment vs Dot %
fig, ax = plt.subplots(figsize=(10.5, 5.8), dpi=180)
top10_w = ew.head(10)
sc = ax.scatter(top10_w["HP_Econ"], top10_w["HP_Dot_Pct"], s=top10_w["HP_Wkts"] * 14, c=top10_w["Pressure_Rating"], cmap="RdPu", edgecolors=RR_BLUE, linewidth=1.5, zorder=3)
for r in top10_w.itertuples():
    dy = 0.45 if r.bowler_name not in ["Mohammad Nawaz", "Sunil Narine", "Shaheen Afridi"] else -0.75
    ax.text(r.HP_Econ, r.HP_Dot_Pct + dy, f"#{r.Rank} {r.bowler_name}\n({r.HP_Wkts}W | {r.Pressure_Rating:.1f})", ha="center", fontsize=8, fontweight="bold")
ax.axvline(ew["HP_Econ"].mean(), color="#94A3B8", linestyle="--", label=f"Eligible Pool Avg HP Econ ({ew['HP_Econ'].mean():.2f})")
ax.axhline(ew["HP_Dot_Pct"].mean(), color="#CBD5E1", linestyle=":", label=f"Eligible Pool Avg Dot % ({ew['HP_Dot_Pct'].mean():.1f}%)")
ax.set_xlabel("High-Pressure Economy Rate (Lower = Better)", fontsize=10, fontweight="bold")
ax.set_ylabel("High-Pressure Dot Ball % (Higher = Better)", fontsize=10, fontweight="bold")
ax.set_title("Top 10 Bowlers Under Pressure: Containment vs. Dot-Ball Squeeze", fontsize=11.5, fontweight="bold", color=RR_BLUE, pad=12)
ax.set_xlim(6.0, 9.9)
ax.set_ylim(33.5, 46.5)
ax.grid(True, linestyle="--", alpha=0.4)
plt.colorbar(sc, ax=ax, label="Composite Pressure Rating (0-100)")
ax.legend(loc="lower left", fontsize=8.5)
plt.tight_layout()
plt.savefig("fig2_bowlers_pressure_matrix.png")
plt.close()

print("\n--- TOP 10 BATTERS (UNSTOP DROPDOWN ORDER) ---")
print(eb[["Rank", "striker_name", "IPL_2026_Team", "HP_Balls", "HP_SR", "Norm_SR", "HP_Avg", "Pressure_Rating"]].head(10).to_string(index=False))

print("\n--- TOP 10 BOWLERS (UNSTOP DROPDOWN ORDER) ---")
print(ew[["Rank", "bowler_name", "IPL_2026_Team", "HP_Balls", "HP_Wkts", "HP_Econ", "HP_Dot_Pct", "Pressure_Rating"]].head(10).to_string(index=False))
print(f"\nSpearman Rank Stability (Weighted vs Equal): Batters={eb['Pressure_Rating'].corr(eb['Equal_Weight_Rating'], method='spearman'):.3f}, Bowlers={ew['Pressure_Rating'].corr(ew['Equal_Weight_Rating'], method='spearman'):.3f}")
print("Saved: SupeRR_Selector_S2_Submission.xlsx, fig1_batters_pressure_lift.png, fig2_bowlers_pressure_matrix.png")