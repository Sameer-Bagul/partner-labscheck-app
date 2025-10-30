'use client';

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditModal from "../test_profile/steps/editmodel"; // adjust path as needed
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { packageSchema } from "@/validations/Package/package"; // your schema
import { z } from "zod";
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAddPackage, useUpdatePackage } from '@/hooks/dashboard/use-package';
import {useRouter} from 'next/navigation';

type PackageFormType = z.infer<typeof packageSchema>;


type PackageType = {
  id: number;
  name: string;
  basic_tests: { id: number; name: string }[];
  homeCollection: string;
  precautions: { name: string; selected: boolean; value: string }[];
  reportTime: { value: string; unit: string };
  reportDelivery: { name: string; selected: boolean }[];
  cost: string;
  consultations: string[];
  selected?: boolean; // ✅ NEW FIELD
};


const defaultPrecautions = [
  { name: 'Fasting', selected: false, value: '' },
];


const defaultDelivery = [
  {
    "name": "Email",
    "selected": true
  },
  {
    "name": "WhatsApp",
    "selected": true
  },
  {
    "name": "Physical Copy",
    "selected": false
  }
];

const createNewPackage = (): PackageType => ({
  id: Date.now(),
  name: '',
  basic_tests: [], // now expects { id, name }[]
  homeCollection: 'no',
  precautions: defaultPrecautions.map(p => ({ ...p })),
  reportTime: { value: '', unit: 'hrs' },
  reportDelivery: defaultDelivery.map(d => ({ ...d })),
  cost: '',
  consultations: [],
});


type AddPackageProps = {
  packageData?: PackageType[] | PackageType;
  onSuccess?: () => void;
};

