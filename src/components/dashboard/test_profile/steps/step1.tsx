"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil } from "lucide-react";
import EditModal from "./editmodel";
import { ListSkeleton } from "@/components/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { basicTests } from "@/hooks/dashboard/use-tests";
import TestCard from "./testcard";
import { Button } from "@/components/ui/button";
import { TestItem } from "@/types/test";

// const deliveryOptions = ["Email", "WhatsApp", "Physical Copy"];

const Step1 = ({
  onDataChange,
  testData, // ✅ new prop
}: {
  onDataChange?: (data: TestItem[]) => void;
  testData?: TestItem[]; // ✅ will be passed in edit mode
}) => {
  const isEditMode = !!testData;
  // useEffect(() => {
  //   console.log("Step1 received testData prop:", testData);
  // }, [testData]);
  const { data, isLoading, isError } = basicTests();
  const [tests, setTests] = useState<TestItem[]>([]);
  // ...existing code...
const [customTests, setCustomTests] = useState<TestItem[]>([]);
const isCustomLoading = isEditMode && (!testData || testData.length === 0);
// Initialize from testData (for edit mode or passed props)


useEffect(() => {
  if (Array.isArray(testData) && testData.length > 0) {
    const formattedTests = testData.map((item: any) => ({
      suggestion_id: item.suggestion_id ?? item.id ?? Date.now(),
      name: item.name ?? "",
      parameters: item.parameters ?? [],
      home_collection: item.home_collection ?? false,
      precautions: item.precautions ?? [],
      consultations: item.consultations ?? [],
      report_turnaround_time: {
        value: item.report_turnaround_time?.value ?? 0,
        unit: item.report_turnaround_time?.unit === "days" ? "Days" : item.report_turnaround_time?.unit || "Hrs",
      },
      report_delivery: item.report_delivery ?? [
        { name: "Email", selected: false },
        { name: "WhatsApp", selected: false },
        { name: "Physical Copy", selected: false },
      ],
      cost: item.cost ?? 0,
      special_instruction: item.special_instruction ?? "",
      isEditable: true,
      selected: true,
      isCustom: true,
    }));

    setCustomTests(formattedTests);
  } else {
    // If no data is passed (add mode), initialize with 1 blank custom test
    setCustomTests([
      {
        suggestion_id: Date.now(),
        name: "",
        parameters: [],
        home_collection: false,
        precautions: [{ name: "Fasting", selected: false, value: "" }],
        consultations: [],
        report_turnaround_time: { value: 0, unit: "Hrs" },
        report_delivery: [
          { name: "Email", selected: false },
          { name: "WhatsApp", selected: false },
          { name: "Physical Copy", selected: false },
        ],
        cost: 0,
        special_instruction: "",
        isEditable: true,
        selected: true,
        isCustom: true,
      },
    ]);
  }
}, [testData]);

  // ...existing code...

  useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log("Fetched suggested tests:", data);
      const mapped: TestItem[] = data.map((item: any) => {
        return {
          suggestion_id: item.suggestion_id || 0,
          name: item.name || "",
          parameters: item.parameters || [],
          home_collection: item.home_collection || false,
          precautions: item.precautions || [],
          consultations: item.consultations || [],
          report_turnaround_time: {
            value: item.report_turnaround_time?.value || 0,
            unit: item.report_turnaround_time?.unit === "days" ? "Days" : item.report_turnaround_time?.unit || "Hrs",
          },
          report_delivery: item.report_delivery || [],
          cost: item.cost || 0,
          special_instruction: item.special_instruction || "",
          isEditable: false,
          selected: false,
        };
      });
      setTests(mapped);
    }
  }, [data]);

  useEffect(() => {
    // Add a small delay to avoid calling onDataChange on every keystroke
    const timeoutId = setTimeout(() => {
      if (onDataChange) {
        const merged = [...tests, ...customTests];

        const filtered = merged.filter((test) => {
          // Ignore unselected suggested tests
          if (!test.isEditable && !test.selected) return false;

          // For custom tests, require name and valid positive cost
          const isCustom = test.isEditable || test.isCustom;
          if (isCustom) {
            const hasName = test.name && test.name.trim().length > 0;
            const hasValidCost = !isNaN(test.cost) && test.cost > 0;
            
            // Only include custom tests that have both a name and valid cost
            return hasName && hasValidCost;
          }

          // For suggested tests, they're already valid if selected
          return true;
        });

        onDataChange(filtered);
      }
    }, 500); // Reduced from 3000ms to 500ms for better user experience

    return () => clearTimeout(timeoutId);
  }, [tests, customTests, onDataChange]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "parameters" | "facility" | "fasting" | "consultations" | null
  >(null);
  const [activeTest, setActiveTest] = useState<TestItem | null>(null);

  // Drag functionality for suggested tests - now unified
  const [dragState, setDragState] = useState<{isDragging: boolean, startX: number, scrollLeft: number}>({
    isDragging: false,
    startX: 0,
    scrollLeft: 0
  });
  const scrollRefs = useRef<{[key: number]: HTMLDivElement | null}>({});

  const handleMouseDown = (testId: number, e: React.MouseEvent<HTMLDivElement>) => {
    const element = scrollRefs.current[testId];
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
    
    setDragState({
      isDragging: true,
      startX: e.pageX - element.offsetLeft,
      scrollLeft: element.scrollLeft
    });
    e.preventDefault();
  };

  const handleMouseMove = (testId: number, e: React.MouseEvent<HTMLDivElement>) => {
    const element = scrollRefs.current[testId];
    if (!dragState.isDragging || !element) return;
    
    e.preventDefault();
    const x = e.pageX - element.offsetLeft;
    const walk = (x - dragState.startX) * 2;
    element.scrollLeft = dragState.scrollLeft - walk;
  };

  const handleMouseUp = (testId: number) => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  };

  const getTextClass = (isEditable: boolean) =>
    isEditable ? "text-[#250732]" : "text-gray-400";

  const openModal = (
    type: "parameters" | "facility" | "fasting" | "consultations",
    test: TestItem
  ) => {
    setModalType(type);
    setActiveTest(test);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setActiveTest(null);
  };

  const handleChange = (id: number, field: keyof TestItem, value: any) => {
    setTests((prev) =>
      prev.map((test) =>
        test.suggestion_id === id ? { ...test, [field]: value } : test
      )
    );
  };

  const toggleEditable = (id: number, checked: boolean) => {
    setTests((prev) =>
      prev.map((test) =>
        test.suggestion_id === id
          ? { ...test, isEditable: checked, selected: checked } // add selected flag
          : test
      )
    );
  };

  if (isLoading) return <ListSkeleton length={6} />;
  if (isError) return <p>Failed to load tests.</p>;

  const addNewCustomTest = () => {
    const newTest: TestItem = {
      suggestion_id: Date.now(), // temporary unique ID
      name: "",
      parameters: [],
      home_collection: false,
      precautions: [{ name: "Fasting", selected: false, value: "" }],
      consultations: [],
      report_turnaround_time: { value: 0, unit: "Hrs" },
      report_delivery: [
        { name: "Email", selected: false },
        { name: "WhatsApp", selected: false },
        { name: "Physical Copy", selected: false },
      ],
      cost: 0,
      special_instruction: "",
      isEditable: true,
    };
    setCustomTests((prev) => [...prev, newTest]);
  };

  const deleteCustomTest = (suggestionId: number) => {
    setCustomTests((prev) => prev.filter(test => test.suggestion_id !== suggestionId));
  };

  const handleCustomTestChange = (index: number, field: keyof TestItem, value: any) => {
    setCustomTests(prev => {
      const updated = [...prev];
      updated[index] = { 
        ...updated[index], 
        [field]: value,
        selected: true, // Ensure custom tests are always selected
        isCustom: true, // Ensure they're marked as custom
        isEditable: true // Ensure they're always editable
      };
      return updated;
    });
  };
  // console.log("customTests in Step1:", customTests);

  return (
    <div className="space-y-4 w-full max-w-full max-h-[80vh] sm:max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin">
      <h2 className="text-lg font-bold">Custom Test</h2>
     {customTests.map((test, index) => (
  <div key={test.suggestion_id} className="w-full overflow-x-auto">
        <TestCard
      test={test}
      onChange={(field, value) => handleCustomTestChange(index, field, value)}
      editableToggle={() => {}}
      onOpenModal={openModal}
      loading={isCustomLoading}
      isSuggested={false}
      onDelete={() => deleteCustomTest(test.suggestion_id)}
    />
  </div>
))}

      {/* Add New Test Button */}
      <div className="flex justify-start mt-4">
        <Button
          onClick={addNewCustomTest}
          variant="outline"
          className="text-sm"
        >
          + Add New Test
        </Button>
      </div>

      {/* Suggested Tests */}
      {!isEditMode && (
        <>
          <h2 className="text-lg font-bold mt-6">Suggested Tests</h2>
          <div 
            ref={(el) => { scrollRefs.current[0] = el; }}
            onMouseDown={(e) => handleMouseDown(0, e)}
            onMouseMove={(e) => handleMouseMove(0, e)}
            onMouseUp={() => handleMouseUp(0)}
            onMouseLeave={() => handleMouseUp(0)}
            className="overflow-x-auto scrollbar-thin cursor-grab active:cursor-grabbing"
            style={{ userSelect: 'none' }}
          >
            <div style={{ minWidth: '1600px' }} className="space-y-4">
              {tests.map((test) => (
                <div key={test.suggestion_id} className="w-full">
                  <div
                    className={`w-full p-4 rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition ${
                      test.isEditable ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div
                      className="grid gap-5"
                      style={{
                        gridTemplateColumns: "0.2fr 2fr 1.5fr repeat(6, 1fr)",
                        alignItems: "start",
                      }}
                    >
                  <div className="flex items-center mb-2 mr-2">
                    <Checkbox
                      checked={test.isEditable}
                      onCheckedChange={(checked) =>
                        toggleEditable(test.suggestion_id, checked as boolean)
                      }
                    />
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium mb-1 ${getTextClass(
                        test.isEditable
                      )}`}
                    >
                      Name
                    </p>
                    <Input
                      value={test.name}
                      onChange={(e) =>
                        handleChange(test.suggestion_id, "name", e.target.value)
                      }
                      className={`h-8 text-sm ${getTextClass(test.isEditable)}`}
                      disabled={!test.isEditable}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <p
                        className={`text-sm font-medium ${getTextClass(
                          test.isEditable
                        )}`}
                      >
                        Parameters
                      </p>
                      {test.isEditable && (
                        <button
                          onClick={() => openModal("parameters", test)}
                          className="text-gray-500 hover:text-primary"
                        >
                          <Pencil size={12} />
                        </button>
                      )}
                    </div>
                    <ul
                      className={`list-disc pl-4 text-sm space-y-1 ${getTextClass(
                        test.isEditable
                      )}`}
                    >
                      {test.parameters.length > 0 ? (
                        test.parameters.map((param) => (
                          <li key={param.id}>{param.name}</li>
                        ))
                      ) : (
                        <li>No Parameters</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium mb-1 ${getTextClass(
                        test.isEditable
                      )}`}
                    >
                      Home Collection
                    </p>
                    <Select
                      value={test.home_collection ? "yes" : "no"}
                      onValueChange={(value) =>
                        handleChange(
                          test.suggestion_id,
                          "home_collection",
                          value === "yes"
                        )
                      }
                      disabled={!test.isEditable}
                    >
                      <SelectTrigger
                        className={`border-0 w-28 h-8 text-sm ${getTextClass(
                          test.isEditable
                        )}`}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium mb-1 ${getTextClass(
                        test.isEditable
                      )}`}
                    >
                      Fasting
                    </p>
                    <div className="flex items-center gap-2 min-h-[32px]">
                      <Checkbox
                        checked={test.precautions?.[0]?.selected || false}
                        onCheckedChange={(checked) => {
                          if (!test.isEditable) return;
                          const updated = [{ name: "Fasting", selected: !!checked, value: checked ? "" : "" }];
                          handleChange(test.suggestion_id, "precautions", updated);
                        }}
                        disabled={!test.isEditable}
                        className="flex-shrink-0"
                      />
                      {test.precautions?.[0]?.selected && (
                        <Input
                          type="number"
                          value={test.precautions?.[0]?.value || ""}
                          onChange={(e) => {
                            if (!test.isEditable) return;
                            const updated = [{ name: "Fasting", selected: true, value: e.target.value }];
                            handleChange(test.suggestion_id, "precautions", updated);
                          }}
                          placeholder="Hrs"
                          className={`w-20 h-8 text-sm ${getTextClass(
                            test.isEditable
                          )}`}
                          disabled={!test.isEditable}
                        />
                      )}
                    </div>
                  </div>

                  {/* Special Instruction */}
                  <div>
                    <p
                      className={`text-sm font-medium mb-1 ${getTextClass(
                        test.isEditable
                      )}`}
                    >
                      Special Instruction
                    </p>
                    <Input
                      value={test.special_instruction || ""}
                      onChange={(e) =>
                        handleChange(test.suggestion_id, "special_instruction", e.target.value)
                      }
                      className={`h-8 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 ${getTextClass(test.isEditable)}`}
                      disabled={!test.isEditable}
                      placeholder="Enter special instructions..."
                    />
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium mb-1 ${getTextClass(
                        test.isEditable
                      )}`}
                    >
                      Report Turnaround
                    </p>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        value={test.report_turnaround_time.value}
                        onChange={(e) =>
                          handleChange(
                            test.suggestion_id,
                            "report_turnaround_time",
                            {
                              ...test.report_turnaround_time,
                              value: parseInt(e.target.value || "0", 10),
                            }
                          )
                        }
                      />

                      <Select
                        value={test.report_turnaround_time.unit}
                        onValueChange={(value) =>
                          handleChange(
                            test.suggestion_id,
                            "report_turnaround_time",
                            {
                              ...test.report_turnaround_time,
                              unit: value,
                            }
                          )
                        }
                        disabled={!test.isEditable}
                      >
                        <SelectTrigger
                          className={`w-20 h-8 text-sm ${getTextClass(
                            test.isEditable
                          )}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hrs">Hrs</SelectItem>
                          <SelectItem value="Days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium mb-1 ${getTextClass(
                        test.isEditable
                      )}`}
                    >
                      Cost
                    </p>
                    <Input
                      type="number"
                      value={isNaN(test.cost) ? "" : test.cost}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || value === null || value === undefined) {
                          handleChange(test.suggestion_id, "cost", 0);
                        } else {
                          const numValue = parseFloat(value);
                          handleChange(test.suggestion_id, "cost", isNaN(numValue) ? 0 : numValue);
                        }
                      }}
                      className={`h-8 text-sm ${getTextClass(test.isEditable)}`}
                      disabled={!test.isEditable}
                      min="0"
                      step="0.01"
                      placeholder="Enter cost"
                    />
                  </div>
                  {/* Consultation */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <p
                        className={`text-sm font-medium ${getTextClass(
                          test.isEditable
                        )}`}
                      >
                        Consultations
                      </p>
                      {test.isEditable && (
                        <button
                          type="button"
                          onClick={() => openModal("consultations", test)}
                          className="text-gray-500 hover:text-primary"
                        >
                          <Pencil size={12} />
                        </button>
                      )}
                    </div>
                    {test.consultations && test.consultations.length > 0 ? (
                      <ul
                        className={`list-disc pl-4 text-sm space-y-1 ${getTextClass(
                          test.isEditable
                        )}`}
                      >
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
              ))}
            </div>
          </div>
        </>
      )}

      <EditModal
        open={isModalOpen}
        onClose={closeModal}
        type={modalType}
        test={activeTest}
        onSave={(updatedFields) => {
          if (activeTest) {
            if (activeTest.isCustom) {
              // ✅ Safe update by suggestion_id for custom tests
              setCustomTests((prev) =>
                prev.map((t) =>
                  t.suggestion_id === activeTest.suggestion_id
                    ? { ...t, ...updatedFields }
                    : t
                )
              );
            } else {
              // ✅ Safe update by suggestion_id for suggested tests
              setTests((prev) =>
                prev.map((t) =>
                  t.suggestion_id === activeTest.suggestion_id
                    ? { ...t, ...updatedFields }
                    : t
                )
              );
            }
          }
          closeModal();
        }}
      />
    </div>
  );
};

export default Step1;