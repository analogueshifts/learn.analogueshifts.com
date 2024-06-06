"use client";
import { useRef } from "react";
import AnimatedNumber from "../ui/animated-number";

const StatisticsCard = () => {
  const industryExpert: any = useRef(null);
  const hoursOfTutorial: any = useRef(null);
  const satisfactionRate: any = useRef(null);

  return (
    <section className="w-[94%] mb-24 px-5 mobile:px-0 bg-white max-w-desktop mx-auto border border-neuralTone flex-col mobile:flex-row rounded-[18px] mobile:py-6 flex">
      <div
        ref={industryExpert}
        className="w-full pl-12 border-b mobile:border-b-0 mobile:border-r border-neuralTone flex flex-col gap-3 py-8 mobile:py-5"
      >
        <h2 className="text-2xl mobile:text-4xl font-semibold text-lightYellow">
          <AnimatedNumber targetNumber={5} triggerRef={industryExpert} />
        </h2>
        <p className="text-mediumDarkGray text-base mobile:text-lg font-normal">
          Industry Experts
        </p>
      </div>
      <div
        ref={hoursOfTutorial}
        className="w-full pl-12 border-b mobile:border-b-0 mobile:border-r border-neuralTone flex flex-col gap-3 py-8 mobile:py-5"
      >
        <h2 className="text-2xl mobile:text-4xl font-semibold text-lightYellow">
          <AnimatedNumber targetNumber={100} triggerRef={hoursOfTutorial} />+
        </h2>
        <p className="text-mediumDarkGray text-base mobile:text-lg font-normal">
          Hours of Tutorial Content
        </p>
      </div>
      <div
        ref={satisfactionRate}
        className="w-full pl-12 flex flex-col gap-3 py-8 mobile:py-5"
      >
        <h2 className="text-2xl mobile:text-4xl font-semibold text-lightYellow">
          <AnimatedNumber targetNumber={99} triggerRef={satisfactionRate} />%
        </h2>
        <p className="text-mediumDarkGray text-base mobile:text-lg font-normal">
          Satisfaction Rate
        </p>
      </div>
    </section>
  );
};

export default StatisticsCard;
