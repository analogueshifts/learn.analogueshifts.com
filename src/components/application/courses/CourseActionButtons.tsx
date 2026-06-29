"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface CourseActionButtonsProps {
  course: {
    id: string;
    slug: string;
    name: string;
    price: string;
    thumbnail?: string;
  };
  variant?: "floating" | "bottom";
  isEnrolled?: boolean;
}

export default function CourseActionButtons({ course, variant = "floating", isEnrolled = false }: CourseActionButtonsProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const { data: session } = useSession();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const isFree = course.price === "Free" || course.price === "$0" || course.price === "$0.00";

  const cartItem = {
    id: course.id,
    name: course.name,
    price: parseFloat(course.price.replace(/[^0-9.]/g, '')) || 0,
    image: course.thumbnail || "/courses/placeholder.jpg",
  };

  const handleAddToCart = () => {
    addItem(cartItem);
    toast.success("Course added to cart!");
  };

  const handleBuyNow = () => {
    addItem(cartItem);
    router.push("/checkout");
  };

  const handleContinueLearning = () => {
    router.push(`/courses/${course.slug}/learn`);
  };

  const handleEnrollFree = async () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/courses/${course.slug}`);
      return;
    }
    setIsEnrolling(true);
    const response = await fetch("/api/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id }),
    });
    const body = await response.json();
    setIsEnrolling(false);

    if (!body.success) {
      toast.error(body.error ?? "Failed to enroll");
      return;
    }

    toast.success("Enrolled! Let's get started.");
    router.push(`/courses/${course.slug}/learn`);
  };

  if (isEnrolled) {
    const className =
      variant === "bottom"
        ? "h-14 px-8 text-lg font-bold bg-primary-tan hover:bg-gray-900 text-white rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
        : "w-full h-14 text-lg font-bold bg-background-darkYellow hover:bg-yellow-600 text-white rounded-xl mb-4";
    return (
      <Button onClick={handleContinueLearning} className={className}>
        Continue Learning
      </Button>
    );
  }

  if (isFree) {
    const className =
      variant === "bottom"
        ? "h-14 px-8 text-lg font-bold bg-primary-tan hover:bg-gray-900 text-white rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
        : "w-full h-14 text-lg font-bold bg-background-darkYellow hover:bg-yellow-600 text-white rounded-xl mb-4";
    return (
      <Button onClick={handleEnrollFree} disabled={isEnrolling} className={className}>
        {isEnrolling ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enrolling...</> : "Start Learning for Free"}
      </Button>
    );
  }

  if (variant === "bottom") {
    return (
      <Button onClick={handleBuyNow} className="h-14 px-8 text-lg font-bold bg-primary-tan hover:bg-gray-900 text-white rounded-xl shadow-xl hover:scale-105 transition-transform duration-300">
        Enroll in {course.name} Now
      </Button>
    );
  }

  return (
    <>
      <Button onClick={handleBuyNow} className="w-full h-14 text-lg font-bold bg-background-darkYellow hover:bg-yellow-600 text-white rounded-xl mb-3">
        Buy Now
      </Button>
      <Button onClick={handleAddToCart} variant="outline" className="w-full h-14 text-lg font-bold border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl mb-4">
        <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
      </Button>
    </>
  );
}
