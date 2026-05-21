import { useToggle } from "./ToggleContainer";
import CheckIcon from "/src/assets/icons/Check-icon.svg?react";

type Props = {
  value: string;
  onSelect?: () => void;
  children: React.ReactNode;
};

export function ToggleOption({ value, onSelect, children }: Props) {
  const { selected, setSelected } = useToggle();

  const isActive = selected === value;

  const handleClick = () => {
    setSelected(isActive ? null : value);
    if (!isActive) onSelect?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex gap-3 items-center justify-center text-center w-full px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer
        ${isActive ? "bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl" : ""}`}
    >
        <span className={`flex items-center ${isActive && 'gap-2'}`}><CheckIcon className={`${isActive ? 'size-4' : 'size-0' } transition-all ease`} />{children}</span>
      
    </button>
  );
}
