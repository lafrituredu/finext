import React, { useState } from 'react'
import SidebarItem from './SidebarItem'

import UsersIcon from '/src/assets/icons/Profile-icon.svg?react'
import DashboardIcon from '/src/assets/icons/Dashboard-icon.svg?react'
import GearIcon from '/src/assets/icons/Gear.svg?react'
import ChartPieSlice from '/src/assets/icons/ChartPieSlice.svg?react'
import ArrowsLeftRight from '/src/assets/icons/ArrowsLeftRight.svg?react'
import Goals from '/src/assets/icons/Goals.svg?react'
import Calculator from '/src/assets/icons/Calculator.svg?react'
import File from '/src/assets/icons/File.svg?react'
function DashboardSidebar() {
const [openId, setOpenId] = useState("");
const [open,setOpen] = useState(false);
const toggleOffCanvas = () => {
    setOpen(!open);
}

const menuItems = [{
  name: 'Overview',
  items: [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: ChartPieSlice,
    to: '/dashboard',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: ArrowsLeftRight,
    to: '/dashboard/transactions'
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: Goals,
    to: '/dashboard/goals'
  },
    {
    id: 'taxes',
    label: 'Taxes',
    icon: Calculator,
    to: '/dashboard/taxes'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: File,
    to: '/dashboard/reports'
  },
  ]},
  {
    name: 'Utils',
    items: [
        {
        id: 'config',
        label: 'Config',
        icon: GearIcon,
        to: '/dashboard/comps',
        },
        {
        id: 'users2',
        label: 'Users',
        icon: UsersIcon,
        children: [
        { label: 'List', to: '/dashboard/users' },{ label: 'Create', to: '/dashboard/users/create' }
        ]
        }
    ]
  }
];
  return (
    <>
                <div id="sidebar" className={`
              lg:block h-full bg-[#FFF] px-5 py-10
              lg:relative fixed
              lg:transition-none overflow-hidden
              border-r-1 border-[#0000001a]
              ${open
                ? 'duration-150 z-50 sm:w-75 w-[90%] opacity-100 pointer-events-auto'
                : 'z-50 w-0 opacity-0 pointer-events-none lg:w-75 lg:opacity-100 lg:pointer-events-auto'}
            `}>
                
                <a href="/dashboard" className=" text-4xl">Logo</a>

                {menuItems.map((item,key) => (
                <div id={`${key}`} className=" pt-10">
                    <p className="text-[#00000066] text-base">{item.name}</p>
                    <ul>
                        {item.items.map( (el,key)=> (
                            <SidebarItem
                            id={el.id}
                            icon={el.icon}
                            label={el.label}
                            to={el.to}
                            children={el.children}
                            openId={openId}
                            setOpenId={setOpenId}
                        />))}
                    </ul>
                </div>
                ))}
                
            </div>
    </>
  )
}

export default DashboardSidebar