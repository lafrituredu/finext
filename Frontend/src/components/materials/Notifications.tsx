import React, { useEffect, useState } from "react";
import BellIcon from '/src/assets/icons/RingBell.svg?react'

type AlertType = "alert" | "success" | "error";

export function Notifications({children, type}:{children:React.ReactNode, type:AlertType}) {

  useEffect(()=>{
  },[])

  const [opened, setOpened] = useState(false)

  return (
    <>
        <div className={`inter flex flex-row absolute justify-center items-center bg-[#ffffff55] ring-1 ring-gray-300 backdrop-blur-sm
        rounded-full py-2 px-6 gap-2 w-fit z-100 shadow-md h-fit
        ${type == "alert" && "text-dark-card"}
        ${type == "success" && ""}
        ${type == "error" && ""}`}>
                <BellIcon className=""/>
                {/* <p>New notification!</p> */}
                <p>{children}</p>
        </div>
    </>
  );
}

export default Notifications;