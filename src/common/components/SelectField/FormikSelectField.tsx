import React from 'react';
import { useField, useFormikContext } from 'formik';
import { ChevronDown } from 'lucide-react';

interface OptionObject {
  value: string;
  label: string;
}

interface FormikSelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  options: Array<string | OptionObject>;
  onChangeOverride?: (value: string) => void;
}

const normalizeOptions = (options: Array<string | OptionObject>): OptionObject[] => {
  return options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );
};

const FormikSelectField: React.FC<FormikSelectFieldProps> = ({
  name,
  label,
  placeholder,
  className = '',
  options,
  onChangeOverride,
}) => {
  const [field, meta, helpers] = useField<string>(name);
  const normalized = normalizeOptions(options);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    helpers.setValue(e.target.value);
    if (onChangeOverride) onChangeOverride(e.target.value);
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <select
          id={name}
          {...field}
          onChange={handleChange}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none appearance-none"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {normalized.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={20}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] z-[0]"
        />
      </div>
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormikSelectField;


