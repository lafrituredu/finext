import React from 'react'
import Navbar from '../components/layout/Navbar'
import DashboardSidebar from '../components/layout/DashboardSidebar'
import { Link, NavLink, Outlet } from 'react-router-dom'
import FiNextIcon from '/src/assets/icons/finext.svg?react'
import HamburgerMenu from '/src/assets/icons/Hamburger-menu.svg?react'
import DarkModeToggle from '../components/buttons/DarkButton'

function Dashboard() {

  return (
  <>
    <div className='h-screen w-full flex'>  
      <DashboardSidebar/>
      <div className='w-full h-full overflow-y-scroll'>
        <nav className='sticky top-0 flex justify-between items-center w-full bg-white dark:bg-[#040919] shadow-sm text-white dark:shadow-sm dark:shadow-[#0F1732] px-10 py-5 z-60 '>
          {/* Left */}
          <div className="md:flex flex-row inter hidden">
              {/* <FiNextIcon className="w-10 h-10 min-w-10 mr-5"/> */}
              <div className="flex justify-center items-center text-black dark:text-[#D8E0F9]">
                  {/* <NavLink to="/" >asd</NavLink>
                  <NavLink to="/about" >asda</NavLink>
                  <NavLink to="/contact" >sada</NavLink> */}
                  {/* <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink> */}
              </div>
          </div>
          {/* Middle */}
          <div className="md:hidden flex">
              <HamburgerMenu className="w-10 h-10 text-black dark:text-[#D8E0F9]"/>
          </div>
          <div className="md:hidden flex">
              <img src="icons/finext.svg" alt="" className="w-12 h-12 min-w-10"/>
          </div>

            <div className="md:hidden flex">
                <DarkModeToggle />
            </div>

          {/* Right */}
          <div className="flex flex-row justify-center items-center inter">


              <div className="md:flex ring-2 ring-white dark:ring-[#0F1732] rounded-full shadow-md hidden">
                  <Link to="/login">
                      <button className="bg-linear-to-r from-[#B6C3F2] to-[#DC94EE] p-2 w-40 rounded-full cursor-pointer">
                          Sign in
                      </button>
                  </Link>
              </div>
          </div>
        </nav>
        <Outlet />
      </div>
      
    </div>
  </>
  )
}

export default Dashboard