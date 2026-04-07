import React from 'react'
import Navbar from '../components/layout/Navbar'
import DashboardSidebar from '../components/layout/DashboardSidebar'
import { Outlet } from 'react-router-dom'


function Dashboard() {

  return (
  <>
    <div className='h-screen w-full flex'>  
      <DashboardSidebar/>
        <Outlet />
      </div>
  </>
  )
}

export default Dashboard