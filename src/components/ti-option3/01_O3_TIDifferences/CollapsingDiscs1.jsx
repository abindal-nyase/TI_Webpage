import { cd1RedDiscData, cd1CollapseDuration } from './geometry.js'
import { CollapsingDiscsSideBySide } from './CollapsingDiscsSideBySide.jsx'

export function CollapsingDiscs1() {
  return (
    <CollapsingDiscsSideBySide
      redDiscData={cd1RedDiscData}
      collapseDuration={cd1CollapseDuration}
      label="Collapsing Discs 1"
    />
  )
}
