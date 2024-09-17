import FAQS from "@/components/application/faqs";
import Landing from "@/components/application/landing";
import NewsLetter from "@/components/application/news-letter";
import GuestLayout from "@/components/application/layouts/guest";
import ProgrammePerks from "@/components/application/programme-perks";
import Introduction from "@/components/application/introduction";
import TelegramChannel from "@/components/application/telegram-channel";
import PaymentPlan from "@/components/application/payment-plan";
import VideoSection from "@/components/application/video-section";
import { Metadata } from "next";

export const metadata: Metadata = {
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
    <GuestLayout>
      <Landing />
      <VideoSection />
      <Introduction />
      <PaymentPlan />
      <TelegramChannel />
      {/* <ProgrammePerks /> */}
      <FAQS />
      <NewsLetter />
    </GuestLayout>
  );
}
