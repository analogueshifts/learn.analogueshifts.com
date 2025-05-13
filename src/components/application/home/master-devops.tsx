"use client";
import SectionMessage from "./section-message";
import VideoSection from "../video-section";
import { scrollToExploreCoursesSection } from "@/lib/utils";

export default function MasterDevops() {
  return (
    <section className="w-full flex justify-center">
      <div className="w-full bg-white large:px-[114px] px-[74px]  tablet:px-6 max-w-[1800px]  tablet:flex-col-reverse flex-row justify-between large:gap-[112px] gap-[72px] large:pt-[168px] pt-[118px] h-max items-center flex">
        <div className="large:max-w-[calc(50%-56px)] max-w-[calc(50%-36px)] w-full h-max tablet:max-w-full tablet:w-max">
          <VideoSection />
        </div>
        <div className="w-max large:max-w-[calc(50%-56px)] max-w-[calc(50%-36px)] tablet:max-w-full flex flex-col gap-6">
          <SectionMessage
            straightTitle
            action={() => {
              scrollToExploreCoursesSection();
            }}
            title="Master DevOps: "
            highlighted="Exclusive Training"
            buttonChildren="Explore Courses"
            description="Join our exclusive DevOps training hosted by Analogue Shifts. Learn the latest tools and techniques to boost your career from industry experts."
          />
        </div>
      </div>
    </section>
  );
}
