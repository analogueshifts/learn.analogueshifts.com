"use client";

import GuestLayout from "@/components/application/layouts/guest";
import Image from "next/image";
import HeroSvg from "@/assets/images/home/hero.svg";
import { CheckCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname?.includes("/login");

  const benefits = isLogin ? [
    "Access your saved courses",
    "Track your learning progress",
    "Engage with your community",
    "View your earned certificates"
  ] : [
    "Access to 5,000+ premium tech courses",
    "Learn from top industry experts",
    "Earn recognized certificates",
    "Join a global community of developers",
  ];

  const topSectionContent = {
    titlePrefix: isLogin ? "Welcome back to" : "Empower your career with",
    description: isLogin 
      ? "Log in to your account to continue learning, access your premium resources, and pick up right where you left off on your journey to mastering new tech skills."
      : "Whether you are a student eager to learn new skills or a professional looking to teach and inspire others, you are in the right place. Create an account below to access thousands of premium resources and join our growing global network."
  };

  const imageCardContent = {
    title: isLogin ? "Pick up where you" : "Unlock your",
    titleHighlight: isLogin ? "left off" : "Potential",
    description: isLogin
      ? "Access your dashboard to review your progress, continue your enrolled courses, and explore new learning paths."
      : "Accelerate your tech career with 5,000+ premium courses. Build the skills you need for the future you want."
  };

  return (
    <GuestLayout>
      <div className="w-full flex flex-col">
        
        {/* TOP SECTION: Professional Writeup */}
        <section className="w-full bg-white border-b border-gray-100 py-16 px-6 sm:px-12 lg:px-24 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-background-darkYellow/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-tan/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-tan mb-6 tracking-tight leading-[1.1]">
              {topSectionContent.titlePrefix} <br className="hidden md:block" />
              <span className="text-background-darkYellow">Analogue Shifts</span>
            </h1>
            <p className="text-content-grayText text-lg md:text-xl max-w-3xl text-balance leading-[1.8] font-medium mx-auto px-4 mt-2">
              {topSectionContent.description}
            </p>
          </div>
        </section>

        {/* UNIFIED SPLIT SCREEN CARD */}
        <div className="w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-background-whisperGray lg:p-10">
          
          <div className="w-full max-w-[1300px] min-h-[750px] flex flex-col lg:flex-row bg-white lg:rounded-[32px] overflow-hidden border border-gray-100">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex w-full lg:w-1/2 relative bg-primary-tan flex-col justify-center items-center p-12 overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-background-darkYellow/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
              </div>

              <div className="relative z-10 w-full max-w-xl flex flex-col items-center h-full">
                <div className="w-full relative aspect-square max-w-[450px] mx-auto mt-auto mb-8">
                  <Image 
                    src={HeroSvg} 
                    alt="Analogue Shifts Learning" 
                    className="w-full h-full object-contain drop-shadow-2xl" 
                    priority
                  />
                </div>

                <div className="w-full bg-black/20 border border-white/10 rounded-3xl p-8 backdrop-blur-md text-left mt-auto">
                  <h1 className="text-2xl xl:text-3xl font-extrabold text-white mb-3 leading-tight">
                    {imageCardContent.title} <span className="text-background-darkYellow">{imageCardContent.titleHighlight}</span>
                  </h1>
                  
                  <p className="text-gray-300 text-sm leading-relaxed font-medium mb-8">
                    {imageCardContent.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-white font-medium text-sm">
                        <div className="w-6 h-6 rounded-full bg-background-darkYellow/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-background-darkYellow" />
                        </div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Authentication Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative bg-white">
              <div className="w-full max-w-[480px] relative z-10">
                {children}
              </div>
            </div>
          </div>

        </div>
      </div>
    </GuestLayout>
  );
}
