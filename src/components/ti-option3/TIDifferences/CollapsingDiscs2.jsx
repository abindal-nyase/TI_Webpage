import { cd2RedDiscData, cd2CollapseDuration } from './geometry.js'
import { CollapsingDiscsSideBySide } from './CollapsingDiscsSideBySide.jsx'

export function CollapsingDiscs2() {
  return (
    <CollapsingDiscsSideBySide
      redDiscData={cd2RedDiscData}
      collapseDuration={cd2CollapseDuration}
      label="Collapsing Discs 2"
    />
  )
}
