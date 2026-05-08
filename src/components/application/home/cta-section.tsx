"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSvg from "@/assets/images/home/hero.svg";

export default function CtaSection() {
  return (
    <section className="w-full bg-background-whisperGray py-20 px-6 lg:px-24 border-t border-gray-200 overflow-hidden relative">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-background-darkYellow/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        <div className="w-full lg:w-1/2 flex flex-col items-start">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-tan mb-6">
            Ready to start your <br />
            <span className="text-background-darkYellow">tech journey?</span>
          </h2>
          <p className="text-lg text-content-grayText mb-8 max-w-lg">
            Join thousands of students who have already transformed their careers through our expertly crafted curriculum. Don&apos;t wait to achieve your goals!
          </p>
          <Link 
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                document.getElementById('featured-courses')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                sessionStorage.setItem("scrollTarget", "featured-courses");
              }
            }}
          >
            <Button className="h-14 px-8 text-lg font-bold bg-primary-tan hover:bg-gray-900 text-white rounded-xl shadow-xl hover:scale-105 transition-transform duration-300">
              Start Learning Now
            </Button>
          </Link>
        </div>
        
        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[500px] aspect-square">
            <Image 
              src={HeroSvg} 
              alt="Start Learning" 
              className="w-full h-full object-contain drop-shadow-2xl hover:-translate-y-4 transition-transform duration-700" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
