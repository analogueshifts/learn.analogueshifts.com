"use client";
import Image from "next/image";
import React from "react";
import CompanyIcon from "@/assets/images/company.svg";
import ClockIcon from "@/assets/images/clock.svg";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  thumbnail: string;
  name: string;
  description: string;
  company: string;
  duration: string;
  price: string;
  slug: string;
}

export default function CourseCard(props: Props) {
  const { company, description, duration, name, price, thumbnail, slug } =
    props;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="col-span-1 flex flex-col">
      <Image
        src={thumbnail}
        alt=""
        width={352}
        height={232}
        className="w-full h-[232px] object-cover rounded-[32px] mb-4"
      />
      <h3 className="font-medium text-[#111111] tablet:text-base text-lg large:text-xl mb-2">
        {name}
      </h3>
      <p className="text-[#7B7B7B] line-clamp-2 text-sm leading-[33px] mb-2">
        {description}
      </p>
      <div className="flex mb-2 flex-wrap items-start gap-2">
        <div className="w-max flex items-center gap-2">
          <Image src={CompanyIcon} alt="" />
          <p className="text-[#7B7B7B] font-semibold text-sm">{company}</p>
        </div>
        <div className="w-max flex items-center gap-2">
          <Image src={ClockIcon} alt="" />
          <p className="text-[#7B7B7B] font-semibold text-sm">{duration}</p>
        </div>
      </div>
      <h3 className="font-bold text-[#111111] large:text-xl text-lg mb-6">
        {price}
      </h3>
      <div className="w-full gap-8 flex items-center">
        <button
          onClick={() => router.push(`/courses/${slug}/apply`)}
          className={`flex gap-1 items-center py-2.5 h-12 large:h-14 px-12 bg-background-darkYellow rounded-2xl text-sm large:text-base text-primary-boulder50 font-semibold w-max `}
        >
          Apply Now
        </button>
        <button
          onClick={() => {
            router.push(`/courses/${slug}`);
          }}
          className={`flex gap-1 items-center py-2.5 h-12 large:h-14 text-background-darkYellow text-sm large:text-base font-semibold w-max `}
        >
          View Course
        </button>
      </div>
    </div>
  );
}
