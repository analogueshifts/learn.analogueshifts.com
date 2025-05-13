"use client";
import Image from "next/image";
import SectionMessage from "./section-message";
import BookOpen from "@/assets/images/book-open.svg";
import BookOpenLight from "@/assets/images/book-open-light.svg";

import Hero from "@/assets/images/home/hero.svg";
import { scrollToExploreCoursesSection } from "@/lib/utils";

export default function Landing() {
  return (
    <section className="w-full flex justify-center">
      <div className="w-full bg-white pl-[66px] max-w-[1800px] large:pl-[104px] tablet:flex-col-reverse flex-row justify-between pr-[55px] large:pr-[85px] tablet:px-6 gap-[51px] large:pt-[91px] pt-[71px] large:pb-[108px] pb-[88px] h-max items-center flex">
        <div className="w-max max-w-[calc(55%-51px)] tablet:max-w-full flex flex-col gap-6">
          <div className="w-max max-w-full h-max rounded-full tablet:py-1 py-1.5 large:py-2.5 tablet:px-2.5 px-3.5 large:px-6 flex items-center tablet:gap-1 gap-2.5 bg-background-darkYellow/10">
            <Image
              className="large:w-max h-max tablet:w-2.5 w-4"
              src={BookOpen}
              alt=""
            />
            <p className="font-medium tablet:text-xs text-sm large:text-base text-background-darkYellow">
              Learn
            </p>
          </div>
          <SectionMessage
            action={() => {
              scrollToExploreCoursesSection();
            }}
            title="Learn, Teach, and Share Courses"
            highlighted="Seamlessly"
            buttonChildren={
              <>
                <Image src={BookOpenLight} alt="" className="animate-pulse" />
                Explore Courses
              </>
            }
            description="Learn and teach with ease. Post and explore courses, and connect with a community of learners and educators. Start your journey today!"
          />
        </div>

        <Image src={Hero} alt="" className="w-[45%] h-max tablet:w-max" />
      </div>
    </section>
  );
}
