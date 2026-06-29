"use client";

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const PRICES = ["Free", "Paid"];

interface Category {
  id: string;
  name: string;
}

interface CourseFiltersProps {
  categoryFilter: string[];
  setCategoryFilter: (val: string[]) => void;
  levelFilter: string[];
  setLevelFilter: (val: string[]) => void;
  priceFilter: string[];
  setPriceFilter: (val: string[]) => void;
}

export default function CourseFilters({
  categoryFilter, setCategoryFilter,
  levelFilter, setLevelFilter,
  priceFilter, setPriceFilter,
}: CourseFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) setCategories(body.data);
      });
  }, []);

  const handleFilter = (
    currentValues: string[],
    setValue: (val: string[]) => void,
    option: string,
    checked: boolean
  ) => {
    let newValues = [...currentValues];
    if (checked) {
      newValues.push(option);
    } else {
      newValues = newValues.filter((v) => v !== option);
    }
    setValue(newValues);
  };

  const isChecked = (currentValues: string[], option: string) => {
    return currentValues.includes(option);
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl border border-gray-100 sticky top-28">
      <h3 className="font-bold text-lg text-primary-tan mb-6">Filters</h3>

      <Accordion type="multiple" defaultValue={["category", "level", "price"]} className="w-full">
        <AccordionItem value="category" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-3 text-primary-tan font-semibold">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {categories.length === 0 ? (
                <p className="text-sm text-gray-400">No categories yet.</p>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${cat.id}`}
                      checked={isChecked(categoryFilter, cat.name)}
                      onCheckedChange={(checked) => handleFilter(categoryFilter, setCategoryFilter, cat.name, checked as boolean)}
                    />
                    <Label htmlFor={`cat-${cat.id}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {cat.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="level" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-3 text-primary-tan font-semibold">Skill Level</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {LEVELS.map((lvl) => (
                <div key={lvl} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lvl-${lvl}`}
                    checked={isChecked(levelFilter, lvl)}
                    onCheckedChange={(checked) => handleFilter(levelFilter, setLevelFilter, lvl, checked as boolean)}
                  />
                  <Label htmlFor={`lvl-${lvl}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {lvl}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-3 text-primary-tan font-semibold">Price</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {PRICES.map((p) => (
                <div key={p} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-${p}`}
                    checked={isChecked(priceFilter, p)}
                    onCheckedChange={(checked) => handleFilter(priceFilter, setPriceFilter, p, checked as boolean)}
                  />
                  <Label htmlFor={`price-${p}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {p}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
