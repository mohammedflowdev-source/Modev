import FAQs from "@/sections/FAQs";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import Hero from "@/sections/Hero";
import Intro from "@/sections/Intro"
import Projects from "@/sections/Projects"
import Testimonials from "@/sections/Testimonials";
import Marquee from "@/components/Marquee";
import Services from "@/sections/Services";
import Process from "@/sections/Process";
export default function Home() {
  return (
    <>
      <Header />
      {/* Page content sits above the footer and slides up to uncover it (curtain reveal). */}
      <main className="relative z-[1] bg-[var(--page-bg)] transition-colors duration-500">
        <Hero />
        <Intro />
        <Services />
        <Projects />
        <Process />
        <Testimonials />
        <FAQs />
        <Marquee />
      </main>
      <Footer />
    </>
  );
}
