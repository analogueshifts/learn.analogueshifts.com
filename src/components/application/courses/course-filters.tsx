"use client";

import { useQueryState } from "nuqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const FILTER_OPTIONS = {
  categories: ["Web Development", "DevOps", "Data Science", "Machine Learning", "Design"],
  levels: ["Beginner", "Intermediate", "Advanced", "All Levels"],
  prices: ["Free", "Paid"],
  languages: ["English", "Spanish", "French"]
};

export default function CourseFilters() {
  const [category, setCategory] = useQueryState("category");
  const [level, setLevel] = useQueryState("level");
  const [price, setPrice] = useQueryState("price");
  const [language, setLanguage] = useQueryState("language");

  const handleFilter = (
    currentValue: string | null, 
    setValue: (val: string | null) => void, 
    option: string, 
    checked: boolean
  ) => {
    let newValues = currentValue ? currentValue.split(",") : [];
    if (checked) {
      newValues.push(option);
    } else {
      newValues = newValues.filter((v) => v !== option);
    }
    setValue(newValues.length > 0 ? newValues.join(",") : null);
  };

  const isChecked = (currentValue: string | null, option: string) => {
    if (!currentValue) return false;
    return currentValue.split(",").includes(option);
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl border border-gray-100 sticky top-28">
      <h3 className="font-bold text-lg text-primary-tan mb-6">Filters</h3>
      
      <Accordion type="multiple" defaultValue={["category", "level", "price", "language"]} className="w-full">
        <AccordionItem value="category" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-3 text-primary-tan font-semibold">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {FILTER_OPTIONS.categories.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${cat}`} 
                    checked={isChecked(category, cat)}
                    onCheckedChange={(checked) => handleFilter(category, setCategory, cat, checked as boolean)}
                  />
                  <Label htmlFor={`cat-${cat}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {cat}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="level" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-3 text-primary-tan font-semibold">Skill Level</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {FILTER_OPTIONS.levels.map((lvl) => (
                <div key={lvl} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`lvl-${lvl}`} 
                    checked={isChecked(level, lvl)}
                    onCheckedChange={(checked) => handleFilter(level, setLevel, lvl, checked as boolean)}
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
              {FILTER_OPTIONS.prices.map((p) => (
                <div key={p} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`price-${p}`} 
                    checked={isChecked(price, p)}
                    onCheckedChange={(checked) => handleFilter(price, setPrice, p, checked as boolean)}
                  />
                  <Label htmlFor={`price-${p}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {p}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="language" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-3 text-primary-tan font-semibold">Language</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {FILTER_OPTIONS.languages.map((lang) => (
                <div key={lang} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`lang-${lang}`} 
                    checked={isChecked(language, lang)}
                    onCheckedChange={(checked) => handleFilter(language, setLanguage, lang, checked as boolean)}
                  />
                  <Label htmlFor={`lang-${lang}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {lang}
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
