"use client";

import Image from "next/image";

import BackgroundImages from "./bg-images";
import CursorRight from "@/assets/images/cursor-right.svg";
import CursorLeft from "@/assets/images/cursor-left.svg";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Landing() {
  const router = useRouter();
  const { slug } = useParams();

  useEffect(() => {
    localStorage.removeItem("newRegistrationData");
  }, []);

  const handleDownloadOutline = () => {
    let url = "";
    if (slug === "devops") {
      url = "/pdfs/DevOps-Program-Overview-Unlocking-Your-Career-Potential.pdf";
    } else if (slug === "data-engineering") {
      url = "/pdfs/data-engineering-curriculum.pdf";
    } else if (slug === "machine-learning") {
      url = "/pdfs/MLOPS BROCHURE.pdf";
    }

    const filename = "course-outline.pdf";

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full relative h-max">
      <BackgroundImages />
      <div className="w-full z-20  large:pb-[72px] tablet:pb-[50px] pb-[60px] sticky bg-transparent h-max flex justify-center">
        <div className="w-max relative max-w-full mobile:max-w-[90%] flex flex-col large:pt-[91px] pt-16 items-center">
          <div className="absolute tablet:left-2.5 left-[-83px] large:top-[129px] tablet:top-[20px] top-[92px]">
            <div className="relative flex">
              <div className="w-max h-max py-[4.8px] tablet:px-4 tablet:py-[3px] tablet:text-[4.5px] px-[23px] text-[7.76px] font-medium text-primary-boulder950 rounded-[3.3px] border border-[#FFE49D]">
                Developer
              </div>
              <Image
                src={CursorRight}
                alt=""
                className="absolute right-0 translate-x-[100%] top-[19px] tablet:top-[15px] w-max h-max tablet:w-3"
              />
            </div>
          </div>

          <div className="absolute right-[-78px] large:top-[152px]  tablet:right-0 tablet:top-[20px] top-[112px]">
            <div className="relative flex">
              <Image
                src={CursorLeft}
                alt=""
                className="absolute left-0 tablet:top-[15px] translate-x-[-100%] top-[19px] w-max h-max tablet:w-3"
              />
              <div className="w-max h-max tablet:px-4 tablet:py-[3px] tablet:text-[4.5px] py-[4.8px] px-[23px] text-[7.76px] font-medium text-primary-boulder950 rounded-[3.3px] border border-[#FFE49D]">
                Product Designer
              </div>
            </div>
          </div>
          <h1 className="large:text-[32px] mt-6 tablet:text-xl text-[26px] font-semibold tablet:mb-3 mb-4 large:mb-5 text-center leading-9 tablet:px-5 px-0 text-black">
            Thank you for{" "}
            <span className="text-background-darkYellow">your submission!</span>
          </h1>
          <p className="text-center max-w-[677px] tablet:mb-5 mb-7 large:mb-10 px-5  tablet:leading-7 leading-8 large:leading-[48px] font-normal tablet:text-sm text-base large:text-xl text-primary-boulder400">
            Our team will carefully evaluate your submission and provide
            feedback within few business days. Due to the high volume of
            applications, this may take a bit longer than usual, but rest
            assured, we’ll get back to you. Keep an eye on your email for
            updates! &nbsp;
            <button
              onClick={handleDownloadOutline}
              className="text-background-darkYellow underline bg-none border-none"
            >
              Download Course Brochure
            </button>
          </p>
          <button
            onClick={() => {
              router.push("/");
            }}
            className={`flex hover-text-button gap-1 items-center py-2.5 h-12 large:h-14 px-12 bg-background-darkYellow rounded-2xl text-sm large:text-base text-primary-boulder50 font-semibold w-max `}
          >
            Go to back homepage
          </button>
        </div>
      </div>
    </div>
  );
}
