"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function PincodeInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const handleAdd = (val: string) => {
    if (/^\d{6}$/.test(val) && !value.includes(val)) {
      onChange([...value, val]);
      setInput("");
    }
  };

  const handleRemove = (pin: string) => {
    onChange(value.filter((p) => p !== pin));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d{0,6}$/.test(val)) {
      setInput(val);
      if (val.length === 6) {
        handleAdd(val);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Input
        value={input}
        onChange={handleChange}
        placeholder="Enter 6-digit pincode"
        type="text"
        maxLength={6}
      />
      <div className="flex flex-wrap gap-2">
        {value.map((pin) => (
          <Badge key={pin} className="flex items-center gap-1">
            {pin}
            <X
              size={14}
              className="cursor-pointer"
              onClick={() => handleRemove(pin)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
