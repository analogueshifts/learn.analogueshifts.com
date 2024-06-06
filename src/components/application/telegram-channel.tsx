"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import Link from "next/link";
import HeroImage from "@/assets/images/more_information_hero.webp";

import TelegramIcon from "@/assets/images/telegram-light.svg";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TelegramChannel = () => {
  const cardElement: any = useRef(null);
  const triggerRef: any = useRef(null);

  useGSAP(() => {
    const card = cardElement.current;

    if (card) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top center",
          onEnter: () => tl.play(),
        },
        paused: true,
      });

      tl.to(card, { rotate: -3, duration: 0.3 });
    }
  }, []);

  return (
    <section
      ref={triggerRef}
      className="w-full max-w-full overflow-hidden mobile:max-w-desktop mx-auto pb-24 pt-12 flex flex-col gap-y-10 laptop:flex-row h-max justify-between items-center"
    >
      <div
        ref={cardElement}
        className="laptop:w-6/12 mobile:w-[235px] w-[180px] rotate-0 flex justify-center"
      >
        <div className="more-information-hero rounded-[40px] mobile:rounded-[60px] laptop:h-[444px] h-[290px] mobile:h-[374px] p-4 w-275 max-w-full bg-white">
          <Image
            src={HeroImage}
            alt="Image of a Girl learning with her Laptop"
            className="w-full h-full object-cover mobile:rounded-[45px] rounded-[30px]"
          />
        </div>
      </div>
      <div className="laptop:w-6/12 w-[90%] mobile:w-[350px] flex laptop:block flex-col items-center">
        <h2 className="laptop:text-4xl text-2xl text-center laptop:text-start mb-6 text-darkCharcoal ">
          <strong className="">For More</strong>{" "}
          <span className=" font-semibold">Information and Updates</span>
        </h2>
        <p className=" laptop:text-xl text-base text-center laptop:text-start font-medium text-lightGray mb-6">
          Join our Telegram Channel to explore how we&apos;re customizing this
          experience to perfectly suit your needs.{" "}
        </p>
        <Link
          href="https://t.me/+qRSWCScxB2I4OTM0"
          className="px-6 flex items-center w-max bg-dimLight h-[50px] gap-2 duration-300 hover:bg-dimLight/70 text-white text-base font-medium rounded-[6px]"
        >
          <Image src={TelegramIcon} alt="Telegram Icon" className="w-4" />
          Join Our Telegram Page
        </Link>
      </div>
    </section>
  );
};

export default TelegramChannel;
