"use client";

import { useEffect } from "react";

export default function ScrollRestoration() {
  useEffect(() => {
    // Check if there is a pending scroll target from the Smart Back Button
    const target = sessionStorage.getItem("scrollTarget");
    if (target) {
      // Delay slightly to ensure all DOM elements are painted
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          // Clear it so it doesn't fire again on normal reloads
          sessionStorage.removeItem("scrollTarget");
        }
      }, 150);
    }
  }, []);

  return null;
}
