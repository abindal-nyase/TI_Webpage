import s from './FinalCTAOption2.module.css'

export default function FinalCTAOption2() {
  return (
    <section className={s.root}>
      <div className={s.inner}>
        <p className={s.pre}>TI projects don't wait.</p>
        <h2 className={s.heading}>Neither do we.</h2>
        <div className={s.contacts}>
          <a href="tel:+12135551234" className={s.contact}>213-555-1234</a>
          <a href="mailto:ti@nyase.com" className={s.contact}>ti@nyase.com</a>
        </div>
      </div>
    </section>
  )
}
