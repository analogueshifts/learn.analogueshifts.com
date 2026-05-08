"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VideoSection() {
  return (
    <section className="relative w-full py-24 bg-background-whisperGray overflow-hidden border-b border-gray-100">
      {/* Decorative glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-background-darkYellow/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container px-6 lg:px-16 mx-auto max-w-[1800px] relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-12">
          
          {/* Left Text Column (CTA) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[45%] flex flex-col items-start"
          >
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-primary-tan mb-6 leading-[1.1]">
              Ready to start your <br />
              <span className="text-background-darkYellow">tech journey?</span>
            </h2>
            <p className="text-lg xl:text-xl text-content-grayText mb-10 max-w-lg leading-relaxed font-medium">
              Join thousands of students who have already transformed their careers through our expertly crafted curriculum. Don&apos;t wait to achieve your goals!
            </p>
            <div className="flex items-center gap-4">
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
                <Button className="h-14 px-8 text-lg font-bold bg-primary-tan hover:bg-gray-900 text-white rounded-xl shadow-xl hover:scale-105 transition-all duration-300">
                  Start Learning Now
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Video Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-[55%] relative group"
          >
            {/* Subtle glow effect behind video */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-background-darkYellow/30 to-orange-400/30 rounded-[32px] blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
            
            <div className="relative rounded-[28px] overflow-hidden bg-white border border-gray-100 shadow-2xl p-2">
              <div className="rounded-2xl overflow-hidden relative w-full aspect-video bg-gray-100">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/gY2FEaYoTXA?autoplay=0&rel=0&showinfo=0&modestbranding=1" 
                  title="Welcome to Analogue Shifts"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
