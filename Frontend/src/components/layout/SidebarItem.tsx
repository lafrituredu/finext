import { useState, type ReactNode } from "react";
import { Link, NavLink } from 'react-router';
import ChevronIcon from '/src/assets/icons/Chevron-down.svg?react';
type IconType = React.FC<React.SVGProps<SVGSVGElement>>

function SidebarItem({id,label,icon: Icon,openId,setOpenId,to = "",children = null}: {id:string,label:string,icon:IconType,to?:string,openId?:string,setOpenId?:any,children?:any}) {
  
    const content = (isActive = false) =>{
        return (<>
        <div id={id} onClick={(e) => { openId != e.currentTarget.id ? setOpenId(e.currentTarget.id) : setOpenId("") } }
            className={`rounded-3xl flex items-center hover:bg-[#0000000a] transition ease-in 
            px-5 py-2 justify-between hover:cursor-pointer ${ isActive || openId == id ? 'bg-[#0000000a]' : ''} `}>
            <p className="flex gap-2 items-center">
                {Icon && <Icon className="size-5" />}
                {label}
            </p>
            {children != null && <ChevronIcon className={`${openId == id && 'rotate-180'  } transition-all`} />}
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
        <NavLink to={to} end>
            {({ isActive }) => content(isActive)}
        </NavLink>
    :
    <div>
        {content()}
    </div>
    }


    </>
  )
}

export default SidebarItem