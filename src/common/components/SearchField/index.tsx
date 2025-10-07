import React from 'react'
import { Search } from "lucide-react";

interface searchFieldProps {
    className?: string;
    iconSize: number;
    value: string;
    onChange: (e:any) => void;
    placeholder: string
}
const SearchField: React.FC<searchFieldProps> = ({ className, iconSize, value, onChange, placeholder }) => {
    return (

        <div className={`relative ${className}`}>
           
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-4 border-0 pr-4 py-2  border-gray-300 rounded-lg  outline-none"
            />
             <Search
                size={iconSize}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
        </div>

    )
}

export default SearchField