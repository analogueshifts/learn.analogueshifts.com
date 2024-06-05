import FAQS from "@/components/application/faqs";
import Landing from "@/components/application/landing";
import NewsLetter from "@/components/application/news-letter";
import GuestLayout from "@/components/application/layouts/guest";
import ProgrammePerks from "@/components/application/programme-perks";
import RegistrationForm from "@/components/application/registration-form";
import Introduction from "@/components/application/introduction";
import TelegramChannel from "@/components/application/telegram-channel";

export default function Home() {
  return (
    <GuestLayout>
      <Landing />
      <TelegramChannel />
      <Introduction />
      <RegistrationForm />
      <ProgrammePerks />
      <FAQS />
      <NewsLetter />
    </GuestLayout>
  );
}
