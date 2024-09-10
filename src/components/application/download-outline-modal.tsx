"use client";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Thumbnail from "@/assets/images/outline-thumbnail.jpg";

import { AnimatePresence, motion } from "framer-motion";
import Spinner from "@/assets/images/spinner.svg";

import { X } from "lucide-react";
import { userDetails } from "@/resources/download-outline-details";

interface Params {
  open: boolean;
  close: () => void;
}

export default function DownloadOutlineModal({ open, close }: Params) {
  const [info, setInfo] = useState(userDetails);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    let answers: any[] = [];
    info?.forEach((item: any) => {
      answers.push({
        question_uuid: item.uuid,
        answer: JSON.stringify(item.answer),
      });
    });
    const config = {
      method: "POST",
      url:
        process.env.NEXT_PUBLIC_BACKEND_URL +
        "/tools/form/store/answers/9bc2e1cc-8b82-468e-8e7c-73002b64b0a1?email=" +
        info[1].answer,
      data: {
        email: info[1].answer,
        responses: answers,
      },
    };

    try {
      setLoading(true);
      await axios.request(config);
      setLoading(false);
      const pdfUrl =
        "/pdfs/DevOps-Program-Overview-Unlocking-Your-Career-Potential.pdf";
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download =
        "DevOps-Program-Overview-Unlocking-Your-Career-Potential.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      close();
    } catch (error) {
      setLoading(false);
      window.alert("Failed to download outline, please try again later.");
    }
  };

  const updateInfo = (uuid: string, newValue: string) => {
    setInfo((prev) =>
      prev.map((item: any) => {
        if (item.uuid !== uuid) {
          return item;
        } else {
          return { ...item, answer: newValue };
        }
      })
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-screen h-screen top-0 left-0 bg-[rgba(40,50,78,0.7)] fixed z-[3000] flex justify-center items-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white pb-6 w-[500px] max-w-full h-full 500:h-[590px] 500:max-h-[calc(100%-40px)] rounded-none 500:rounded-2xl flex flex-col relative scroll-hidden overflow-y-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={close}
              className="w-8 h-8 top-4 hover:text-boulder900 right-4 text-boulder400 flex justify-center items-center absolute bg-white rounded-full"
            >
              <X width={15} height={15} />
            </button>

            <Image
              src={Thumbnail}
              alt="Thumbnail"
              className="w-full h-max max-h-[60%] object-cover"
            />
            <form
              onSubmit={handleFormSubmit}
              className="w-full h-max pt-7 px-6 flex flex-col"
            >
              <h2 className="text-boulder900 tablet:text-2xl text-base pb-6 font-bold text-center">
                Download the Course Outline
              </h2>
              <input
                type="text"
                required
                placeholder="Full name"
                value={info[0].answer}
                onChange={(e) => updateInfo(info[0].uuid, e.target.value)}
                className="w-full h-12 outline-none text-sm font-normal mb-3.5 text-boulder700 placeholder:text-boulder300 px-3 rounded-md border"
              />
              <input
                type="email"
                required
                value={info[1].answer}
                onChange={(e) => updateInfo(info[1].uuid, e.target.value)}
                placeholder="Email address"
                className="w-full h-12 outline-none text-sm font-normal mb-3.5 text-boulder700 placeholder:text-boulder300 px-3 rounded-md border"
              />
              <input
                type="text"
                required
                value={info[2].answer}
                onChange={(e) => updateInfo(info[2].uuid, e.target.value)}
                placeholder="Phone number"
                className="w-full h-12 outline-none text-sm font-normal mb-3.5 text-boulder700 placeholder:text-boulder300 px-3 rounded-md border"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 font-medium text-white text-sm flex justify-center items-center rounded-md outline-none bg-dimGray hover:bg-dimGray/80"
              >
                <Image
                  src={Spinner}
                  className={`${loading ? "block" : "hidden"} w-8 h-8`}
                  alt=""
                />{" "}
                {!loading && "Download"}
              </button>
            </form>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
