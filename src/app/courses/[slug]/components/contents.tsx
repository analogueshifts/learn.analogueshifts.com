"use client";
import React, { useState } from "react";
import courses from "@/resources/courses.json";
import Image from "next/image";
import ChevronDownImage from "@/assets/images/chevron-down.svg";
import CompanyIcon from "@/assets/images/company.svg";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Contents({ slug }: { slug: string }) {
  const [isShowingMore, setIsShowingMore] = useState(false);

  const course = courses.find((c) => c.slug === slug);

  return (
    <div className="w-full flex flex-col gap-12">
      <div
        style={{
          height: isShowingMore ? "max-content" : "450px",
        }}
        className="w-full relative rounded-[32px] border border-[#D1D1D1] tablet:px-5 tablet:pt-5 px-8 pt-8 overflow-hidden"
      >
        <h2 className="large:text-[28px] large:leading-[64px] leading-10 tablet:text-lg text-xl mb-6 w-full font-semibold text-black">
          What you will learn
        </h2>
        <div className="w-full h-px bg-[#E7E7E7] mb-6" />
        <p className="text-primary-boulder400 tablet:text-base text-lg large:text-xl font-normal py-5 mb-10px large:leading-[48px] leading-10">
          {course?.whatToExpect?.summary}
        </p>
        <div className="w-full grid grid-cols-2 gap-y-4 tablet:grid-cols-1 gap-x-[38px]">
          {course?.whatToExpect?.list?.map((item, index) => {
            return (
              <div key={index} className="col-span-1 flex gap-4 items-start">
                <Image src="/check-mark.svg" alt="" width={24} height={24} />
                <p className="text-primary-boulder400 tablet:text-sm text-base font-normal leading-8">
                  {item}
                </p>
              </div>
            );
          })}
        </div>
        <div className="h-[124px]" />
        <div
          onClick={() => {
            setIsShowingMore((prev) => !prev);
          }}
          className="absolute cursor-pointer bottom-0 left-0 w-full h-[124px] light-gradient px-8 pb-8 flex items-end justify-between"
        >
          <p className="text-black font-medium text-lg large:text-xl">
            Show {isShowingMore ? "Less" : "More"}
          </p>

          <Image
            className={`${
              isShowingMore ? "rotate-180" : "rotate-0"
            } duration-300`}
            src={ChevronDownImage}
            alt=""
          />
        </div>
      </div>
      <div className="w-full relative rounded-[32px] border border-[#D1D1D1] tablet:p-5 p-8 overflow-hidden">
        <h2 className="large:text-[28px] large:leading-[64px] leading-10 tablet:text-base text-xl tablet:mb-4 mb-6 w-full font-semibold text-black">
          Course Content
        </h2>
        <div className="w-full h-px bg-[#E7E7E7] tablet:mb-4 mb-6" />
        <Accordion
          defaultValue="content-one"
          type="single"
          collapsible
          className="w-full"
        >
          {course?.contents?.map((item) => {
            return (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-[#454545] large:text-xl tablet:text-base text-lg font-bold text-start">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 pb-6">
                  {item.lessons.map((lesson, index) => {
                    return (
                      <div key={index} className="flex gap-3 items-center">
                        <Image width={24} height={24} src="/play.svg" alt="" />
                        <p className="text-primary-boulder400 large:text-xl tablet:text-base text-lg font-normal">
                          {lesson}
                        </p>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <div className="w-full relative rounded-[32px] border border-[#D1D1D1] tablet:p-5 p-8 overflow-hidden">
        <div className="w-full flex items-center justify-between mb-6">
          <h2 className="large:text-[28px] large:leading-[64px] leading-10 tablet:text-lg text-xl  font-semibold text-black">
            Instructor
          </h2>
          <div className="h-8 bg-[#0398551F] w-max rounded-full px-4 flex justify-center items-center">
            <p className="text-[#039855] text-xs font-normal">4.8 Rating</p>
          </div>
        </div>
        <div className="w-full h-px bg-[#E7E7E7] tablet:mb-5 mb-10" />
        <div className="w-full flex tablet:gap-5 gap-10 items-start">
          <Image
            src={course?.instructor?.image as string}
            alt=""
            className="rounded-full tablet:min-w-16 min-w-[150px]"
            width={150}
            height={150}
          />
          <div className="w-full flex flex-col">
            <h3 className="font-semibold text-black tablet:text-base large:text-2xl text-xl">
              Instructor
            </h3>
            <p className="text-primary-boulder400 font-normal large:text-xl tablet:text-sm text-lg mb-[22px]">
              Advanced Educator
            </p>
            <div className="flex items-center tablet:flex-col tablet:mb-3 gap-4 mb-5">
              <div className="flex gap-2 items-center">
                <Image
                  src="/star.svg"
                  alt=""
                  width={27}
                  height={27}
                  className="large:w-[27px] large:h-[27px] w-[23px] h-[23px]"
                />
                <p className="text-black font-normal tablet:text-base large:text-xl text-lg">
                  234 Reviews
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Image src={CompanyIcon} alt="" />
                <p className="text-black font-normal tablet:text-base large:text-xl text-lg">
                  1,000 Students
                </p>
              </div>
            </div>
            <p className="text-primary-boulder400 tablet:hidden large:text-xl text-lg font-normal large:leading-[48px] leading-10">
              {course?.instructor?.about}
            </p>
          </div>
        </div>
        <p className="text-primary-boulder400 hidden tablet:block text-base font-normal">
          {course?.instructor?.about}
        </p>
      </div>
      <div className="w-full relative rounded-[32px] border border-[#D1D1D1] tablet:p-5 p-8 overflow-hidden">
        <div className="w-full flex items-center justify-between mb-6">
          <h2 className="large:text-[28px] large:leading-[64px] leading-10 tablet:text-lg text-xl  font-semibold text-black">
            Reviews
          </h2>
        </div>
        <div className="w-full h-px bg-[#E7E7E7] mb-4" />
        <div className="w-full flex mb-5 items-center gap-4">
          <Image
            src={"/grace.svg"}
            alt=""
            className="rounded-full min-w-[64px]"
            width={64}
            height={64}
          />
          <h3 className="font-semibold text-black large:text-2xl text-xl">
            Grace .O
          </h3>
        </div>
        <p className="text-primary-boulder400 large:text-xl tablet:text-base text-lg font-normal large:leading-[48px] leading-10">
          {course?.review}
        </p>
      </div>
    </div>
  );
}
