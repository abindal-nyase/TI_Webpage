import s from './TIDifferencesOption3.module.css'
import { COPY } from './config.js'

export function Intro() {
  return (
    <section className={s.intro}>
      <div className={s.introBox}>
        <h2 className={s.introH}>
          {COPY.introHeadMain.map((line, i) => (
            <span key={i} className={s.introHeadMain}>{line}</span>
          ))}
          <em>{COPY.introHeadEm}</em>
        </h2>
        <p className={s.introSub}>{COPY.introSub}</p>
      </div>
    </section>
  )
}
