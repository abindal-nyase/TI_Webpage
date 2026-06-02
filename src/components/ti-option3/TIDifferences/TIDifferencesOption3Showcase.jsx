import s from './TIDifferencesOption3.module.css'
import { TEXT_REDS, TEXT_GREENS } from './geometry.js'
import { BarsAndBubbles1 } from './BarsAndBubbles1.jsx'
import { BarsAndBubbles2 } from './BarsAndBubbles2.jsx'
import { CollapsingDiscs1 } from './CollapsingDiscs1.jsx'
import { CollapsingDiscs2 } from './CollapsingDiscs2.jsx'
import { CollapsingDiscs3 } from './CollapsingDiscs3.jsx'
import { CollapsingDiscs4 } from './CollapsingDiscs4.jsx'

export default function TIDifferencesOption3Showcase() {
  return (
    <div className={s.root} style={{ '--red': TEXT_REDS, '--green': TEXT_GREENS }}>
      <BarsAndBubbles1 />
      <BarsAndBubbles2 />
      <CollapsingDiscs1 />
      <CollapsingDiscs2 />
      <CollapsingDiscs3 />
      <CollapsingDiscs4 />
    </div>
  )
}
