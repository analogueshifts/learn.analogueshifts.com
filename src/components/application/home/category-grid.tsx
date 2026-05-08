"use client";

import { 
  Code2, 
  Terminal, 
  Database, 
  Cloud, 
  Smartphone, 
  PenTool, 
  LineChart, 
  Shield,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORIES = [
  { name: "Web Development", icon: Code2, count: 120, slug: "web-development" },
  { name: "DevOps", icon: Terminal, count: 85, slug: "devops" },
  { name: "Data Science", icon: Database, count: 64, slug: "data-science" },
  { name: "Cloud Computing", icon: Cloud, count: 92, slug: "cloud-computing" },
  { name: "Mobile Dev", icon: Smartphone, count: 45, slug: "mobile-development" },
  { name: "UI/UX Design", icon: PenTool, count: 78, slug: "design" },
  { name: "Marketing", icon: LineChart, count: 32, slug: "marketing" },
  { name: "Cybersecurity", icon: Shield, count: 56, slug: "cybersecurity" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function CategoryGrid() {
  return (
    <section id="category-grid" className="py-16 lg:py-20 px-6 lg:px-24 bg-primary-tan relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-background-darkYellow/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-orange-500/5 blur-[100px]" />
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
              Explore Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-background-darkYellow to-orange-400">Categories</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Find exactly what you're looking for. Our platform offers thousands of courses across the most in-demand tech disciplines.
            </p>
          </div>
          <Link 
            href="/courses" 
            onClick={() => typeof window !== 'undefined' && sessionStorage.setItem('scrollBackAnchor', 'category-grid')}
            className="group flex items-center gap-2 text-background-darkYellow font-bold hover:text-white transition-colors"
          >
            View All Categories <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div key={category.slug} variants={itemVariants}>
                <Link 
                  href={`/courses?category=${category.slug}`}
                  onClick={() => typeof window !== 'undefined' && sessionStorage.setItem('scrollBackAnchor', 'category-grid')}
                  className="block relative p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-background-darkYellow/50 transition-all duration-300 group overflow-hidden"
                >
                  {/* Hover gradient backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-br from-background-darkYellow/0 to-background-darkYellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 flex flex-col items-start text-left">
                    <div className="w-12 h-12 bg-white/10 text-background-darkYellow rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-background-darkYellow group-hover:text-primary-tan transition-all duration-300 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-background-darkYellow transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-background-darkYellow transition-colors" />
                      {category.count} Courses
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
