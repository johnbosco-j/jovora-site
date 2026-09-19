import { NavCapsule } from "@/components/nav/NavCapsule";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Domains } from "@/components/sections/Domains";
import { Footer } from "@/components/sections/Footer";
import { Founder } from "@/components/sections/Founder";
import { Hero } from "@/components/sections/Hero";
import { Principles } from "@/components/sections/Principles";
import { Process } from "@/components/sections/Process";
import { Products } from "@/components/sections/Products";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <>
      <NavCapsule />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Principles />
        <Domains />
        <Products />
        <Services />
        <Process />
        <Founder />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
