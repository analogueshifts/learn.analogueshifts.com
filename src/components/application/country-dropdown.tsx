"use client";
import { useState } from "react";
import Image from "next/image";
import LocationImage from "@/assets/images/location.svg";
import Eye from "@/assets/images/eye.svg";
import EyeSlash from "@/assets/images/eye-slash.svg";
import ChevronDownImage from "@/assets/images/chevron-down.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allCountries } from "@/resources/all-countries";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (event: any) => void;
  required?: boolean;
}

const SelectCountry: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  required,
}) => {
  return (
    <div className="w-full flex flex-col gap-3 large:gap-4">
      <p className="large:text-base text-sm font-normal text-[#262626]">
        {label}
      </p>
      <Select
        value={value}
        required={required}
        onValueChange={(v) => onChange(v)}
      >
        <SelectTrigger
          className={`w-full relative focus:outline-none focus:border-background-darkYellow flex items-center h-14 large:h-16 rounded-2xl border gap-2.5 px-6 py-2.5 ${
            value?.length > 0 ? "text-[#262626]" : "text-[#B0B0B0]"
          }`}
        >
          <div className="flex w-max gap-3 items-center">
            {" "}
            <Image src={LocationImage} alt="" className="large:w-6 h-max w-5" />
            <SelectValue
              className={`large:text-base text-sm font-normal `}
              placeholder={"Select country"}
            />
          </div>
          <Image
            className="large:w-6 h-max w-5"
            src={ChevronDownImage}
            alt=""
          />
        </SelectTrigger>
        <SelectContent>
          {allCountries.map((c, index) => {
            return (
              <SelectItem key={index} value={c}>
                {c}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectCountry;
