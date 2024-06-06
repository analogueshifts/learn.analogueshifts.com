"use client";

import Image from "next/image";
import Link from "next/link";

import GirlImage from "@/assets/images/girl.webp";
import PeopleStack from "../ui/people-stack";
import InfintyImage from "@/assets/images/infinity.svg";
import BookImage from "@/assets/images/book.svg";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const Hero = () => {
  useGSAP(() => {
    gsap.to(".girl", { scale: 1, duration: 1.5 });
    gsap.to(".infinity", { scale: 1, rotate: -10, duration: 1.5 });
    gsap.to(".book", { scale: 1, rotate: 10, duration: 1.5 });
    gsap.to(".stack", { scale: 1, duration: 1.5 });
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full pt-[120px] pb-20 h-max max-w-full max-[500px]:overflow-x-hidden  tablet:max-w-desktop mx-auto flex mobile:flex-row flex-col justify-between items-center px-4">
      <div className="laptop:w-[calc(100%-430px)] mb-5 px-3 mobile:px-0 mobile:mb-0 w-full mobile:w-6/12 mt-[35px] mobile:mt-[86px]">
        <h1 className="laptop:text-[56px] mobile:text-[45px] text-[30px] leading-[40px] mb-6 laptop:leading-[68px] mobile:leading-[56px]">
          <strong className="text-dimLight ">Master DevOps:</strong> <br />
          <span className="text-[rgb(89,89,89)] font-semibold">
            Exclusive Training
          </span>
        </h1>
        <p className=" text-lg text-[#595959] mb-6">
          Join for exclusive access to premium tutorials, behind-the-scenes, and
          more. Elevate your skill set and acquire a skill that is on high
          demand today{" "}
        </p>
        <div className="flex mobile:flex-row flex-col items-start mobile:items-center">
          <button
            onClick={() => scrollToSection("payment-plan")}
            className="px-6 bg-dimGray h-[50px] flex items-center duration-300 hover:bg-dimGray/90 text-white text-base font-medium rounded-[6px]"
          >
            Register Here
          </button>
          <Link
            href="https://www.analogueshifts.com/contact"
            className="px-0 mobile:px-6  h-[50px] flex items-center  underline text-base font-medium text-dimLight"
          >
            Contact Us
          </Link>
        </div>
      </div>
      <div className="tablet:w-heroImage w-[350px] pt-20">
        <div className="relative w-full tablet:h-heroImage h-[350px] rounded-[360px] bg-heroImage">
          <div className="w-full tablet:h-heroGirl h-[430px] absolute flex justify-center bottom-0 rounded-b-[360px] overflow-hidden">
            <Image
              src={GirlImage}
              alt="Image of a Girl with Book"
              className="girl scale-[1.15] w-full h-full object-contain"
            />
          </div>
          <div className="absolute -right-4 bottom-8 scale-50 stack origin-bottom-right">
            <PeopleStack />
          </div>
          <div className="infinity scale-50 absolute top-16 mobile:-left-12 -left-2 -rotate-[5deg] w-32 h-32 bg-white p-3 rounded-3xl">
            <div className=" w-full h-full rounded-2xl bg-lightYellow flex items-center justify-center">
              <Image
                src={InfintyImage}
                alt="Infinity Symbol"
                className="w-3/5"
              />
            </div>
          </div>
          <div className="absolute book scale-50 rotate-[5deg] -top-9 mobile:top-0 right-0 mobile:-right-4 w-[105px] h-[105px] bg-white p-3 rounded-3xl">
            <div className="w-full h-full rounded-2xl bg-lightYellow flex items-center justify-center">
              <Image src={BookImage} alt="Book Symbol" className="w-3/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
