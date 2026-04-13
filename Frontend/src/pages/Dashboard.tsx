import React, { useState } from 'react'
import DashboardSidebar from '../components/layout/DashboardSidebar'
import { Link, NavLink, Outlet } from 'react-router-dom'
import DashboardNavbar from '../components/layout/DashboardNavbar'


function Dashboard() {
    const [opened, setOpened] = useState(false);
    const toggleMenu = () => {
        setOpened(!opened);
        console.log("Opened? "+ !opened)
    };

  return (
  <>
    <div className='h-screen w-full flex'>  
      <DashboardSidebar opened={opened}/>
      <div className='w-full h-full overflow-y-scroll'>
        <DashboardNavbar opened={opened} onToggle ={toggleMenu}/>
        <Outlet />
      </div>
      
    </div>
  </>
  )
}

export default Dashboard