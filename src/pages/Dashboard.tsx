import { useState } from "react";

//Import de componentes
import SidebarItem from "../components/SidebarItem";
import TopNavbar from "../components/TopNavbar";

//Import de iconos
import UsersIcon from '/src/assets/icons/Profile-icon.svg?react'
import DashboardIcon from '/src/assets/icons/Dashboard-icon.svg?react'
import GearIcon from '/src/assets/icons/Gear.svg?react'
import { Outlet } from "react-router";

function Dashboard() {

const menuItems = [{
  name: 'menu',
  items: [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    to: '/dashboard',
  },
  {
    id: 'users',
    label: 'Users',
    icon: UsersIcon,
    children: [
      { label: 'List', to: '/dashboard/users' },
      { label: 'Create', to: '/dashboard/users/create' },
    ],
  },
  {
    id: 'dashboard2',
    label: 'Dashboard2',
    to: '/dashboard2',
    icon: DashboardIcon,
  },
  ]},
  {
    name: 'config',
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


const [openId, setOpenId] = useState("");
const [open,setOpen] = useState(false);
const toggleOffCanvas = () => {
    setOpen(!open);
}
  return (
    <>
        <div className="h-screen font-inter flex">
            {open && <div onClick={toggleOffCanvas} className={`lg:hidden
                top-0 left-0 w-screen h-screen bg-black z-30 hover:cursor-pointer
                ${open ? 'opacity-40 fixed ': 'w-0 opacity-0'}`}>

            </div>}

            <div id="sidebar" className={`
              lg:block h-full bg-[#001D3D] px-5 py-10
              lg:relative fixed
              lg:transition-none overflow-hidden
              ${open
                ? 'duration-150 z-50 sm:w-75 w-[90%] opacity-100 pointer-events-auto'
                : 'z-50 w-0 opacity-0 pointer-events-none lg:w-75 lg:opacity-100 lg:pointer-events-auto'}
            `}>
                
                <a href="/dashboard" className="text-white text-4xl">Logo</a>

                {menuItems.map((item,key) => (
                <div id={`${key}`} className="text-white pt-10">
                    <p className="text-[#DADADA] text-base">{item.name.toUpperCase()}</p>
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

            

            <div className="w-full h-full overflow-y-scroll overflow-x-hidden flex-row ">
              <TopNavbar open={open} setOpen={setOpen} />
              <div id="dashboard" className="lg:px-20 lg:py-10 px-5 py-5 min-h-full h-fit w-full bg-[#F1F5F9]">
                <Outlet />
              </div>
            </div>

        </div>
    </>
  )
}

export default Dashboard