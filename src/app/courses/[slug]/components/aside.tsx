"use client";
import Image from "next/image";
import React from "react";
import ClockIcon from "@/assets/images/clock.svg";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";

interface Props {
  price: string;
  duration: string;
  enrolledStudents: string;
  skillLevel: string;
  slug: string;
}

export default function Aside({
  price,
  duration,
  enrolledStudents,
  skillLevel,
  slug,
}: Props) {
  const { notifyUser } = useAuth();
  const router = useRouter();

  function copyToClipboard(text: string) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          notifyUser("success", "Text copied to clipboard", "right");
        })
        .catch((err) => {
          notifyUser("error", "Failed to copy text", "right");
        });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const success = document.execCommand("copy");
        console.log(success ? "Text copied (fallback)" : "Copy command failed");
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      }

      document.body.removeChild(textarea);
    }
  }

  return (
    <div className="min-w-[363px] tablet:min-w-0 tablet:w-[363px] tablet:max-w-full flex flex-col gap-8">
      <div className="w-full h-max p-8 tablet:p-5 rounded-[32px] border border-background-darkYellow">
        <div className="w-full large:mb-12 mb-11 flex items-center justify-between">
          <h1 className="large:text-[32px] tablet:text-xl text-2xl font-semibold text-black">
            {price}
          </h1>
          <div className="w-max flex items-center gap-2">
            <Image src={ClockIcon} alt="" />
            <p className="text-[#7B7B7B] font-semibold text-sm">{duration}</p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/courses/${slug}/apply`)}
          className={`flex large:mb-8 mb-7 hover-text-button gap-1 items-center justify-center py-2.5 h-12 large:h-14 bg-background-darkYellow rounded-2xl text-sm large:text-base text-primary-boulder50 font-semibold w-full `}
        >
          Apply
        </button>
        <div className="w-full large:mb-8 mb-7 flex flex-col gap-4">
          <div className="w-full border-b border-[#E7E7E7] pb-4 flex justify-between">
            <p className="text-[#7B7B7B] font-bold text-sm large:text-base leading-8">
              Enrolled Students
            </p>
            <div className="h-8 bg-[#0398551F] w-max rounded-full px-4 flex justify-center items-center">
              <p className="text-[#039855] text-xs font-normal">
                {enrolledStudents}
              </p>
            </div>
          </div>
          <div className="w-full flex justify-between">
            <p className="text-[#7B7B7B] font-bold text-sm large:text-base leading-8">
              Skill Level
            </p>
            <div className="h-8 bg-[#0398551F] w-max rounded-full px-4 flex justify-center items-center">
              <p className="text-[#039855] text-xs font-normal">{skillLevel}</p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <button
            onClick={() => {
              const text = `${window.location.origin}/courses/${slug}`;
              copyToClipboard(text);
            }}
            className="hover:opacity-70 w-max text-sm large:text-base font-medium text-background-darkYellow border-0 bg-transparent"
          >
            Copy link
          </button>
        </div>
      </div>
      <div className="w-full border border-[#D1D1D1] tablet:p-5 rounded-[32px] p-8 flex flex-col items-center">
        <h2 className="large:text-[28px] large:leading-[64px] leading-10 tablet:text-lg text-xl mb-6 w-full font-semibold text-black">
          Course Rating
        </h2>
        <div className="w-full h-px bg-[#E7E7E7] mb-[33px]" />
        <h1 className="text-black font-bold text-[80px] mb-4 large:text-[100px]">
          5.0
        </h1>
        <div className="w-max flex items-center gap-[5.4px]">
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
    </div>
  );
}
