import React, { useEffect, useState } from "react";
import BellIcon from '/src/assets/icons/RingBell.svg?react'

type AlertType = "alert" | "success" | "error";

export function Notifications({children, type, duration, open}:{children:React.ReactNode, type:AlertType, duration:number, open:boolean}) {

  useEffect(()=>{
    setTimeout(() => {
        setOpened(false)
    }, duration);
  },[])

  const [opened, setOpened] = useState(false)

  return (
    <>
        <div className={`inter flex flex-row fixed justify-center items-center bg-[#ffffff55] ring-1 ring-gray-300 backdrop-blur-sm
        rounded-full py-2 px-6 gap-2 w-fit z-100 shadow-md h-fit top-5
        dark:text-dark-text dark:bg-[#220c2c55] dark:ring-gray-700
        ${type == "alert" && "text-dark-card"}
        ${type == "success" && ""}
        ${type == "error" && ""}`}>
                <BellIcon className=""/>
                <p>{children}</p>
        </div>
    </>
  );
}

export default Notifications;