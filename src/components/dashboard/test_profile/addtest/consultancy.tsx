import { Textarea } from '@/components/ui/textarea';
import { Minus } from 'lucide-react';


const ConsultancyComponent = ({ fields, remove, register }) => {

    return (
        <div className="space-y-4 mt-4">
            {fields.map((field, index) => (
                <div key={field.id} className="relative">
                    <label className="block text-sm font-medium mb-1">Consultancy {index + 1}</label>
                    <Textarea
                        {...register(`consultancies.${index}.text`, {
                            validate: (value) =>
                                value.trim().length > 0 || 'Consultancy cannot be blank',
                        })}
                        placeholder="Enter consultancy details"
                        className='border-slate-200 placeholder:text-slate-400 shadow-sm focus-visible:ring-0 focus:shadow-md'
                    />
                    <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-0 right-0 text-destructive hover:text-red-700"
                        aria-label="Remove consultancy"
                    >
                        <Minus size={20} />
                    </button>
                </div>
            ))}
        </div>
    )
}

export default ConsultancyComponent;