"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

const Comobox = ({
  list,
  setValue,
  value,
}: {
  list: string[];
  setValue: any;
  value: string;
}) => {
  return <ComboBoxResponsive value={value} setValue={setValue} list={list} />;
};

export default Comobox;

export function ComboBoxResponsive({
  list,
  setValue,
  value,
}: {
  list: string[];
  setValue: any;
  value: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`flex font-normal w-full hover:bg-whiteSmoke justify-between bg-whiteSmoke rounded-[8px] text-sm ${
            value.length ? "text-black" : "text-[rgb(105,105,105)]"
          }`}
        >
          <span>{value.length ? value : "Select Country"}</span>{" "}
          <ChevronDown width={15} color="rgba(105,105,105,0.6)" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[720px] max-w-[calc(100vw-60px)]">
        <div className="">
          <StatusList setValue={setValue} list={list} setOpen={setOpen} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function StatusList({
  setOpen,
  setValue,
  list,
}: {
  setOpen: (open: boolean) => void;
  list: string[];
  setValue: any;
}) {
  return (
    <Command className="">
      <CommandInput placeholder="Filter country..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {list.map((status) => (
            <CommandItem
              key={status}
              value={status}
              onSelect={(value) => {
                setValue(list.find((priority) => priority === value) || "");
                setOpen(false);
              }}
            >
              {status}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
