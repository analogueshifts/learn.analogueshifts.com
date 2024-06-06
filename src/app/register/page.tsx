import GuestLayout from "@/components/application/layouts/guest";
import RegistrationForm from "@/components/application/registration-form";

export default function Home() {
  return (
    <GuestLayout>
      <RegistrationForm />
    </GuestLayout>
  );
}
