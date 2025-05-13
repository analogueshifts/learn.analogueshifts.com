import Reviews from "@/components/application/home/reviews";
import ExploreCourses from "@/components/application/home/explore-courses";
import BrowseCourses from "@/components/application/home/browse-courses";
import Landing from "@/components/application/home/landing";
import MasterDevops from "@/components/application/home/master-devops";
import Stats from "@/components/application/home/stats";
import GuestLayout from "@/components/application/layouts/guest";
import { Metadata } from "next";
import FAQ from "@/components/application/home/faqs";
import NewsLetter from "@/components/application/home/news-letter";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://learn.analogueshifts.com"),
  title: "Online tech courses and tech trainings - Analogue Shifts",
  description:
    "Accelerate your tech career growth with our comprehensive online tech courses and training. Discover the latest tools and industry insights at your convenience.",
  openGraph: {
    title: "Online tech courses and tech trainings - Analogue Shifts",
    description:
      "Accelerate your tech career growth with our comprehensive online tech courses and training. Discover the latest tools and industry insights at your convenience.",
    url: "https://learn.analogueshifts.app",
    siteName: "AnalogueShifts",
    images: [
      {
        url: "/og-image.webp",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://learn.analogueshifts.app",
  },
  verification: {
    google: "wNT1hvWDYGZp2pbVAHsjrug-fDv3T_Z0uxTL_SWBOwc",
  },
};

export default function Home() {
  return (
    <Suspense>
      <GuestLayout>
        <Landing />
        <Stats />
        <MasterDevops />
        <ExploreCourses />
        <BrowseCourses />
        <Reviews />
        <FAQ />
        <NewsLetter />
      </GuestLayout>
    </Suspense>
  );
}
