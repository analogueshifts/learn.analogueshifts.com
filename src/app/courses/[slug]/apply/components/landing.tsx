"use client";
import React, { FormEvent, useEffect, useState } from "react";
import ChevronRightImage from "@/assets/images/chevron-right.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FormInput from "@/components/application/FormInput";
import UserImage from "@/assets/images/user.svg";
import EnvelopeImage from "@/assets/images/envelope.svg";
import PhoneImage from "@/assets/images/phone.svg";
import SelectCountry from "@/components/application/country-dropdown";
import { useParams } from "next/navigation";

export default function Landing() {
  const router = useRouter();
  const { slug } = useParams();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "",
  });
  const [isValidSlug, setIsValidSlug] = useState<boolean | null>(null);

  const updateFormField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const existingData = localStorage.getItem("newRegistrationData");
    if (existingData) {
      const data = JSON.parse(existingData);
      setForm(data.personalInformation);
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    const validSlugs = ["devops", "machine-learning", "data-engineering"];
    setIsValidSlug(validSlugs.includes(slug.toString()));
  }, [slug]);

  if (isValidSlug === false) {
    router.push("/");
    return;
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const existingData = localStorage.getItem("newRegistrationData");
    if (existingData) {
      const data = JSON.parse(existingData);
      localStorage.setItem(
        "newRegistrationData",
        JSON.stringify({ ...data, personalInformation: form })
      );
    } else {
      localStorage.setItem(
        "newRegistrationData",
        JSON.stringify({ personalInformation: form })
      );
    }
    router.push(`/courses/${slug}/apply/background`);
  };

  return (
    <div className="w-full pt-[60px] large:pt-[88px] max-w-[1800px] large:px-[112px] px-[72px] flex justify-between items-start gap-[91px] tablet:px-6">
      <div className="w-full flex flex-col">
        <div className="w-full mb-8 flex h-max justify-between items-center">
          <div
            onClick={() => {
              router.back();
            }}
            className="w-max flex cursor-pointer gap-3 items-center"
          >
            <Image src={ChevronRightImage} alt="" />
            <p className="text-[#767676] text-sm large:text-base font-semibold">
              Back
            </p>
          </div>
          <p className="text-[#767676] text-sm large:text-base font-semibold">
            1/<span className="text-background-darkYellow">3</span>
          </p>
        </div>
        <div className="w-full mb-8 rounded-2xl bg-[#FEF9E8] tablet:py-3 tablet:px-3 py-6 px-5">
          <p className="text-base large:text-xl tablet:text-sm font-normal text-background-darkYellow">
            Please Note: That your submission would be reviewed, and you’ll
            receive a response in few days once a decision is made.{" "}
          </p>
        </div>
        <h3
          className={`section-tittle overflow-hidden large:mb-4 mb-2 large:text-[32px] tablet:text-xl text-2xl tablet:leading-8 leading-[45px] font-semibold large:leading-[64px] text-black`}
        >
          Personal Information
        </h3>
        <p
          className={`text-primary-boulder400 large:mb-10 mb-7 large:text-xl text-base leading-9 large:leading-[48px] font-normal `}
        >
          Let’s get to know you better!
        </p>
        <form
          onSubmit={handleFormSubmit}
          className="w-full grid grid-cols-2 gap-y-6 gap-x-[27px]"
        >
          <div className="col-span-1">
            <FormInput
              image={UserImage}
              label="First Name"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => updateFormField("firstName", e)}
              type="text"
              required
            />
          </div>
          <div className="col-span-1">
            <FormInput
              image={UserImage}
              label="Last Name"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => updateFormField("lastName", e)}
              type="text"
              required
            />
          </div>
          <div className="col-span-1">
            <FormInput
              image={EnvelopeImage}
              label="Email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => updateFormField("email", e)}
              type="email"
              required
            />
          </div>
          <div className="col-span-1">
            <FormInput
              image={PhoneImage}
              label="Phone Number"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={(e) => updateFormField("phoneNumber", e)}
              type="text"
              required
            />
          </div>
          <div className="col-span-2 mb-6">
            <SelectCountry
              label="Country (Optional)"
              value={form.country}
              onChange={(e) => updateFormField("country", e)}
              required={false}
            />
          </div>
          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className={`py-2.5 h-12 large:h-14 w-[222px] bg-background-darkYellow rounded-2xl text-sm large:text-base text-primary-boulder50 font-semibold `}
            >
              Next
            </button>
          </div>
        </form>
      </div>
      <div className="relative hidden pb-[48px] pr-[35px] h-max min-w-[524px] pt-[70px] 1186:flex justify-end">
        <Image src="/apply-bg.svg" alt="" width={480} height={504} />
        <Image
          src="/apply-bg-star.svg"
          alt=""
          width={152}
          height={158}
          className="absolute top-0 left-0"
        />
        <Image
          src="/apply-bg-text.svg"
          alt=""
          width={222}
          height={72}
          className="absolute bottom-0 right-0"
        />
      </div>
    </div>
  );
}
