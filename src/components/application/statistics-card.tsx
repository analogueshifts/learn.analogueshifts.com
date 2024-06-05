const StatisticsCard = () => {
  return (
    <section className="w-[94%] px-5 mobile:px-0 bg-white max-w-desktop mx-auto border border-neuralTone flex-col mobile:flex-row rounded-[18px] mobile:py-6 mb-10 flex">
      <div className="w-full pl-12 border-b mobile:border-b-0 mobile:border-r border-neuralTone flex flex-col gap-3 py-8 mobile:py-5">
        <h2 className="text-2xl mobile:text-4xl font-medium text-lightYellow">
          5
        </h2>
        <p className="text-mediumDarkGray text-base mobile:text-lg font-normal">
          Industry Experts
        </p>
      </div>
      <div className="w-full pl-12 border-b mobile:border-b-0 mobile:border-r border-neuralTone flex flex-col gap-3 py-8 mobile:py-5">
        <h2 className="text-2xl mobile:text-4xl font-medium text-lightYellow">
          100+
        </h2>
        <p className="text-mediumDarkGray text-base mobile:text-lg font-normal">
          Hours of Tutorial Content
        </p>
      </div>
      <div className="w-full pl-12 flex flex-col gap-3 py-8 mobile:py-5">
        <h2 className="text-2xl mobile:text-4xl font-medium text-lightYellow">
          99%
        </h2>
        <p className="text-mediumDarkGray text-base mobile:text-lg font-normal">
          Satisfaction Rate
        </p>
      </div>
    </section>
  );
};

export default StatisticsCard;
