'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';

const formSchema = z.object({
  prev_password: z.string(),
  new_password: z.string().min(6),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

export default function ChangePasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(_values: z.infer<typeof formSchema>) {
    toast.success('Password updated successfully');

  }

  return (
    <Card className='bg-transparent'>
      <CardHeader>Change Password</CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col sm:grid grid-cols-2 gap-6'>
            <FormField control={form.control} name='prev_password' render={({ field }) => (
              <FormItem>
                <FormLabel>Previous Password</FormLabel>
                <FormControl><PasswordInput {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='new_password' render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl><PasswordInput {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='confirm_password' render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl><PasswordInput {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
           <div  className="flex h-full justify-end items-end">
           <Button type='submit'>Submit</Button>
           </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
