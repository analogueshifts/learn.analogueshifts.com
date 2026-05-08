import GuestLayout from "@/components/application/layouts/guest";
import { Suspense } from "react";
import NewHero from "@/components/application/home/new-hero";
import VideoSection from "@/components/application/home/video-section";
import Stats from "@/components/application/home/stats";
import FeaturedCarousel from "@/components/application/home/featured-carousel";
import CategoryGrid from "@/components/application/home/category-grid";
import BrowseCourses from "@/components/application/home/browse-courses";
import Reviews from "@/components/application/home/reviews";
import FAQ from "@/components/application/home/faqs";
import NewsLetter from "@/components/application/home/news-letter";
import ScrollRestoration from "@/components/application/home/scroll-restoration";

export default function Home() {
  return (
    <Suspense>
      <ScrollRestoration />
      <GuestLayout>
        <NewHero />
        <VideoSection />
        <BrowseCourses />
        <FeaturedCarousel />
        <Stats />
        <CategoryGrid />
        <FAQ />
        <Reviews />
        <NewsLetter />
      </GuestLayout>
    </Suspense>
  );
}
