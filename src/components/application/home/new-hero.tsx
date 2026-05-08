"use client";

import SearchBar from "./search-bar";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const backgrounds = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop"
];

export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000); // Change image every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden flex flex-col items-center justify-center min-h-[75vh]">
      
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${backgrounds[bgIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />
        
        {/* Subtle glowing orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-background-darkYellow/20 blur-[150px]" />
      </div>
      
      <div className="container relative z-10 px-6 lg:px-12 mx-auto max-w-5xl flex flex-col items-center text-center">
        

        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-6xl lg:text-[72px] font-extrabold tracking-tight text-white mb-6 leading-[1.05]"
        >
          Master Tech with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-background-darkYellow to-yellow-300">
            Analogue Shifts
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-300 max-w-3xl mb-10 font-medium leading-relaxed"
        >
          Accelerate your career growth with top-tier training. Discover the latest tools, frameworks, and industry insights at your convenience.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-2xl relative z-20 shadow-2xl rounded-full"
        >
          <SearchBar />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="mt-14 flex flex-col items-center gap-6 text-sm text-gray-300 font-bold"
        >
          <p className="uppercase tracking-widest text-xs">Trusted by professionals from</p>
          <div className="flex flex-wrap justify-center gap-10 opacity-60 grayscale brightness-200 transition-all duration-500 hover:grayscale-0 hover:opacity-100 hover:brightness-100">
            <span className="text-2xl font-serif">Amazon</span>
            <span className="text-2xl font-sans">Google</span>
            <span className="text-2xl font-mono">Microsoft</span>
            <span className="text-2xl font-bold">Netflix</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
