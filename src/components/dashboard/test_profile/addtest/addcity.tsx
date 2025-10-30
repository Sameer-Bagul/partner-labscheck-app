"use client";

import React, { useMemo, useState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useGetAllParameters } from "@/hooks/dashboard/use-tests";

type AddCityProps = {
  value: string[]; // ✅ Just an array of city names
  onChange: (value: string[]) => void;
  onLoadingChange?: (loading: boolean) => void;
};

const AddCity = ({ value, onChange, onLoadingChange  }: AddCityProps) => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetAllParameters();
  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  const cityList: string[] = data?.cities || [];

  // ✅ Filtered list based on search
  const filteredCities = useMemo(() => {
    return cityList
      .filter((city) => city.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const aSelected = value.includes(a) ? 0 : 1;
        const bSelected = value.includes(b) ? 0 : 1;
        return aSelected - bSelected;
      });
  }, [search, cityList, value]);

  const allVisibleSelected =
    filteredCities.length > 0 &&
    filteredCities.every((city) => value.includes(city));

  const toggleCity = (city: string) => {
    const updated = value.includes(city)
      ? value.filter((c) => c !== city)
      : [...value, city];
    onChange(updated);
  };

  const handleSelectAll = () => {
    const updated = allVisibleSelected
      ? value.filter((c) => !filteredCities.includes(c)) // deselect
      : [...value, ...filteredCities.filter((c) => !value.includes(c))]; // select
    onChange(updated);
  };

  if (isLoading) return <p>Loading cities...</p>;

  return (
    <div className="space-y-4 max-w-3xl">
      {/* ✅ Search */}
      <Input
        placeholder="Search city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-slate-100 placeholder:text-slate-400 shadow-sm focus-visible:ring-0"
      />

      {/* ✅ Selected Count */}
      <p className="text-sm text-muted-foreground">Selected: {value.length} cities</p>

      {/* ✅ Select All */}
      {filteredCities.length > 0 && (
        <label className="flex items-center gap-2 pl-4 text-sm cursor-pointer font-medium">
          <input type="checkbox" checked={allVisibleSelected} onChange={handleSelectAll} />
          <span>Select All</span>
        </label>
      )}

      {/* ✅ City List */}
      <div className="p-4 rounded max-h-[150px] overflow-y-auto space-y-2">
        {filteredCities.length === 0 ? (
          <p className="text-muted-foreground text-sm">No cities found</p>
        ) : (
          filteredCities.map((city) => (
            <label key={city} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={value.includes(city)}
                onChange={() => toggleCity(city)}
              />
              <span>{city}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default AddCity;
