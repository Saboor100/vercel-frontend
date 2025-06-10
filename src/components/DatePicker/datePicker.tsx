import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs, { Dayjs } from "dayjs";

const currentYear = dayjs();

const CustomDatePicker = ({ id, date, onSelect, label, placeholder = "Select Date" }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (date) {
      const parsedDate = dayjs(date.split(" - ")[0], "MMMM YYYY");
      setSelectedDate(parsedDate);
    }
  }, [date]);

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    onSelect(newDate ? newDate.toDate() : null);
    setPopoverOpen(false); // Close the popover
  };

  return (
    <div className="space-y-2">
 
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            onClick={() => setPopoverOpen(true)}
            className="w-full justify-start text-left font-normal text-muted-foreground text-[#E67912] hover:bg-[#E67912] hover:text-white"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? selectedDate.format("MMMM YYYY") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              value={selectedDate}
              onChange={handleDateChange}
              displayStaticWrapperAs="desktop"
              openTo="year"
              views={["year", "month"]}
              maxDate={currentYear}
            />
          </LocalizationProvider>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomDatePicker;
