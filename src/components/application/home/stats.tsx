"use client";

import { useRef } from "react";
import AnimatedNumber from "@/components/ui/animated-number";
import Image from "next/image";
import HeroSvg from "@/assets/images/home/hero.svg";
import { motion } from "framer-motion";

export default function Stats() {
  const triggerRef = useRef<HTMLDivElement>(null);

  const RenderStat = ({
    targetNumber,
    value,
    prefix = "",
    suffix = "+",
  }: {
    targetNumber: number;
    value: string;
    prefix?: string;
    suffix?: string;
  }) => {
    return (
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-start hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
        <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-tan flex items-center mb-2 group-hover:text-background-darkYellow transition-colors">
          {prefix}
          <AnimatedNumber targetNumber={targetNumber} triggerRef={triggerRef} />
          {suffix}
        </h2>
        <p className="text-content-grayText text-base font-medium">
          {value}
        </p>
      </div>
    );
  };

  return (
    <section 
      ref={triggerRef}
      className="w-full bg-white py-16 lg:py-20 px-6 lg:px-24 overflow-hidden"
    >
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Column: Stats Grid */}
        <div className="w-full lg:w-[45%] flex flex-col items-start">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-extrabold text-primary-tan mb-6 leading-tight"
          >
            Empowering global <br />
            <span className="text-background-darkYellow">Success Stories</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-content-grayText mb-12 max-w-lg leading-relaxed"
          >
            Our platform connects millions of eager learners with industry-leading experts to foster growth, skill development, and career breakthroughs.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <RenderStat targetNumber={8200} value="Success Stories" />
            <RenderStat targetNumber={1125} value="Expert Instructors" />
            <RenderStat targetNumber={5313} value="Courses Posted" />
            <RenderStat targetNumber={4804} value="Active Students" />
          </motion.div>
        </div>

        {/* Right Column: Hero SVG */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[55%] relative flex justify-center lg:justify-end"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-background-darkYellow/20 to-orange-400/20 blur-[100px] rounded-full pointer-events-none" />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-[600px] aspect-square relative z-10"
          >
            <Image 
              src={HeroSvg} 
              alt="Global Success" 
              className="w-full h-full object-contain drop-shadow-2xl" 
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
