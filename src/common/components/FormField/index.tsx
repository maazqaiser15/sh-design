// components/FormikInput.js
import { Field, ErrorMessage } from "formik";
import React from "react";
import { DatePicker } from "../DatePicker";


interface formFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  className?: string;
  isLeftIcon?: any;
  isRightIcon?: any;
  // Allow standard input props to pass through to Field
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value?: string | number | readonly string[];
  autoComplete?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
}

// Custom component for date fields to work with Formik
const DatePickerField: React.FC<{ field: any; form: any; label?: string; className?: string; min?: string; max?: string; disabled?: boolean; required?: boolean; placeholder?: string }> = ({
  field,
  form,
  label,
  className,
  min,
  max,
  disabled,
  required,
  placeholder,
}) => {
  const error = form.touched[field.name] && form.errors[field.name];
  
  return (
    <DatePicker
      value={field.value || ''}
      onChange={(value) => form.setFieldValue(field.name, value)}
      onBlur={() => form.setFieldTouched(field.name, true)}
      name={field.name}
      id={field.name}
      label={label}
      placeholder={placeholder}
      className={className}
      min={min}
      max={max}
      disabled={disabled}
      required={required}
      error={error as string}
      showLabel={false}
    />
  );
};

const FormField: React.FC<formFieldProps> = ({ label, name, type = "text", placeholder, className = "", isLeftIcon, isRightIcon, min, max, disabled, required, ...rest }) => {
  // Use DatePicker for date type fields
  if (type === "date") {
    return (
      <div className={`flex flex-col  ${className ? className : 'mb-4'}`}>
        {label && (
          <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <Field
          name={name}
          component={DatePickerField}
          label={label}
          className={className}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
        />

        <ErrorMessage
          name={name}
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col  ${className ? className : 'mb-4'}`}>
      {label && (
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {isLeftIcon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {isLeftIcon}
          </span>
        )}

        <Field
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none 
            ${isLeftIcon ? "pl-10" : ""}
            ${isRightIcon ? "pr-10" : ""}`}
          {...rest}
        />

        {/* Right Icon */}
        {isRightIcon && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
            {isRightIcon}
          </span>
        )}
      </div>

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  )
};

export default FormField;
