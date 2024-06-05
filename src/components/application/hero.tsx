"use client";

import Image from "next/image";
import Link from "next/link";

import GirlImage from "@/assets/images/girl.webp";
import PeopleStack from "../ui/people-stack";
import InfintyImage from "@/assets/images/infinity.svg";
import BookImage from "@/assets/images/book.svg";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Hero = () => {
  useGSAP(() => {
    const elements = document.querySelectorAll(".words-slide-down");

    elements.forEach((element: any) => {
      gsap.set(element, { opacity: 1 });
      const chars = element.innerText.split("");
      element.innerHTML = chars
        .map((char: any) => `<span class="char">${char}</span>`)
        .join("");

      gsap.from(element.querySelectorAll(".char"), {
        opacity: 0,
        yPercent: -100,
        duration: 0.5,
        ease: "power1.out",
        stagger: {
          amount: 0.5,
        },
      });
    });

    gsap.to(".girl", { scale: 1, duration: 1.5 });
    gsap.to(".infinity", { scale: 1, rotate: -10, duration: 1.5 });
    gsap.to(".book", { scale: 1, rotate: 10, duration: 1.5 });
    gsap.to(".stack", { scale: 1, duration: 1.5 });
  }, []);

  return (
    <section className="w-full pt-[120px] pb-20 h-max max-w-full overflow-x-hidden  tablet:max-w-desktop mx-auto flex mobile:flex-row flex-col justify-between items-center px-4">
      <div className="laptop:w-[calc(100%-430px)] mb-28 px-3 mobile:px-0 mobile:mb-0 w-full mobile:w-6/12 mt-[65px] mobile:mt-[86px]">
        <h1 className="laptop:text-[56px] mobile:text-[45px] text-[35px] mb-6 laptop:leading-[68px] leading-[56px]">
          <strong className="text-dimLight words-slide-down opacity-0">
            Master DevOps:
          </strong>{" "}
          <span className="text-[rgb(89,89,89)] font-medium words-slide-down opacity-0">
            Exclusive Training
          </span>
        </h1>
        <p className="words-slide-down text-lg text-[#595959] mb-6 opacity-0">
          Join for exclusive access to premium tutorials, behind-the-scenes, and
          more. Elevate your skill set and acquire a skill that is on high
          demand today{" "}
        </p>
        <div className="flex mobile:flex-row flex-col items-start mobile:items-center">
          <Link
            href=""
            className="px-6 bg-dimLight h-[50px] flex items-center duration-300 hover:bg-dimLight/70 text-white text-base font-medium rounded-[6px]"
          >
            Register Here
          </Link>
          <Link
            href="/contact"
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
