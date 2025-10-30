import z from 'zod'

export const ProfileFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  date_of_birth: z.coerce
    .date({ required_error: 'Date of birth is required' })
    .refine(
      (date) => date <= new Date() && date >= new Date('1900-01-01'),
      'Date of birth must be between 1900 and today',
    ),
  // date_of_birth: z.date().optional(),
});



export const ProfileformSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  date_of_birth: z.coerce.date(),
  email: z.string(),
  phone: z.string(),
  bio: z.string(),
});




export const userformSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  role: z.string().min(1, 'Role is required'),
  designation: z.string().min(1, 'Designation is required'),
  laboratory: z.array(z.string()).nonempty('Select at least one laboratory'),
});