import { z } from "zod";

// Single precaution rule: if selected, value must be provided
const precautionSchema = z.object({
  name: z.string(),
  selected: z.boolean(),
  value: z.string().optional(),
}).refine(
  (data) => {
    if (data.selected && (!data.value || data.value.trim() === "")) return false;
    return true;
  },
  {
    message: "Duration is required when precaution is selected",
    path: ["value"],
  }
);

// Report Delivery (optional but reusable)
const reportDeliverySchema = z.object({
  name: z.string(),
  selected: z.boolean(),
});

// Final schema for a single package
export const packageSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Package name is required"),
  basic_tests: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })).min(2, "At least two basic tests are required"),

  homeCollection: z.enum(["yes", "no"], {
    errorMap: () => ({ message: "Home collection must be yes or no" }),
  }),

  precautions: z.array(precautionSchema),

  reportTime: z.object({
    value: z.string().min(1, "Turnaround time is required"),
    unit: z.enum(["hrs", "days"], {
      errorMap: () => ({ message: "Please select a unit (hrs or days)" }),
    }),
  }),

  reportDelivery: z.array(reportDeliverySchema).optional(),

  cost: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Cost must be a positive number" }
  ),

  consultations: z.array(z.string()),

  selected: z.boolean().optional(),
});
