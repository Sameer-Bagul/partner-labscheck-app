'use client';

import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select';
import { useAllLabList } from '@/hooks/dashboard/use-labs';
import { Spinner } from '@/components/ui/spinner';
import { MyFormData } from '@/types/test';
import { testformSchema } from '@/validations/test';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


interface EditFormProps {
  initialData: MyFormData;
  onSubmit: (data: {
    test_id: number;
    cost: number;
    labs_id: number[];
  }) => void;
  isPending?: boolean;
}
// ✅ Zod schema with validation



export default function EditForm({
  initialData,
  onSubmit,
  isPending,
}: EditFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof testformSchema>>({
    resolver: zodResolver(testformSchema),
    defaultValues: {
      id: Number(initialData?.id ?? ''),
      name: initialData?.name ?? '',
      short_description: initialData?.short_description ?? '',
      category: initialData?.category ?? '',
      avg_cost: initialData?.avg_cost ?? '',
      cost: initialData?.cost ?? 0,
      laboratory: initialData?.laboratory ?? [],
    },
  });

  const { data: labnamelist,refetch, isPending: isPendingLab } = useAllLabList();
  useEffect(()=>{
    refetch();
  },[labnamelist,refetch])

  const laboratoryOptions = isPendingLab
    ? [{ id: 'loading', name: <Spinner /> }]
    : [
        { id: 'all', name: 'All Laboratories' },
        ...(labnamelist?.map((lab: { id: number; name: string }) => ({
          id: lab.id,
          name: lab.name,
        })) || []),
      ];

  function handleSubmit(values: z.infer<typeof testformSchema>) {
    const selectedLabs = values.laboratory
      ?.map((labName) => {
        const lab = laboratoryOptions.find((l) => l.name === labName);
        return lab ? lab.id : null;
      })
      .filter(Boolean);

    const updatedValues = {
      test_id: values.id,
      cost: values.cost,
      labs_id: selectedLabs as number[], // Replace with array of
    };
    onSubmit(updatedValues);
    router.push('/tests');
  }

  const onError = (errors: FieldErrors) => {
    throw errors;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, onError)}
        className='space-y-4'
      >
        {/* Hidden ID Field */}
        <Input
          type='number'
          className='hidden'
          {...form.register('id', { valueAsNumber: true })}
        />

        {/* Name Field */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex  space-y-0'>
              <FormLabel className='p-3'>Name:</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  {...field}
                  readOnly
                  className='border-none  focus-visible:ring-0'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name='short_description'
          render={({ field }) => (
            <FormItem className='flex  space-y-0 '>
              <FormLabel className='trucate p-3'>Description:</FormLabel>
              <FormControl>
                <div className='p-3 text-sm  line-clamp-3'>{field.value}</div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem className='flex  space-y-0 '>
              <FormLabel className='p-3'>Category:</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  {...field}
                  readOnly
                  className='border-none focus-visible:ring-0'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Avg Cost Field */}
        <FormField
          control={form.control}
          name='avg_cost'
          render={({ field }) => (
            <FormItem className='flex  space-y-0 '>
              <FormLabel className='text-nowrap p-3'>Avg Cost:</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  {...field}
                  readOnly
                  className='border-none focus-visible:ring-0'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cost Field */}
        <FormField
          control={form.control}
          name='cost'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='p-3'>Cost</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Multi-Select Laboratory Dropdown */}
        <FormField
          control={form.control}
          name='laboratory'
          render={({ field }) => {
            const selectedLabs = field.value || [];
            const isAllSelected =
              selectedLabs.length === laboratoryOptions.length - 1;

            const handleChange = (selectedValues: string[]) => {
              if (selectedValues.includes('All Laboratories')) {
                field.onChange(
                  isAllSelected ? [] : laboratoryOptions.map((lab) => lab.name),
                );
              } else {
                field.onChange(selectedValues);
              }
            };

            return (
              <FormItem>
                <FormLabel className='p-3'>Select Laboratory</FormLabel>
                <FormControl>
                  <MultiSelector
                    values={selectedLabs}
                    onValuesChange={handleChange}
                    loop
                    className='w-full'
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder='Select laboratories' />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {laboratoryOptions.map((lab) => (
                          <MultiSelectorItem key={lab.id} value={lab.name}>
                            {lab.name}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </FormControl>
                <FormDescription>
                  Select multiple laboratories or All Laboratories to select
                  all.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Submit Button */}
        <Button type='submit' className='w-36'>
          {isPending ? (
            <Spinner size={'small'} className='text-white' />
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </Form>
  );
}
