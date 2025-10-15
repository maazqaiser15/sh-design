import React from 'react'
import { Search } from "lucide-react";

interface searchFieldProps {
    className?: string;
    iconSize: number;
    value: string;
    onChange: (e:any) => void;
    placeholder: string;
    inputClassName: string;
}
const SearchField: React.FC<searchFieldProps> = ({ className, iconSize, value, onChange, placeholder, inputClassName }) => {
    return (

        <div className={`relative ${className}`}>
           
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={
                    inputClassName
                      ? `w-full pl-4 pr-4 py-2  rounded-lg outline-none ${inputClassName}` // defaults + custom
                      : "w-full pl-4 pr-4 py-2 border-0 border-gray-300 rounded-lg outline-none"
                  }
            />
             <Search
                size={iconSize}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400`}
            />
        </div>

    )
}

export default SearchField