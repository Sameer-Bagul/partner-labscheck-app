// import * as z from 'zod';

// export const formSchema = z.object({
//   labname: z.string({ required_error: "Lab name is required" }),
//   phoneNo: z.string({ required_error: "Phone number is required" }),
 
//   email: z.string().email({ message: "Invalid email address" }),
//   address: z.string().max(255, "Address too long"),
//   sublocality: z.string().optional(), // ✅ Added this

//   pincode: z.preprocess(
//     (val) => (val === '' ? undefined : Number(val)),
//     z
//       .number({
//         required_error: "Pincode is required",
//         invalid_type_error: "Pincode must be a number",
//       })
//       .int()
//       .min(100000, "Pincode must be 6 digits")
//       .max(999999, "Pincode must be 6 digits")
//   ),

//   country_state: z.tuple([
//     z.string({ required_error: "Country is required" }),
//     z.string().optional(),
//   ]),

//   locality: z.string({ required_error: "Locality is required" }),
//   city: z.string({ required_error: "City is required" }),

 

//   workingHours: z.string({ required_error: "Working hours required" }),





//   latitude: z.number().optional(),
//   longitude: z.number().optional(),
// });


import * as z from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Valid country codes array (longest first to ensure proper matching)
const validCountryCodes = [
  '+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36', '+39', '+41', '+43', '+44', '+45', '+46', '+47', '+48', '+49', '+51', '+52', '+54', '+55', '+56', '+57', '+58', '+60', '+61', '+62', '+63', '+65', '+66', '+81', '+82', '+84', '+86', '+90', '+91', '+92', '+93', '+94', '+98', '+212', '+233', '+234', '+254', '+351', '+380', '+420', '+852', '+880', '+886', '+966', '+971', '+972', '+977'
];

export const formSchema = z.object({
  labname: z.string({ required_error: "Lab name is required" }).min(1, "Lab name is required"),
  phoneNo: z.string().refine((val) => {
    // Find the matching country code (longest match first)
    let countryCode = '';
    let nationalNumber = '';
    
    for (const code of validCountryCodes) {
      if (val.startsWith(code)) {
        countryCode = code;
        nationalNumber = val.substring(code.length);
        break;
      }
    }
    
    if (!countryCode) {
      return false; // No valid country code found
    }
    
    // Check if national number is exactly 10 digits~
    const digitOnly = nationalNumber.replace(/[^\d]/g, '');
    return digitOnly.length === 10;
  }, {
    message: "Please enter exactly 10 digits for the phone number"
  }),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address" })
    .refine(
      (val) => {
        // Additional email validation - check for common patterns
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val);
      },
      {
        message: "Please enter a valid email address",
      }
    ),
  address: z.string().max(255, "Address too long"),
  // sublocality: z.string().optional(),

  pincode: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({
        required_error: "Pincode is required",
        invalid_type_error: "Pincode must be a number",
      })
      .int()
      .min(100000, "Pincode must be 6 digits")
      .max(999999, "Pincode must be 6 digits")
  ),

  country_state: z.tuple([
    z.string({ required_error: "Country is required" }),
    z.string().optional(),
  ]),

  locality: z.string({ required_error: "Locality is required" }),
  city: z.string({ required_error: "City is required" }),
 workingHours: z.record(
  z.string(),
  z.object({
    openHour: z.string().optional(),
    closeHour: z.string().optional(),
    open24Hours: z.boolean().optional(),
  })
),


  latitude: z.number().optional(),
  longitude: z.number().optional(),

  // ✅ Add Google Place ID field
  googlePlaceId: z.string().optional(),

  // ✅ Optional website with lenient validation
  website: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true; // Allow empty values
        
        // If value is provided, do basic URL validation
        try {
          // Add protocol if missing
          const urlToTest = val.startsWith('http') ? val : `https://${val}`;
          new URL(urlToTest);
          return true;
        } catch {
          // If URL constructor fails, check for basic domain pattern
          const basicDomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return basicDomainRegex.test(val.replace(/^https?:\/\//, ''));
        }
      },
      {
        message: "Please enter a valid website URL (e.g., example.com or https://example.com)",
      }
    ),

  // ✅ Certificate files (if applicable)
  clinical_certificate: z.instanceof(File).optional(),
  shop_certificate: z.instanceof(File).optional(),
  gst_certificate: z.instanceof(File).optional(),
  nabl_certificate: z.instanceof(File).optional(),
serviceable_pin_codes: z
  .array(z.string().regex(/^\d{6}$/, "Invalid pincode format"))
  .min(1, "At least one serviceable pincode is required"),


});
