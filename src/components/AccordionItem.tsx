import { type ReactNode } from "react";
import ChevronIcon from "/src/assets/icons/Chevron-down.svg?react";

interface AccordionItemProps {
  title: string;
  id:string;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

function AccordionItem({
  title,
  id,
  children,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div id={id}>
      <div
        onClick={onToggle}
        className="flex items-center justify-between bg-[#586FFFcc]
        px-5 py-3 rounded-sm cursor-pointer"
      >
        <p className="text-xl">{title}</p>

        <ChevronIcon
          className={`size-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`
          bg-[#E9EAFF] rounded-sm overflow-hidden
          transition-all duration-400 ease
          ${isOpen ? "max-h-[100px]" : "max-h-0"}
        `}
      >
        <div className="px-5 py-3">{children}</div>
      </div>
    </div>
  );
}

export default AccordionItem;
