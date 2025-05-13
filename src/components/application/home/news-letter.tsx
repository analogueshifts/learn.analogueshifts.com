"use client";

import { FormEvent, useState } from "react";
import axios from "axios";

export default function NewsLetter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/contacts",
        {
          email: email,
          listIds: [3], // Replace with actual List ID from Brevo
          updateEnabled: true, // Prevents duplicate contacts
        },
        {
          headers: {
            "api-key": process.env.NEXT_PUBLIC_BREVO_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setMessage("Successfully subscribed!");
        setEmail(""); // Clear input field
      } else {
        setMessage("Subscription failed, please try again.");
      }
    } catch (error: any) {
      setMessage(
        "Error: " + (error.response?.data?.message || "Network issue")
      );
    }
  };

  return (
    <section
      style={{
        backgroundImage: "url(/lines-bg.png)",
      }}
      className="w-full z-20 sticky bg-no-repeat bg-cover overflow-hidden bg-background-darkYellow large:py-[160px] tablet:py-14 py-24 px-6 items-center flex flex-col"
    >
      <h2 className="large:text-[32px] tablet:text-xl text-2xl text-center font-semibold text-black">
        Access New Opportunities with{" "}
        <span className="text-white">Our Latest Updates!</span>
      </h2>
      <p className="max-w-[881px] tablet:max-w-full large:text-xl text-base leading-9 large:leading-48 font-normal text-[#907222] text-center mt-5 mb-10">
        Discover new courses, special discounts, and inspiring success stories
        this month. Explore now and take your skills to the next level!
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 max-w-full justify-center tablet:flex-wrap items-center"
      >
        <input
          type="email"
          required
          placeholder="Your Email Address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-white/30 bg-white/10 rounded-2xl h-14 px-6 outline-none max-w-full w-[351px] text-base font-normal text-white/60 placeholder:text-white/60"
        />
        <button
          type="submit"
          className="h-14 px-12 tablet:w-[351px] max-w-full flex justify-center items-center bg-primary-boulder950 rounded-2xl text-base text-primary-boulder50 font-semibold"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-3 text-white">{message}</p>}
    </section>
  );
}
