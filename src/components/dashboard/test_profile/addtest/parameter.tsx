"use client";

import React, { useMemo, useEffect } from "react";
import { useFormContext, useController } from "react-hook-form";
import { useGetAllParameters } from "@/hooks/dashboard/use-tests";
import { Input } from "@/components/ui/input";

export const SearchableList = ({
  title,
  items,
  selected,
  onChange,
}: {
  title: string;
  items: { id: string; label: string }[];
  selected: { id: string; label: string }[];
  onChange: (id: string, checked: boolean) => void;
}) => {
  const [query, setQuery] = React.useState("");

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const sortedItems = [
    ...filteredItems.filter((item) => selected.some((s) => s.id === item.id)),
    ...filteredItems.filter((item) => !selected.some((s) => s.id === item.id)),
  ];

  const handleChange = (id: string, checked: boolean) => {
    onChange(id, checked);
    setQuery("");
  };

  return (
    <div className="w-full md:w-1/2 p-2 border border-slate-200 shadow-sm rounded space-y-4">
      <h5 className="font-medium mb-2 mx-2">{title}</h5>
      <Input
        placeholder={`Search ${title.toLowerCase()}...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-2 text-primary border placeholder:text-gray-400 border-slate-100 shadow-sm focus-visible:ring-0 focus:outline-none"
      />
      <div className="mx-2 text-sm text-gray-500">Selected: {selected.length}</div>
      <div className="max-h-[120px] overflow-y-auto mx-2">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 mb-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.some((p) => p.id === item.id)}
                onChange={(e) => handleChange(item.id, e.target.checked)}
              />
              <span>{item.label}</span>
            </label>
          ))
        ) : (
          <label className="text-muted-foreground">No results found</label>
        )}
      </div>
    </div>
  );
};

const ParameterComponent = ({ onLoadingChange }) => {
  const { control } = useFormContext();
  const { data, isLoading } = useGetAllParameters();
// console.log("Fetched parameters/offerings: ", data);
useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  const parametersList = useMemo(() => {
    return (
      data?.parameters?.map((item) => ({
        id: String(item.id),
        label: item.name,
      })) || []
    );
  }, [data]);

  const offeringsList = useMemo(() => {
    return (
      data?.packages?.map((item) => ({
        id: String(item.id),
        label: item.name,
      })) || []
    );
  }, [data]);

  const { field: parametersField } = useController({ name: "parameters", control });
  const { field: offeringsField } = useController({ name: "offerings", control });

  const selectedParameters = parametersField.value || [];
  const selectedOfferings = offeringsField.value || [];

  const handleParamChange = (id: string, checked: boolean) => {
    const item = parametersList.find((p) => p.id === id);
    if (!item) return;

    const updated = checked
      ? [...selectedParameters, item]
      : selectedParameters.filter((p) => p.id !== id);

    parametersField.onChange(updated);
  };

  const handleOfferChange = (id: string, checked: boolean) => {
    const item = offeringsList.find((p) => p.id === id);
    if (!item) return;

    const updated = checked
      ? [...selectedOfferings, item]
      : selectedOfferings.filter((p) => p.id !== id);

    offeringsField.onChange(updated);
  };

  if (isLoading) return <p>Loading parameters...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <SearchableList
        title="Parameters"
        items={parametersList}
        selected={selectedParameters}
        onChange={handleParamChange}
      />
      <SearchableList
        title="Other Offerings"
        items={offeringsList}
        selected={selectedOfferings}
        onChange={handleOfferChange}
      />
    </div>
  );
};

export default ParameterComponent;
