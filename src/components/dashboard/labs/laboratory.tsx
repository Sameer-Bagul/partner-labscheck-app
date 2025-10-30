"use client";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TimePicker from "./workingtime";
import { useAddLabs, useUpdateLabs } from "@/hooks/dashboard/use-labs";
import { Spinner } from "@/components/ui/spinner";
import { formSchema } from "@/validations/labs";
import { useRouter } from "next/navigation";
import LocationSearch from "./locationsearch";
import PincodeInput from "./pincodeinput";

const extendedFormSchema = formSchema.extend({
  clinical_certificate: z.instanceof(File, { message: "Required" }),
  shop_license: z.instanceof(File, { message: "Required" }),
  gst_certificate: z.instanceof(File).optional(),
  nabl_certificate: z.instanceof(File).optional(),
});

// Country data with flag information
const countryData = [
  { code: "+1", country: "US", name: "United States" },
  { code: "+91", country: "IN", name: "India" },
  { code: "+44", country: "GB", name: "United Kingdom" },
  { code: "+61", country: "AU", name: "Australia" },
  { code: "+33", country: "FR", name: "France" },
  { code: "+49", country: "DE", name: "Germany" },
  { code: "+81", country: "JP", name: "Japan" },
  { code: "+86", country: "CN", name: "China" },
  { code: "+7", country: "RU", name: "Russia" },
  { code: "+55", country: "BR", name: "Brazil" },
  { code: "+27", country: "ZA", name: "South Africa" },
  { code: "+971", country: "AE", name: "UAE" },
  { code: "+966", country: "SA", name: "Saudi Arabia" },
  { code: "+65", country: "SG", name: "Singapore" },
  { code: "+60", country: "MY", name: "Malaysia" },
  { code: "+52", country: "MX", name: "Mexico" },
  { code: "+34", country: "ES", name: "Spain" },
  { code: "+39", country: "IT", name: "Italy" },
  { code: "+31", country: "NL", name: "Netherlands" },
  { code: "+46", country: "SE", name: "Sweden" },
  { code: "+47", country: "NO", name: "Norway" },
  { code: "+45", country: "DK", name: "Denmark" },
  { code: "+41", country: "CH", name: "Switzerland" },
  { code: "+43", country: "AT", name: "Austria" },
  { code: "+32", country: "BE", name: "Belgium" },
  { code: "+351", country: "PT", name: "Portugal" },
  { code: "+48", country: "PL", name: "Poland" },
  { code: "+420", country: "CZ", name: "Czech Republic" },
  { code: "+36", country: "HU", name: "Hungary" },
  { code: "+30", country: "GR", name: "Greece" },
  { code: "+90", country: "TR", name: "Turkey" },
  { code: "+972", country: "IL", name: "Israel" },
  { code: "+98", country: "IR", name: "Iran" },
  { code: "+20", country: "EG", name: "Egypt" },
  { code: "+212", country: "MA", name: "Morocco" },
  { code: "+234", country: "NG", name: "Nigeria" },
  { code: "+254", country: "KE", name: "Kenya" },
  { code: "+233", country: "GH", name: "Ghana" },
  { code: "+62", country: "ID", name: "Indonesia" },
  { code: "+66", country: "TH", name: "Thailand" },
  { code: "+84", country: "VN", name: "Vietnam" },
  { code: "+63", country: "PH", name: "Philippines" },
  { code: "+82", country: "KR", name: "South Korea" },
  { code: "+880", country: "BD", name: "Bangladesh" },
  { code: "+94", country: "LK", name: "Sri Lanka" },
  { code: "+977", country: "NP", name: "Nepal" },
  { code: "+92", country: "PK", name: "Pakistan" },
  { code: "+93", country: "AF", name: "Afghanistan" },
  { code: "+54", country: "AR", name: "Argentina" },
  { code: "+56", country: "CL", name: "Chile" },
  { code: "+57", country: "CO", name: "Colombia" },
  { code: "+51", country: "PE", name: "Peru" },
  { code: "+58", country: "VE", name: "Venezuela" },
];

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

interface WorkingHoursDay {
  openHour: string;
  closeHour: string;
  open24Hours: boolean;
}

interface LabData {
  id?: number;
  name?: string;
  phoneNo?: string; // Changed back to string to match backend schema
  email?: string;
  address?: string;
  locality?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: number;
  latitude?: number;
  longitude?: number;
  website?: string;
  googlePlaceId?: string;
  googlemap?: string;
  status?: string;
  workingHours?: Record<Day, WorkingHoursDay>;
  serviceable_pin_codes?: string[];
}

