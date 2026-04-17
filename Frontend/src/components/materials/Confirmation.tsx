import React, { useEffect, useState } from "react";

interface ConfirmationProps {
    children: React.ReactNode
    close: () => void
    onConfirm: () => void
}
export function Confirmation({children, close, onConfirm}:ConfirmationProps) {

  useEffect(()=>{
  },[])

  const [opened, setOpened] = useState(false)

  return (
    <>
        <div className="flex flex-col items-center justify-center fixed bg-[#0000006b] backdrop-blur-xs min-w-full min-h-full z-60 top-0 left-0">
            <div className="inter bg-white shadow-md rounded-xl p-8">
                <p className="text-xl max-w-100 text-center">{children}</p>
                <div className="flex flex-col justify-between pt-5 gap-4">
                    <button className="bg-red-400 rounded-full py-2 px-2 cursor-pointer select-none hover:scale-104 hover:bg-red-500 transition-all duration-100 ease-in-out" onClick={onConfirm}>Delete</button>
                    <button className="bg-background ring-2 ring-gray-300 rounded-full py-2 px-2 cursor-pointer select-none hover:scale-104 transition-all duration-100 ease-in-out" onClick={close}>Abort</button>
                </div>
            </div>

        </div>
    </>
  );
}

export default Confirmation;