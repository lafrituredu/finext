import React, { useState } from 'react'
import DashboardSidebar from '../components/layout/DashboardSidebar'
import { Link, NavLink, Outlet } from 'react-router-dom'
import DashboardNavbar from '../components/layout/DashboardNavbar'
import Notifications from '../components/materials/Notifications';


function Dashboard() {
    const [opened, setOpened] = useState(false);
    const toggleMenu = () => {
        setOpened(!opened);
        console.log("Opened? "+ !opened)
    };
    

    console.log(
      "%c Bienvenido a @FINEXT",
      "color: #242424; padding: 6px 10px; border-radius: 4px; font-size:24px; font-family: Arial;",
    );
  return (
  <>
    <div className='h-screen w-full flex'>
      <DashboardSidebar opened={opened}/>
      <div className='w-full h-full overflow-y-scroll'>
        <DashboardNavbar opened={opened} onToggle ={toggleMenu}/>

        <div className='flex justify-center items-center'>
          <Notifications type="alert" duration={500} open={true}>Transaction successfully deleted!</Notifications>
        </div>
        <Outlet />
      </div>
      
    </div>
  </>
  )
}

export default Dashboard