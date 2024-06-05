import ParticlesBackground from "../ui/particles";
import { Input } from "../ui/input";

const NewsLetter = () => {
  return (
    <section className="relative bg-white h-[502px] mobile:h-[336px]">
      <div className="absolute  top-0 left-0 w-full h-full">
        <ParticlesBackground />
      </div>
      <div className="mobile:w-[94%] w-[90%] mobile:max-w-[960px] pt-24 mx-auto relative">
        <div className="mobile:h-36 h-[310px] absolute w-full p-6 rounded-[18px] gap-y-5 bg-aliceBlue flex mobile:flex-row flex-col justify-between">
          <div className="mobile:w-3/5 w-full flex flex-col gap-5">
            <h2 className="text-charcoalGray pt-2 font-medium text-[22px] mobile:text-2xl laptop:text-4xl leading-[1.2em]">
              Stay Informed, Stay Inspired
            </h2>
            <p className="text-lg font-normal leading-[1.2em] text-mediumDarkGray">
              Subscribe to my newsletter for the latest design insights.
            </p>
          </div>
          <form className="mobile:w-2/5 w-full gap-y-3 flex flex-col justify-between">
            <Input
              type="email"
              required
              placeholder="name@email.com"
              className=" duration-200 p-2.5 placeholder:text-[rgb(105,105,105,0.7)] h-max text-[15px] rounded-[6px] text-dimGray bg-white"
            />
            <button
              className="w-full text-[15px] p-2.5 bg-lightYellow rounded-[6px] text-white"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
