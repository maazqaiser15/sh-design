import React from "react";


interface formFieldProp {
    as?: any;
    label?: string;
    name?: string;
    value?: any;
    onChange: (e: any) => void;
    placeholder?: string;
    type?: string;
    helperText?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    leftIcon?: any;
    rightIcon?: any;
    className?: string;
    containerClassName?: string;
}


export const FormField: React.FC<formFieldProp> = ({
    as = "input",
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    helperText,
    error,
    required = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className = "",
    containerClassName = "",
    ...rest
}) => {
    const base =
        "w-full px-3 py-2 border rounded-md  outline-none backdrop-blur-[42px] shadow-[inset_-5px_-5px_250px_0px_#ffffff05,0px_4px_15px_0px_#0000000a]";
    const normalBorder = "border-gray-300 focus:ring-primary";
    const errorBorder = "border-red-400 focus:ring-red-500";
    const leftPad = leftIcon ? "pl-9" : "pl-3";
    const rightPad = rightIcon ? "pr-9" : "pr-3";
    const state = error ? errorBorder : normalBorder;

    const commonProps = {
        id: name,
        name,
        value,
        onChange,
        placeholder,
        disabled,
        required,
        "aria-invalid": !!error,
        className: `${base} ${state} ${leftPad} ${rightPad} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""
            } ${className}`,
        ...rest,
    };

    const field =
        as === "textarea" ? (
            <textarea {...commonProps} rows={rest.rows || 4} />
        ) : (
            <input {...commonProps} type={type} />
        );

    return (
        <div className={`flex flex-col gap-1 ${containerClassName}`}>
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {leftIcon}
                    </span>
                )}
                {field}
                {rightIcon && (
                    <span className=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </span>
                )}
            </div>

            {error ? (
                <p className="text-sm text-red-600">{error}</p>
            ) : helperText ? (
                <p className="text-sm text-gray-500">{helperText}</p>
            ) : null}
        </div>
    );
};
