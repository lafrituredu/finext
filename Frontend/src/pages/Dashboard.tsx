import React, { useState } from 'react'
import DashboardSidebar from '../components/layout/DashboardSidebar'
import { Link, NavLink, Outlet } from 'react-router-dom'
import DashboardNavbar from '../components/layout/DashboardNavbar'
import Notifications from '../components/materials/Notifications';
import { DashboardProvider } from '../contexts/DashboardContext';


function Dashboard() {
    const [opened, setOpened] = useState(false);
    const toggleMenu = () => {
        setOpened(!opened);
    };
    
  return (
  <>
    <div className='h-screen w-full flex'>
      <DashboardSidebar opened={opened} onClose={() => setTimeout(() => setOpened(false), 150)} />
      <div className='w-full h-full overflow-y-scroll'>
        <DashboardNavbar opened={opened} onToggle ={toggleMenu}/>

        <div className='flex justify-center items-center'>
          {/*<Notifications type="alert" duration={500} open={true}>Transaction successfully deleted!</Notifications>*/}
        </div>
        <DashboardProvider>
          <Outlet />
        </DashboardProvider>
        
      </div>
      
    </div>
  </>
  )
}

export default Dashboard
