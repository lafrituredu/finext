import React from 'react'
import DashboardSidebar from '../components/layout/DashboardSidebar'
import { Link, NavLink, Outlet } from 'react-router-dom'
import DashboardNavbar from '../components/layout/DashboardNavbar'


function Dashboard() {

  return (
  <>
    <div className='h-screen w-full flex'>  
      <DashboardSidebar/>
      <div className='w-full h-full overflow-y-scroll'>
        <DashboardNavbar/>
        <Outlet />
      </div>
      
    </div>
  </>
  )
}

export default Dashboard