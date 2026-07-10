import simMu045 from './simulation_data_mu_0.45.json'
import simMu050 from './simulation_data_mu_0.50.json'
import simMu055 from './simulation_data_mu_0.55.json'

export const DISCS = {
  blenderScale: 120,
  towerScale: 0.64,
  scrollVhPerPhase: 30,
  baselinePct: 0,
  fontScale: 0.75,
  posNegFontRatio: 1.1, // solution text larger than risk text (prominence)
  dropAnimDuration: 0.58,
  riskBarH: 14,
  riskBarMaxW: null,
  redRiskBarGrowDir: "left",
  greenRiskBarGrowDir: "center",
  riskBarScale: 1.0,
  valueBarW: 5,
  valueBarGap: 100,
  barIdleOpacity: 0,
  barActiveOpacity: 1,
  towerColPct: 40,
  towerColShift: -100,
  cd1SimData: simMu050,
  cd2SimData: simMu055,
  cd3SimData: simMu055,
  cd3TowerScale: 1.3,
  cd4SimData: simMu055,
  cd4TowerScale: 2.5,
  cd4RedTextScale: 1.0,
  cd4GreenTextScale: 1.0,
  cd4TapeSideMargin: 0.075,
  cd4TapeTopBotMargin: 0.15,
  cd4TapeBgOpacity: 0.92,
  cd4StackTitleH: 200,
  cd4StackGapH: 200,
};

export const BARS = {
  fontScale:            1.0,
  scrollVhPerPhase:     48,
  baselinePct:          5.0,
  barWidth:             36,
  barHeightRef:         360,
  redBarHeights:        [1.90, 1.60, 1.30, 1.00, 0.70, 0.40, 0.10],
  greenBarHeights:      [0.10, 0.40, 0.70, 1.00, 1.30, 1.60, 1.90],
  bubbleDiameter:       200,
  bubbleBarGap:         8,
  glowRadius:           64,
  greenRedRatio:        1.0,
  barAnimDuration:      2.0,
  positionAnimDuration: 1.0,
  opacityAnimDuration:  2,
  curveTension:         0.2,
  curveOpacity:         0.6,
  curveStrokeWidth:     4,
  arrowType:            'hollow',
  arrowSize:            50,
  arrowStrokeWidth:     4,
  curveLabelFontScale:  1.5,
  curveOvershootPx:     40,
  labelBoxGap:          16,
  bb2BubbleBarScale:    1.5,
  exitFadeOpacity:      0.1,
  horizSpacing:         0.3,
  horizTransitionSpacing: 0.42,
  bb2ChartPhases:       3,
  bb2ChartStaggerFactor:0.6,
  bb2ChartTitleDelay:   0.3,
  bb2EndDwellPhases:    1,
}

export const ITEMS = [
  { category: 'Site Intelligence',      ntext: 'Existing building treated as a generic structure. Design built on a false premise.',                          ptext: 'Structural system studied early on its own terms. Every decision reflects how the building actually works.' },
  { category: 'Front-End Clarity',      ntext: 'Generic assumptions replace the right questions. Late discoveries create avoidable cost.',                    ptext: 'Structural input provided early. Owners and architects know what is possible and what to resolve.' },
  { category: 'Design Ambition',        ntext: 'Engineer cannot support the design, architect hears no. Innovative ideas lose their impact.',                 ptext: 'Strong structural solutions protect the design vision. Innovative ideas reach construction intact.' },
  { category: 'Construction Readiness', ntext: 'Standard details ignore actual site conditions. Conflicts in the field, RFIs follow, small misses chain.',    ptext: 'Details tailored to actual conditions. Drawings are clear, coordinated, and practical to build. RFIs minimized.' },
  { category: 'Approvals',              ntext: 'Drawings submitted without anticipating city expectations. Rework, delays, and longer approvals follow.',     ptext: 'Drawings prepared for what the city will need. Plan check moves predictably without surprises.' },
  { category: 'Team Coordination',      ntext: 'Poor coordination creates cost drift and uncertainty for owners. Slow communication causes schedule loss.',   ptext: 'Communication kept clear across the structural team, architect, contractor, and owner. Fewer delays.' },
  { category: 'Scope & Fees',           ntext: 'Building never studied, scope never fully understood. Low upfront fee becomes a stream of add-services.',     ptext: 'Proposal sized to the real scope. Clients avoid surprise add-services and cost drift.' },
]

export const COPY = {
  introHeadMain:   ['When structure is', 'treated as a second thought,'],
  introHeadEm:     'the whole project pays.',
  introSub:        'There are many ways a TI project can lose value, time, and design integrity. Take a look at what changes when the engineer understands the building.',
  eyebrowRed:      'Common Problems',
  titleRed:        'The Risk',
  eyebrowGreen:    'Done Right',
  titleGreen:      'The Solution',
  trajectoryLabel: 'Project Value Trajectory',
  barRedLabel:     'Exposed Risk',
  barGreenLabel:   'Resolved Risk',
  barValueLabel:   'Project Value',
}

export const DISC_REDS = [
  { face: '#7a3a40', rim: '#552828' },
  { face: '#8c3b41', rim: '#62292e' },
  { face: '#9f3b43', rim: '#6f292f' },
  { face: '#b13c44', rim: '#7c2a30' },
  { face: '#c43d45', rim: '#892a30' },
  { face: '#d63d47', rim: '#962b32' },
  { face: '#e93e48', rim: '#a32b32' },
]

export const DISC_GREENS = [
  { face: '#1e6e42', rim: '#155030' },
  { face: '#1c7c4a', rim: '#145a36' },
  { face: '#1a8a52', rim: '#12663c' },
  { face: '#169858', rim: '#107042' },
  { face: '#12a860', rim: '#0c7c48' },
  { face: '#0eb868', rim: '#088a50' },
  { face: '#0aca72', rim: '#069856' },
]

export const RED_COLORS = [
  { bright: '#7a3a40', dark: '#552828' },
  { bright: '#8c3b41', dark: '#62292e' },
  { bright: '#9f3b43', dark: '#6f292f' },
  { bright: '#b13c44', dark: '#7c2a30' },
  { bright: '#c43d45', dark: '#892a30' },
  { bright: '#d63d47', dark: '#962b32' },
  { bright: '#e93e48', dark: '#a32b32' },
]

export const GREEN_COLORS = [
  { bright: '#1e5c3a', dark: '#143e28' },
  { bright: '#266840', dark: '#1a4a2e' },
  { bright: '#2e7448', dark: '#205436' },
  { bright: '#368050', dark: '#265c3e' },
  { bright: '#3c9058', dark: '#2c6844' },
  { bright: '#42a466', dark: '#307a4e' },
  { bright: '#4ab87a', dark: '#368a5a' },
]
