"use client";
import { useState } from "react";

import PeopleStack from "../ui/people-stack";

import { allCountries } from "@/resources/all-countries";
import { SkillLevel } from "./skill-level";

// Ui
import { Input } from "../ui/input";
import Comobox from "./comobox";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const RegistrationForm = () => {
  const [skillLevel, setSkillLevel] = useState("");
  const [country, setCountry] = useState("");

  return (
    <section className="w-full bg-aliceBlue py-24">
      <form className="w-[94%] max-w-[960px] bg-white mx-auto p-5 mobile:py-50 mobile:px-100">
        <h2 className="text-charcoalGray font-semibold text-2xl laptop:text-4xl leading-[1.2em] text-center">
          We look Forward To having you <br /> Please Fill the Form Below To
          Register
        </h2>
        <div className="w-full flex justify-center my-6">
          <PeopleStack />
        </div>

        {/* Inputs */}
        <div className="w-full flex flex-wrap gap-3">
          <div className="w-[calc(50%-6px)] flex flex-col gap-2">
            <label htmlFor="firstName" className="text-charcoalGray">
              First Name*
            </label>
            <Input
              required
              type="text"
              placeholder="Jane"
              id="firstName"
              className="bg-whiteSmoke rounded-[8px] text-sm duration-150 placeholder:text-[rgb(105,105,105)]"
            />
          </div>
          <div className="w-[calc(50%-6px)] flex flex-col gap-2">
            <label htmlFor="lastName" className="text-charcoalGray">
              Last Name*
            </label>
            <Input
              required
              type="text"
              placeholder="Doe"
              id="lastName"
              className="bg-whiteSmoke rounded-[8px] text-sm duration-150 placeholder:text-[rgb(105,105,105)]"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="email" className="text-charcoalGray">
              Email*
            </label>
            <Input
              required
              type="email"
              placeholder="hello@analogueshifts.com"
              id="email"
              className="bg-whiteSmoke rounded-[8px] text-sm duration-150 placeholder:text-[rgb(105,105,105)]"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="phone" className="text-charcoalGray">
              Phone*
            </label>
            <Input
              required
              type="text"
              placeholder="+123262234533"
              id="phone"
              className="bg-whiteSmoke rounded-[8px] text-sm duration-150 placeholder:text-[rgb(105,105,105)]"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-charcoalGray">Country*</label>
            <Comobox
              value={country}
              setValue={setCountry}
              list={allCountries}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-charcoalGray">Skill Level*</label>
            <SkillLevel value={skillLevel} setValue={setSkillLevel} />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="message" className="text-charcoalGray">
              Message*
            </label>
            <Textarea
              required
              id="message"
              className="bg-whiteSmoke rounded-[8px] text-sm duration-150 placeholder:text-[rgb(105,105,105)]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[rgb(51,51,51)] h-[50px] flex items-center hover:bg-[rgb(51,51,51)]/90 text-white text-base font-medium rounded-[6px]"
          >
            Submit
          </Button>
        </div>
      </form>
    </section>
  );
};

export default RegistrationForm;
