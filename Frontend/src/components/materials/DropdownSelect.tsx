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
        className={`${buttonClassName} pr-10 text-left flex items-center justify-between gap-2`}
      >
        <span className="truncate">{selectedLabel}</span>
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
        <div className="absolute z-70 w-full mt-2 max-h-60 overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1b35] shadow-2xl ring-1 ring-black/5 dark:ring-white/10 p-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(name, option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2.5 text-left rounded-xl hover:bg-blue-50 dark:hover:bg-[#1a2957] transition inter flex items-center justify-between gap-3 ${
                value === option.value
                  ? "bg-blue-50 dark:bg-[#1a2957] text-primary font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="truncate">{option.label}</span>
              {value === option.value && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownSelect;
