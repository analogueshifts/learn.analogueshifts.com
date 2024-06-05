import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { questionsAndAnswers } from "@/resources/questions-answers";

const FAQS = () => {
  return (
    <section className="bg-snow py-24">
      <div className="w-[94%] max-w-[960px] mx-auto flex flex-col gap-5">
        <h2 className="text-charcoalGray mb-3 text-center font-medium text-2xl laptop:text-4xl leading-[1.2em]">
          Answers to <br />
          Your Questions
        </h2>
        <div className="w-full h-max bg-white rounded-2xl overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {questionsAndAnswers.map((item) => {
              return (
                <AccordionItem
                  key={item.question}
                  value={item.question}
                  className="px-6"
                >
                  <AccordionTrigger className="py-6 text-xl text-start font-medium leading-[1.2em] text-dimGray">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-lg font-normal leading-[1.2em]  text-mediumDarkGray">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQS;
