"use client";
import React, { FormEvent, useEffect, useState } from "react";
import ChevronRightImage from "@/assets/images/chevron-right.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import courses from "@/resources/courses.json";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function Landing() {
  const router = useRouter();
  const { slug } = useParams();
  const [isValidSlug, setIsValidSlug] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    commitment: "",
    customCommitment: "",
    goal: "",
    goalOther: "",
    jobSupport: "",
    mentorship: "",
    referralSource: "",
    referralOther: "",
    additionalInfo: "",
  });
  const course = courses.find((c) => c.slug === slug);

  const existingData = localStorage.getItem("newRegistrationData");

  const handleChange = (name: string, newValue: string) => {
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  useEffect(() => {
    if (existingData) {
      const data = JSON.parse(existingData);
      if (data?.commitment) {
      }
    }
  }, [existingData]);

  useEffect(() => {
    if (!slug) return;
    const validSlugs = ["devops", "machine-learning", "data-engineering"];
    setIsValidSlug(validSlugs.includes(slug.toString()));
  }, [slug]);

  if (isValidSlug === false || !existingData) {
    router.push("/");
    return;
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = JSON.parse(existingData);
    const allInformations = {
      ...data.background,
      ...formData,
      ...data.personalInformation,
    };

    console.log(allInformations);

    // Send All Information To Data

    router.push(`/courses/${slug}/apply/commitment`);
  };

  return (
    <div className="w-full pt-[60px] large:pt-[88px] max-w-[1800px] large:px-[112px] px-[72px] flex flex-col tablet:px-6">
      <div className="w-full mb-5 flex h-max justify-between items-center">
        <div className="w-max flex items-center gap-4">
          <div
            onClick={() => {
              router.back();
            }}
            className="w-max flex tablet:hidden cursor-pointer gap-3 items-center"
          >
            <Image src={ChevronRightImage} alt="" />
            <p className="text-[#767676] text-sm large:text-base font-semibold">
              Back
            </p>
          </div>
          <Image src={ChevronRightImage} alt="" />
          <div
            onClick={() => {
              router.back();
            }}
            className="w-max flex cursor-pointer gap-3 items-center"
          >
            <p className="text-[#767676] text-sm large:text-base font-semibold">
              Background & Experience
            </p>
          </div>
          <Image className="tablet:hidden" src={ChevronRightImage} alt="" />
          <p className="text-background-darkYellow tablet:hidden font-semibold large:text-base text-sm">
            Commitment, Availability, Goals & Expectations
          </p>
        </div>
        <p className="text-background-darkYellow text-sm large:text-base font-semibold">
          3/3
        </p>
      </div>
      <div className="flex flex-col pl-2.5">
        <h3
          className={`section-tittle overflow-hidden large:mb-4 mb-2 large:text-[32px] tablet:text-xl text-2xl tablet:leading-8 leading-[45px] font-semibold large:leading-[64px] text-black`}
        >
          Commitment, Availability, Goals & Expectations
        </h3>
        <p
          className={`text-primary-boulder400 mb-[30px] large:text-xl text-base leading-9 large:leading-[48px] font-normal `}
        >
          Let’s get to know about your commitment, availability, goals and
          expectations level better!
        </p>
        <form
          onSubmit={handleFormSubmit}
          className="w-full flex flex-col gap-8"
        >
          <div className="w-full flex items-start gap-1.5">
            <p className="large:text-xl text-lg font-normal text-black">1.</p>
            <div className="flex flex-col">
              <p className="large:text-xl mb-8 text-lg font-normal text-black">
                Can you commit{" "}
                <span className="font-semibold">“10–15 hours per week”</span>{" "}
                for a period of{" "}
                <span className="font-semibold">“4 months”</span> to complete
                the course?
              </p>
              <div className="flex flex-col gap-7">
                <RadioGroup
                  onValueChange={(v) => handleChange("commitment", v)}
                  value={formData.commitment}
                  className="gap-5"
                >
                  {["Yes, I can", "No, I can't", "Maybe - explain"].map(
                    (option) => (
                      <div
                        key={option}
                        className="flex items-center gap-4 large:gap-[23px]"
                      >
                        <RadioGroupItem value={option} id={option} />
                        <label
                          htmlFor={option}
                          className="font-normal text-[#7B7B7B] large:text-xl text-lg"
                        >
                          {option}
                        </label>
                      </div>
                    )
                  )}
                </RadioGroup>
                {formData.commitment === "Maybe - explain" && (
                  <input
                    type="text"
                    placeholder="Type here...."
                    className="w-[286px] tablet:w-full tablet:ml-0 ml-10 large:ml-[47px] py-5 outline-none text-base large:text-xl px-6 placeholder:text-[#B0B0B0] rounded-2xl border border-[#E7E7E7]"
                    value={formData.customCommitment}
                    onChange={(e) =>
                      handleChange("customCommitment", e.target.value)
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex items-start gap-1.5">
            <p className="large:text-xl text-lg font-normal text-black">2.</p>
            <div className="flex flex-col">
              <p className="large:text-xl mb-8 text-lg font-normal text-black">
                What’s your main goal after completing this training?
              </p>
              <div className="flex flex-col gap-7">
                <RadioGroup
                  onValueChange={(v) => handleChange("goal", v)}
                  value={formData.goal}
                  className="gap-5"
                >
                  {[
                    "Get a job",
                    "Improve in current role",
                    "Launch freelance/consulting work",
                    "Lookout for future opportunities",
                    "Upskill for future opportunities",
                    "Other",
                  ].map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-4 large:gap-[23px]"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <label
                        htmlFor={option}
                        className="font-normal text-[#7B7B7B] large:text-xl text-lg"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
                {formData.goal === "Other" && (
                  <input
                    type="text"
                    placeholder="Type here...."
                    className="w-[286px]  tablet:w-full tablet:ml-0 ml-10 large:ml-[47px] py-5 outline-none text-base large:text-xl px-6 placeholder:text-[#B0B0B0] rounded-2xl border border-[#E7E7E7]"
                    value={formData.goalOther}
                    onChange={(e) => handleChange("goalOther", e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex items-start gap-1.5">
            <p className="large:text-xl text-lg font-normal text-black">3.</p>
            <div className="flex flex-col">
              <p className="large:text-xl mb-8 text-lg font-normal text-black">
                Would you require{" "}
                <span className="font-semibold">
                  “career support or job placement”
                </span>{" "}
                after completing the course?
              </p>
              <div className="flex flex-col gap-7">
                <RadioGroup
                  onValueChange={(v) => handleChange("jobSupport", v)}
                  value={formData.jobSupport}
                  className="gap-5"
                >
                  {["Yes", "No", "Maybe"].map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-4 large:gap-[23px]"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <label
                        htmlFor={option}
                        className="font-normal text-[#7B7B7B] large:text-xl text-lg"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="w-full flex items-start gap-1.5">
            <p className="large:text-xl text-lg font-normal text-black">4.</p>
            <div className="flex flex-col">
              <p className="large:text-xl mb-8 text-lg font-normal text-black">
                Are you open to joining a{" "}
                <span className="font-semibold">
                  “mentorship program or internship”
                </span>{" "}
                after the course?
              </p>
              <div className="flex flex-col gap-7">
                <RadioGroup
                  onValueChange={(v) => handleChange("jobSupport", v)}
                  value={formData.jobSupport}
                  className="gap-5"
                >
                  {["Yes, I am", "No, I'm not"].map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-4 large:gap-[23px]"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <label
                        htmlFor={option}
                        className="font-normal text-[#7B7B7B] large:text-xl text-lg"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="w-full flex items-start gap-1.5">
            <p className="large:text-xl text-lg font-normal text-black">5.</p>
            <div className="flex flex-col">
              <p className="large:text-xl mb-8 text-lg font-normal text-black">
                How did you hear about this training?
              </p>
              <div className="flex flex-col gap-7">
                <RadioGroup
                  onValueChange={(v) => handleChange("referralSource", v)}
                  value={formData.referralSource}
                  className="gap-5"
                >
                  {[
                    "Instagram",
                    "X",
                    "LinkedIn",
                    "Our Site",
                    "Other source",
                  ].map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-4 large:gap-[23px]"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <label
                        htmlFor={option}
                        className="font-normal text-[#7B7B7B] large:text-xl text-lg"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
                {formData.referralSource === "Other source" && (
                  <input
                    type="text"
                    placeholder="Type here...."
                    className="w-[286px] tablet:w-full tablet:ml-0 ml-10 large:ml-[47px] py-5 outline-none text-base large:text-xl px-6 placeholder:text-[#B0B0B0] rounded-2xl border border-[#E7E7E7]"
                    value={formData.referralOther}
                    onChange={(e) =>
                      handleChange("referralOther", e.target.value)
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex items-start gap-1.5">
            <p className="large:text-xl text-lg font-normal text-black">6.</p>
            <div className="flex flex-col">
              <p className="large:text-xl mb-8 text-lg font-normal text-black">
                Is there anything else you&apos;d like us to know about your
                background or goals? (Optional)
              </p>
              <input
                type="text"
                placeholder="Type here...."
                className="w-[286px] tablet:w-full tablet:ml-0 ml-10 large:ml-[47px] py-5 outline-none text-base large:text-xl px-6 placeholder:text-[#B0B0B0] rounded-2xl border border-[#E7E7E7]"
                value={formData.additionalInfo}
                onChange={(e) => handleChange("additionalInfo", e.target.value)}
              />
            </div>
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className={`py-2.5 h-12 large:h-14 w-[222px] bg-background-darkYellow rounded-2xl text-sm large:text-base text-primary-boulder50 font-semibold `}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
