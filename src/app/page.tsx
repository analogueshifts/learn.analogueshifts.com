import FAQS from "@/components/application/faqs";
import Landing from "@/components/application/landing";
import NewsLetter from "@/components/application/news-letter";
import GuestLayout from "@/components/application/layouts/guest";
import ProgrammePerks from "@/components/application/programme-perks";
import Introduction from "@/components/application/introduction";
import TelegramChannel from "@/components/application/telegram-channel";
import PaymentPlan from "@/components/application/payment-plan";
import VideoSection from "@/components/application/video-section";

export default function Home() {
  return (
    <GuestLayout>
      <Landing />
      <VideoSection />
      <Introduction />
      <PaymentPlan />
      <TelegramChannel />
      <ProgrammePerks />
      <FAQS />
      <NewsLetter />
    </GuestLayout>
  );
}
