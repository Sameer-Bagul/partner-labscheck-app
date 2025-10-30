import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useGetAllParameters } from "@/hooks/dashboard/use-tests";
import { Spinner } from "@/components/ui/spinner";


interface Parameter {
  id: number;
  name: string;
}

const EditModal = ({
  open,
  onClose,
  type,
  test,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  type: "parameters" | "facility" | "fasting" | "consultations" | 'basictest' | null;
  test: any;
  onSave: (fields: Record<string, any>) => void;
}) => {
  const { data, isLoading } = useGetAllParameters();
  const allParameters: Parameter[] = data?.parameters || [];
  const basic_tests: Parameter[] = data?.basic_tests || [];


  const [selectedParams, setSelectedParams] = useState<number[]>([]);
  const [consultations, setConsultations] = useState<string[]>([]);
  const [fastingTime, setFastingTime] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pre-fill selected parameters
  useEffect(() => {
    if (open && type === "parameters" && test?.parameters) {
      const selected = allParameters
        .filter((p) => test.parameters.some((tp: any) => tp.name === p.name))
        .map((p) => p.id);
      setSelectedParams(selected);
    }
  }, [open, type, test, data]);

  // Pre-fill consultations
  useEffect(() => {
    if (open && type === "consultations") {
      setConsultations(
        Array.isArray(test?.consultations) ? test.consultations : []
      );
    }
  }, [open, type, test]);

  // Pre-fill fasting
  useEffect(() => {
    if (open && type === "fasting") {
      setFastingTime(test?.fasting?.fastingTime || "");
    }
  }, [open, type, test]);

  // Pre-fill basic tests
  useEffect(() => {
    if (open && type === "basictest" && test?.basic_tests) {
      const selected = basic_tests
        .filter((p) => test.basic_tests.some((tp: any) => tp.name === p.name))
        .map((p) => p.id);
      setSelectedParams(selected);
    }
  }, [open, type, test, data]);

  const toggleParameter = (paramId: number) => {
    setSelectedParams((prev) =>
      prev.includes(paramId)
        ? prev.filter((id) => id !== paramId)
        : [...prev, paramId]
    );
    setSearchTerm(""); // Clear the search input after selecting
  };


  const handleSave = () => {
    if (type === "parameters") {
      const selectedNames = allParameters
        .filter((p) => selectedParams.includes(p.id))
        .map((p) => ({ id: p.id, name: p.name }));
      onSave({ parameters: selectedNames });
    }

    if (type === "consultations") {
      onSave({ consultations: consultations });
    }

    if (type === "fasting") {
      onSave({
        fasting: {
          ...test.fasting,
          fastingTime: fastingTime || null,
          fastingRequired: true,
        },
      });
    }

    if (type === "basictest") {
      const selectedNames = basic_tests
        .filter((p) => selectedParams.includes(p.id))
        .map((p) => ({ id: p.id, name: p.name }));
      onSave({ basic_tests: selectedNames });
    }
  };

  if (!type || !test) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {type}</DialogTitle>
        </DialogHeader>

        {/* PARAMETERS SECTION */}
        {type === "parameters" && (
          <div>
            <input
              type="text"
              placeholder="Search Parameters"
              className="border border-green-50 p-2 text-sm w-full mb-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="mx-2 text-sm text-gray-500">
              Selected: {selectedParams.length}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded">
              {isLoading ? (
                // <p className="text-gray-500 text-sm">Loading parameters...</p>
                <Spinner />
              ) : (
                [...allParameters]
                  .filter((param) =>
                    param.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => {
                    const aSelected = selectedParams.includes(a.id) ? -1 : 1;
                    const bSelected = selectedParams.includes(b.id) ? -1 : 1;
                    return aSelected - bSelected;
                  })
                  .map((param) => (
                    <label
                      key={param.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedParams.includes(param.id)}
                        onChange={() => toggleParameter(param.id)}
                      />
                      {param.name}
                    </label>
                  ))
              )}

              {!isLoading &&
                [...allParameters].filter((p) =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <p className="text-gray-400 text-sm">No results found</p>
                )}
            </div>
          </div>
        )}

        {type === "basictest" && (
          <div>
            <input
              type="text"
              placeholder="Search Basic Tests"
              className="border border-green-50 p-2 text-sm w-full mb-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="mx-2 text-sm text-gray-500">
              Selected: {selectedParams.length}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded">
              {isLoading ? (
                // <p className="text-gray-500 text-sm">Loading basic tests...</p>
                <Spinner />

              ) : (
                [...basic_tests]
                  .filter((param) =>
                    param.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => {
                    const aSelected = selectedParams.includes(a.id) ? -1 : 1;
                    const bSelected = selectedParams.includes(b.id) ? -1 : 1;
                    return aSelected - bSelected;
                  })
                  .map((param) => (
                    <label
                      key={param.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedParams.includes(param.id)}
                        onChange={() => toggleParameter(param.id)}
                      />
                      {param.name}
                    </label>
                  ))
              )}

              {!isLoading &&
                [...basic_tests].filter((p) =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <p className="text-gray-400 text-sm">No results found</p>
                )}
            </div>
          </div>
        )}

        {/* CONSULTATION SECTION */}
        {type === "consultations" && (
          <div className="space-y-2">
            {consultations.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={c}
                  onChange={(e) => {
                    const updated = [...consultations];
                    updated[idx] = e.target.value;
                    setConsultations(updated);
                  }}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Enter consultation"
                />
                <button
                  type="button"
                  onClick={() => {
                    setConsultations(consultations.filter((_, i) => i !== idx));
                  }}
                  className="text-red-500 text-lg"
                >
                  -
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setConsultations([...consultations, ""])}
              className="px-2 py-1 text-white bg-purple-600 rounded text-xs"
            >
              + Add Consultation
            </button>
          </div>
        )}

        {/* FASTING SECTION */}
        {type === "fasting" && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Fasting Time (hrs)</p>
            <input
              type="number"
              value={fastingTime}
              onChange={(e) => setFastingTime(e.target.value)}
              className="w-full p-2 border rounded text-sm"
              placeholder="Enter fasting time"
            />
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
