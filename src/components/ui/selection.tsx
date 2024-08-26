import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import { CheckIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { PopoverClose } from "@radix-ui/react-popover";

interface SelectionInterface {
  placeholder?: string;
  options: { label: string; value: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
  allowClear?: boolean;
  onSearch?: (value?: string | null) => void;
  className?: string;
}

const Selection: React.FC<SelectionInterface> = ({
  options,
  placeholder = "Select an option",
  value,
  onChange,
  allowClear = false,
  onSearch,
  className,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {
          <Button
            variant="outline"
            role="combobox"
            className={cn("justify-between w-full font-normal", className)}
          >
            {value
              ? options.find((o) => o.value === value)?.label
              : placeholder}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        }
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            onInput={(e) => {
              if (onSearch) onSearch(e.currentTarget.value);
            }}
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  disabled={false}
                  onSelect={() => {
                    onChange(option.value);
                  }}
                >
                  <PopoverClose className="w-full text-left">
                    {option.label}
                  </PopoverClose>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      option.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator className={cn(allowClear ? "" : "hidden")} />
          <CommandGroup className={cn(allowClear ? "" : "hidden")}>
            <CommandItem
              className="justify-center"
              onSelect={() => {
                onChange(null);
              }}
            >
              <PopoverClose className="w-full h-full text-center">
                Clear
              </PopoverClose>
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Selection;
