"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ChevronRightImage from "@/assets/images/chevron-right.svg";
import courses from "@/resources/courses.json";
import { useRouter } from "next/navigation";

export default function Landing({ slug }: { slug: string }) {
  const course = courses.find((c) => c.slug === slug);
  const router = useRouter();
  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-[#767676] font-semibold large:text-base text-sm"
        >
          Home
        </Link>
        <Image
          src={ChevronRightImage}
          className="large:w-6 large:h-6 w-5 h-5"
          alt=""
        />
        <p className="text-background-darkYellow font-semibold large:text-base text-sm">
          View Course Details
        </p>
      </div>
      <div className="w-full tablet:pt-8 tablet:gap-8 bg-white items-center tablet:flex-col flex-row justify-between gap-[27px] h-max flex">
        <div className="w-full flex flex-col">
          <h1 className="large:text-[32px] tablet:text-xl text-2xl tablet:leading-8 leading-[45px] mb-3 large:mb-4 font-semibold large:leading-[64px] text-black">
            {course?.headline}
          </h1>
          <p className="text-primary-boulder400 mb-8 large:text-xl text-base leading-9 large:leading-[48px] font-normal">
            {course?.description}
          </p>
          <div className="w-full flex items-center">
            <button
              onClick={() => router.push(`/courses/${slug}/apply`)}
              className={`flex hover-text-button large:mr-9 mr-8 gap-1 items-center py-2.5 h-12 large:h-14 px-12 bg-background-darkYellow rounded-2xl text-sm large:text-base text-primary-boulder50 font-semibold w-max `}
            >
              Apply now!
            </button>
            <div className="w-max flex large:mr-8 mr-7 items-center gap-2">
              <h3 className="text-black font-bold text-lg large:text-xl">
                5.0
              </h3>
              <div className="w-max flex tablet:hidden items-center gap-[5.4px]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Image
                    key={s}
                    src="/star.svg"
                    alt=""
                    width={27}
                    height={27}
                    className="large:w-[27px] large:h-[27px] w-[23px] h-[23px]"
                  />
                ))}
              </div>
            </div>
            <h3 className="text-black font-medium tablet:hidden text-lg large:text-xl">
              {course?.enrolledStudents}
            </h3>
          </div>
        </div>
        <Image
          alt=""
          width={496}
          height={490}
          className="min-w-[496px] tablet:max-w-full tablet:min-w-0 h-max rounded-[44px]"
          src={course?.preview as string}
        />
      </div>
    </div>
  );
}
