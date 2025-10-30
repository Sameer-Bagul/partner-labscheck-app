'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PhoneInput } from '@/components/ui/phone-input';
import { cn } from '@/lib/utils';
import { ProfileformSchema } from '@/validations/profile';
import { updatePhoneNumber, updateUser } from '@/app/api/user/route';



export default function ProfileForm() {
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ProfileformSchema>>({
    resolver: zodResolver(ProfileformSchema),
    defaultValues: {
      first_name: 'John',
      last_name: 'Doe',
      date_of_birth: new Date('1990-01-01'),
      email: 'johndoe@example.com',
      phone: '+1234567890',
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileformSchema>) {
    setIsLoading(true);
    try {
      const updateData = {
        first_name: values.first_name,
        last_name: values.last_name,
        date_of_birth: values.date_of_birth ? format(values.date_of_birth, 'yyyy-MM-dd') : undefined,
        email: values.email,
        phone: values.phone,
      };
      await updateUser(updateData);
      toast.success('Profile Updated!');
      setEditing(false);
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className='bg-transparent'>
      <CardHeader>General Information</CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:grid  grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>First Name: </FormLabel>
                
                  <FormControl>
                  {
                  // !isEditing ? <Label>{field.value}</Label> :
                    <Input placeholder="Enter First Name" {...field} disabled={!isEditing} />
                  }
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name:</FormLabel>
                  <FormControl>
                  {
                  // !isEditing ? <Label>{field.value}</Label> :
                    <Input placeholder="Enter Last Name" {...field} disabled={!isEditing} />
              }
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                      { 
                      // !isEditing ? <Label>{field.value ? format(field.value, 'PPP') : 'No date selected'}</Label> :
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={!isEditing}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        }
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                  {
                  // !isEditing ? <Label>{field.value}</Label> :
                    <Input placeholder="Enter Email" type="email" {...field} disabled={!isEditing} />
              }
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number: </FormLabel>
                  <FormControl className="w-full">
                  {
                  // !isEditing ? <Label>{field.value}</Label> :
                    <PhoneInput placeholder="Placeholder" {...field} defaultCountry="US" disabled={!isEditing} />
              }
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           

            {/* Button Controls */}
            <div className="col-span-2 flex justify-end">
                {isEditing &&
                <Button className='w-[120px]' type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              }
            </div>

          </form>
        </Form>
        <div className="flex justify-end">
        {!isEditing &&
        <Button className='w-[120px]' type="button" onClick={() => setEditing(true)} variant="outline">
          Edit
         </Button> }
            </div>
       
             

      </CardContent>
    </Card>
  );
}
