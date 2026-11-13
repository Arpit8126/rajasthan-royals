import urllib.request
import re
import os

os.makedirs('public/images/players', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

player_sources = {
    'Dhruv Jurel': 'https://www.rajasthanroyals.com/static-assets/images/players/71370.png?v=7.95',
    'Tristan Stubbs': 'https://www.delhicapitals.in/players/74761-tristan-stubbs-profile',
    'Namboori Tilak Varma': 'https://www.mumbaiindians.com/static-assets/images/players/large/action-shots/70761.png?v=7.71&w=400',
    'David Miller': 'https://www.delhicapitals.in/static-assets/images/players/ipl/5313.png?v=2.72',
    'Suryakumar Yadav': 'https://static-files.cricket-australia.pulselive.com/headshots/440/10916-camedia.png',
    'Marcus Stoinis': 'https://timesofindia.indiatimes.com/sports/cricket/ipl/player-stats/marcus-stoinis/4311',
    'Tim David': 'https://www.mumbaiindians.com/players/67402-tim-david-profile',
    'Rinku Singh': 'https://www.kkr.in/static-assets/images/players/64727.png?v=112.14',
    'Shashank Singh': 'https://www.punjabkingsipl.in/static-assets/images/players/63520.png?v=6.68',
    'Andre Russell': 'https://static.toiimg.com/photo/119127559.cms',
    'Matheesha Pathirana': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBNz4pRUZwoGA_ZJ-a9YZwdhok8Y6zeiF4-ukpYakDq-A_xB-9FtE0Xh7J&s=10',
    'Mohammad Nawaz': 'https://images.icc-cricket.com/image/upload/t_player-headshot-portrait-lg-webp/prd/assets/players/generic/colored/57935.png',
    'Haris Rauf': 'https://static-files.cricket-australia.pulselive.com/headshots/288/3928-camedia.png',
    'Nathan Ellis': 'https://static.toiimg.com/photo/120896426.cms',
    'Shaheen Afridi': 'https://www.pngguru.in/storage/uploads/images/Shaheen%20Afridi%20Pakistani%20cricketer%20free%20HD%20PNG%20Image_1696787243_632614253.webp',
    'Jasprit Bumrah': 'https://i.redd.it/uq3kx3v0123h1.png',
    'Wanindu Hasaranga': 'https://static-files.cricket-australia.pulselive.com/headshots/288/3164-camedia.png',
    'Sunil Narine': 'https://www.kkr.in/static-assets/images/players/11229.png?v=112.14',
    'Josh Hazlewood': 'https://static.toiimg.com/photo/120897606.cms',
    'Abrar Ahmed': 'https://static-files.cricket-australia.pulselive.com/headshots/440/10733-camedia.png'
}

def extract_image_from_html(html, player_name):
    if 'stubbs' in player_name.lower():
        # Look for delhicapitals image pattern
        m = re.search(r'(https://[^\s\"\'<>]*(?:74761|stubbs)[^\s\"\'<>]*(?:\.png|\.webp|\.jpg))', html, re.I)
        if m: return m.group(1)
        m2 = re.search(r'(https://www\.delhicapitals\.in/static-assets/images/players/[^\s\"\'<>]+)', html)
        if m2: return m2.group(1)
    elif 'david' in player_name.lower():
        m = re.search(r'(https://[^\s\"\'<>]*(?:67402|action-shots|players)[^\s\"\'<>]*(?:\.png|\.webp|\.jpg)[^\s\"\'<>]*)', html, re.I)
        if m: return m.group(1)
    elif 'stoinis' in player_name.lower():
        m = re.search(r'(https://static\.toiimg\.com/photo/[0-9]+\.cms)', html)
        if m: return m.group(1)
        m2 = re.search(r'(https://[^\s\"\'<>]*stoinis[^\s\"\'<>]*(?:\.png|\.webp|\.jpg|\.cms))', html, re.I)
        if m2: return m2.group(1)
    return None

downloaded_paths = {}

for name, url in player_sources.items():
    slug = name.lower().replace(' ', '_')
    out_file = f'public/images/players/{slug}.png'
    print(f'Fetching {name}...')
    
    target_img_url = url
    if url.endswith('-profile') or 'player-stats' in url:
        try:
            req = urllib.request.Request(url, headers=headers)
            html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
            found_url = extract_image_from_html(html, name)
            if found_url:
                target_img_url = found_url
                print(f'  Resolved HTML -> {target_img_url}')
        except Exception as e:
            print(f'  HTML resolve failed: {e}')
            
    # Fallback known high-quality headshots if needed
    if 'stubbs' in name.lower() and ('-profile' in target_img_url or not target_img_url):
        target_img_url = 'https://www.delhicapitals.in/static-assets/images/players/ipl/74761.png'
    if 'david' in name.lower() and ('-profile' in target_img_url or not target_img_url):
        target_img_url = 'https://www.mumbaiindians.com/static-assets/images/players/large/action-shots/67402.png?v=7.71&w=400'
    if 'stoinis' in name.lower() and ('player-stats' in target_img_url or not target_img_url):
        target_img_url = 'https://static-files.cricket-australia.pulselive.com/headshots/440/1384-camedia.png'

    try:
        req = urllib.request.Request(target_img_url, headers=headers)
        data = urllib.request.urlopen(req, timeout=12).read()
        with open(out_file, 'wb') as f:
            f.write(data)
        downloaded_paths[name] = f'/images/players/{slug}.png'
        print(f'  Saved -> {out_file} ({len(data)} bytes)')
    except Exception as e:
        print(f'  Download failed for {name} ({target_img_url}): {e}')
        # Fallback to direct URL
        downloaded_paths[name] = target_img_url

print('\nSummary of player image paths:')
import json
print(json.dumps(downloaded_paths, indent=2))

with open('public/images/players/manifest.json', 'w') as f:
    json.dump(downloaded_paths, f, indent=2)

