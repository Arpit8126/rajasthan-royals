import matplotlib.pyplot as plt
import numpy as np
import shutil
import os

os.makedirs('public/images', exist_ok=True)
shutil.copy('fig1_batters_pressure_lift.png', 'public/images/fig1_batters_pressure_lift.png')
shutil.copy('fig2_bowlers_pressure_matrix.png', 'public/images/fig2_bowlers_pressure_matrix.png')

# Create Figure 3: chart3_rr_2025_26_gaps.png matching the official RR website aesthetic
RR_PINK = '#E41B66'
LEAGUE_COLOR = '#453A5A'
BG_COLOR = '#181622'
CARD_BG = '#272236'
TEXT_COLOR = '#F8FAFC'
MUTED_COLOR = '#A99EBD'

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5.5), dpi=200, facecolor=BG_COLOR)

# Subplot 1: Batting Phase Strike Rate (RR vs League)
phases = ['Powerplay\n(Overs 1-6)', 'Middle Phase\n(Overs 7-15)', 'Death Phase\n(Overs 16-20)']
rr_bat = [182.61, 131.61, 154.80]
lq_bat = [122.07, 132.41, 167.27]

x = np.arange(len(phases))
width = 0.35

ax1.set_facecolor(CARD_BG)
rects1 = ax1.bar(x - width/2, rr_bat, width, label='Rajasthan Royals', color=RR_PINK, edgecolor='none', zorder=3)
rects2 = ax1.bar(x + width/2, lq_bat, width, label='Other 9 IPL Teams', color=LEAGUE_COLOR, edgecolor='none', zorder=3)

ax1.set_ylabel('High-Pressure Strike Rate', color=TEXT_COLOR, fontsize=11, fontweight='bold')
ax1.set_title('Batting Phase Performance (RR vs. League Average)', color=TEXT_COLOR, fontsize=12, fontweight='black', pad=14)
ax1.set_xticks(x)
ax1.set_xticklabels(phases, color=TEXT_COLOR, fontsize=10, fontweight='bold')
ax1.tick_params(colors=MUTED_COLOR)
ax1.set_ylim(80, 210)
ax1.grid(axis='y', linestyle='--', alpha=0.3, color='#554870', zorder=0)
ax1.legend(facecolor=BG_COLOR, edgecolor=LEAGUE_COLOR, labelcolor=TEXT_COLOR, loc='upper left')

# Delta annotations
ax1.text(0, 192, '+60.54 SR\n(Elite Blitz)', ha='center', color='#34D399', fontweight='black', fontsize=9)
ax1.text(1, 142, '-0.80 SR\n(Parity)', ha='center', color=MUTED_COLOR, fontweight='bold', fontsize=9)
ax1.text(2, 175, '-12.47 SR\n(CRITICAL GAP)', ha='center', color='#F43F5E', fontweight='black', fontsize=9)

# Subplot 2: Bowling Phase Economy (RR vs League)
bowl_cats = ['Powerplay\nPace', 'Middle\nSpin', 'Middle\nPace', 'Death\nPace', 'Death\nSpin']
rr_bowl = [10.57, 10.25, 10.73, 11.91, 12.26]
lq_bowl = [10.94, 9.40, 10.26, 11.51, 11.70]

x2 = np.arange(len(bowl_cats))

ax2.set_facecolor(CARD_BG)
rects3 = ax2.bar(x2 - width/2, rr_bowl, width, label='Rajasthan Royals (Conceded)', color=RR_PINK, zorder=3)
rects4 = ax2.bar(x2 + width/2, lq_bowl, width, label='League Average', color=LEAGUE_COLOR, zorder=3)

ax2.set_ylabel('High-Pressure Economy Rate (Lower = Better)', color=TEXT_COLOR, fontsize=11, fontweight='bold')
ax2.set_title('Bowling Phase Economy Leakage (RR vs. League)', color=TEXT_COLOR, fontsize=12, fontweight='black', pad=14)
ax2.set_xticks(x2)
ax2.set_xticklabels(bowl_cats, color=TEXT_COLOR, fontsize=9.5, fontweight='bold')
ax2.tick_params(colors=MUTED_COLOR)
ax2.set_ylim(7.0, 13.8)
ax2.grid(axis='y', linestyle='--', alpha=0.3, color='#554870', zorder=0)
ax2.legend(facecolor=BG_COLOR, edgecolor=LEAGUE_COLOR, labelcolor=TEXT_COLOR, loc='upper left')

# Delta annotations on bowling
ax2.text(1, 11.2, '+0.85 Econ\n(LEAKAGE)', ha='center', color='#F43F5E', fontweight='black', fontsize=8.5)
ax2.text(3, 12.7, '+0.40 Econ\n(Death Bleed)', ha='center', color='#F59E0B', fontweight='bold', fontsize=8.5)

# Spines styling
for ax in (ax1, ax2):
    for spine in ax.spines.values():
        spine.set_color('#3A334E')

plt.suptitle("Figure 3: Rajasthan Royals (IPL 2025–2026) Tactical Phase Gap Audit", color=TEXT_COLOR, fontsize=14, fontweight='black', y=1.03)
plt.tight_layout()
plt.savefig('chart3_rr_2025_26_gaps.png', facecolor=BG_COLOR, bbox_inches='tight')
plt.savefig('public/images/chart3_rr_2025_26_gaps.png', facecolor=BG_COLOR, bbox_inches='tight')
plt.close()

print('Saved chart3_rr_2025_26_gaps.png to root and public/images/!')

