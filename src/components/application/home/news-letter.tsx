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
      className="w-full relative z-20 bg-no-repeat bg-cover bg-center overflow-hidden bg-background-darkYellow py-12 lg:py-16 px-6 flex justify-center"
    >
      <div className="max-w-[1400px] w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">
        
        {/* Left Side: Text */}
        <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-primary-tan mb-3 leading-tight tracking-tight">
            Access New Opportunities with <br className="hidden xl:block" />
            <span className="text-white drop-shadow-sm">Our Latest Updates!</span>
          </h2>
          <p className="max-w-[550px] text-base font-medium text-primary-tan/80 leading-relaxed">
            Discover new courses, special discounts, and inspiring success stories this month. Explore now and take your skills to the next level!
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-[45%] max-w-[500px] flex flex-col items-center lg:items-end mt-4 lg:mt-0">
          <form
            onSubmit={handleSubmit}
            className="relative flex w-full"
          >
            <input
              type="email"
              required
              placeholder="Your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-transparent focus:border-white focus:ring-4 focus:ring-white/30 rounded-full h-14 lg:h-16 pl-6 pr-[140px] sm:pr-[160px] outline-none text-base font-semibold text-primary-tan placeholder:text-gray-400 shadow-lg transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 sm:px-8 flex justify-center items-center bg-primary-tan hover:bg-gray-900 rounded-full text-sm sm:text-base font-bold text-white transition-all shadow-sm hover:shadow-md"
            >
              Subscribe
            </button>
          </form>
          {message && (
            <p className="mt-4 text-primary-tan font-bold bg-white/20 px-6 py-2 rounded-xl backdrop-blur-md w-full text-center lg:text-left">
              {message}
            </p>
          )}
        </div>

      </div>
    </section>
  );
}
