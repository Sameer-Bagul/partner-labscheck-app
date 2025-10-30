import { z } from "zod";

// Precaution Schema
const precautionSchema = z.object({
  name: z.string(),
  selected: z.boolean(),
  value: z.string().optional(),
}).refine(
  (data) => {
    // if selected, value must be present
    if (data.selected && (!data.value || data.value.trim() === "")) return false;
    return true;
  },
  {
    message: "Time is required when precaution is selected",
    path: ["value"], // this ensures error shows at correct field
  }
);

// Report Delivery Schema
const reportDeliverySchema = z.object({
  name: z.string(),
  selected: z.boolean(),
});

// Main Test Schema
export const testSchema = z.object({
  suggestion_id: z.number().optional(), // optional for new entries
  name: z.string().min(1, "Test name is required"),
  parameters: z
    .array(z.object({ id: z.number(), name: z.string() })), // allow empty array
  home_collection: z.boolean(),
  precautions: z.array(precautionSchema),
  consultations: z.array(z.string()).optional(),
  report_turnaround_time: z
    .object({
      value: z.number().optional(),
      unit: z.string().optional(),
    })
    .optional(),
  report_delivery: z.array(reportDeliverySchema).optional(),
  cost: z.number({ required_error: "Cost is required" }).positive("Cost must be greater than 0"),
});

// Export testFormSchema as an alias for testSchema
export const testFormSchema = testSchema;
