import s from './TIDifferencesOption3.module.css'
import { TEXT_REDS, TEXT_GREENS } from './geometry.js'
import { Intro } from './Intro.jsx'
import { CollapsingDiscs4 } from './CollapsingDiscs4.jsx'

export default function TIDifferencesOption3() {
  return (
    <div className={s.root} style={{ '--red': TEXT_REDS, '--green': TEXT_GREENS }}>
      <Intro />
      <CollapsingDiscs4 />
    </div>
  )
}
