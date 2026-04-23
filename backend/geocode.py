# geocode.py
# Requirements: pip install requests
# Run: python geocode.py

import csv
import json
import time
import requests
from dotenv import load_dotenv
import os

load_dotenv()

MAPBOX_TOKEN = os.getenv('MAPBOX_TOKEN')
INPUT_FILE = 'buildings.csv'
OUTPUT_FILE = 'projects.json'

def geocode(address):
    url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/{}.json'.format(
        requests.utils.quote(address)
    )
    params = {
        'access_token': MAPBOX_TOKEN,
        'limit': 1,
        'country': 'US',
        'proximity': '-118.2437,34.0522'
    }
    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        data = res.json()

        if data['features']:
            feature = data['features'][0]
            lng, lat = feature['center']

            # Use the POI name if Mapbox knows it, otherwise use the
            # formatted address string as a fallback
            name = feature.get('place_name') or address
            location = feature.get('context')[0].get('text') if feature.get('context') else 'Los Angeles'

            return lat, lng, name, location
        else:
            return None, None, None, None

    except Exception as e:
        print(f'  ERROR: {e}')
        return None, None, None, None

results = []
failed = []

with open(INPUT_FILE, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f'Geocoding {len(rows)} addresses...\n')

for row in rows:
    address = row['address'].strip()
    print(f'  {address}...')
    lat, lng, name, location = geocode(address)

    if lat is None:
        print(f'  FAILED — could not resolve')
        failed.append({'address': address})
    else:
        print(f'  OK — {name} | {lat:.5f}, {lng:.5f}')
        results.append({
            'name': name,
            'address': address,
            'lat': lat,
            'lng': lng,
            'location': location
        })

    time.sleep(0.2)

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print(f'\nDone.')
print(f'  Resolved: {len(results)} addresses → {OUTPUT_FILE}')

if failed:
    print(f'  Failed:   {len(failed)} addresses — fix and re-run\n')
    for b in failed:
        print(f'    {b["address"]}')