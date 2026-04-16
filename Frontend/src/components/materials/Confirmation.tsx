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
        <div className="flex flex-col items-center justify-center fixed bg-[#0000006b] min-w-full min-h-full z-60 top-0 left-0">
            <div className="inter bg-white shadow-md rounded-xl p-6">
                {children}
                <div className="flex justify-between mx-20 pt-5">
                    <button className="bg-red-200 rounded-md py-1 px-2 ring-2 ring-red-400 cursor-pointer select-none" onClick={close}>Cancel</button>
                    <button className="bg-green-200 rounded-md py-1 px-2 ring-2 ring-green-400 cursor-pointer select-none" onClick={onConfirm}>Confirm</button>
                </div>
            </div>

        </div>
    </>
  );
}

export default Confirmation;