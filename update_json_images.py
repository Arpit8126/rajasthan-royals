import json

with open('public/data/top_batters.json', 'r') as f:
    batters = json.load(f)

with open('public/data/top_bowlers.json', 'r') as f:
    bowlers = json.load(f)

with open('public/images/players/manifest.json', 'r') as f:
    img_manifest = json.load(f)

batter_meta = {
    'Tristan Stubbs': {'first': 'TRISTAN', 'last': 'STUBBS', 'country': 'South Africa', 'flag': '🇿🇦'},
    'Namboori Tilak Varma': {'first': 'TILAK', 'last': 'VARMA', 'country': 'India', 'flag': '🇮🇳'},
    'David Miller': {'first': 'DAVID', 'last': 'MILLER', 'country': 'South Africa', 'flag': '🇿🇦'},
    'Dhruv Jurel': {'first': 'DHRUV', 'last': 'JUREL', 'country': 'India', 'flag': '🇮🇳'},
    'Suryakumar Yadav': {'first': 'SURYAKUMAR', 'last': 'YADAV', 'country': 'India', 'flag': '🇮🇳'},
    'Marcus Stoinis': {'first': 'MARCUS', 'last': 'STOINIS', 'country': 'Australia', 'flag': '🇦🇺'},
    'Tim David': {'first': 'TIM', 'last': 'DAVID', 'country': 'Australia', 'flag': '🇦🇺'},
    'Rinku Singh': {'first': 'RINKU', 'last': 'SINGH', 'country': 'India', 'flag': '🇮🇳'},
    'Shashank Singh': {'first': 'SHASHANK', 'last': 'SINGH', 'country': 'India', 'flag': '🇮🇳'},
    'Andre Russell': {'first': 'ANDRE', 'last': 'RUSSELL', 'country': 'West Indies', 'flag': '🌴'}
}

bowler_meta = {
    'Matheesha Pathirana': {'first': 'MATHEESHA', 'last': 'PATHIRANA', 'country': 'Sri Lanka', 'flag': '🇱🇰'},
    'Mohammad Nawaz': {'first': 'MOHAMMAD', 'last': 'NAWAZ', 'country': 'Pakistan', 'flag': '🇵🇰'},
    'Haris Rauf': {'first': 'HARIS', 'last': 'RAUF', 'country': 'Pakistan', 'flag': '🇵🇰'},
    'Nathan Ellis': {'first': 'NATHAN', 'last': 'ELLIS', 'country': 'Australia', 'flag': '🇦🇺'},
    'Shaheen Afridi': {'first': 'SHAHEEN', 'last': 'AFRIDI', 'country': 'Pakistan', 'flag': '🇵🇰'},
    'Jasprit Bumrah': {'first': 'JASPRIT', 'last': 'BUMRAH', 'country': 'India', 'flag': '🇮🇳'},
    'Wanindu Hasaranga': {'first': 'WANINDU', 'last': 'HASARANGA', 'country': 'Sri Lanka', 'flag': '🇱🇰'},
    'Sunil Narine': {'first': 'SUNIL', 'last': 'NARINE', 'country': 'West Indies', 'flag': '🌴'},
    'Josh Hazlewood': {'first': 'JOSH', 'last': 'HAZLEWOOD', 'country': 'Australia', 'flag': '🇦🇺'},
    'Abrar Ahmed': {'first': 'ABRAR', 'last': 'AHMED', 'country': 'Pakistan', 'flag': '🇵🇰'}
}

for b in batters:
    name = b['Name']
    b['image_url'] = img_manifest.get(name, f"/images/players/{name.lower().replace(' ', '_')}.png")
    meta = batter_meta.get(name, {'first': name.split()[0].upper(), 'last': ' '.join(name.split()[1:]).upper(), 'country': 'Global', 'flag': '🏏'})
    b['first_name'] = meta['first']
    b['last_name'] = meta['last']
    b['country'] = meta['country']
    b['country_flag'] = meta['flag']

for w in bowlers:
    name = w['Name']
    w['image_url'] = img_manifest.get(name, f"/images/players/{name.lower().replace(' ', '_')}.png")
    meta = bowler_meta.get(name, {'first': name.split()[0].upper(), 'last': ' '.join(name.split()[1:]).upper(), 'country': 'Global', 'flag': '🏏'})
    w['first_name'] = meta['first']
    w['last_name'] = meta['last']
    w['country'] = meta['country']
    w['country_flag'] = meta['flag']

with open('public/data/top_batters.json', 'w') as f:
    json.dump(batters, f, indent=2)

with open('public/data/top_bowlers.json', 'w') as f:
    json.dump(bowlers, f, indent=2)

print("Updated top_batters.json and top_bowlers.json with images and official RR metadata!")

