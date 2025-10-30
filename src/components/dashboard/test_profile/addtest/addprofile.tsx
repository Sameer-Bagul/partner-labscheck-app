"use client";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { SingleInputSearch } from "./inputsearch";
import ParameterComponent from "./parameter";

import AddCity from "./addcity";
import Precautions from "./precautions";
import { useParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { RadioGroup } from '@radix-ui/react-dropdown-menu';
import Preview from "@/components/dashboard/test_profile/addtest/previewform";
import { zodResolver } from "@hookform/resolvers/zod";
import { testFormSchema } from "@/validations/Test/test";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import ConsultancyComponent from "./consultancy";

// interface CityType {
//   id: string;
//   name: string;
//   state: string;
// }

type CityData = {
  cities: string[];
};

type TestFormData = z.infer<typeof testFormSchema>;

type PrecautionState = {
  [key in
    | "fasting"
    | "sexual"
    | "menstrual"
    | "medicine"
    | "alcohol"
    | "caffeine"
    | "homesample"]: {
    selected: boolean;
    value: string;
    unit: "hrs" | "days";
  };
};

// type ParameterComponentProps = {
//   setParamete;

//   rData: (data: { parameters: string[]; offerings: string[] }) => void;
// };

export const AddProfile = ({ testData }: { testData?: any }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<TestFormData>(null);

  const [isParameterLoading, setIsParameterLoading] = useState(true);
  const [isCityLoading, setIsCityLoading] = useState(true);

  const isFormLoading = isParameterLoading || isCityLoading;

  const router = useRouter();

  const params = useParams();
  const id = params.id;

  // console.log("Id from add profile: ", id);

  const isEditing = Boolean(testData);
  // console.log("isEditing", isEditing);

  const form = useForm<TestFormData>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      name: testData?.name || "",
      // known_as: testData?.known_as || "",
      parameters: testData?.parameters || [],
      offerings: testData?.offerings || [],
      consultancies: testData?.consultancies || [],
      cities: testData?.cities || [],
      precautions: testData?.precautions || {
        fasting: { selected: false, value: "", unit: "hrs" },
        sexual: { selected: false, value: "", unit: "days" },
        medicine: { selected: false, value: "" },
      },
      home_sample: testData?.home_sample || "no",
      cost: testData?.cost || 0,
    },
  });

  const { control, register } = form; // for consultancy

  const {
    fields: consultancyFields,
    append: appendConsultancy,
    remove: removeConsultancy,
  } = useFieldArray({
    control,
    name: "consultancies",
  });

  const getResetFormValues = (retrievedData: TestFormData) => {
    return {
      name: retrievedData.name || "",
      // known_as: retrievedData.known_as || "",
      parameters: retrievedData.parameters || [],
      offerings: retrievedData.offerings || [],
      cities: retrievedData.cities || [],

      precautions: retrievedData.precautions || {
        fasting: { selected: false, value: "", unit: "hrs" },
        sexual: { selected: false, value: "", unit: "hrs" },
        menstrual: { selected: false, value: "", unit: "hrs" },
        medicine: { selected: false, value: "", unit: "hrs" },
        alcohol: { selected: false, value: "", unit: "hrs" },
        caffeine: { selected: false, value: "", unit: "hrs" },
      },
      home_sample: retrievedData.home_sample || "no",
      cost: retrievedData.cost || 0,
    };
  };

  // useEffect(() => {
  //   if (isEditing) {
  //     const retrievedData = testData.find(
  //       (element) => String(element.id) === String(id)
  //     );
  //     console.log("retrieved data: ", retrievedData);

  //     if (retrievedData) {
  //       const formvalues = getResetFormValues(retrievedData);
  //       form.reset(formvalues);
  //     }
  //   }
  // }, [isEditing, id, testData, form]);

  // const [selectedParameter, setselectedParameter] = useState("");
  // const [parameterPrice, setparameterPrice] = useState("");
  // const [selectedParameters, setselectedParameters] = useState<
  //   { parameter: string; price: number }[]
  // >([]);  for build now

  const [isTestNameSelected, setIsTestNameSelected] = useState(false); // For name selection

  // const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(null); //For City adding
  // const [selectedState, setSelectedState] = useState<StateProps | null>(null);  // For state selection

  // const [parameterData, setParameterData] = useState([]);
  // const [cityData, setCityData] = useState<CityData[] | null>(null);
  // const [precautionsData, setPrecautionsData] =
  //   useState<PrecautionState | null>(null);   for build

  // const [cost, setCost] = useState(0);

  // For updating test component details

  // const addparameter = () => {
  //   if (!selectedParameter || !parameterPrice) return;
  //   const price = parseFloat(parameterPrice);
  //   if (isNaN(price)) return;

  //   const exists = selectedParameters.find(
  //     (t) => t.parameter === selectedParameter
  //   );
  //   if (exists) return;

  //   setselectedParameters((prev) => [
  //     ...prev,
  //     { parameter: selectedParameter, price },
  //   ]);
  //   setselectedParameter("");
  //   setparameterPrice("");
  // };  for build...

  // const handleCostChange = (e) => {
  //   const value = e.target.value;
  //   setCost(value);
  // };

  // const totalPrice = selectedParameters.reduce((sum, t) => sum + t.price, 0);

  const onSubmit = (data: TestFormData) => {
    // console.log("Form Data: ", data)
    // console.log("Form Data: ", data);
    setPreviewData(data);
    setShowPreview(true);
  };

  const onError = (errors: unknown) => {
    console.error("Form validation failed:", errors);
  };

  const finalSubmit = (FormData: TestFormData) => {
    if (isEditing) {
    //   console.log("EDITING MODE - Updated Test Profile Data:", {
    //     id,
    //     ...FormData,
    //   });
    // } else {
    //   console.log("ADDING MODE - New Test Profile Data:", FormData);
    // }

    // Navigate after logging
    router.push("/profile");
  };

  // useEffect(() => {
  //   console.log("showPreview:", showPreview);
  //   console.log("previewData:", previewData);
  // }, [showPreview, previewData]);

  return (
    <div className="relative">
      {isFormLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="max-w-lg lg:max-w-none h-full flex flex-col gap-6 w-full mx-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-card-foreground">
                  Name
                </FormLabel>
                <FormControl>
                  <SingleInputSearch
                    value={field.value}
                    onSelect={(item) => {
                      form.setValue("name", item.name);
                      // form.setValue("known_as", item.known_as ?? ""); // No TypeScript error now
                    }}
                    onInputChange={(inputValue) => {
                      form.setValue("name", inputValue);
                      // if (!inputValue) form.setValue("known_as", "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {form.watch("known_as") && (
            <FormField
              control={form.control}
              name="known_as"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Known As</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}

          {/* Only show known as name when suggestion selected */}
          {/* {isTestNameSelected && (
            <FormField
              control={form.control}
              name="known_as"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Known As</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}

          <div>
            <h2 className="text-lg font-semibold mb-2">Test Parameters</h2>
            <ParameterComponent onLoadingChange={setIsParameterLoading} />
          </div>

          <div>
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">Consultation</h2>
              <button
                type="button"
                onClick={() => appendConsultancy({ text: "" })}
                className="w-fit bg-primary rounded-full p-1 hover:bg-secondary"
              >
                <Plus className="text-white" size={18} strokeWidth={2} />
              </button>
            </div>
            <ConsultancyComponent
              fields={consultancyFields}
              remove={removeConsultancy}
              register={register}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-2">
            <div className="border border-slate-200 p-4 shadow-sm rounded-lg">
              <FormField
                control={form.control}
                name="cities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold mb-2">
                      Cities
                    </FormLabel>
                    <AddCity
                      value={field.value}
                      onChange={field.onChange}
                      onLoadingChange={setIsCityLoading}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-start border border-slate-200 shadow-sm p-4 rounded-md">
              <FormField
                control={form.control}
                name="precautions"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold mb-2">
                      Test Precautions
                    </FormLabel>
                    <Precautions />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Facility</h2>

            <FormField
              control={form.control}
              name="home_sample"
              rules={{ required: "Please select if Home Sample is available." }}
              render={({ field }) => (
                <FormItem className="space-y-2 flex items-center space-x-6">
                  <FormLabel className="text-md font-normal">
                    Home Sample
                  </FormLabel>

                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-4 pb-1,"
                    >
                      <FormItem className="flex justify-center items-center  space-x-2">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal pb-2">Yes</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal pb-2">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem className="w-full space-y-2">
                <h2 className="text-lg font-semibold mb-2">Cost</h2>
                <FormControl>
                  <div className="relative w-1/4">
                    <span className="absolute inset-y-0 left-2 flex items-center text-gray-600 text-md">
                      ₹
                    </span>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="number"
                      min={0}
                      placeholder="Enter cost"
                      className="pl-6 border-slate-300 placeholder:text-slate-400 shadow-sm focus-visible:ring-0 focus:shadow-md focus:text-primary"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="w-full sm:max-w-[180px]">
              Submit
            </Button>
          </div>
          <Preview
            open={showPreview}
            onClose={() => setShowPreview(false)}
            data={previewData}
            onFinalSubmit={finalSubmit}
          />
        </form>
      </Form>
    </div>
  );
};

// name: str
// registrationNo: str
// franchiseId: Optional[int]
// email: str
// address: str
// googlePlaceId: Optional[str]
// workingHours: Optional[str]
// reviews: Optional[str]
// rating: Optional[float]
// latitude: Optional[float]
// longitude: Optional[float]
// pincode: Optional[int]
// locality: Optional[str]
// city: str
// state: Optional[str]
// country: Optional[str]
// website: Optional[str]
// franchiseWebsite: Optional[str]
// phoneNo: Optional[str]
// directionsUri: Optional[str]
// placeUri: Optional[str]
// photosUri: Optional[str]
// status: Optional[str] = "pending"createdDate: datetime
// lastModifiedDate: datetime
// createdBy: str
// lastModifiedBy: str