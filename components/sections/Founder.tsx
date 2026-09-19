import { ParallaxLayer } from "@/components/parallax/ParallaxLayer";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { FounderCard } from "@/components/ui/FounderCard";
import { founder } from "@/content/founder";
import { site } from "@/content/site";
import { Orbit } from "./Orbit";

export function Founder() {
  return (
    <section id="founder" aria-labelledby="founder-title" className="relative isolate overflow-hidden section-divider section-y">
      {/* L1 — the hero's orbit returns, faintly: the story comes full circle */}
      <ParallaxLayer speed={0.35} distance={500} className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center" aria-hidden>
        <Orbit faint className="w-[min(1400px,180vw)] opacity-80" />
      </ParallaxLayer>
      <div className="container-x">
        <SectionHeader id="founder-title" label={site.founderSection.label} heading={site.founderSection.heading} />
        <div className="reveal mt-14 md:mt-20">
          <FounderCard founder={founder} />
        </div>
      </div>
    </section>
  );
}
