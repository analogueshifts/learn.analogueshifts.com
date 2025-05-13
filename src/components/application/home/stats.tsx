import React from "react";

export default function Stats() {
  const RenderStat = ({
    number,
    value,
    floatRight,
  }: {
    number: string;
    value: string;
    floatRight?: boolean;
  }) => {
    return (
      <div
        className={`w-max tablet:w-full tablet:col-span-1 h-max flex flex-col gap-[11px] ${
          floatRight ? "tablet:items-end" : ""
        }`}
      >
        <h2 className="large:text-[32px] tablet:text-lg text-2xl tablet:leading-6 leading-[45px] font-semibold large:leading-[64px] text-white">
          {number}
        </h2>
        <p className="text-white/80 large:text-lg text-base leading-6 large:leading-[48px] font-normal">
          {value}
        </p>
      </div>
    );
  };

  const Divider = () => {
    return <div className="w-px h-[75px] bg-white/50 tablet:hidden"></div>;
  };

  return (
    <div className="w-full bg-[#FFBB0A] justify-between tablet:grid grid-cols-2 tablet:gap-x-3 tablet:gap-y-5 py-[42px] large:px-[143px] px-[97px] tablet:px-6 items-center flex gap-[82px]">
      <RenderStat number="8,200" value="Success Stories" />
      <Divider />
      <RenderStat floatRight number="1,125" value="Expert Instructors" />
      <Divider />
      <RenderStat number="5,313" value="Courses Posted" />
      <Divider />
      <RenderStat floatRight number="4,804" value="Active Students" />
    </div>
  );
}
