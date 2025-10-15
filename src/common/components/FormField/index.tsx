// components/FormikInput.js
import { Field, ErrorMessage } from "formik";
import React from "react";


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
}

const FormField: React.FC<formFieldProps> = ({ label, name, type = "text", placeholder, className = "", isLeftIcon, isRightIcon, ...rest }) => {
  return (
    <div className={`flex flex-col  ${className ? className : 'mb-4'}`}>
      {label && (
        <label htmlFor={name} className="mb-1 font-medium text-gray-700">
          {label}
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
