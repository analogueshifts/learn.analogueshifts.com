"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CourseActionButtonsProps {
  course: {
    slug: string;
    name: string;
    price: string;
    thumbnail?: string;
  };
  variant?: "floating" | "bottom";
}

export default function CourseActionButtons({ course, variant = "floating" }: CourseActionButtonsProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    addItem({
      id: course.slug,
      name: course.name,
      price: parseFloat(course.price.replace(/[^0-9.]/g, '')),
      image: course.thumbnail || "/courses/placeholder.jpg"
    });
    toast.success("Course added to cart!");
  };

  const handleBuyNow = () => {
    addItem({
      id: course.slug,
      name: course.name,
      price: parseFloat(course.price.replace(/[^0-9.]/g, '')),
      image: course.thumbnail || "/courses/placeholder.jpg"
    });
    router.push("/checkout");
  };

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
