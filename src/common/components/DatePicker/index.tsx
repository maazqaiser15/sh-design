import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value?: string; // ISO format (YYYY-MM-DD) or MM/DD/YYYY
  onChange?: (value: string) => void; // Returns ISO format (YYYY-MM-DD)
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  min?: string; // ISO format (YYYY-MM-DD)
  max?: string; // ISO format (YYYY-MM-DD)
  disabled?: boolean;
  required?: boolean;
  error?: string;
  showLabel?: boolean;
}

/**
 * Converts ISO date (YYYY-MM-DD) to MM/DD/YYYY format
 */
const formatToMMDDYYYY = (isoDate: string): string => {
  if (!isoDate) return '';
  // If already in MM/DD/YYYY format, return as is
  if (isoDate.includes('/')) {
    return isoDate;
  }
  try {
    const date = new Date(isoDate + 'T00:00:00'); // Add time to avoid timezone issues
    if (isNaN(date.getTime())) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch {
    return '';
  }
};

/**
 * Converts MM/DD/YYYY format to ISO date (YYYY-MM-DD)
 */
const formatToISO = (mmddyyyy: string): string => {
  if (!mmddyyyy) return '';
  // If already in ISO format, return as is
  if (mmddyyyy.includes('-') && mmddyyyy.length === 10) {
    return mmddyyyy;
  }
  
  // Remove any non-digit, non-slash characters
  const cleaned = mmddyyyy.replace(/[^\d/]/g, '');
  const parts = cleaned.split('/');
  
  if (parts.length !== 3) {
    // Try to parse if it's in progress (e.g., "12/2" -> "12/02")
    if (parts.length === 2 && parts[0].length === 2) {
      return ''; // Partial date, not valid yet
    }
    return '';
  }
  
  const [month, day, year] = parts;
  
  // Validate and convert to ISO
  if (month && day && year && month.length === 2 && day.length === 2 && year.length === 4) {
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);
    
    if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31 && yearNum >= 1900 && yearNum <= 2100) {
      const date = new Date(yearNum, monthNum - 1, dayNum);
      if (date.getMonth() === monthNum - 1 && date.getDate() === dayNum) {
        return `${yearNum}-${month}-${day}`;
      }
    }
  }
  
  return '';
};

/**
 * Formats input as user types to MM/DD/YYYY
 */
const formatInput = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

/**
 * Calendar Popup Component
 */
