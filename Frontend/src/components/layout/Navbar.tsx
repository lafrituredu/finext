import { Link, NavLink } from "react-router-dom"
import DarkButton from '../buttons/DarkButton.tsx'
import LanguageSelect from '../buttons/Lang.tsx'
import { useTranslation } from "react-i18next";
import { useState, type ChangeEvent } from "react";
import FiNextIcon from '/src/assets/icons/finext.svg?react'
import HamburgerMenu from "../buttons/HamburgerMenu.tsx";

function Navbar() {
    const { t } = useTranslation("nav");

    //Arrow function linkClass: Detecta la ruta que esta activa y le da un estilo diferente
    const linkClass = ({ isActive }: { isActive: boolean }) => `whitespace-nowrap cursor-pointer lg:px-8 px-4 transition ${isActive ? "text-[#84A2EB] drop-shadow-[0_0_6px_rgb(59,130,246,0.2)] font-bold" : "text-black dark:text-[#D8E0F9] hover:text-[#9bb3ef]"}`

    const [opened, setOpened] = useState(false);
    const toggleMenu = () => {
        setOpened(!opened);
    };

  return (
    <>
    <nav className="flex justify-between items-center z-3 fixed w-full bg-background dark:bg-dark-background shadow-sm
     text-white dark:shadow-md px-10 py-5">
        {/* Left */}
        <div className="md:flex flex-row inter hidden">
            <FiNextIcon className="w-10 h-10 min-w-10 mr-5"/>
            <div className="flex justify-center items-center text-text dark:text-dark-text">
                <NavLink to="/" className={linkClass}>{t("home")}</NavLink>
                <NavLink to="/about" className={linkClass}>{t("about_us")}</NavLink>
                <NavLink to="/contact" className={linkClass}>{t("contact_us")}</NavLink>
                {/* <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink> */}
            </div>
        </div>
        {/* Middle */}
        <div className="md:hidden flex">
            <HamburgerMenu opened={opened} onToggle={toggleMenu}/>
        </div>
        <div className="md:hidden flex">
            {/* <FiNextIcon className='w-12 h-12 shrink-0' /> */}
            <img src="/img/FiNext.png" alt="FiNext-Logo" className="w-12 h-12 min-w-12"/>
        </div>

        {/* Right */}
        <div className="flex flex-row justify-center items-center inter">
            <div className="md:flex hidden">
                <LanguageSelect/>
            </div>
            <DarkButton/>
            <div className="md:flex ring-2 ring-white dark:ring-[#0F1732] rounded-full shadow-md hidden">
                <Link to="/dashboard">
                    <button className="bg-linear-to-r from-[#B6C3F2] to-[#DC94EE] hover:to-accent hover:from-primary duration-600 transition-colors ease-in-out p-2 w-40 rounded-full cursor-pointer">
                        Sign in
                    </button>
                </Link>
            </div>
        </div>

        
    </nav>
    
    <div className={`md:hidden flex flex-col fixed z-2 w-full h-fit bg-gray-200 dark:bg-gray-700 shadow-md rounded-b-[30px] items-center
      transition-transform duration-300 ease-in-out ${opened ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-wrap justify-center items-center pt-30 pb-5 gap-2">
            <NavLink to="/" className={linkClass}>{t("home")}</NavLink>
            <NavLink to="/about" className={linkClass}>{t("about_us")}</NavLink>
            <NavLink to="/contact" className={linkClass}>{t("contact_us")}</NavLink>
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        </div>
        <div className="md:hidden flex pb-5">
            <LanguageSelect/>
        </div>
    </div>
    </>
  )
}

export default Navbar
