import GuestLayout from "@/components/application/layouts/guest";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <GuestLayout>
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12 lg:py-24 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <CheckoutClient />
        </div>
      </div>
    </GuestLayout>
  );
}
