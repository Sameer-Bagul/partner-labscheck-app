"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { basicTests } from "@/hooks/dashboard/use-tests";

interface TestSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  onTestSelect: (testData: any) => void;
  className?: string;
  placeholder?: string;
}

const TestSuggestions = ({
  value,
  onChange,
  onTestSelect,
  className = "",
  placeholder = "Type test name..."
}: TestSuggestionsProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get suggested tests data
  const { data: suggestedTests = [], isLoading } = basicTests();

  // Filter tests based on input using useMemo to avoid infinite re-renders
  const filteredTests = useMemo(() => {
    if (value.length > 0 && Array.isArray(suggestedTests) && suggestedTests.length > 0) {
      return suggestedTests
        .filter(test => 
          test.name?.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 8); // Limit to 8 suggestions
    }
    return [];
  }, [value, suggestedTests]);

  // Remove the problematic useEffect since we're using useMemo now

  // Close suggestions when clicking outside or on scroll/resize
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    const handleScrollOrResize = () => {
      setShowSuggestions(false);
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScrollOrResize);
      window.addEventListener("resize", handleScrollOrResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [showSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0);
  };

  const handleSuggestionClick = (test: any) => {
    onChange(test.name);
    onTestSelect(test);
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={value}
        onChange={handleInputChange}
        onFocus={() => value.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className={`${className} focus:outline-none focus:ring-0 focus:border-gray-300`}
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="fixed z-[9999] bg-white border border-gray-200 rounded-md shadow-xl max-h-60 overflow-y-auto min-w-[300px]"
             style={{
               top: containerRef.current ? 
                 `${containerRef.current.getBoundingClientRect().bottom + window.scrollY + 4}px` : 
                 'auto',
               left: containerRef.current ? 
                 `${containerRef.current.getBoundingClientRect().left + window.scrollX}px` : 
                 'auto',
               width: containerRef.current ? 
                 `${containerRef.current.getBoundingClientRect().width}px` : 
                 'auto'
             }}>
          {isLoading ? (
            <div className="p-3 text-sm text-gray-500 text-center">
              Loading suggestions...
            </div>
          ) : filteredTests.length > 0 ? (
            <div className="py-1">
              {filteredTests.map((test, index) => (
                <div
                  key={test.suggestion_id || index}
                  onClick={() => handleSuggestionClick(test)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                >
                  <div className="font-medium text-sm text-gray-900">{test.name}</div>
                  {test.parameters && test.parameters.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {test.parameters.length} parameters • ₹{test.cost || 0}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : value.length > 0 ? (
            <div className="p-3 text-sm text-gray-500 text-center">
              No suggestions found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TestSuggestions;
