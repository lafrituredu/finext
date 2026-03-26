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
      className={`px-3 transition-all ease hover:cursor-pointer
        ${isActive ? "bg-black/20" : "hover:bg-black/10"}`}
    >
        <span className={`flex items-center ${isActive && 'gap-2'}`}><CheckIcon className={`${isActive ? 'size-4' : 'size-0' } transition-all ease`} />{children}</span>
      
    </button>
  );
}
