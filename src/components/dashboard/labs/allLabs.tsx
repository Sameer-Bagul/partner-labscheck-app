"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAllLabList, useDeleteLab } from "@/hooks/dashboard/use-labs";
import Link from "next/link";
import { ListSkeleton } from "@/components/skeleton";
import { MdDeleteSweep, MdEditSquare } from "react-icons/md";
import { FaGlobeAfrica, FaPhoneAlt } from "react-icons/fa";
import NotFoundPage from "@/app/not-found";
import { Lab } from "@/types/labs";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { log } from "console";
import { toast } from "sonner";

export default function AllLabs() {
  const { data: LabsData = [], isFetching, error } = useAllLabList();
  // console.log("LabsData:", LabsData);
  const [searchTerm, setSearchterm] = useState("");

  // ✅ Debounced input change handler
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        setSearchterm(term);
      }, 300),
    []
  );

  // ✅ Cancel debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // ✅ Use useMemo for filtering instead of useEffect + state
  const filteredData = useMemo(() => {
    // Ensure LabsData is an array before processing
    if (!Array.isArray(LabsData) || LabsData.length === 0) {
      return [];
    }

    return searchTerm
      ? LabsData.filter((lab) =>
          lab.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : LabsData;
  }, [LabsData, searchTerm]);


  const deleteMutation = useDeleteLab();

const handleDeleteLab = (labId: number) => {
  const confirmed = confirm('Are you sure you want to delete this lab?');
  if (!confirmed) return;

  deleteMutation.mutate(labId); // ✅ Pass ID here
};

  console.log("Filtered Data:", filteredData);

  return (
    <div className="flex flex-col justify-start gap-6 px-5 pb-2 lg:pb-5">
      {isFetching ? (
        <ListSkeleton length={5} />
      ) : error ? (
        <div className="w-full h-full flex justify-center items-center">
          <NotFoundPage />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 🔍 Search Box */}
          <div className="flex justify-start">
            <Input
              className="placeholder:text-slate-500 w-full self-start md:w-1/2"
              placeholder="Search Laboratories"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>

          {/* 🛑 Empty state */}
          {!filteredData.length && (
            <div className="flex justify-center items-center">
              <p className="text-gray-500 mt-10">No labs data available</p>
            </div>
          )}

          {/* ✅ Mapped Labs */}
          {filteredData.map((lab: Lab) => (
            <motion.div
              key={lab.id}
              className="bg-white rounded-lg shadow-md transform transition-all duration-500 hover:scale-105 hover:shadow-lg border-primary cursor-pointer flex flex-col relative overflow-hidden group gap-2"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              {/* Status Badge */}
              <div
                className={`${
                  lab.status === "Pending" ? "bg-[#F28C28]" : "bg-secondary"
                } absolute text-center cursor-vertical-text h-full text-white`}
                style={{
                  writingMode: "sideways-lr",
                  fontWeight: "bold",
                  letterSpacing: "5px",
                  fontSize: "13px",
                  padding: "3px",
                }}
              >
                {lab.status.toUpperCase()}
              </div>

              <div className="px-10 py-4">
                {/* Lab Name */}
                <div className="flex justify-between">
                  <div>
                    <h1 className="text-primary font-bold mb-2 text-sm sm:text-xl">
                      {lab.name?.split(/[:|]/)[0]?.trim()}
                    </h1>
                    <h1 className="text-secondary font-semibold text-xs sm:text-lg">
                      {lab.name?.split(/[:|]/)[1]?.trim() || ""}
                    </h1>
                  </div>
                </div>

                {/* Address & Contact */}
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {lab.address || "Address not available"}
                  </p>
                  <div className="space-y-1">
                    <p className="flex items-center gap-3 text-gray-700">
                      <FaPhoneAlt className="text-secondary" />{" "}
                      {lab.phoneNo || "N/A"}
                    </p>
                    <p className="flex items-center gap-3 text-gray-700">
                      <FaGlobeAfrica className="text-secondary" />
                      <Link
                        href={`${lab.website}`}
                        target="_blank"
                        className="underline text-blue-500"
                      >
                        {lab.website.replace(/(\.com).*/, "$1")}
                      </Link>
                    </p>
                  </div>

                  {/* Working Hours */}
                  {/* {lab.workingHours && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 font-medium mb-1">Working Days:</p>
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          try {
                            const parsedHours = JSON.parse(lab.workingHours);
                            const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                            return weekdays.map((day) => {
                              const dayData = parsedHours[day];
                              const isOpen = dayData && (!!dayData.openHour || !!dayData.closeHour || !!dayData.open24Hours);
                              return (
                                <span
                                  key={day}
                                  className={`text-xs px-1 py-0.5 rounded ${
                                    isOpen 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-gray-100 text-gray-400'
                                  }`}
                                  title={`${day}${isOpen ? ` (${dayData.open24Hours ? '24hrs' : dayData.openHour && dayData.closeHour ? `${dayData.openHour}-${dayData.closeHour}` : ''})` : ' - Closed'}`}
                                >
                                  {day.charAt(0)}
                                </span>
                              );
                            });
                          } catch (error) {
                            return <span className="text-xs text-gray-400">Working hours unavailable</span>;
                          }
                        })()}
                      </div>
                    </div>
                  )} */}
                </div>

                {/* Edit Button */}
              
                <div className="flex justify-end mt-2 gap-2">
                  {/* Edit Button */}
                    {lab.status !=="Active" && (
                  <Link href={`/laboratory/${lab.id}`}>
                    <div className="h-8 w-20 rounded-md bg-primary flex justify-center  hover:bg-secondary items-center gap-2 text-white text-sm">
                      <MdEditSquare />
                      Edit
                    </div>
                  </Link>
                    )}

                  {/* Remove Button */}
                  <button
                    // onClick={() => handleDelete(lab.id)}
                    onClick={() => handleDeleteLab(Number(lab.id))}
                    className="h-8 w-24 rounded-md bg-primary text-white text-sm flex items-center justify-center gap-2 hover:bg-red-600"
                  >
                    <MdDeleteSweep className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
