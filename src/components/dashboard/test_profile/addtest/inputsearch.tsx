"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { IoSearch } from "react-icons/io5";

import { searchQuerySchema } from "@/validations/searchquery"; // You may need a new schema

import { userCommonTests } from "@/hooks/dashboard/use-tests";
import { TestItem } from "@/app/api/tests/route"; 

// interface SearchItem {
//   id: number;
//   name: string;
//   // known_as?: string; // Add this
//   [key: string]: string | number | undefined; // keep it flexible
// }

export const SingleInputSearch = ({
  onSelect,
  placeholder = "Enter name...",
  value,
  onInputChange,
}: {
  onSelect?: (item: TestItem) => void;

  placeholder?: string;
  value?: string;
  onInputChange?: (input: string) => void; // ✅ new prop type
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    // control,
    // getValues,
    setValue,
    // formState: { errors },
  } = useForm({
    resolver: zodResolver(searchQuerySchema),
    defaultValues: { searchquery: "" },
  });

  const { data: suggestions = [], isLoading, error } = userCommonTests(query);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value.trim() ? value : "");
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: TestItem) => {
    // setValue('searchquery', item.name);
    onSelect?.(item);
    setShowResults(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative w-1/2">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <IoSearch className="w-5 h-5 text-secondary" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="block w-full p-2 ps-10 text-sm border border-slate-300 shadow-sm focus-visible:shadow-md border-primary/50 rounded-md outline-none text-foreground"
          value={inputValue}
          onChange={(e) => {
            const newVal = e.target.value;
            setInputValue(newVal);
            debouncedSearch(newVal);
            setShowResults(true);
            // ✅ Notify parent
            onInputChange?.(newVal);
          }}
          onFocus={() => setShowResults(true)}
        />
      </div>

      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-1/2 bg-white border border-gray-200 mt-1 rounded-md shadow-xl backdrop-blur-sm"
          style={{
            boxShadow:
              "0 4px 20px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {isLoading ? (
            <div className="p-2 text-center text-sm text-gray-500">
              Loading...
            </div>
          ) : error ? (
            <div className="p-2 text-sm text-red-500">
              Error loading suggestions
            </div>
          ) : suggestions?.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No results found</div>
          ) : (
            <ul className="divide-y divide-gray-300 max-h-48 overflow-y-auto">
              {suggestions?.map((item) => (
                <li
                  key={item.id}
                  className="p-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                  onClick={() => handleSelect(item)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </div>
  );
};
