import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

const SUBJECTS = [
  "Mathematics",
  "Algebra",
  "Geometry",
  "Calculus",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Literature",
  "Grammar",
  "Essay Writing",
  "History",
  "World History",
  "U.S. History",
  "Geography",
  "Computer Science",
  "Programming",
  "Spanish",
  "French",
  "German",
  "Music",
  "Art",
  "Physical Education",
  "Economics",
  "Business",
  "Psychology",
  "Sociology"
];

interface MultiSelectSubjectsProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiSelectSubjects({ selected, onChange }: MultiSelectSubjectsProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (subject: string) => {
    onChange(selected.filter((s) => s !== subject));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          onChange(selected.slice(0, -1));
        }
      }
      // This is not a default behavior of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  const selectables = SUBJECTS.filter((subject) => !selected.includes(subject));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-white">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((subject) => (
            <Badge key={subject} variant="secondary" className="mb-1">
              {subject}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(subject);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(subject)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select subjects..."
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-[200px]">
              {selectables.map((subject) => (
                <CommandItem
                  key={subject}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={() => {
                    setInputValue("");
                    onChange([...selected, subject]);
                  }}
                  className="cursor-pointer"
                >
                  {subject}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}