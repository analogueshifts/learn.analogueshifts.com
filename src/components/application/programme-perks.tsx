import { programmeContent } from "@/resources/programme-content";
import TextUnderline from "../ui/text-underline";

const ProgrammePerks = () => {
  return (
    <section className="bg-snow py-24">
      <div className="mobile:w-[75%] w-[85%] mobile:max-w-[850px] mx-auto flex flex-col gap-5 mb-10">
        <h2 className="text-charcoalGray font-semibold text-2xl laptop:text-4xl leading-[1.2em]">
          LETS TAKE A LOOK INSIDE THE PROGRAMME, SHALL WE ?
        </h2>
        <TextUnderline />
        <p className="font-semibold text-xl text-lightGray">
          Engaging in this Program Unlocks:
        </p>
      </div>
      <div className="mobile:w-[85%] w-[75%] mb-10 mobile:max-w-desktop mx-auto flex mobile:flex-row flex-col justify-between gap-y-5 h-max tablet:h-[290px] mobile:h-[350px]">
        <div className="h-full p-[30px] bg-white perk-box w-full mobile:w-[calc(50%-10px)] flex flex-col">
          <h3 className="text-darkCharcoal text-xl font-bold leading-[1.4em] mb-5">
            1. Interview Preparation and Resume Optimization:{" "}
          </h3>
          <p className="text-davyGray font-medium text-start text-base leading-[1.6em]">
            Get ready to ace DevOps interviews with our comprehensive
            preparation sessions, covering common questions and scenarios.
            Meanwhile, our experts will optimize your resume to showcase your
            DevOps skills effectively, ensuring you stand out to potential
            employers.
          </p>
        </div>
        <div className="h-full p-[30px] bg-white perk-box w-full mobile:w-[calc(50%-10px)] flex flex-col">
          <h3 className="text-darkCharcoal text-xl font-bold leading-[1.4em] mb-5">
            2. Job Opportunity Updates:{" "}
          </h3>
          <p className="text-davyGray font-medium text-start text-base leading-[1.6em]">
            Remain at the forefront of opportunities with our timely job
            notifications, delivering updates on potential openings within the
            DevOps realm. Seize every chance for career advancement – stay
            informed and primed to progress in your professional journey.
          </p>
        </div>
      </div>
      <div className="mobile:w-[75%] w-[85%] mobile:max-w-[850px] mx-auto flex flex-col">
        <div className="w-full flex flex-col gap-5 mb-10">
          <p className="font-semibold text-xl text-lightGray">
            Our collaborative team, alongside DevOps experts, has diligently
            designed this curriculum to ensure your readiness for employment
            upon program completion.
          </p>
          <TextUnderline />
        </div>
        <div className="w-full flex flex-col gap-12">
          {programmeContent.map((item) => {
            return (
              <div className="w-full flex flex-col" key={crypto.randomUUID()}>
                <div className="w-full flex flex-col gap-3 mb-5">
                  <h2 className="text-dimLight font-medium text-xl laptop:text-[28px] leading-[1.2em]">
                    {item.title}
                  </h2>
                  <TextUnderline />
                </div>
                <div className="w-full flex flex-col gap-3">
                  {item.contents.map((content) => {
                    return (
                      <div
                        key={content}
                        className="w-full py-1.5 border-b-[3px] border-[#222222]"
                      >
                        <p className="font-medium text-lg laptop:text-xl text-lightGray">
                          {content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="w-full flex flex-col gap-5">
            <p className="font-bold text-lg laptop:text-xl text-lightGray">
              Final Project
            </p>
            <p className="font-medium text-lg laptop:text-xl text-lightGray">
              Throughout the 6 months, participants will work on a cumulative
              project where they&apos;ll apply the concepts and tools learned.
              This project could involve automating infrastructure deployment,
              setting up CI/CD pipelines for a sample application,
              containerizing applications, and managing them with Kubernetes,
              all while adhering to SRE practices for reliability and
              scalability
            </p>
            <TextUnderline />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgrammePerks;
