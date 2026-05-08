"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote } from "lucide-react";
import ratings from "../utilities/ratings.json";

export default function Reviews() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  return (
    <section className="w-full py-12 lg:py-16 bg-white relative overflow-hidden">
      
      <div className="container mx-auto px-6 lg:px-24 max-w-[1800px] relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 max-w-2xl mx-auto"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-tan mb-4">
            What Our Students <span className="text-background-darkYellow">Say</span>
          </h2>
          <p className="text-lg text-content-grayText font-medium">
            Don&apos;t just take our word for it. Hear directly from the individuals who have accelerated their tech careers with us.
          </p>
        </motion.div>

        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-6 py-4">
            {ratings.map((item: any, index: number) => (
              <div 
                key={index} 
                className="min-w-0 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-6"
              >
                <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-shadow duration-300 h-full flex flex-col relative group">
                  
                  {/* Decorative Quote Icon Background */}
                  <div className="absolute top-6 right-6 opacity-5 text-gray-400 group-hover:text-background-darkYellow group-hover:opacity-10 transition-all duration-500 pointer-events-none">
                    <Quote size={54} fill="currentColor" strokeWidth={0} />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-5 relative z-10">
                    {item.ratings.map((_: any, i: number) => (
                      <Star key={i} className="w-4 h-4 fill-background-darkYellow text-background-darkYellow" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-content-grayText text-base leading-relaxed mb-6 flex-grow relative z-10 font-medium line-clamp-4">
                    "{item.message}"
                  </p>

                  {/* User Profile */}
                  <div className="flex items-center gap-3 mt-auto border-t border-gray-100 pt-5 relative z-10">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-white shadow-sm ring-2 ring-gray-50 shrink-0">
                      <Image
                        src={item.userImage}
                        alt={item.userName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-primary-tan text-sm truncate">{item.userName}</h4>
                      <p className="text-xs text-content-grayText font-medium truncate mt-0.5">{item.userRole}</p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
