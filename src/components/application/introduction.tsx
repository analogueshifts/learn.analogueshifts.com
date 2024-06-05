import Image from "next/image";
import Link from "next/link";

import Avatar from "@/assets/images/avatar-richard.png";
import Reward from "@/assets/images/reward.svg";

import { socials } from "@/resources/socials";

const Introduction = () => {
  return (
    <section className="mobile:w-[94%] w-[324px] gap-y-6 max-w-[94%] rounded-full border border-neuralTone mobile:max-w-[960px] p-3 mx-auto mt-36 mb-20 flex mobile:flex-row flex-col h-max items-center justify-between">
      <div className="mobile:w-260 w-full h-max">
        <Image
          src={Avatar}
          alt="Avatar Image"
          className="w-full h-max rounded-full"
        />
      </div>
      <div className="mobile:w-introductionSection pb-8 mobile:pb-0 w-full gap-5 mobile:pr-7 px-2 h-max flex flex-col">
        <div className="w-full flex items-center mobile:justify-start justify-between mobile:gap-5">
          <h1 className="text-charcoalGray font-medium text-[22px] moblie:text-2xl laptop:text-4xl leading-[1.2em]">
            Hi! I&apos;m Richard
          </h1>
          <div className="w-max h-max rounded-full bg-aliceBlue py-1 px-3.5 flex items-center gap-1">
            <span className="text-brilliantBlue underline">Expert</span>
            <Image src={Reward} alt="" className="h-4 w-max" />
          </div>
        </div>
        <p className="text-[rgb(89,89,89)] text-lg font-normal">
          I am the Product Manager at Analogue Shifts, I&apos;m thrilled to
          introduce our user-friendly DevOps training program designed to guide
          you through the complexities of this dynamic field. With our track
          record of excellence, you can rest assured that you&apos;re in safe
          hands as you embark on this journey.
        </p>
        <div className="w-full flex items-center mobile:gap-3 gap-1.5 justify-center mobile:justify-start">
          {socials.map((item, index) => {
            return (
              <Link
                href={item.url}
                key={index}
                className="hover:bg-aliceBlue/70 py-2 px-2.5 opacity-60 mobile:opacity-100 rounded-lg"
              >
                <Image src={item.image} alt="" className=" w-6 h-6" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Introduction;
