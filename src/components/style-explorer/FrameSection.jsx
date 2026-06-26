/*
 * FrameSection.jsx — picks which Option-3 section to render inside the
 * Style Explorer iframe, based on the `?section=` query read CLIENT-side.
 *
 * Why client-side: Astro's static output doesn't honor server-read
 * searchParams (every /se-frame request would otherwise render the default
 * section). Reading location.search at mount works in dev and static alike.
 * client:only React, so window is always available here.
 */
import O3Hero from '../00_O3_Hero/00_O3_Hero.jsx';
import O3TIDifferences from '../01_O3_TIDifferences/01_O3_TIDifferences.jsx';
import O3FirmCulture from '../02_O3_FirmCulture/02_O3_FirmCulture.jsx';
import O3TrustWall from '../03_O3_TrustWall/03_O3_TrustWall.jsx';
import O3ClientCare from '../04_O3_ClientCare/04_O3_ClientCare.jsx';
import O3Ethos from '../05_O3_Ethos/05_O3_Ethos.jsx';
import O3Footer from '../06_O3_Footer/06_O3_Footer.jsx';

const MAP = {
  hero:    O3Hero,
  risk:    O3TIDifferences,
  culture: O3FirmCulture,
  trust:   O3TrustWall,
  care:    O3ClientCare,
  vision:  O3Ethos,
  footer:  O3Footer,
};

export default function FrameSection() {
  const id = new URLSearchParams(window.location.search).get('section') || 'hero';
  const Comp = MAP[id] || O3Hero;
  return <Comp />;
}
