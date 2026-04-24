"""
LA Projects Map — NYA Structural Engineering
Act 2 — Presence (NYA_Website_Creative_Vision.md)

Generates a standalone HTML page: full-viewport Leaflet map with
Act 2 copy overlay. Static dots only, no interaction on markers.

Requirements:
    pip install pandas openpyxl
"""

import json
import math
import pandas as pd

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
INPUT_FILE   = "output_classified.xlsx"
OUTPUT_FILE  = "la_projects_map.html"
LA_LAT       = 34.0522
LA_LNG       = -118.2437
RADIUS_MILES = 10

# NYA color system
WARM   = "#B4A08B"   # TI — warm accent
COOL   = "#8CB0BE"   # cool structural accent (used in counter)
LABEL  = "#AFBEB9"   # annotation text
DIM    = "#585049"   # recessive / secondary text
BG     = "#141616"   # page background

# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------
def haversine(lat1, lon1, lat2, lon2) -> float:
    R = 3958.8
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2
         + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2))
         * math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def load_and_filter(path: str) -> pd.DataFrame:
    df = pd.read_excel(path, sheet_name="Projects", dtype=str)

    has_addr = df["PROJECT ADDRESS"].str.strip().ne("") & df["PROJECT ADDRESS"].notna()
    has_zip  = df["ZIP CODE"].str.strip().ne("") & df["ZIP CODE"].notna()
    df = df[has_addr & has_zip].copy()

    df["LATITUDE"]  = pd.to_numeric(df["LATITUDE"],  errors="coerce")
    df["LONGITUDE"] = pd.to_numeric(df["LONGITUDE"], errors="coerce")
    df = df.dropna(subset=["LATITUDE", "LONGITUDE"])

    df["_dist"] = df.apply(
        lambda r: haversine(LA_LAT, LA_LNG, r["LATITUDE"], r["LONGITUDE"]), axis=1
    )
    return df[df["_dist"] <= RADIUS_MILES].drop(columns="_dist").reset_index(drop=True)


# ---------------------------------------------------------------------------
# HTML template — placeholders replaced by render_html()
# ---------------------------------------------------------------------------
HTML_TEMPLATE = """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NYA Structural Engineering — Project Locations</title>
  <link rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
        rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      height: 100%;
      background: __BG__;
      overflow: hidden;
    }

    /* ── Map ──────────────────────────────────────────────────────────── */
    #map {
      position: absolute;
      inset: 0;
    }

    /* ── Top overlay: act label + headline + counter ─────────────────── */
    .act2-header {
      position: absolute;
      top: 0; left: 0; right: 0;
      z-index: 500;
      padding: 52px 68px 80px;
      background: linear-gradient(
        to bottom,
        rgba(20, 22, 22, 0.96) 0%,
        rgba(20, 22, 22, 0.60) 55%,
        rgba(20, 22, 22, 0.00) 100%
      );
      pointer-events: none;
    }

    .act2-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.20em;
      color: __DIM__;
      margin-bottom: 18px;
    }

    .act2-headline {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 22px;
      font-weight: 400;
      letter-spacing: 0.01em;
      color: __LABEL__;
      margin-bottom: 14px;
      max-width: 520px;
      line-height: 1.5;
    }

    .act2-counter {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: __DIM__;
    }

    .act2-counter strong {
      color: __COOL__;
      font-weight: 500;
    }

    /* ── Legend ──────────────────────────────────────────────────────── */
    .act2-legend {
      position: absolute;
      bottom: 36px;
      left: 36px;
      z-index: 500;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.12em;
      color: __DIM__;
      line-height: 2.2;
      pointer-events: none;
    }

    .legend-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .legend-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-divider {
      border: none;
      border-top: 1px solid #232726;
      margin: 6px 0;
      width: 160px;
    }

    .legend-total {
      font-size: 8px;
      letter-spacing: 0.14em;
      color: #2E3332;
    }

    /* ── Leaflet overrides ───────────────────────────────────────────── */
    .leaflet-control-zoom         { display: none !important; }
    .leaflet-control-attribution  {
      background: transparent !important;
      font-family: 'IBM Plex Mono', monospace !important;
      font-size: 8px !important;
      color: #2E3332 !important;
    }
    .leaflet-control-attribution a { color: #3A3F3E !important; }
  </style>
</head>
<body>

  <div id="map"></div>

  <div class="act2-header">
    <div class="act2-label">02 &mdash; PRESENCE</div>
    <div class="act2-headline">We may already know your building.</div>
    <div class="act2-counter">
      <strong>__TI_COUNT__</strong> tenant improvement projects &nbsp;&middot;&nbsp; Los Angeles
    </div>
  </div>

  <div class="act2-legend">
    <div class="legend-row">
      <div class="legend-dot" style="background:__WARM__"></div>
      <span>TENANT IMPROVEMENT</span>
    </div>
    <div class="legend-row" style="color:#2E3332">
      <div class="legend-dot" style="background:#2E3332"></div>
      <span>OTHER WORK</span>
    </div>
    <hr class="legend-divider" />
    <div class="legend-total">__TOTAL__ PROJECTS TOTAL</div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', {
      center: [__LA_LAT__, __LA_LNG__],
      zoom: 12,
      zoomControl:       false,
      attributionControl: true,
      scrollWheelZoom:   true,
      dragging:          true,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    var markers = __MARKERS_JSON__;

    markers.forEach(function (m) {
      L.circleMarker([m.lat, m.lng], {
        radius:      m.ti ? 5 : 3,
        fillColor:   m.ti ? '__WARM__' : '#323735',
        fillOpacity: m.ti ? 0.88 : 0.45,
        color:       'none',
        weight:      0,
        interactive: false,
      }).addTo(map);
    });
  </script>

</body>
</html>
"""


# ---------------------------------------------------------------------------
# Render
# ---------------------------------------------------------------------------
def render_html(df: pd.DataFrame) -> str:
    markers = [
        {"lat": float(row["LATITUDE"]), "lng": float(row["LONGITUDE"]),
         "ti": str(row.get("AUTO_TI", "")).strip() == "YES"}
        for _, row in df.iterrows()
    ]
    ti_count = sum(1 for m in markers if m["ti"])
    no_count = len(markers) - ti_count
    total    = len(markers)

    return (HTML_TEMPLATE
            .replace("__MARKERS_JSON__", json.dumps(markers))
            .replace("__TI_COUNT__",     f"{ti_count:,}")
            .replace("__NO_COUNT__",     f"{no_count:,}")
            .replace("__TOTAL__",        f"{total:,}")
            .replace("__LA_LAT__",       str(LA_LAT))
            .replace("__LA_LNG__",       str(LA_LNG))
            .replace("__WARM__",         WARM)
            .replace("__COOL__",         COOL)
            .replace("__LABEL__",        LABEL)
            .replace("__DIM__",          DIM)
            .replace("__BG__",           BG))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print(f"Reading {INPUT_FILE} ...")
    df = load_and_filter(INPUT_FILE)

    ti_n = (df["AUTO_TI"] == "YES").sum()
    no_n = len(df) - ti_n
    print(f"  {len(df):,} projects within {RADIUS_MILES} mi of LA Downtown")
    print(f"  TI: {ti_n:,}   |   Other: {no_n:,}")

    html = render_html(df)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Saved -> {OUTPUT_FILE}")
