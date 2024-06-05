import Footer from "../footer";
import Navigation from "../navigation";

function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-max min-h-screen ">
      <Navigation />
      {children}
      <Footer />
    </main>
  );
}

export default GuestLayout;
