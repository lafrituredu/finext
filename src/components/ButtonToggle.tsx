import { useState } from "react"
import CheckIcon from "/src/assets/icons/Check-icon.svg?react";

function ButtonToggle() {
    const [selected,setSelected] = useState<string>();
    const toggle = (event:React.MouseEvent) => {
        let el = event.currentTarget as HTMLElement;
        setSelected(selected == el.id ? "" : el.id);
    }

    let options = [
        {content: 'A', action: () => alert('Escogiste: A')},
        {content: 'B', action: () => alert('Escogiste: B')},
        {content: 'C', action: () => alert('Escogiste: C')}
    ];
  return (
    <>
        
        <div className="flex w-fit border border-gray-500 rounded-full overflow-hidden">
            {options.map((opt,i) =>  (
                <button onClick={(e) => {toggle(e);opt.action()}} id={`${i}`} className={`${options.length-1 == (i) ? '' : 'border-r border-gray-500' } ${selected == i.toString() ? 'bg-[#00000025]' : ' hover:bg-[#00000011]'} px-2 cursor-pointer`}>
                    <span className={`flex items-center ${selected == i.toString() && 'gap-2'}`}><CheckIcon className={`${selected == i.toString() ? 'size-4' : 'size-0' } transition-all ease`} />{opt.content}</span>
                </button>
            ))}
        </div>
    </>
  )
}

export default ButtonToggle