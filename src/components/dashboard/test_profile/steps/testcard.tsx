// components/TestCard.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestItem } from "@/types/test";
import TestSuggestions from "./testsuggestions";

interface TestCardProps {
  test: TestItem;
  onChange: (field: keyof TestItem, value: any) => void;
  onOpenModal?: (
    type: "parameters" | "facility" | "fasting" | "consultations",
    test: TestItem
  ) => void;
  editableToggle?: (checked: boolean) => void;
  isSuggested?: boolean;
  loading?: boolean;
  onDelete?: () => void; // New prop for delete functionality
}

import React, { useRef, useState } from "react";

const TestCard = ({
  test,
  onChange,
  onOpenModal,
  editableToggle,
  isSuggested = false,
  loading = false,
  onDelete,
}: TestCardProps) => {
  const getTextClass = (isEditable: boolean) =>
    isEditable ? "text-[#250732]" : "text-gray-400";
  const DEFAULT_FASTING = [
    { name: "Fasting", selected: false, value: "" },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!element) return;
    
    // Don't start dragging if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'BUTTON' ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('button') ||
      target.closest('[role="combobox"]') ||
      target.closest('[data-radix-select-trigger]') ||
      target.closest('[role="checkbox"]') ||
      target.hasAttribute('data-radix-checkbox-indicator')
    ) {
      return;
    }
    
    setIsDragging(true);
    setStartX(e.pageX - element.offsetLeft);
    setScrollLeft(element.scrollLeft);
    e.preventDefault(); // Prevent text selection
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!isDragging || !element) return;
    e.preventDefault();
    const x = e.pageX - element.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    element.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  // console.log("TestCard Props:", { test, isSuggested, editableToggle });

  const effectivePrecautions =
    test.precautions?.length > 0
      ? test.precautions
      : test.isEditable && !isSuggested
      ? DEFAULT_FASTING
      : [];
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition bg-white relative">
      {/* Delete button for custom tests - Top Left */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-3 left-3 z-10 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 border border-red-200 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
          title="Delete this test"
        >
          <X size={14} strokeWidth={2} />
        </button>
      )}
      
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="cursor-grab active:cursor-grabbing overflow-x-auto scrollbar-thin relative"
        style={{ userSelect: 'none', overflowY: 'visible' }}
      >
        <div
          className="grid gap-6"
          style={{
            minWidth: '1600px',
            gridTemplateColumns: "0.2fr 2fr 1.5fr repeat(6, 1fr)",
            alignItems: "start",
            padding: onDelete ? "8px 0 8px 40px" : "8px 0", // Add left padding when delete button is present
          }}
        >
        {/* Checkbox for suggested only */}
        {isSuggested ? (
          <div className="flex items-center mb-2 mr-2">
            <Checkbox
              checked={test.isEditable}
              onCheckedChange={(checked) => editableToggle?.(checked as boolean)}
            />
          </div>
        ) : (
          <div />
        )}

        {/* Name */}
        <div>
          <p className={`text-sm font-medium mb-1 ${getTextClass(test.isEditable)}`}>
            Name <span className="text-red-500">*</span>
          </p>
          {test.isEditable ? (
            <TestSuggestions
              value={test.name}
              onChange={(value) => onChange("name", value)}
              onTestSelect={(selectedTest) => {
                // Auto-fill test data when suggestion is selected
                onChange("name", selectedTest.name);
                if (selectedTest.parameters) {
                  onChange("parameters", selectedTest.parameters);
                }
                if (selectedTest.cost) {
                  onChange("cost", selectedTest.cost);
                }
                if (selectedTest.report_turnaround_time) {
                  onChange("report_turnaround_time", selectedTest.report_turnaround_time);
                }
                if (selectedTest.home_collection !== undefined) {
                  onChange("home_collection", selectedTest.home_collection);
                }
                if (selectedTest.precautions && selectedTest.precautions.length > 0) {
                  onChange("precautions", selectedTest.precautions.map(p => ({ ...p, value: String(p.value) })));
                }
              }}
              className={`h-8 text-sm ${getTextClass(test.isEditable)}`}
              placeholder="Type test name for suggestions..."
            />
          ) : (
            <Input
              value={test.name}
              onChange={(e) => onChange("name", e.target.value)}
              className={`h-8 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 ${getTextClass(test.isEditable)}`}
              disabled={true}
            />
          )}
        </div>

        {/* Parameters */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <p className={`text-sm font-medium ${getTextClass(test.isEditable)}`}>
              Parameters <span className="text-red-500">*</span>
            </p>
            {test.isEditable && onOpenModal && (
              <button
                onClick={() => onOpenModal("parameters", test)}
                className="text-gray-500 hover:text-primary"
              >
                <Pencil size={12} />
              </button>
            )}
          </div>
          <ul className={`list-disc pl-4 text-sm space-y-1 ${getTextClass(test.isEditable)}`}>
            {test.parameters?.length > 0 ? (
              test.parameters.map((param) => <li key={param.id}>{param.name}</li>)
            ) : (
              <li>No Parameters</li>
            )}
          </ul>
        </div>

        {/* Home Collection */}
        <div>
          <p className={`text-sm font-medium mb-1 ${getTextClass(test.isEditable)}`}>
            Home Collection <span className="text-red-500">*</span>
          </p>
          <Select
            value={test.home_collection ? "yes" : "no"}
            onValueChange={(value) => onChange("home_collection", value === "yes")}
            disabled={!test.isEditable}
          >
            <SelectTrigger className={`border-0 w-28 h-8 text-sm ${getTextClass(test.isEditable)}`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fasting */}
        <div>
          <p className={`text-sm font-medium mb-1 ${getTextClass(test.isEditable)}`}>Fasting</p>
          <div className="flex items-center gap-2 min-h-[32px]">
            <Checkbox
              checked={test.precautions?.[0]?.selected || false}
              onCheckedChange={(checked) => {
                if (!test.isEditable) return;
                const updated = [{ name: "Fasting", selected: !!checked, value: checked ? "" : "" }];
                onChange("precautions", updated);
              }}
              disabled={!test.isEditable}
              className="flex-shrink-0"
            />
            {test.precautions?.[0]?.selected && (
              <Input
                type="number"
                value={test.precautions?.[0]?.value || ""}
                onChange={(e) => {
                  const updated = [{ name: "Fasting", selected: true, value: e.target.value }];
                  onChange("precautions", updated);
                }}
                placeholder="Hrs"
                className={`w-20 h-8 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 ${getTextClass(test.isEditable)}`}
                disabled={!test.isEditable}
              />
            )}
          </div>
        </div>

        {/* Special Instruction */}
        <div>
          <p className={`text-sm font-medium mb-1 ${getTextClass(test.isEditable)}`}>
            Special Instruction
          </p>
          <Input
            value={test.special_instruction || ""}
            onChange={(e) => onChange("special_instruction", e.target.value)}
            className={`h-8 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 ${getTextClass(test.isEditable)}`}
            disabled={!test.isEditable}
            placeholder="Enter special instructions..."
          />
        </div>

        {/* Turnaround */}
        <div>
          <p className={`text-sm font-medium mb-1 ${getTextClass(test.isEditable)}`}>
            Report Turnaround <span className="text-red-500">*</span>
          </p>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={test.report_turnaround_time.value}
              onChange={(e) =>
                onChange("report_turnaround_time", {
                  ...test.report_turnaround_time,
                  value: parseInt(e.target.value || "0", 10),
                })
              }
              className="focus:outline-none focus:ring-0 focus:border-gray-300"
              disabled={!test.isEditable}
            />
            <Select
              value={test.report_turnaround_time.unit}
              onValueChange={(value) =>
                onChange("report_turnaround_time", {
                  ...test.report_turnaround_time,
                  unit: value,
                })
              }
              disabled={!test.isEditable}
            >
              <SelectTrigger className={`w-20 h-8 text-sm ${getTextClass(test.isEditable)}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hrs">Hrs</SelectItem>
                <SelectItem value="Days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cost */}
        <div>
          <p className={`text-sm font-medium mb-1 ${getTextClass(test.isEditable)}`}>
            Cost <span className="text-red-500">*</span>
          </p>
          <Input
            type="number"
            value={isNaN(test.cost) ? "" : test.cost}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || value === null || value === undefined) {
                onChange("cost", 0); // Set to 0 instead of NaN when empty
              } else {
                const numValue = parseFloat(value);
                onChange("cost", isNaN(numValue) ? 0 : numValue);
              }
            }}
            className={`h-8 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 ${getTextClass(test.isEditable)}`}
            disabled={!test.isEditable}
            min="0"
            step="0.01"
            placeholder="Enter cost"
          />
        </div>

        {/* Consultations */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <p className={`text-sm font-medium ${getTextClass(test.isEditable)}`}>Consultations</p>
            {test.isEditable && onOpenModal && (
              <button
                onClick={() => onOpenModal("consultations", test)}
                className="text-gray-500 hover:text-primary"
              >
                <Pencil size={12} />
              </button>
            )}
          </div>
          {test.consultations?.length > 0 ? (
            <ul className={`list-disc pl-4 text-sm space-y-1 ${getTextClass(test.isEditable)}`}>
              {test.consultations.map((c, idx) => (
                <li key={idx}>Consultation - {c}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No Consultations</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default React.memo(TestCard);