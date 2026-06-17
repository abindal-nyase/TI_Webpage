import s from './04_O3_NYACulture2.module.css'

const DESCRIPTION =
  'At NYA, tenant improvement work is treated as a responsibility: to understand the building, protect the priorities behind the project, communicate clearly, and do the work with care. That mindset began with our founder and continues in the way our teams serve clients today.'

const ITEMS = [
  {
    id: 'advocate',
    title: 'NYA Acting as a true client advocate',
    benefit: '',
    content: 'NYA takes client care seriously. We listen closely, understand what matters most to the owner, architect, or project team, and work to protect those priorities. Our goal is not just to complete the structural scope, but to support clients, ensure they are informed, and make sure their needs are looked after.',
  },
  {
    id: 'client-care',
    title: 'A genuine care for the client and the building itself',
    benefit: 'Helps prevent the building from being treated like a generic structure and leads to solutions that reflect how it actually works.',
    content: 'Generic structural advice can miss what makes an existing building unique. NYA takes the time to understand the inner workings of your building: its structural system, existing conditions, load paths, constraints, and hidden complexities. That allows our guidance to be grounded in how the building actually works, not in one-size-fits-all assumptions.',
  },
  {
    id: 'technical-judgment',
    title: 'Technical judgment that earns confidence',
    benefit: 'Helps ensure the work is sound, coordinated, code-conscious, and ready to move through review, approval, and construction.',
    content: 'NYA is generally trusted to peer-review other engineers\'s complex TI designs, verifying calculations, checking code compliance, and preparing summary reports. That role reflects the level of technical judgment clients and project teams trust us to bring to the project.',
  },
  {
    id: 'make-it-work',
    title: 'A "make it work" mindset / A listening ear that always tries to accommodate',
    benefit: 'Helps protect the design vision instead of defaulting to "no" when a creative idea is technically challenging.',
    content: 'Architects bring the creative ambition to TI work: unusual stairs, open lobbies, new partitions, technology walls, floating floors, and adaptive reuse concepts. NYA\'s role is to safeguard that ambition, translating it into structural solutions that are coordinated, code-conscious, and constructible. The result is a design vision that moves forward with earned confidence, not on hope. Every architecture firm has its own way of working, its own design priorities, and its own expectations for collaboration. NYA does not ask that team to adapt to us. We adapt to them — calibrating guidance, level of detail, communication style, and flexibility to match the way that team already works best.',
  },
  {
    id: 'early-guidance',
    title: 'Guidance clients can feel confident in',
    benefit: 'Gives owners and architects early structural clarity before decisions become expensive or risky.',
    content: 'Before a TI project is fully formalized, owners often need enough structural input to understand what is possible and what may create risk. NYA helps teams have those early conversations with more confidence, offering quick guidance, feasibility input, and practical advice so the project can move forward with a clearer path.',
  },
  {
    id: 'senior-engineers',
    title: 'You work with senior engineers with decades of experience',
    benefit: '',
    content: 'In tenant improvement work, slow communication and too many handoffs can quietly cost a project time. A bureaucratic process can delay decisions, create unnecessary back-and-forth, and make it harder to resolve issues when they come up. NYA replaces that drag with seasoned structural judgment and direct, unfiltered access to the engineers closest to the work. The result is a team that keeps the project moving, not through rushed work, but through a process engineered to remove the waiting.',
  },
  {
    id: 'details',
    title: 'Details shaped with care, not copied from habit',
    benefit: 'Reduces field conflicts, RFIs, redesign, and construction delays caused by generic details.',
    content: 'TI work is not well served by over reliance on generic details. Existing buildings rarely behave like clean templates. Years of prior modifications, hidden as-built discrepancies, and on-site adaptations mean the real condition is always more particular than the record drawings suggest. We tailor our structural details to each project\'s actual conditions, reducing the risk of field conflicts, unclear connections, and construction-phase surprises.',
  },
  {
    id: 'communication',
    title: 'Communication that reduces pressure, not adds to it',
    benefit: 'Limits unnecessary back-and-forth, cost drift, missed expectations, and schedule loss.',
    content: 'Delays in TI work rarely begin with a crisis. They seep in through quieter gaps: the question left unanswered, the RFI that waits days for a response, the decision that drifts because no one knew who owned it. NYA is structured to intercept those gaps before they widen into schedule loss. We respond the same day, pick up the phone when field issues need discussion, and keep clients informed even when a full answer requires more time. NYA\'s decades of familiarity with different teams helps reduce that friction, improve predictability, and support better cost control.',
  },
  {
    id: 'pricing',
    title: 'Pricing that is reliable',
    benefit: 'The goal is not just a lower engineering fee. The goal is a more predictable total project cost.',
    content: 'A complete proposal helps clients understand what is included, reduce unexpected fees, and avoid costly surprises later. With NYA, experience is not overhead — it is efficiency. Our engineers have seen most TI challenges before, so we are not learning the problem at the client\'s expense. We can start further down the field, use past knowledge, automate repetitive steps, and apply sophisticated processes that help us move faster while reducing risk.',
  },
  {
    id: 'plan-check',
    title: 'Plan check is easy with NYA\'s experience',
    benefit: '',
    content: 'When you begin a TI project with NYA, you start with a team that has already mapped the terrain: the building, the permitting path, the plan check culture, the ownership expectations, and the local players involved. That is the advantage NYA brings to TI work. Our familiarity helps teams begin with more clarity, reduce early friction, and move forward with confidence from the first conversation.',
  },
  {
    id: 'trusted',
    title: 'Our quality of work is trusted',
    benefit: '',
    content: 'NYA\'s reputation was shaped by long-standing relationships with owners, architects, and property managers who experienced our founder\'s warmth, character, and care firsthand. That trust continues today because clients know how we work, how we communicate, and how seriously we take their buildings. Much of NYA\'s work comes through recommendations because clients trust the quality of our work, our reputation for excellence, and the confidence we give those who put our name forward.',
  },
]

export default function O3NYACulture2() {
  return (
    <section id="nya-culture-2" className={s.section}>
      <div className={s.grid}>

        {/* ── Row 1 Left — subtitle ── */}
        <div className={s.leftHeader}>
          <h2 className={s.subtitle}>A Culture of Trust</h2>
        </div>

        {/* ── Row 2 Left — image ── */}
        <div className={s.leftMain}>
          <img
            src="/pav-img/NYA Group Photo 2025.jpg"
            alt="NYA team — group photo 2025"
            draggable={false}
            className={s.img}
          />
        </div>

        {/* ── Row 2 Right — description + hover accordion ── */}
        <div className={s.rightMain}>
          <p className={s.descHeading}>A Culture Built to Take Every Project Seriously</p>
          <p className={s.description}>{DESCRIPTION}</p>

          <ul className={s.accordion}>
            {ITEMS.map(item => (
              <li key={item.id} className={s.item}>
                <div className={s.itemRow}>
                  <span className={s.itemTitle}>{item.title}</span>
                  <span className={s.itemIcon} aria-hidden="true" />
                </div>
                <div className={s.itemBody}>
                  {item.benefit && <p className={s.itemBenefit}>{item.benefit}</p>}
                  <p className={s.itemContent}>{item.content}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}