export default function AddPackage({ packageData, onSuccess }: AddPackageProps) {
  const isEditMode = !!packageData; // Determine if we're in edit mode
  
  const [packages, setPackages] = useState<PackageType[]>(
    packageData
      ? Array.isArray(packageData)
        ? packageData
        : [packageData]
      : [createNewPackage()]
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editType, setEditType] = useState<"parameters" | "facility" | "fasting" | "consultations" | 'basictest' | null>(null);
  const [activePackageId, setActivePackageId] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<Record<number, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPackageMutation = useAddPackage();
  const updatePackageMutation = useUpdatePackage();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const router = useRouter()

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!element) return;
    setIsDragging(true);
    setStartX(e.pageX - element.offsetLeft);
    setScrollLeft(element.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!isDragging || !element) return;
    e.preventDefault();
    const x = e.pageX - element.offsetLeft;
    const walk = x - startX;
    element.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);


  const handlePackageChange = (id: number, updated: Partial<PackageType>) => {
    setPackages(prev =>
      prev.map(pkg => (pkg.id === id ? { ...pkg, ...updated } : pkg))
    );
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handlePrecautionChange = (
    pkgId: number,
    index: number,
    updated: Partial<PackageType['precautions'][0]>
  ) => {
    setPackages(prev =>
      prev.map(pkg =>
        pkg.id === pkgId
          ? {
            ...pkg,
            precautions: pkg.precautions.map((p, i) =>
              i === index ? { ...p, ...updated } : p
            ),
          }
          : pkg
      )
    );
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[pkgId];
      return newErrors;
    });
  };

  const handleReportDeliveryChange = (
    pkgId: number,
    index: number,
    selected: boolean
  ) => {
    setPackages(prev =>
      prev.map(pkg =>
        pkg.id === pkgId
          ? {
            ...pkg,
            reportDelivery: pkg.reportDelivery.map((d, i) =>
              i === index ? { ...d, selected } : d
            ),
          }
          : pkg
      )
    );
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[pkgId];
      return newErrors;
    });
  };


  const handleAddPackage = () => {
    setPackages(prev => [...prev, createNewPackage()]);
  };

  const handleSubmit = async () => {
    // Validate all packages using Zod
    let hasError = false;
    const errors: Record<number, any> = {};
    packages.forEach((pkg) => {
      const result = packageSchema.safeParse(pkg);
      if (!result.success) {
        hasError = true;
        const flattenedErrors = result.error.flatten();
        errors[pkg.id] = {
          ...flattenedErrors.fieldErrors,
          ...flattenedErrors.formErrors
        };
      }
    });
    setFormErrors(errors);
    if (hasError) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Convert all packages to the API format
      const packageArray = packages.map(pkg => ({
        name: pkg.name,
        basic_tests: pkg.basic_tests,
        precautions: pkg.precautions,
        consultations: pkg.consultations,
        home_collection: pkg.homeCollection === "yes",
        report_turnaround_time: {
          value: parseInt(pkg.reportTime.value),
          unit: pkg.reportTime.unit
        },
        report_delivery: pkg.reportDelivery,
        cost: parseInt(pkg.cost)
      }));
      console.log("Submitting package data:", packageArray);

      if (packageData && !Array.isArray(packageData)) {
        // Edit mode: update a single package
        const packageId = packageData.id;
        const editedPackage = packageArray[0];
        // Attach the package_id and convert to FormData for your API
        const formData = new FormData();
        formData.append('package_id', packageId.toString());
        formData.append('name', editedPackage.name);
        formData.append('basic_tests', JSON.stringify(editedPackage.basic_tests));
        formData.append('precautions', JSON.stringify(editedPackage.precautions));
        formData.append('consultations', JSON.stringify(editedPackage.consultations));
        formData.append('home_collection', JSON.stringify(editedPackage.home_collection));
        formData.append('report_turnaround_time', JSON.stringify(editedPackage.report_turnaround_time));
        formData.append('report_delivery', JSON.stringify(editedPackage.report_delivery));
        formData.append('cost', editedPackage.cost.toString());
        await updatePackageMutation.mutateAsync(formData);
        toast.success("Package updated successfully!");
        onSuccess?.();
        router.push('/profile');
      } else {
        // Add mode: add all packages
        await addPackageMutation.mutateAsync(packageArray);
        setPackages([createNewPackage()]); // Reset form after add
        router.push('/profile'); // Redirect after adding
      }

      toast.success(packageData ? "Package updated successfully!" : "Package added successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting package:", error);
      toast.error(packageData ? "Failed to update package" : "Failed to add package");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">

      {
        isEditMode && !packageData && (
          <div className="text-left mb-4">
            <p className="text-sm text-red-600">No package found</p>
          </div>
        )
      }
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold mb-4 text-left mt-2">{packageData ? 'Edit Package' : 'Add Package'}</h1>
        {!isEditMode && packages.some(pkg => pkg.selected) && (
          <button
            onClick={() => {
              setPackages(prev => prev.filter(pkg => !pkg.selected));
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Delete Selected
          </button>
        )}
      </div>
      {packages.map(pkg => {
        const errors = formErrors[pkg.id] || {};
        return (
          <div
            key={pkg.id}
            className="w-full p-4 rounded-lg shadow-md border border-slate-200 bg-white hover:shadow-lg transition"
          >
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseUp}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="cursor-grab active:cursor-grabbing overflow-x-auto scrollbar-thin"
            >
              <div
                className="flex flex-col gap-5 md:grid md:min-w-[1500px]"
                style={{
                  gridTemplateColumns: `
                ${isEditMode ? '' : '0.1fr'}      /* Checkbox (only in add mode) */
    2fr      /* Package Name */
    1.5fr        /* Offerings */
    1fr        /* Home Collection */
    1fr        /* Precautions */
    1.5fr      /* Report Turnaround */
    1.5fr      /* Report Delivery */
    1fr        /* Cost */
    2fr        /* Consultations */
  `,
                  alignItems: "start",
                }}
              >
                {!isEditMode && (
                  <div className="flex justify-between items-center mb-2">
                    <Checkbox
                      checked={pkg.selected || false}
                      onCheckedChange={(checked) =>
                        handlePackageChange(pkg.id, { selected: !!checked })
                      }
                    />
                  </div>
                )}

                {/* Name */}
                <div>
                  <p className="text-sm font-medium mb-1">Package Name <sup>*</sup></p>
                  <Input
                    className="h-8 text-sm"
                    value={pkg.name}
                    onChange={e => handlePackageChange(pkg.id, { name: e.target.value })}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
                </div>

                {/* Parameters */}
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <p className="text-sm font-medium">Basic Tests <sup>*</sup></p>
                    <button
                      className="text-gray-500 hover:text-primary"
                      onClick={() => {
                        setActivePackageId(pkg.id);
                        setEditType("basictest"); // or "consultations", "fasting"
                        setEditModalOpen(true);
                      }}
                    >
                      <Pencil size={12} />
                    </button>
                  </div>
                  <ul className="list-disc pl-4 text-sm space-y-1">
                    {pkg.basic_tests?.length > 0 ? (
                      pkg.basic_tests.map((param, idx) => (
                        <li key={idx}>{param.name}</li>
                      ))
                    ) : (
                      <li className="text-gray-400">No Tests</li>
                    )}
                  </ul>
                  {(errors.basic_tests || errors["basic_tests"]) && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.basic_tests?.[0] || errors["basic_tests"]?.[0]}
                    </p>
                  )}
                </div>

                {/* Home Collection */}
                <div>
                  <p className="text-sm font-medium mb-1 whitespace-nowrap">Home Collection <sup className="text-xs p-0 m-0">*</sup></p>
                  <Select
                    value={pkg.homeCollection}
                    onValueChange={val => handlePackageChange(pkg.id, { homeCollection: val })}
                  >
                    <SelectTrigger className="border w-28 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.homeCollection && <p className="text-xs text-red-500 mt-1">{errors.homeCollection[0]}</p>}
                </div>

                {/* Precautions */}
                <div>
                  <p className="text-sm font-medium mb-1">Precautions</p>
                  {pkg.precautions.map((precaution, i) => (
                    <div key={i} className="mb-2 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={precaution.selected}
                          onCheckedChange={checked =>
                            handlePrecautionChange(pkg.id, i, { selected: !!checked })
                          }
                        />
                        <label className="capitalize text-sm">{precaution.name}</label>
                      </div>
                      {precaution.selected && (
                        <Input
                          className="w-24 h-8 text-sm"
                          placeholder="Duration (hrs)"
                          value={precaution.value}
                          onChange={e =>
                            handlePrecautionChange(pkg.id, i, { value: e.target.value })
                          }
                        />
                      )}
                    </div>
                  ))}
                  {(errors["precautions.0.value"] || errors.precautions) && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors["precautions.0.value"]?.[0] || errors.precautions?.[0]}
                    </p>
                  )}
                </div>

                {/* Report Turnaround */}
                <div>
                  <p className="text-sm font-medium mb-1">Report Turnaround <sup>*</sup></p>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      value={pkg.reportTime.value}
                      onChange={e =>
                        handlePackageChange(pkg.id, {
                          reportTime: { ...pkg.reportTime, value: e.target.value },
                        })
                      }
                    />
                    <Select
                      value={pkg.reportTime.unit}
                      onValueChange={val =>
                        handlePackageChange(pkg.id, {
                          reportTime: { ...pkg.reportTime, unit: val },
                        })
                      }
                    >
                      <SelectTrigger className="w-20 h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hrs">Hrs</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors["reportTime"] && (
                    <p className="text-xs text-red-500 mt-1">Report turnaround is required</p>
                  )}
                  {errors["reportTime.unit"] && (
                    <p className="text-xs text-red-500 mt-1">{errors.reportTime.unit[0]}</p>
                  )}
                </div>

                {/* Report Delivery */}
                <div>
                  <p className="text-sm font-medium mb-1">Report Delivery <sup>*</sup></p>
                  <div className="flex flex-col gap-1">
                    {pkg.reportDelivery.map((d, i) => (
                      <label key={i} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={d.selected}
                          onCheckedChange={checked =>
                            handleReportDeliveryChange(pkg.id, i, !!checked)
                          }
                        />
                        <span>{d.name}</span>
                      </label>
                    ))}
                  </div>
                  {(errors.reportDelivery || errors["reportDelivery"]) && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.reportDelivery?.[0] || errors["reportDelivery"]?.[0]}
                    </p>
                  )}
                </div>

                {/* Cost */}
                <div>
                  <p className="text-sm font-medium mb-1">Cost <sup>*</sup></p>
                  <Input
                    type="number"
                    value={pkg.cost}
                    onChange={e => handlePackageChange(pkg.id, { cost: e.target.value })}
                    className="h-8 text-sm"
                  />
                  {errors.cost && <p className="text-xs text-red-500 mt-1">{errors.cost[0]}</p>}
                </div>

                {/* Consultations */}
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <p className="text-sm font-medium">Consultations</p>
                    <button type="button" className="text-gray-500 hover:text-primary"
                      onClick={() => {
                        setActivePackageId(pkg.id);
                        setEditType("consultations"); // or "consultations", "fasting"
                        setEditModalOpen(true);
                      }}
                    >
                      <Pencil size={12} />
                    </button>
                  </div>
                  <ul className="list-disc pl-4 text-sm space-y-1">
                    {pkg.consultations.length > 0 ? (
                      pkg.consultations.map((c, idx) => (
                        <li key={idx}>Consultation - {c}</li>
                      ))
                    ) : (
                      <li className="text-gray-400">No Consultations</li>
                    )}
                  </ul>
                  {(errors.consultations || errors["consultations"]) && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.consultations?.[0] || errors["consultations"]?.[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add & Submit Buttons */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between pt-6">
        {!packageData && (
          <button
            onClick={handleAddPackage}
            className="bg-secondary px-4 py-2 rounded-md text-sm text-white hover:bg-secondary/60 transition w-full md:w-auto"
          >
            + Add Package
          </button>
        )}

        <button
          onClick={handleSubmit}
          className="bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-violet-900 w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? (packageData ? 'Updating...' : 'Adding...')
            : (packageData ? 'Update Package' : 'Submit')}
        </button>

      </div>

      {activePackageId !== null && (
        <EditModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditType(null);
            setActivePackageId(null);
          }}
          type={editType}
          test={packages.find((pkg) => pkg.id === activePackageId)}
          onSave={(updatedFields) => {
            setPackages((prev) =>
              prev.map((pkg) =>
                pkg.id === activePackageId ? { ...pkg, ...updatedFields } : pkg
              )
            );
            setEditModalOpen(false);
            setEditType(null);
            setActivePackageId(null);
          }}
        />
      )}

    </div>
  );
}
