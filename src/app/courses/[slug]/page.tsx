import GuestLayout from "@/components/application/layouts/guest";
import courses from "@/resources/courses.json";
import Landing from "./components/landing";
import Aside from "./components/aside";
import Contents from "./components/contents";
import CourseCard from "@/components/application/course-card";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  const otherCourses = courses.filter((c) => c.slug !== slug);

  return (
    <GuestLayout>
      <Suspense>
        <section className="w-full flex flex-col items-center large:pt-[76px] pb-[18px] pt-12">
          <div className="w-full max-w-[1800px] large:px-[112px] px-[72px]  tablet:px-6">
            <div className=" mb-12 tablet:mb-8 ">
              <Landing slug={slug} />
              <div className="large:mt-[124px] tablet:mt-16 mt-[94px] w-full tablet:flex-col flex items-start gap-[51px]">
                <Contents slug={slug} />
                <Aside
                  slug={course?.slug as string}
                  duration={course?.duration as string}
                  enrolledStudents={course?.enrolledStudents as string}
                  price={course?.price as string}
                  skillLevel={course?.skillLevel as string}
                />
              </div>
            </div>
            <div className="w-full flex flex-col tablet:gap-6 gap-12">
              <h1 className="large:text-[32px] tablet:text-xl text-2xl tablet:leading-8 leading-[45px] font-semibold large:leading-[64px] text-black">
                Other Available Courses
              </h1>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[43px] large:gap-y-16 gap-y-14">
                {otherCourses.map((c, index) => {
                  return (
                    <CourseCard
                      key={index}
                      slug={c.slug}
                      company={c.company}
                      description={c.description}
                      duration={c.duration}
                      name={c.name}
                      price={c.price}
                      thumbnail={c.thumbnail}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </Suspense>
    </GuestLayout>
  );
}
