import s from './TIDifferencesOption3.module.css'
import { TEXT_REDS, TEXT_GREENS } from './geometry.js'
import { Intro } from './Intro.jsx'
import { CollapsingDiscs3 } from "./CollapsingDiscs3.jsx";

export default function TIDifferencesOption3() {
  return (
    <div
      id="section-ti-differences"
      className={s.root}
      style={{ "--red": TEXT_REDS, "--green": TEXT_GREENS }}
    >
      <Intro />
      <CollapsingDiscs3 />
    </div>
  );
}
