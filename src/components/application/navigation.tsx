import Link from "next/link";
import ApplicationLogo from "./application-logo";
import MobileNavbar from "./mobile-navbar";

const Navigation = ({ scrollToSection }: any) => {
  return (
    <div className="w-full overflow-hidden max-w-full z-30 fixed top-0 left-0 flex justify-center p-3.5 backdrop-blur-lg">
      <nav className="w-full hidden max-w-desktop p-4 bg-white rounded-[18px] mobile:flex justify-between">
        <div className="pl-7">
          <ApplicationLogo />
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="https://www.analogueshifts.com"
            className="px-5 h-full flex items-center duration-300 hover:bg-lightGray/30 text-dimGray text-base font-normal rounded-[6px]"
          >
            Recruitment Site
          </Link>
          <Link
            href="https://www.analogueshifts.com/contact"
            className="px-5 h-full flex items-center duration-300 hover:bg-lightGray/30 text-dimGray text-base font-normal rounded-[6px]"
          >
            Contact Us
          </Link>
          <button
            onClick={() => scrollToSection("payment-plan")}
            className="px-5 bg-[rgb(51,51,51)] h-full flex items-center duration-300 hover:bg-[rgb(51,51,51)]/90 text-white text-base font-normal rounded-[6px]"
          >
            Register Here
          </button>
        </div>
      </nav>
      <MobileNavbar scrollToSection={scrollToSection} />
    </div>
  );
};

export default Navigation;
