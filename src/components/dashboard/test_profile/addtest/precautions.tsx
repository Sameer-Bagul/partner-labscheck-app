'use client'

import React, { useMemo } from 'react';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

import { Card } from '@/components/ui/card';
import { useController, useFormContext } from 'react-hook-form';

const precautionOptions = [
    { key: 'fasting', label: 'Fasting', type: 'duration' },
    { key: 'sexual', label: 'Sexual Abstinence', type: 'duration' },
    // { key: 'menstrual', label: 'Menstrual Cycle', type: 'duration' },
    { key: 'medicine', label: 'Medicine Abstinence', type: 'boolean' },

    // { key: 'homesample', label: 'Home Sample', type: 'boolean' },

];




const Precautions = () => {
    const { control, formState: { errors } } = useFormContext();
    const { field } = useController({ name: 'precautions', control });

    const precautions = useMemo(() => field.value, [field.value]);

    const handleChange = (type: string, fieldKey: string, value: string | boolean) => {
        field.onChange({
            ...precautions,
            [type]: {
                ...precautions?.[type],
                [fieldKey]: value,
            },
        });
    };

    return (
        <Card className="p-4 space-y-4 max-w-2xl">
            {precautionOptions.map((type) => {
                const item = precautions?.[type.key] || { selected: false, value: '' };
                const fieldError = errors?.precautions?.[type.key]?.value as { message?: string } | undefined;

                return (
                    <div
                        key={type.key}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 max-w-md place-content-center items-center"
                    >
                        {/* Checkbox + Label */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={item.selected}
                                onCheckedChange={(checked: boolean) =>
                                    handleChange(type.key, 'selected', checked)
                                }
                                className="h-[16px] w-[16px] rounded-md"
                            />
                            <span className="font-normal text-md">{type.label}</span>
                        </div>

                        {/* Duration Input */}
                        {item.selected && type.type === 'duration' && (
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2 items-center">
                                    <Input
                                        type="number"
                                        className="w-24 border-slate-300 placeholder:text-slate-400 shadow-sm focus-visible:ring-0 focus:shadow-md"
                                        placeholder="Days"
                                        value={item.value}
                                        min={1}
                                        onChange={(e) =>
                                            handleChange(type.key, 'value', e.target.value)
                                        }

                                    />
                                </div>
                                {fieldError && (
                                    <span className="text-sm text-red-500">{fieldError.message}</span>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </Card>
    );
};

export default Precautions