export default function LabForm({ labData }: { labData?: LabData }) {
  // Add separate state for phone number management
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("+91");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { mutate: addLab, isPending: addingLab } = useAddLabs();
  const { mutate: updateLab, isPending: updatingLab } = useUpdateLabs();
  const isEditing = Boolean(labData);

  // Helper function to parse working hours from backend string
  const parseWorkingHoursFromBackend = (
    workingHoursString?: string
  ): Record<Day, WorkingHoursDay> => {
    if (!workingHoursString) return sanitizeWorkingHours({});


    try {
      const parsed = JSON.parse(workingHoursString);
      return sanitizeWorkingHours(parsed);
    } catch (error) {
      console.error("Failed to parse working hours:", error);
      return sanitizeWorkingHours({});
    }
  };

  const sanitizeWorkingHours = (
    raw: Partial<Record<Day, Partial<WorkingHoursDay>>>
  ): Record<Day, WorkingHoursDay> => {
    const result: Record<Day, WorkingHoursDay> = {
      Monday: { openHour: "", closeHour: "", open24Hours: false },
      Tuesday: { openHour: "", closeHour: "", open24Hours: false },
      Wednesday: { openHour: "", closeHour: "", open24Hours: false },
      Thursday: { openHour: "", closeHour: "", open24Hours: false },
      Friday: { openHour: "", closeHour: "", open24Hours: false },
      Saturday: { openHour: "", closeHour: "", open24Hours: false },
      Sunday: { openHour: "", closeHour: "", open24Hours: false },
    };

    (Object.keys(result) as Day[]).forEach((day) => {
      const data = raw?.[day];
      if (data) {
        result[day] = {
          open24Hours: data.open24Hours || false,
          openHour: data.open24Hours ? "00:00" : data.openHour || "",
          closeHour: data.open24Hours ? "23:59" : data.closeHour || "",
        };
      }
      // If no data for the day, keep it as empty (closed)
    });

    return result;
  };

  const form = useForm<z.infer<typeof extendedFormSchema>>({
    resolver: zodResolver(extendedFormSchema),
    defaultValues: {
      labname: labData?.name || "",
      phoneNo: labData?.phoneNo || "", // Keep as string since backend sends it as string
      email: labData?.email || "",
      address: labData?.address || "",
      pincode: labData?.pincode || 0,
      city: labData?.city || "",
      country_state: [labData?.country || "", labData?.state || ""],
      locality: labData?.locality || "",
      workingHours: parseWorkingHoursFromBackend(
        (labData?.workingHours as unknown) as string
      ),
      latitude: labData?.latitude || 0,
      longitude: labData?.longitude || 0,
      website: labData?.website || "",
      googlePlaceId: labData?.googlePlaceId || "",
      serviceable_pin_codes: labData?.serviceable_pin_codes?.map(String) || [],

    },
  });

  // Initialize phone state from labData
  useEffect(() => {
    if (labData?.phoneNo) {
      // Backend sends phoneNo as a string with 10 digits
      const phoneValue = labData.phoneNo;
      // For existing data, it's just the 10-digit number without country code
      setPhoneNumber(phoneValue);
      // Keep default country code (+91) or you could store country code separately
    }
  }, [labData?.phoneNo]);

  // Update form value whenever phone state changes
  useEffect(() => {
    const phoneValue = `${phoneCountryCode}${phoneNumber}`;
    form.setValue('phoneNo', phoneValue);
    // Trigger validation after setting the value
    if (phoneNumber.length === 10) {
      setTimeout(() => {
        form.trigger('phoneNo');
      }, 100);
    }
  }, [phoneCountryCode, phoneNumber, form]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof extendedFormSchema>) => {
    const formData = new FormData();

    // Process website URL - add protocol if missing and not empty
    let processedWebsite = "";
    if (values.website && values.website.trim()) {
      const website = values.website.trim();
      processedWebsite = website.startsWith('http') ? website : `https://${website}`;
    }

    const labDataObj = {
      name: values.labname,
      phoneNo: phoneNumber, // Send only the 10-digit number as a string
      email: values.email,
      address: values.address,
      locality: values.locality,
      city: values.city,
      state: values.country_state?.[1] || "",
      country: values.country_state?.[0] || "",
      pincode: Number(values.pincode),
      workingHours: sanitizeWorkingHours(values.workingHours),
      latitude: values.latitude || 0,
      longitude: values.longitude || 0,
      googlePlaceId: values.googlePlaceId,
      status: "Pending",
      website: processedWebsite,
      serviceable_pin_codes: values.serviceable_pin_codes?.map((pin) => Number(pin)) || [],
    };

    formData.append("lab_data", JSON.stringify(labDataObj));
    formData.append("clinical_certificate", values.clinical_certificate);
    formData.append("shop_license", values.shop_license);
    if (values.gst_certificate) {
      formData.append("gst_certificate", values.gst_certificate);
    }
    if (values.nabl_certificate) {
      formData.append("nabl_certificate", values.nabl_certificate);
    }
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }


    if (isEditing) {
      formData.append("lab_id", labData.id?.toString() || "");


      updateLab(formData, { onSuccess: () => router.push("/laboratory") });
    } else {
      addLab(formData, { onSuccess: () => router.push("/laboratory") });
    }
  };


  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
          {isEditing ? 'Update Laboratory Information' : 'Add New Laboratory'}
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm">
          Fill in the details below to {isEditing ? 'update' : 'register'} your laboratory
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          
          {/* Basic Information Card */}
          <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6 border border-purple-100/50">
            <div className="flex items-center gap-2 pb-3 sm:pb-4 border-b border-purple-100">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>

            {/* Lab Name */}
            <FormField
              control={form.control}
              name="labname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Laboratory Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter laboratory name" 
                      {...field}
                      className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email + Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">Email Address *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="lab@example.com" 
                        {...field}
                        className="h-10 sm:h-11 text-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Phone Number *</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="relative" ref={dropdownRef}>
                          {/* Custom Dropdown Button */}
                          <button
                            type="button"
                            className="flex h-11 w-24 rounded-l-md border border-r-0 border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 items-center justify-between hover:bg-gray-50 transition-colors"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={`https://flagcdn.com/24x18/${countryData.find(c => c.code === phoneCountryCode)?.country.toLowerCase()}.png`}
                                alt="flag"
                                className="w-6 h-4 object-cover rounded-sm"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <span className="text-xs font-medium">
                                {countryData.find(c => c.code === phoneCountryCode)?.code}
                              </span>
                            </div>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Custom Dropdown Options */}
                          {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                              {countryData.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm hover:bg-purple-50 focus:bg-purple-50 focus:outline-none transition-colors"
                                  onClick={() => {
                                    setPhoneCountryCode(country.code);
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  <img
                                    src={`https://flagcdn.com/24x18/${country.country.toLowerCase()}.png`}
                                    alt={`${country.name} flag`}
                                    className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  <span className="flex-1 text-left truncate font-medium">
                                    {country.name}
                                  </span>
                                  <span className="text-gray-500 text-xs font-mono">
                                    {country.code}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit number"
                          value={phoneNumber}
                          onChange={(e) => {
                            const cleanValue = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                            setPhoneNumber(cleanValue);
                          }}
                          onKeyDown={(e) => {
                            const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End'];
                            if (controlKeys.includes(e.key)) {
                              return;
                            }
                            if (!/\d/.test(e.key)) {
                              e.preventDefault();
                            }
                            if (phoneNumber.length >= 10 && /\d/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          maxLength={10}
                          className="rounded-l-none flex-1 h-10 sm:h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Website + Serviceable Pincodes Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">Website <span className="text-gray-400 font-normal">(Optional)</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., example.com"
                        {...field}
                        value={field.value || ''}
                        className="h-10 sm:h-11 text-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="serviceable_pin_codes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">Serviceable Pincode(s) *</FormLabel>
                    <FormControl>
                      <PincodeInput
                        value={field.value || []}
                        onChange={(val) => field.onChange(val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Location Information Card */}
          <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6 border border-purple-100/50">
            <div className="flex items-center gap-2 pb-3 sm:pb-4 border-b border-purple-100">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Location Details</h3>
            </div>

            <FormField
              control={form.control}
              name="googlePlaceId"
              render={() => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">Search & Select Location</FormLabel>
                  <FormControl>
                    <LocationSearch
                      onLocationSelect={(location) => {
                        form.setValue("googlePlaceId", location.placeId);
                        form.setValue("address", location.address);
                        form.setValue("latitude", location.lat);
                        form.setValue("longitude", location.lng);
                        form.setValue("pincode", location.pincode || "");
                        form.setValue("locality", location.locality || "");
                        form.setValue("city", location.city || "");
                        form.setValue("country_state", [
                          location.country || "",
                          location.state || "",
                        ]);
                      }}
                      defaultValue={labData?.address || ""}
                      defaultLat={labData?.latitude || 18.5204}
                      defaultLng={labData?.longitude || 73.8567}
                      isEditable={true}
                      initialData={
                        labData
                          ? {
                              locality: labData.locality || "",
                              city: labData.city || "",
                              stateCountry: `${labData.state || ""}, ${
                                labData.country || ""
                              }`,
                              pincode: labData.pincode?.toString() || "",
                              lat: labData.latitude,
                              lng: labData.longitude,
                            }
                          : null
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Working Hours & Documents Card */}
          <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6 border border-purple-100/50">
            <div className="flex items-center gap-2 pb-3 sm:pb-4 border-b border-purple-100">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Working Hours & Documents</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Working Hours - Takes 2 columns on desktop */}
              <div className="lg:col-span-2">
                <FormField
                  control={form.control}
                  name="workingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">Working Hours</FormLabel>
                      <TimePicker
                        initialData={field.value}
                        onChange={(val) => {
                          console.log("✅ Final working hours object =>", val);
                          field.onChange(val);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Documents - Takes 1 column on desktop, full width on mobile */}
              <div className="space-y-3 sm:space-y-4">
                <div className="mb-2">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Required Documents</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500">Upload PDF, JPG, or PNG files</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="clinical_certificate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">Clinical Certificate *</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] || null)
                          }
                          className="block w-full text-xs sm:text-sm text-gray-700 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4
                          file:rounded-lg file:border-0
                          file:text-xs sm:file:text-sm file:font-semibold
                          file:bg-gradient-to-r file:from-purple-50 file:to-violet-50 file:text-purple-700
                          hover:file:from-purple-100 hover:file:to-violet-100
                          border border-gray-200 rounded-lg cursor-pointer
                          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shop_license"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">Shop Act *</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] || null)
                          }
                          className="block w-full text-xs sm:text-sm text-gray-700 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4
                          file:rounded-lg file:border-0
                          file:text-xs sm:file:text-sm file:font-semibold
                          file:bg-gradient-to-r file:from-purple-50 file:to-violet-50 file:text-purple-700
                          hover:file:from-purple-100 hover:file:to-violet-100
                          border border-gray-200 rounded-lg cursor-pointer
                          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nabl_certificate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">NABL Certificate <span className="text-gray-400 font-normal">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] || null)
                          }
                          className="block w-full text-xs sm:text-sm text-gray-700 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4
                          file:rounded-lg file:border-0
                          file:text-xs sm:file:text-sm file:font-semibold
                          file:bg-gradient-to-r file:from-purple-50 file:to-violet-50 file:text-purple-700
                          hover:file:from-purple-100 hover:file:to-violet-100
                          border border-gray-200 rounded-lg cursor-pointer
                          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gst_certificate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">GST Certificate <span className="text-gray-400 font-normal">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] || null)
                          }
                          className="block w-full text-xs sm:text-sm text-gray-700 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4
                          file:rounded-lg file:border-0
                          file:text-xs sm:file:text-sm file:font-semibold
                          file:bg-gradient-to-r file:from-purple-50 file:to-violet-50 file:text-purple-700
                          hover:file:from-purple-100 hover:file:to-violet-100
                          border border-gray-200 rounded-lg cursor-pointer
                          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> {/* End of documents div */}
            </div> {/* End of grid (working hours + documents) */}
          </div> {/* End of Working Hours & Documents Card */}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/laboratory")}
              className="px-6 sm:px-8 h-10 sm:h-11 text-sm border-gray-300 hover:bg-gray-50 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-6 sm:px-8 h-10 sm:h-11 text-sm bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all order-1 sm:order-2"
              disabled={addingLab || updatingLab}
            >
              {addingLab || updatingLab ? (
                <div className="flex items-center gap-2">
                  <Spinner className="text-white w-4 h-4" />
                  <span className="text-sm">{isEditing ? 'Updating...' : 'Submitting...'}</span>
                </div>
              ) : isEditing ? (
                'Update Laboratory'
              ) : (
                'Submit Laboratory'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
