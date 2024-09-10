"use client";

import PeopleStack from "../ui/people-stack";
import DownloadOutlineModal from "./download-outline-modal";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { paymentPlans } from "@/resources/payment-plans";

import { Check } from "lucide-react";

const PaymentPlan = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Outline Modal */}
      <DownloadOutlineModal
        open={modalOpen}
        close={() => setModalOpen(false)}
      />
      <section
        id="payment-plan"
        className="w-full relative bg-white pt-24 pb-24"
      >
        <div className="w-[94%] z-30 max-w-[800px] bg-white mx-auto ">
          <div className="w-full flex justify-center mb-3">
            <PeopleStack />
          </div>
          <h2 className="text-charcoalGray font-bold text-2xl mb-3 laptop:text-4xl leading-[1.2em] text-center">
            Your Journey To Mastery Starts Here
          </h2>
          <p className="text-center text-charcoalGray text-xl mb-12 laptop:text-3xl leading-[1.2em] font-semibold">
            Choose Your Payment Plan{" "}
          </p>
          <div className="flex flex-wrap w-full gap-5 items-center justify-center">
            {paymentPlans.map((item) => {
              return (
                <div
                  key={item.name}
                  className="plan-box h-max miniMobile:w-[calc(50%-10px)] w-full bg-white rounded-[20px] p-[30px]"
                >
                  <p className="text-sm font-semibold mb-5 leading-[1.5em] text-davyGray">
                    {item.name}
                  </p>
                  <div className="w-max flex gap-2.5 mb-3">
                    <p className="text-xs font-semibold text-lightGray relative discount-text">
                      {item.mainPrice}{" "}
                    </p>
                    <p className="text-xs font-semibold text-lightGray">
                      {item.discountPercent}{" "}
                    </p>
                  </div>
                  <div className="flex gap-2 items-end border-b border-black/5 pb-2 mb-2">
                    <h2 className="font-bold text-charcoalGray text-3xl">
                      <strong> {item.discountPrice}</strong>
                    </h2>
                    <h3 className="font-bold text-charcoalGray text-lg">
                      <strong> Full Payment</strong>
                    </h3>
                  </div>

                  <div className="flex gap-2 items-center">
                    <p className="text-sm font-semibold text-davyGray">
                      $1000 now
                    </p>
                    <p className="text-base font-semibold text-davyGray">&</p>
                    <p className="text-sm font-semibold text-davyGray">
                      $500 later
                    </p>
                  </div>

                  <p className="cohort-almost-full mt-3 text-sm text-auxRed font-semibold mb-5">
                    The Cohort is almost full{" "}
                  </p>
                  <button
                    onClick={() =>
                      router.push(
                        "https://events.analogueshifts.app/show/DevOps_Training"
                      )
                    }
                    className="w-full bg-dimGray h-10 flex justify-center items-center duration-300 hover:bg-dimGray/90 text-white text-base mb-7 font-medium rounded-[6px]"
                  >
                    Buy Now
                  </button>
                  <div className="w-full flex flex-col gap-3">
                    {item.benefits.map((benefit) => {
                      return (
                        <div
                          key={benefit.title}
                          className="w-full flex items-center justify-between"
                        >
                          <div className="w-5 h-5 max-w-5 max-h-5 bg-lightYellow rounded-full flex justify-center items-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <div className="w-[calc(100%-35px)]">
                            <p className="text-sm font-semibold leading-[1.5em] text-davyGray">
                              <strong>{benefit.title}:</strong>&nbsp;
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-sm font-semibold leading-[1.5em] text-davyGray">
                      <strong>Other Benefits </strong>
                    </p>
                    {item.otherBenefits.map((benefit) => {
                      return (
                        <div
                          key={benefit}
                          className="w-full flex items-center justify-between"
                        >
                          <div className="w-5 h-5 max-w-5 max-h-5 bg-dimGray rounded-full flex justify-center items-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <div className="w-[calc(100%-35px)]">
                            <p className="text-sm font-semibold leading-[1.5em] text-davyGray">
                              <strong>{benefit}</strong>&nbsp;
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full bg-dimGray h-10 flex justify-center items-center duration-300 hover:bg-dimGray/90 text-white text-base mt-7 font-medium rounded-[6px]"
                  >
                    Download Course Outline
                  </button>
                </div>
              );
            })}
            {/* <div className="miniMobile:w-[calc(50%-10px)] w-full  h-max plan-box bg-white rounded-[20px] p-[30px]">
           <p className="text-sm font-semibold mb-5 leading-[1.5em] text-davyGray">
             Invitational to induction Week
           </p>

           <div className="flex gap-2 items-end">
             <h2 className="font-bold text-charcoalGray text-3xl">
               <strong> $200</strong>
             </h2>
           </div>
           <p className="cohort-almost-full-green mt-3 text-sm text-green-600 font-semibold mb-8">
             Join The first week of training and see if the program is a right
             fit for you
           </p>

           <div className="w-full flex flex-col gap-3">
             <p className="text-sm font-semibold leading-[1.5em] text-davyGray">
               <strong>Benefits </strong>
             </p>
             {["Community", "Training Flexibility "].map((benefit) => {
               return (
                 <div
                   key={benefit}
                   className="w-full flex items-center justify-between"
                 >
                   <div className="w-5 h-5 max-w-5 max-h-5 bg-dimGray rounded-full flex justify-center items-center">
                     <Check className="w-3 h-3 text-white" />
                   </div>
                   <div className="w-[calc(100%-35px)]">
                     <p className="text-sm font-semibold leading-[1.5em] text-davyGray">
                       <strong>{benefit}</strong>&nbsp;
                     </p>
                   </div>
                 </div>
               );
             })}
           </div>
           <button
             onClick={() => router.push("/register")}
             className="w-max px-4 bg-[#f2f2f2] h-10 flex justify-center items-center duration-300 hover:bg-[#f2f2f2]/90 text-[rgb(17,17,17)] text-sm mt-8 font-medium rounded-[6px]"
           >
             Buy Now
           </button>
         </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentPlan;
