import simMu045 from './simulation_data_mu_0.45.json'
import simMu050 from './simulation_data_mu_0.50.json'
import simMu055 from './simulation_data_mu_0.55.json'

export const DISCS = {
  blenderScale:       120,
  towerScale:         0.64,
  scrollVhPerPhase:   48,
  baselinePct:        0,
  fontScale:          1.0,
  posNegFontRatio:    0.9,
  dropAnimDuration:   0.58,
  riskBarH:           14,
  riskBarMaxW:        null,
  redRiskBarGrowDir:  'left',
  greenRiskBarGrowDir:'center',
  riskBarScale:       1.0,
  valueBarW:          5,
  valueBarGap:        100,
  barIdleOpacity:     0,
  barActiveOpacity:   1,
  towerColPct:        50,
  towerColShift:      -100,
  cd1SimData:         simMu050,
  cd2SimData:         simMu055,
  cd3SimData:         simMu055,
  cd3TowerScale:      1.3,
  cd4SimData:         simMu055,
  cd4TowerScale:      2.5,
  cd4RedTextScale:    1.0,
  cd4GreenTextScale:  1.0,
  cd4TapeSideMargin:  0.075,
  cd4TapeTopBotMargin:0.15,
  cd4TapeBgOpacity:   0.92,
}

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
  { face: '#5a1e1e', rim: '#3e1414' },
  { face: '#6e2222', rim: '#4e1818' },
  { face: '#822626', rim: '#5e1e1e' },
  { face: '#962a2a', rim: '#6e2022' },
  { face: '#aa2c30', rim: '#7e2028' },
  { face: '#bc2e34', rim: '#8a1e2a' },
  { face: '#c42535', rim: '#8e1e2c' },
]

export const DISC_GREENS = [
  { face: '#1a5030', rim: '#123820' },
  { face: '#1a5c38', rim: '#123e28' },
  { face: '#1c6840', rim: '#144a2e' },
  { face: '#1a7848', rim: '#125636' },
  { face: '#168850', rim: '#106040' },
  { face: '#109858', rim: '#0c6e40' },
  { face: '#0da85e', rim: '#0a7042' },
]

export const RED_COLORS = [
  { bright: '#6e2828', dark: '#4a1e1e' },
  { bright: '#7e3030', dark: '#582424' },
  { bright: '#8e3838', dark: '#662a2a' },
  { bright: '#9e4040', dark: '#723030' },
  { bright: '#ae4848', dark: '#7e3838' },
  { bright: '#bc4c4c', dark: '#8a3c3c' },
  { bright: '#c85050', dark: '#924040' },
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
