'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select';
import { PhoneInput } from '@/components/ui/phone-input';
import { userformSchema } from '@/validations/profile';

type FormData = z.infer<typeof userformSchema>;

interface UserFormProps {
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
  roles: string[];
  laboratories: string[];
}

export default function UserForm({
  initialData,
  onSubmit,
  roles,
  laboratories,
}: UserFormProps) {
  
  const form = useForm({
    resolver: zodResolver(userformSchema),
    defaultValues: {
      id: initialData?.id || null,
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      role: initialData?.role || '',
      designation: initialData?.designation || '',
      laboratory: initialData?.laboratory || [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
              <FormLabel>phone</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    placeholder="Enter your phone number."
                    {...field}
                    defaultCountry="TR"
                  />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Role' />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='laboratory'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Laboratory</FormLabel>
              <MultiSelector
                values={field.value}
                onValuesChange={field.onChange}
              >
                <MultiSelectorTrigger>
                  <MultiSelectorInput placeholder='Select laboratories' />
                </MultiSelectorTrigger>
                <MultiSelectorContent>
                  <MultiSelectorList>
                    {laboratories.map((lab) => (
                      <MultiSelectorItem key={lab} value={lab}>
                        {lab}
                      </MultiSelectorItem>
                    ))}
                  </MultiSelectorList>
                </MultiSelectorContent>
              </MultiSelector>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Save</Button>
      </form>
    </Form>
  );
}
