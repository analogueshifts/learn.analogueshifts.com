"use client";
import SectionMessage from "./section-message";
import Hero from "@/assets/images/home/browse-courses-hero.svg";
import Image from "next/image";
import { scrollToExploreCoursesSection } from "@/lib/utils";

export default function BrowseCourses() {
  return (
    <section className="w-full flex justify-center">
      <div className="w-full bg-white large:px-[114px] px-[74px]  tablet:px-6 max-w-[1800px]  tablet:flex-col-reverse flex-row justify-between large:gap-[112px] gap-[72px] large:pt-[168px] pt-[118px] h-max items-center flex">
        <div className="large:max-w-[calc(50%-56px)] max-w-[calc(50%-36px)] w-full h-max tablet:max-w-full tablet:w-max">
          <Image src={Hero} alt="" className="w-full h-max" />
        </div>
        <div className="w-max large:max-w-[calc(50%-56px)] max-w-[calc(50%-36px)] tablet:max-w-full flex flex-col gap-6">
          <SectionMessage
            straightTitle
            action={() => {
              scrollToExploreCoursesSection();
            }}
            title="Learn. Grow. Achieve. "
            highlighted="Succeed!"
            buttonChildren="Get Started"
            description="Browse courses from experts or share your own. Choose free or paid options to learn and earn. our platform provides everything you need to learn new skills, grow your expertise, and earn from your knowledge."
          />
        </div>
      </div>
    </section>
  );
}
