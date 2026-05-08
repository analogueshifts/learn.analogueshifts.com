"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Hero from "@/assets/images/home/browse-courses-hero.svg";

export default function BrowseCourses() {
  const benefits = [
    "Expert-led instructional content",
    "Real-world practical projects",
    "Lifetime access to materials",
    "Verified certificates of completion"
  ];

  return (
    <section id="browse-courses" className="relative w-full py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container relative z-10 px-6 lg:px-16 mx-auto max-w-[1800px]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Glowing background behind SVG */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-r from-background-darkYellow/20 to-orange-400/20 blur-3xl rounded-full pointer-events-none" />
            <Image 
              src={Hero} 
              alt="Browse Courses Hero" 
              className="w-full h-auto relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-700" 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex flex-col items-start"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-tan mb-4 leading-tight tracking-tight">
              Learn. Grow. Achieve. <br />
              <span className="text-background-darkYellow">Succeed!</span>
            </h2>
            
            <p className="text-base lg:text-lg text-content-grayText mb-6 leading-relaxed">
              Browse courses from industry experts or share your own. Choose free or paid options to learn and earn. Our platform provides everything you need to learn new skills, grow your expertise, and excel in your tech career.
            </p>
            
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-3 text-primary-tan font-medium">
                  <CheckCircle2 className="w-6 h-6 text-background-darkYellow shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <Link 
              href="/courses" 
              onClick={() => typeof window !== 'undefined' && sessionStorage.setItem('scrollBackAnchor', 'browse-courses')}
              className="group flex items-center gap-2 bg-primary-tan text-white px-8 py-4 rounded-xl font-bold hover:bg-background-darkYellow transition-colors duration-300 shadow-xl"
            >
              Explore All Courses
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
