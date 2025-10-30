"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { TestFormData } from "@/validations/Test/test";

import {
  FlaskConical,
  Tag,
  IndianRupee,
  Truck,
  ListChecks,
  Gift,
  MapPin,
  AlertTriangle,
} from "lucide-react";


// addind this at the time of build
// interface Parameter {
//   id: string;
//   label: string;
// }

// interface Offering {
//   id: string;
//   label: string;
// }



// interface Consultancy {
//   id: string;
//   text: string;
// }

interface Precaution {
  selected: boolean;
  value: string;
  unit: string;
}

// interface TestPreviewData {
//   name: string;
//   known_as?: string;
//   cost: number;
// home_sample: "yes" | "no";
//   parameters?: Parameter[];
//   offerings?: Offering[];
//   cities?: { state: string; cities: City[] }[];
//   consultancies?: Consultancy[];
//   precautions?: Record<string, Precaution>;
// }




export interface PreviewProps {
  open: boolean;
  onClose: () => void;
  data: TestFormData;
 onFinalSubmit: (data: TestFormData) => void;
}






const Preview: React.FC<PreviewProps> = ({
  open,
  onClose,
  data,
  onFinalSubmit,
}) => {
  // const router = useRouter();
  if (!data) return null;

  // console.log("Data in preview component: ", data);

  const handlePreviewSubmit = () => {
    // console.log("User confirmed submission");
    onFinalSubmit(data); // ✅ route happens here
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6 rounded-xl shadow-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <FlaskConical className="text-blue-600 w-6 h-6" />
            Test Preview
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] mt-4 pr-2">
          <div className="space-y-6 text-sm text-gray-700">
            {/* Top Fields */}
            <div className="grid grid-cols-2 gap-4">
              <p>
                <FlaskConical className="inline-block text-blue-500 mr-2 w-4 h-4" />
                <span className="font-medium">Name:</span> {data.name}
              </p>
              {/* <p>
                <Tag className="inline-block text-green-500 mr-2 w-4 h-4" />
                <span className="font-medium">Known As:</span>{" "}
                {data.known_as || "N/A"}
              </p> */}
              <p>
                <IndianRupee className="inline-block text-purple-500 mr-2 w-4 h-4" />
                <span className="font-medium">Cost:</span> ₹{data.cost}
              </p>
              <p>
                <Truck className="inline-block text-pink-500 mr-2 w-4 h-4" />
                <span className="font-medium">Home Sample:</span>{" "}
                {data.home_sample}
              </p>
            </div>

            <Separator />

            {/* Bottom Sections in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parameters */}
              {data.parameters?.length > 0 && (
                <div>
                  <p className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <ListChecks className="text-indigo-600 w-5 h-5" />
                    Parameters
                  </p>
                  <ul className="list-disc list-inside pl-4 text-gray-600">
                    {data.parameters.map(
                      (param: { id: string; label: string }, index: number) => (
                        <li key={index}>{param.label}</li> // ✅ use param.label
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* Offerings */}
              {data.offerings?.length > 0 && (
                <div>
                  <p className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Gift className="text-amber-600 w-5 h-5" />
                    Offerings
                  </p>
                  <ul className="list-disc list-inside pl-4 text-gray-600">
                    {data.offerings.map(
                      (item: { id: string; label: string }, index: number) => (
                        <li key={index}>{item.label}</li> // ✅ use item.label
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* Cities */}
              {data.cities?.length > 0 && (
                <div>
                  <p className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <MapPin className="text-cyan-600 w-5 h-5" />
                    Cities
                  </p>
                 <ul className="list-disc list-inside pl-4 text-gray-600">
              <ul className="list-disc list-inside pl-4 text-gray-600">
                {data.cities.map((city, index) => (
                  <li key={index}>{city}</li>
                ))}
              </ul>
     
    </ul>
                </div>
              )}

              {data.consultancies?.length > 0 && (
                <div>
                  <p className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Gift className="text-amber-600 w-5 h-5" />
                    consultancies
                  </p>
                  <ul className="list-disc list-inside pl-4 text-gray-600">
                    {data.consultancies.map(
                      (item: { id: string; text: string }, index: number) => (
                        <li key={index}>{item.text}</li> // ✅ use item.label
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* Precautions */}
              {data.precautions && (
                <div>
                  <p className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="text-red-500 w-5 h-5" />
                    Precautions
                  </p>
                  <ul className="list-disc list-inside pl-4 text-gray-600">
                  {Object.entries(data.precautions).map(([key, val]: [string, Precaution]) =>
                      val.selected ? (
                        <li key={key}>
                          {key} - {val.value} {val.unit}
                        </li>
                      ) : null
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-end mt-6 gap-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handlePreviewSubmit}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Preview;
