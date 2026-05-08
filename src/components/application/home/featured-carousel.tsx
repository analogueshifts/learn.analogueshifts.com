"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import coursesData from "@/resources/courses.json";

const TRAINER_NAMES = ["Jane Doe", "John Smith", "Alice Wonderland"];

const carouselItems = [...coursesData, ...coursesData, ...coursesData].slice(0, 8).map((c, index) => ({
  id: c.slug,
  title: c.headline || c.name,
  description: c.description,
  instructor: TRAINER_NAMES[index % TRAINER_NAMES.length],
  price: c.price,
  rating: 4.8,
  students: c.enrolledStudents || "1,200",
  image: c.thumbnail || "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
  uniqueKey: `${c.slug}-${index}`
}));

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function FeaturedCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 4000 })]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section id="featured-courses" className="py-16 lg:py-20 px-6 lg:px-24 bg-white max-w-[1800px] mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-tan mb-2 tracking-tight">
            Featured <span className="text-background-darkYellow">Courses</span>
          </h2>
          <p className="text-content-grayText text-base lg:text-lg font-medium">Discover our most highly rated and popular courses.</p>
        </div>
        <div className="hidden md:flex gap-3">
          <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full h-12 w-12 border-gray-200 hover:border-background-darkYellow hover:text-background-darkYellow transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full h-12 w-12 border-gray-200 hover:border-background-darkYellow hover:text-background-darkYellow transition-colors">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-6 items-stretch">
          {chunkArray(carouselItems, 2).map((coursePair, index) => (
            <div key={index} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] xl:flex-[0_0_25%] pl-6 flex flex-col gap-6">
              {coursePair.map((course) => (
                <Link 
                  href={`/courses/${course.id}`} 
                  key={course.uniqueKey} 
                  onClick={() => typeof window !== 'undefined' && sessionStorage.setItem('scrollBackAnchor', 'featured-courses')}
                  className="flex-1 flex flex-col"
                >
                  <Card className="flex-1 overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-100 group rounded-2xl flex flex-col">
                    <div className="relative h-40 lg:h-44 w-full overflow-hidden bg-gray-100 shrink-0">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold rounded text-primary-tan shadow-sm">
                        BESTSELLER
                      </div>
                    </div>
                    <CardContent className="p-5 flex-grow flex flex-col">
                      <div className="flex items-center gap-1 text-xs mb-2 font-medium">
                        <span className="text-background-darkYellow font-bold">{course.rating}</span>
                        <div className="flex text-background-darkYellow">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-content-subtle ml-1">({course.students})</span>
                      </div>
                      <h3 className="font-bold text-lg text-primary-tan line-clamp-2 mb-1.5 group-hover:text-background-darkYellow transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-snug mb-4">
                        {course.description}
                      </p>
                      
                      <div className="mt-auto">
                        <p className="text-xs text-content-grayText font-medium mb-3">{course.instructor}</p>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <span className="font-bold text-lg text-primary-tan">{course.price}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <Link 
          href="/courses"
          onClick={() => typeof window !== 'undefined' && sessionStorage.setItem('scrollBackAnchor', 'featured-courses')}
        >
          <Button className="group h-14 px-8 text-lg font-bold bg-white text-primary-tan border-2 border-gray-100 hover:border-background-darkYellow hover:text-background-darkYellow rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2">
            Explore All Courses
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
