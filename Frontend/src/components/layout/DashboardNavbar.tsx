import { useState } from "react";
import FiNextIcon from '/src/assets/icons/finext.svg?react'
import HamburgerMenu from '../../components/buttons/HamburgerMenu'
import DarkModeToggle from '../../components/buttons/DarkButton'

interface DashboardNavbar {
    opened: boolean;
    onToggle: () => void;
}

function DashboardNavbar({ opened, onToggle }: DashboardNavbar){

    return(
        <>
            <nav className='sticky top-0 lg:hidden flex justify-center items-center w-full bg-white dark:bg-[#040919] shadow-sm text-white dark:shadow-sm dark:shadow-[#0F1732] px-10 py-5 z-60 '>
            <div className="lg:hidden absolute left-10">
                <HamburgerMenu opened={opened} onToggle={onToggle}/>
            </div>
            <div className="lg:hidden flex">
                <img src="/icons/finext.svg" alt="" className="w-12 h-12 min-w-10"/>
            </div>

                <div className="lg:hidden flex">
                    {/* <DarkModeToggle /> */}
                </div>
            </nav>
        </>
    )
}
export default DashboardNavbar