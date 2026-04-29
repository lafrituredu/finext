import { useEffect, useRef, useState } from "react";

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownSelectProps = {
  name: string;
  value: string;
  placeholder: string;
  options: DropdownOption[];
  onChange: (name: string, value: string) => void;
  buttonClassName: string;
};

function DropdownSelect({
  name,
  value,
  placeholder,
  options,
  onChange,
  buttonClassName
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`${buttonClassName} pr-10 text-left`}
      >
        {selectedLabel}
      </button>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 pointer-events-none">
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(name, option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition inter ${
                value === option.value
                  ? "bg-blue-50 dark:bg-blue-900/30 text-primary"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownSelect;

