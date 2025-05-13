"use client";
import { useState } from "react";
import Image from "next/image";

import Eye from "@/assets/images/eye.svg";
import EyeSlash from "@/assets/images/eye-slash.svg";

interface FormInputProps {
  label: string;
  value: string;
  type: string;
  placeholder: string;
  image: any;
  onChange: (event: any) => void;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  image,
  value,
  type,
  placeholder,
  onChange,
  required,
}) => {
  const [passwordType, setPasswordType] = useState("password");
  const [focus, setFocus] = useState(false);

  const togglePasswordType = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <div className="w-full flex flex-col gap-3 large:gap-4">
      <p className="large:text-base text-sm font-normal text-[#262626]">
        {label} {required && <span className="text-[#FF0000]">*</span>}
      </p>
      <div
        className={`w-full relative flex items-center h-14 large:h-16 rounded-2xl border gap-2.5 px-6 py-2.5 ${`  ${
          focus ? "border-[#FFBB0A]" : "border-primary-boulder200"
        }`}`}
      >
        <Image src={image} alt="" className="large:w-6 h-max w-5" />
        <input
          className={`password-input text-sm large:text-base font-normal text-[#262626] placeholder:text-[#B0B0B0] w-full bg-transparent border-none outline-none `}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={value}
          type={type === "password" ? passwordType : type}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
        {type === "password" && (
          <button
            onClick={togglePasswordType}
            type="button"
            className="w-max h-max  flex justify-center text-gray-400"
          >
            <Image
              className="large:w-6 h-max w-5"
              src={passwordType === "text" ? EyeSlash : Eye}
              alt=""
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput;
