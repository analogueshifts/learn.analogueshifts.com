"use client";
import Filter from "./filter";
import courses from "@/resources/courses.json";
import CourseCard from "../course-card";

export default function ExploreCourses() {
  return (
    <section id="explore-courses" className="w-full flex justify-center">
      <div className="w-full items-start bg-white max-w-[1800px] large:px-[114px] px-[74px]  tablet:px-6 large:pt-[168px] pt-[70px] lg:pt-[118px] h-max flex large:gap-[109px] gap-[69px]">
        <Filter />
        <div className="w-full flex flex-col items-center">
          <h3
            className={`section-tittle overflow-hidden large:text-[32px] tablet:text-xl text-2xl tablet:leading-8 text-center leading-[45px] mb-3 large:mb-5 font-semibold large:leading-[64px] text-black`}
          >
            Explore
            <span className="text-background-darkYellow">Courses</span>
          </h3>
          <p
            className={`text-primary-boulder400 large:mb-[43px] mb-[30px]  large:text-xl text-center text-base leading-9 large:leading-[48px] font-normal `}
          >
            Expand your skills with expert-led courses in various fields
          </p>
          <div className="w-full large:mb-[72px] mb-[52px] sm:flex-row flex-col flex items-center h-max sm:h-14 gap-3">
            <input
              className="w-full h-14 sm:h-full outline-none rounded-2xl border border-primary-boulder200 px-6 tablet:text-sm text-sm large:text-base font-normal text-primary-boulder700 placeholder:text-primary-boulder200"
              placeholder="Search for course by qualification, industry e.t.c."
            />
            <button className="rounded-2xl min-w-full sm:min-w-[150px] h-14 sm:h-full bg-background-darkYellow flex justify-center items-center text-primary-boulder50 tablet:text-sm text-sm large:text-base font-semibold">
              Search
            </button>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-[43px] large:gap-y-16 gap-y-14">
            {courses.map((course, index) => {
              return (
                <CourseCard
                  key={index}
                  slug={course.slug}
                  company={course.company}
                  description={course.description}
                  duration={course.duration}
                  name={course.name}
                  price={course.price}
                  thumbnail={course.thumbnail}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
