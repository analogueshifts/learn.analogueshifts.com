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
  const [coursesTaken, setCoursesTaken] = useState("");
  const [listedCourses, setListedCourses] = useState("");
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [toolsUsed, setToolsUsed] = useState<string[]>([]);
  const [customTool, setCustomTool] = useState("");
  const course = courses.find((c) => c.slug === slug);

  const handleToolsChange = (tool: string) => {
    if (toolsUsed.includes(tool)) {
      setToolsUsed((prev) => prev.filter((t) => t !== tool));
    } else {
      setToolsUsed((prev) => [...prev, tool]);
    }
  };
  const existingData = localStorage.getItem("newRegistrationData");

  useEffect(() => {
    if (existingData) {
      const data = JSON.parse(existingData);
      if (data?.background) {
        setCoursesTaken(data.background.coursesTaken);
        setListedCourses(data.background.listedCourses);
        setRole(data.background.role);
        setCustomRole(data.background.customRole);
        setExperienceLevel(data.background.experienceLevel);
        setToolsUsed(data.background.toolsUsed);
        setCustomTool(data.background.customTool);
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
    const newForm = {
      coursesTaken,
      listedCourses,
      role,
      customRole,
      experienceLevel,
      toolsUsed,
      customTool,
    };
    const data = JSON.parse(existingData);
    localStorage.setItem(
      "newRegistrationData",
      JSON.stringify({ ...data, background: newForm })
    );

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
            className="w-max flex cursor-pointer gap-3 items-center"
          >
            <Image src={ChevronRightImage} alt="" />
            <p className="text-[#767676] text-sm large:text-base font-semibold">
              Back
            </p>
          </div>
          <Image className="tablet:hidden" src={ChevronRightImage} alt="" />
          <p className="text-background-darkYellow tablet:hidden font-semibold large:text-base text-sm">
            Background & Experience
          </p>
        </div>
        <p className="text-[#767676] text-sm large:text-base font-semibold">
          2/<span className="text-background-darkYellow">3</span>
        </p>
      </div>
      <div className="flex flex-col pl-2.5">
        <h3
          className={`section-tittle overflow-hidden large:mb-4 mb-2 large:text-[32px] tablet:text-xl text-2xl tablet:leading-8 leading-[45px] font-semibold large:leading-[64px] text-black`}
        >
          Background & Experience
        </h3>
        <p
          className={`text-primary-boulder400 mb-[30px] large:text-xl text-base leading-9 large:leading-[48px] font-normal `}
        >
          Let’s get to know about your background & experience better!
        </p>
        <form
          onSubmit={handleFormSubmit}
          className="w-full flex flex-col gap-8"
        >
          <div className="w-full flex items-start gap-1.5">
            <p className="large:text-xl text-lg font-normal text-black">1.</p>
            <div className="flex flex-col">
              <p className="large:text-xl mb-8 text-lg font-normal text-black">
                Have you taken any courses related to{" "}
                <span className="font-semibold">
                  “{course?.courseName || "this course"}”
                </span>
                ?
              </p>
              <div className="flex flex-col gap-7">
                <RadioGroup
                  onValueChange={(v) => setCoursesTaken(v)}
                  value={coursesTaken}
                  className="gap-5"
                >
                  {["Yes", "No"].map((option) => (
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
                {coursesTaken === "Yes" && (
                  <input
                    type="text"
                    placeholder="If yes, please list them"
                    className="w-[286px] tablet:w-full tablet:ml-0 ml-10 large:ml-[47px] py-5 outline-none text-base large:text-xl px-6 placeholder:text-[#B0B0B0] rounded-2xl border border-[#E7E7E7]"
                    value={listedCourses}
                    onChange={(e) => setListedCourses(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex items-start gap-1.5">
            <p className="large:text-xl text-lg font-normal text-black">2.</p>
            <div className="flex flex-col">
              <p className="large:text-xl mb-8 text-lg font-normal text-black">
                What is your current role or background?
              </p>
              <div className="flex flex-col gap-7">
                <RadioGroup
                  onValueChange={(v) => setRole(v)}
                  value={role}
                  className="gap-5"
                >
                  {[
                    "Student",
                    "Data Analyst",
                    "Software Engineer",
                    "ML Engineer",
                    "Career Switcher",
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
                {role === "Other" && (
                  <input
                    type="text"
                    placeholder="Other (please specify)"
                    className="w-[286px] tablet:w-full tablet:ml-0 ml-10 large:ml-[47px] py-5 outline-none text-base large:text-xl px-6 placeholder:text-[#B0B0B0] rounded-2xl border border-[#E7E7E7]"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex items-start gap-1.5 large:mb-[42px] mb-8">
            <p className="large:text-xl text-lg font-normal text-black">3.</p>
            <div className="flex flex-col">
              <p className="large:text-xl mb-8 text-lg font-normal text-black">
                What is your current experience level with machine{" "}
                {course?.courseName} tools?
              </p>
              <div className="flex flex-col gap-7">
                <RadioGroup
                  onValueChange={(v) => setExperienceLevel(v)}
                  value={experienceLevel}
                  className="gap-2.5 tablet:grid-cols-1 grid-cols-3"
                >
                  {["Beginner", "Intermediate", "Advanced"].map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-4 large:gap-[23px]"
                    >
                      <RadioGroupItem key={option} value={option} id={option} />
                      <label
                        htmlFor={option}
                        className="font-normal text-[#7B7B7B] large:text-xl text-lg"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="large:text-xl text-lg font-normal text-black">
                  Tools you’ve used (check all that apply):
                </p>
                <div className="flex flex-col gap-5">
                  {[
                    "Docker",
                    "Git",
                    "Python",
                    "TensorFlow / PyTorch",
                    "Kubernetes",
                    "MLflow",
                  ].map((tool) => (
                    <div
                      key={tool}
                      className="flex items-center gap-4 large:gap-[23px]"
                    >
                      <Checkbox
                        checked={toolsUsed.includes(tool) ? true : false}
                        onCheckedChange={() => {
                          handleToolsChange(tool);
                        }}
                        id={tool}
                      />
                      <label
                        htmlFor={tool}
                        className="font-normal text-[#7B7B7B] large:text-xl text-lg"
                      >
                        {tool}
                      </label>
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Other (please specify)"
                  className="w-[286px] tablet:w-full tablet:ml-0 ml-10 large:ml-[47px] py-5 outline-none text-base large:text-xl px-6 placeholder:text-[#B0B0B0] rounded-2xl border border-[#E7E7E7]"
                  value={customTool}
                  onChange={(e) => setCustomTool(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className={`py-2.5 h-12 large:h-14 w-[222px] bg-background-darkYellow rounded-2xl text-sm large:text-base text-primary-boulder50 font-semibold `}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
