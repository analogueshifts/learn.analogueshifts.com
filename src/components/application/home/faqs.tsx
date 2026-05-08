"use client";

import data from "../utilities/faqs.json";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const router = useRouter();
  
  // Combine the nested arrays if needed
  const flatData = Array.isArray(data[0]) ? data.flat() : data;

  return (
    <section className="w-full bg-background-whisperGray py-16 lg:py-20 px-6 lg:px-24">
      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-stretch">
        
        {/* Left Column: Heading Top, Contact Card Bottom */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-[35%] flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 bg-background-darkYellow/10 text-background-darkYellow rounded-xl flex items-center justify-center mb-4 shadow-sm border border-background-darkYellow/20">
              <BookOpen className="w-5 h-5" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-tan mb-3 leading-[1.2] tracking-tight">
              Frequently Asked <br className="hidden lg:block" />
              <span className="text-background-darkYellow">Questions</span>
            </h2>
            
            <p className="text-sm text-content-grayText font-medium leading-relaxed max-w-sm">
              Find everything you need to know about our platform, courses, and how we can help you achieve your career goals.
            </p>
          </div>
          
          {/* Compact Contact Card pushed exactly to the bottom */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] w-full max-w-sm mt-8">
            <h3 className="font-bold text-base text-primary-tan mb-1">Still have questions?</h3>
            <p className="text-content-grayText text-xs mb-4 font-medium">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <Link 
              href="https://www.analogueshifts.com/contact"
              className="flex w-full items-center justify-center gap-2 bg-primary-tan hover:bg-gray-900 text-white h-11 rounded-xl font-bold transition-all shadow-sm hover:shadow-md text-sm"
            >
              Get in touch
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Floating Accordion Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[65%]"
        >
          <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
            {flatData.map((item: any, index: number) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white border border-gray-100 rounded-[20px] px-6 lg:px-8 py-2 shadow-sm data-[state=open]:border-background-darkYellow/50 data-[state=open]:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="hover:no-underline py-6 group">
                  <span className="text-left font-bold text-lg lg:text-xl text-primary-tan group-hover:text-background-darkYellow transition-colors pr-8 leading-snug">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-content-grayText leading-relaxed pb-6 font-medium">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

      </div>
    </section>
  );
}
