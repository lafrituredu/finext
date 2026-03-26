import { useState, type ReactNode } from "react";
import { Link } from 'react-router';
import ChevronIcon from '/src/assets/icons/Chevron-down.svg?react';
type IconType = React.FC<React.SVGProps<SVGSVGElement>>

function SidebarItem({id,label,icon: Icon,openId,setOpenId,to = "",children = null}: {id:string,label:string,icon:IconType,to?:string,openId?:string,setOpenId?:any,children?:any}) {
  
    const content = () =>{
        return (<>
        <div id={id} onClick={(e) => { openId != e.currentTarget.id ? setOpenId(e.currentTarget.id) : setOpenId("") } } className={`flex items-center hover:bg-[#0052AD] transition ease-in px-5 py-2 focus:bg-[#003875] ${openId == id && 'bg-[#003875]'} justify-between hover:cursor-pointer`}>
            <p className="flex gap-2 items-center">
                {Icon && <Icon className="size-5 text-white" />}
                {label}
            </p>
            {children != null && <ChevronIcon />}
        </div>
        
        
        <div className={`ms-5 dropdown transition-all duration-75 ease-in overflow-hidden ${openId == id ? "max-h-20" : "max-h-0"}`}>
            {children != null && children.map((child: any) => (
                <SidebarItem id="" label={child.label} icon={child.icon} to={child.to}></SidebarItem>
            ))}
        </div>
        </>)
    }
  
    return (
    <>
    {to != "" ?
        <Link to={to}>
            {content()}
        </Link>
    :
    <div>
        {content()}
    </div>
    }


    </>
  )
}

export default SidebarItem