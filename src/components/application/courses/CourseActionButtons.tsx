"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
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
