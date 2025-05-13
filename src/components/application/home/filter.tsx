import React from "react";
import FilterIcon from "@/assets/images/filter.svg";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

export default function Filter() {
  const Divider = () => {
    return <div className="w-full h-px bg-[#E7E7E7]"></div>;
  };

  const RenderTextWithCheckBox = ({ text }: { text: string }) => {
    return (
      <div className="w-full flex items-center large:gap-3 gap-2.5">
        <Checkbox className="border-[#6D6D6D]" id={text} />
        <label
          htmlFor={text}
          className="text-[#6D6D6D] font-medium large:text-base text-sm"
        >
          {text}
        </label>
      </div>
    );
  };

  return (
    <div className="large:min-w-[355px] 1186:flex hidden flex-col min-w-[315px] rounded-2xl border border-[#D1D1D1] px-4 large:px-6 py-6 large:py-8">
      <div className="flex gap-1.5 large:mb-[38px] mb-[30px] large:gap-2 items-center">
        <Image src={FilterIcon} alt="" />
        <h3 className="text-black text-lg large:text-xl font-semibold">
          Filter By{" "}
        </h3>
      </div>
      <div className="w-full flex flex-col large:gap-10 gap-8">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex justify-between items-center h-max">
            <h4 className="font-medium text-black large:text-base text-sm">
              Course Category
            </h4>
            <button className="border-0 p-0 bg-transparent font-medium text-[#FFBB0A] large:text-base text-sm">
              Clear filter
            </button>
          </div>
          <RenderTextWithCheckBox text="Software Development" />
          <RenderTextWithCheckBox text="Design" />
          <RenderTextWithCheckBox text="Data Science" />
          <RenderTextWithCheckBox text="Project Management" />
          <RenderTextWithCheckBox text="Marketing" />
          <RenderTextWithCheckBox text="Others" />
        </div>
        <Divider />
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex justify-between items-center h-max">
            <h4 className="font-medium text-black large:text-base text-sm">
              Price
            </h4>
            <button className="border-0 p-0 bg-transparent font-medium text-[#FFBB0A] large:text-base text-sm">
              Clear filter
            </button>
          </div>
          <RenderTextWithCheckBox text="Free" />
          <RenderTextWithCheckBox text="Paid" />
        </div>

        <Divider />
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex justify-between items-center h-max">
            <h4 className="font-medium text-black large:text-base text-sm">
              Skill Level
            </h4>
            <button className="border-0 p-0 bg-transparent font-medium text-[#FFBB0A] large:text-base text-sm">
              Clear filter
            </button>
          </div>
          <RenderTextWithCheckBox text="Beginner" />
          <RenderTextWithCheckBox text="Intermediate" />
          <RenderTextWithCheckBox text="Advanced" />
        </div>
      </div>
    </div>
  );
}
