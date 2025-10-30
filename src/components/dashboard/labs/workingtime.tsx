"use client";

import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const formSchema = z.object({
  operatingHours: z.record(
    z.object({
      isOpen: z.boolean().optional(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      is24Hours: z.boolean().optional(),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

const generateTimes = () => {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h % 12 || 12;
      const minute = m.toString().padStart(2, "0");
      const period = h < 12 ? "AM" : "PM";
      times.push(`${hour}:${minute} ${period}`);
    }
  }
  return times;
};

export default function TimePicker({
  onChange,
  initialData,
}: {
  onChange: (
    data: Record<
      string,
      { openHour: string; closeHour: string; open24Hours: boolean }
    >
  ) => void;

  initialData?: Record<
    string,
    { openHour?: string; closeHour?: string; open24Hours?: boolean }
  >;
}) {
  const parseInitialData = () => {
    const defaultValues: Record<string, {
      isOpen: boolean;
      is24Hours: boolean;
      openTime: string;
      closeTime: string;
    }> = {};
    weekdays.forEach((day) => {
      defaultValues[day] = {
        isOpen: false,
        is24Hours: false,
        openTime: "",
        closeTime: "",
      };
    });

    if (!initialData) return { operatingHours: defaultValues };

    weekdays.forEach((day) => {
      const dayData = initialData[day];
      if (!dayData) return;

      const { openHour, closeHour, open24Hours } = dayData;

      const isOpen = !!openHour || !!closeHour;

      defaultValues[day] = {
        isOpen,
        is24Hours: !!open24Hours,
        openTime: openHour || "",
        closeTime: closeHour || "",
      };
    });

    return { operatingHours: defaultValues };
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: parseInitialData(),
  });

  const times = generateTimes();
  const operatingHours = form.watch("operatingHours");

  const convertTo24HourFormat = useCallback((time: string): string => {
    if (!time) return "";
    const [timePart, modifier] = time.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);
    let adjustedHours = hours;

    if (modifier === "PM" && hours !== 12) adjustedHours += 12;
    if (modifier === "AM" && hours === 12) adjustedHours = 0;

    return `${String(adjustedHours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const formattedHours = weekdays.reduce((acc, day) => {
        const { isOpen, is24Hours, openTime, closeTime } =
          value.operatingHours?.[day] || {};
        acc[day] = {
          openHour: isOpen ? convertTo24HourFormat(openTime || "") : "",
          closeHour: isOpen ? convertTo24HourFormat(closeTime || "") : "",

          open24Hours: !!is24Hours,
        };
        return acc;
      }, {} as Record<string, { openHour: string; closeHour: string; open24Hours: boolean }>);

      onChange(formattedHours);
    });

    return () => subscription.unsubscribe();
  }, [form, onChange, convertTo24HourFormat]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Operating Hours</h3>
          <p className="text-xs text-gray-500 mt-0.5">Set your laboratory&apos;s working schedule</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200">
          <p className="text-xs font-medium text-purple-700">Weekly Schedule</p>
        </div>
      </div>
    
      {/* Table Container */}
      <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl border border-purple-100 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="w-[140px]">
              <p className="text-sm font-semibold text-white">Day</p>
            </div>
            <div className="w-[150px]">
              <p className="text-sm font-semibold text-white">Opens At</p>
            </div>
            <div className="w-[150px]">
              <p className="text-sm font-semibold text-white">Closes At</p>
            </div>
            <div className="w-[60px] flex justify-center">
              <div className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-sm">
                <p className="text-xs font-semibold text-white">24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-purple-100">
          {weekdays.map((day, index) => {
            const isOpen = operatingHours[day]?.isOpen;
            
            return (
              <div 
                key={day} 
                className={cn(
                  "flex items-center gap-4 px-4 py-3 transition-colors",
                  index % 2 === 0 ? "bg-white" : "bg-purple-50/30",
                  isOpen && "bg-purple-50/50 hover:bg-purple-50",
                  !isOpen && "opacity-60 hover:opacity-80"
                )}
              >
            {/* Day + Open Checkbox */}
            <div className="flex items-center gap-3 w-[140px]">
              <FormField
                control={form.control}
                name={`operatingHours.${day}.isOpen`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: boolean) => {
                          form.setValue(
                            `operatingHours.${day}.isOpen`,
                            checked
                          );
                          if (!checked) {
                            form.setValue(`operatingHours.${day}.openTime`, "");
                            form.setValue(
                              `operatingHours.${day}.closeTime`,
                              ""
                            );
                            form.setValue(
                              `operatingHours.${day}.is24Hours`,
                              false
                            );
                          } else {
                            form.setValue(
                              `operatingHours.${day}.openTime`,
                              "8:30 AM"
                            );
                            form.setValue(
                              `operatingHours.${day}.closeTime`,
                              "7:00 PM"
                            );
                          }
                        }}
                        className="border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                    </FormControl>
                    <FormLabel className={cn(
                      "text-sm font-medium cursor-pointer m-0",
                      isOpen ? "text-gray-900" : "text-gray-500"
                    )}>
                      {day}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Open Time Picker */}
            <div className="w-[150px]">
              <FormField
                control={form.control}
                name={`operatingHours.${day}.openTime`}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={
                          !operatingHours[day]?.isOpen ||
                          operatingHours[day]?.is24Hours
                        }
                        className={cn(
                          "h-9 text-xs gap-2 px-3 w-full justify-between",
                          "border-purple-200 hover:bg-purple-50 hover:border-purple-300",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          !field.value && "text-gray-400",
                          field.value && "text-gray-900 font-medium"
                        )}
                      >
                        <span className="truncate">{field.value || "Select time"}</span>
                        <Clock className="w-3.5 h-3.5 text-purple-500 opacity-70" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[200px]">
                      <Command>
                        <CommandInput placeholder="Search time..." className="h-9" />
                        <CommandEmpty>No time found.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-auto">
                          {times.map((time) => (
                            <CommandItem
                              key={time}
                              value={time}
                              onSelect={() =>
                                form.setValue(
                                  `operatingHours.${day}.openTime`,
                                  time
                                )
                              }
                              className="cursor-pointer text-sm hover:bg-purple-50"
                            >
                              {time}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            {/* Close Time Picker */}
            <div className="w-[150px]">
              <FormField
                control={form.control}
                name={`operatingHours.${day}.closeTime`}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={
                          !operatingHours[day]?.isOpen ||
                          operatingHours[day]?.is24Hours
                        }
                        className={cn(
                          "h-9 text-xs gap-2 px-3 w-full justify-between",
                          "border-purple-200 hover:bg-purple-50 hover:border-purple-300",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          !field.value && "text-gray-400",
                          field.value && "text-gray-900 font-medium"
                        )}
                      >
                        <span className="truncate">{field.value || "Select time"}</span>
                        <Clock className="w-3.5 h-3.5 text-purple-500 opacity-70" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[200px]">
                      <Command>
                        <CommandInput placeholder="Search time..." className="h-9" />
                        <CommandEmpty>No time found.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-auto">
                          {times.map((time) => (
                            <CommandItem
                              key={time}
                              value={time}
                              onSelect={() =>
                                form.setValue(
                                  `operatingHours.${day}.closeTime`,
                                  time
                                )
                              }
                              className="cursor-pointer text-sm hover:bg-purple-50"
                            >
                              {time}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            {/* 24/7 Checkbox */}
            <div className="w-[60px] flex justify-center">
              <FormField
                control={form.control}
                name={`operatingHours.${day}.is24Hours`}
                render={({ field }) => (
                  <FormItem className="flex items-center justify-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: boolean) => {
                          form.setValue(
                            `operatingHours.${day}.is24Hours`,
                            checked
                          );
                          if (checked) {
                            form.setValue(
                              `operatingHours.${day}.openTime`,
                              "12:00 AM"
                            );
                            form.setValue(
                              `operatingHours.${day}.closeTime`,
                              "11:59 PM"
                            );
                          }
                        }}
                        disabled={!operatingHours[day]?.isOpen}
                        className="border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      })}
        </div>

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-4 py-2.5 border-t border-purple-100">
          <div className="flex items-center gap-2 text-xs text-purple-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">
              Check the days you&apos;re open and set your operating hours
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
