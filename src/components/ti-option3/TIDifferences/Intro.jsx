import s from './TIDifferencesOption3.module.css'
import { COPY } from './config.js'

export function Intro() {
  return (
    <section className={s.intro}>
      <div className={s.introBox}>
        <p className={s.eyebrow}>{COPY.introEyebrow}</p>
        <h2 className={s.introH}>
          {COPY.introHeadMain}{' '}
          <em>{COPY.introHeadEm}</em>
        </h2>
        <p className={s.introSub}>{COPY.introSub}</p>
        <span className={s.cue}>{COPY.introCue}</span>
      </div>
    </section>
  )
}
