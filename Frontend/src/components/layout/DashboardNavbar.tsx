import { useState } from "react";
import FiNextIcon from '/src/assets/icons/finext.svg?react'
import HamburgerMenu from '/src/assets/icons/Hamburger-menu.svg?react'
import DarkModeToggle from '../../components/buttons/DarkButton'

function DashboardNavbar(){

    const [opened, setOpened] = useState(false);
    const toggleMenu = () => {
        setOpened(!opened);
        console.log("Opened? "+ !opened)
    };

    return(
        <>
            <nav className='sticky top-0 lg:hidden flex justify-between items-center w-full bg-white dark:bg-[#040919] shadow-sm text-white dark:shadow-sm dark:shadow-[#0F1732] px-10 py-5 z-60 '>
            <div className="lg:hidden flex">
                <HamburgerMenu className="w-10 h-10 text-black dark:text-[#D8E0F9]"/>
            </div>
            <div className="lg:hidden flex">
                <img src="/icons/finext.svg" alt="" className="w-12 h-12 min-w-10"/>
            </div>

                <div className="lg:hidden flex">
                    <DarkModeToggle />
                </div>
            </nav>
        </>
    )
}
export default DashboardNavbar