import { ChevronDown } from 'lucide-react';
import React from 'react';

interface SelectFieldProps {
  className: string;
  label: string;
  value: any;
  onChange: (e: any) => void;
  placeholder: string;
  options: any[];
}

const SelectField: React.FC<SelectFieldProps> = ({
  className,
  label,
  value,
  onChange,
  placeholder,
  options,
}) => {
  return (
    <div className={`relative flex flex-col ${className}`}>
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      )}
      {/* Wrapping select in a relative container */}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 pr-10  border-0 rounded-md focus:outline-none appearance-none"
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom Icon */}
        <ChevronDown
          size={20}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] z-[0]"
        />
      </div>
    </div>
  );
};

export default SelectField;
