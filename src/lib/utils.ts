import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scrollToExploreCoursesSection() {
  const element = document.getElementById("explore-courses");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}
