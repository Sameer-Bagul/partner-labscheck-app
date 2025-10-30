
"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import Step1 from "@/components/dashboard/test_profile/steps/step1";
import { useAddNewTests } from "@/hooks/dashboard/use-tests";
import { useRouter } from "next/navigation";
import { testSchema } from "@/validations/Test/test"; 
import { TestItem } from "@/types/test";

interface AddProfileStepperProps {
  testData?: TestItem[];
}
const AddProfileStepper = ({ testData }: AddProfileStepperProps) => {
  const [step1Data, setStep1Data] = useState<TestItem[]>([]);
  const { mutateAsync: addTest, isPending } = useAddNewTests();


  const router=useRouter();



const handleSubmit = async () => {
  // Separate custom and suggested tests
 const suggestedTests = step1Data.filter(
  (test) => !test.isCustom && test.suggestion_id && test.selected
);


  const customTests = step1Data
    .filter((test) => test.isCustom && test.selected)
    .map(({ suggestion_id, ...rest }) => rest); 

  const finalTests = [...suggestedTests, ...customTests];

  if (finalTests.length === 0) {
    return toast.warning("No tests to submit");
  }

  // Sanitize report_delivery inside each test
  const sanitizedTests = finalTests.map(({ isEditable, isCustom,selected, ...test }) => ({
    ...test,
    report_delivery: Array.isArray(test.report_delivery)
      ? test.report_delivery.filter((d) => d.selected)
      : [],
  }));
  for (const test of sanitizedTests) {
    const result = testSchema.safeParse(test);
    if (!result.success) {
      const message = result.error.errors[0].message;
      toast.error(message);
      return;
    }
  }



  try {
    await addTest(sanitizedTests);
    toast.success("Tests added successfully");
    router.push("/profile");
  } catch (error) {
    console.error("Error adding tests:", error);
    toast.error("Failed to add tests");
  }
};

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with Submit Button */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="flex justify-between items-center p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Test Profile</h1>
            <p className="text-gray-600 text-sm mt-1">Create custom tests and select suggested tests for your laboratory</p>
          </div>
          <button
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Tests"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Step1 testData={testData} onDataChange={setStep1Data} />
      </div>
    </div>
  );
};

export default AddProfileStepper;