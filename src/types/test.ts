export type MyFormData = {
  id: string | number;
  name?: string;
  short_description?: string;
  category?: string;
  avg_cost?: string;
  cost?: number;
  laboratory?: string[];
}
// types/test.ts

export interface Parameter {
  id: number;
  name: string;
}

export interface Precaution {
  name: string;
  selected: boolean;
  value: string;
}

export interface TestItem {
  suggestion_id: number | null;
  name: string;
  parameters: Parameter[];
  home_collection: boolean;
  precautions: Precaution[];
  consultations: string[];
  report_turnaround_time: {
    value: number;
    unit: string;
  };
  report_delivery: { name: string; selected: boolean }[];
  cost: number;
  special_instruction?: string;
  isEditable?: boolean;
  selected?: boolean;
  isCustom?: boolean;
}