const CalendarPopup: React.FC<{
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  min?: string;
  max?: string;
  position: { top: number; left: number };
}> = ({ selectedDate, onDateSelect, onClose, min, max, position }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isDateDisabled = (date: Date): boolean => {
    if (min) {
      const minDate = new Date(min);
      minDate.setHours(0, 0, 0, 0);
      if (date < minDate) return true;
    }
    if (max) {
      const maxDate = new Date(max);
      maxDate.setHours(0, 0, 0, 0);
      if (date > maxDate) return true;
    }
    return false;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const date = new Date(year, month, day);
    if (!isDateDisabled(date)) {
      onDateSelect(date);
      onClose();
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="w-full h-7"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const isToday = date.getTime() === today.getTime();

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          disabled={disabled}
          className={`
            w-full h-7 flex items-center justify-center text-xs rounded transition-colors
            ${disabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : selected
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : isToday
              ? 'bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200'
              : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div 
      className="fixed bg-white border border-gray-300 rounded-lg shadow-xl p-2 w-56"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
    >
      {/* Header with month/year and navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h3 className="text-xs font-semibold text-gray-900">
          {monthNames[month].slice(0, 3)} {year}
        </h3>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1.5">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-[10px] font-medium text-gray-500 py-0.5">
            {day.slice(0, 1)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value = '',
  onChange,
  onBlur,
  name,
  id,
  label,
  placeholder = 'MM/DD/YYYY',
  className = '',
  min,
  max,
  disabled = false,
  required = false,
  error,
  showLabel = true,
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync display value with prop value
  useEffect(() => {
    if (value) {
      setDisplayValue(formatToMMDDYYYY(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  // Close calendar when clicking outside and update position on scroll/resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        calendarRef.current &&
        !calendarRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target) &&
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        setShowCalendar(false);
      }
    };

    const handleScrollOrResize = () => {
      if (showCalendar && inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        
        // Calculate position below the input, aligned to right edge
        const top = inputRect.bottom + scrollY + 1; // 1px gap
        const calendarWidth = 224;
        const left = inputRect.right + scrollX - calendarWidth; // Align right edge
        
        const windowWidth = window.innerWidth;
        
        let adjustedLeft = left;
        if (left + calendarWidth > windowWidth + scrollX) {
          adjustedLeft = windowWidth + scrollX - calendarWidth - 8;
        }
        if (adjustedLeft < scrollX) {
          adjustedLeft = scrollX + 8;
        }

        setCalendarPosition({ top, left: adjustedLeft });
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('resize', handleScrollOrResize);
      };
    }
  }, [showCalendar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatInput(inputValue);
    setDisplayValue(formatted);
    
    // Try to convert to ISO format
    const isoValue = formatToISO(formatted);
    if (isoValue && onChange) {
      onChange(isoValue);
    } else if (!formatted && onChange) {
      // Empty value
      onChange('');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    // Validate and format on blur
    const isoValue = formatToISO(displayValue);
    if (displayValue && !isoValue) {
      // Invalid date, clear it or show error
      setDisplayValue('');
      if (onChange) onChange('');
    } else if (isoValue) {
      // Ensure display is properly formatted
      setDisplayValue(formatToMMDDYYYY(isoValue));
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleCalendarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      
      // Calculate position below the input, aligned to right edge
      const top = inputRect.bottom + scrollY + 1; // 1px gap
      const calendarWidth = 224; // w-56 = 14rem = 224px
      const left = inputRect.right + scrollX - calendarWidth; // Align right edge
      
      // Check if calendar would go off screen
      const windowWidth = window.innerWidth;
      
      let adjustedLeft = left;
      if (left + calendarWidth > windowWidth + scrollX) {
        // Adjust to fit on screen
        adjustedLeft = windowWidth + scrollX - calendarWidth - 8; // 8px padding from edge
      }
      if (adjustedLeft < scrollX) {
        adjustedLeft = scrollX + 8; // 8px padding from left edge
      }

      setCalendarPosition({ top, left: adjustedLeft });
      setShowCalendar(!showCalendar);
    }
  };

  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const isoDate = `${year}-${month}-${day}`;
    
    setDisplayValue(formatToMMDDYYYY(isoDate));
    if (onChange) {
      onChange(isoDate);
    }
    setShowCalendar(false);
  };

  const getSelectedDate = (): Date | null => {
    if (!value) return null;
    const isoValue = formatToISO(displayValue) || value;
    if (!isoValue) return null;
    try {
      const date = new Date(isoValue + 'T00:00:00');
      if (isNaN(date.getTime())) return null;
      return date;
    } catch {
      return null;
    }
  };

  const baseInputClasses = `w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
    error ? 'border-red-500' : 'border-gray-300'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`;

  return (
    <>
      <div className="flex flex-col" ref={containerRef}>
        {showLabel && label && (
          <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative" ref={calendarRef}>
          {/* MM/DD/YYYY formatted input */}
          <input
            ref={inputRef}
            type="text"
            name={name}
            id={id || name}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            maxLength={10}
            className={`${baseInputClasses} ${isFocused ? 'pr-10' : 'pr-10'}`}
            inputMode="numeric"
          />
          
          {/* Calendar icon button */}
          <button
            type="button"
            onClick={handleCalendarClick}
            disabled={disabled}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed z-10"
            tabIndex={-1}
          >
            <Calendar className="w-5 h-5 pointer-events-none" />
          </button>
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Calendar Popup - Rendered via Portal to avoid overflow issues */}
      {showCalendar && !disabled && typeof document !== 'undefined' && createPortal(
        <CalendarPopup
          selectedDate={getSelectedDate()}
          onDateSelect={handleDateSelect}
          onClose={() => setShowCalendar(false)}
          min={min}
          max={max}
          position={calendarPosition}
        />,
        document.body
      )}
    </>
  );
};

export default DatePicker;

