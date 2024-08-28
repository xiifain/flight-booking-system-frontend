"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  className: React.HTMLAttributes<HTMLButtonElement>["className"];
  children: React.ReactNode;
  handleSelected?: (date?: Date | undefined) => void;
};

export function DatePicker({ className, children, handleSelected }: Props) {
  const [date, setDate] = React.useState<Date>();

  const onSelectedDate = (date?: Date | undefined) => {
    setDate(date);
    if (handleSelected) {
      handleSelected(date);
    }
  };

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            `justify-start text-left font-normal ${className}`,
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{children}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelectedDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
