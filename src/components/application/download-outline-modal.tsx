"use client";

import Image from "next/image";
import Thumbnail from "@/assets/images/outline-thumbnail.jpg";

import { AnimatePresence, motion } from "framer-motion";

import { X } from "lucide-react";

interface Params {
  open: boolean;
  close: () => void;
}

export default function DownloadOutlineModal({ open, close }: Params) {
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
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
            className="bg-white pb-6 w-[500px] max-w-full h-full 500:h-[550px] max-h-full rounded-none 500:rounded-2xl flex flex-col relative overflow-y-auto"
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
                className="w-full h-12 outline-none text-sm font-normal mb-3.5 text-boulder700 placeholder:text-boulder300 px-3 rounded-md border"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full h-12 outline-none text-sm font-normal mb-3.5 text-boulder700 placeholder:text-boulder300 px-3 rounded-md border"
              />
              <button
                type="submit"
                className="w-full h-12 font-medium text-white text-sm flex justify-center items-center rounded-md outline-none bg-dimGray hover:bg-dimGray/80"
              >
                Download
              </button>
            </form>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
