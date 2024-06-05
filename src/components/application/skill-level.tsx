import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SkillLevel({
  value,
  setValue,
}: {
  value: string;
  setValue: any;
}) {
  return (
    <Select value={value} onValueChange={(e) => setValue(e)}>
      <SelectTrigger
        className={`w-full bg-whiteSmoke rounded-[8px] text-sm duration-150 ${
          value.length ? "" : "text-[rgb(105,105,105)]"
        }`}
      >
        <SelectValue placeholder="Skill Level" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Skill Levels</SelectLabel>
          <SelectItem value="beginner">Biginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="expert">Expert</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
