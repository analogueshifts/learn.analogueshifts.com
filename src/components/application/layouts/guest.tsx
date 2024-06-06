"use client";
import gsap from "gsap";

import Footer from "../footer";
import Navigation from "../navigation";

function GuestLayout({ children }: { children: React.ReactNode }) {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <main className="w-full h-max min-h-screen ">
      <Navigation scrollToSection={scrollToSection} />
      {children}
      <Footer />
    </main>
  );
}

export default GuestLayout;
