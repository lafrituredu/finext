import { Link, NavLink } from "react-router-dom"
import DarkButton from '../buttons/DarkButton.tsx'
import LanguageSelect from '../buttons/Lang.tsx'
import { useTranslation } from "react-i18next";
import { useState, type ChangeEvent } from "react";
import FiNextIcon from '/src/assets/icons/finext.svg?react'
import HamburgerMenu from '/src/assets/icons/Hamburger-menu.svg?react'

function Navbar() {
    const { t } = useTranslation("nav");

    //Arrow function linkClass: Detecta la ruta que esta activa y le da un estilo diferente
    const linkClass = ({ isActive }: { isActive: boolean }) => `cursor-pointer lg:px-8 px-4 transition ${isActive ? "text-[#84A2EB] drop-shadow-[0_0_6px_rgb(59,130,246,0.2)] font-bold" : "text-black dark:text-[#D8E0F9] hover:text-[#9bb3ef]"}`

    const [opened, setOpened] = useState(false);
    const toggleMenu = () => {
        setOpened(!opened);
        console.log(opened)
    };

  return (
    <>
    <nav className="flex justify-between items-center z-3 fixed w-full bg-white dark:bg-[#040919] shadow-sm text-white dark:shadow-md px-10 py-5">
        {/* Left */}
        <div className="md:flex flex-row inter hidden">
            <FiNextIcon className="w-10 h-10 min-w-10 mr-5"/>
            <div className="flex justify-center items-center text-black dark:text-[#D8E0F9]">
                <NavLink to="/" className={linkClass}>{t("home")}</NavLink>
                <NavLink to="/about" className={linkClass}>{t("about_us")}</NavLink>
                <NavLink to="/contact" className={linkClass}>{t("contact_us")}</NavLink>
                {/* <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink> */}
            </div>
        </div>
        {/* Middle */}
        <div className="md:hidden flex">
            <HamburgerMenu onClick={toggleMenu} className="w-10 h-10 text-black dark:text-[#D8E0F9] cursor-pointer"/>
        </div>
        <div className="md:hidden flex">
            <img src="icons/finext.svg" alt="" className="w-12 h-12 min-w-10"/>
        </div>

        {/* Right */}
        <div className="flex flex-row justify-center items-center inter">
            <LanguageSelect/>
            <DarkButton/>
            <div className="md:flex ring-2 ring-white dark:ring-[#0F1732] rounded-full shadow-md hidden">
                <Link to="/login">
                    <button className="bg-linear-to-r from-[#B6C3F2] to-[#DC94EE] p-2 w-40 rounded-full cursor-pointer">
                        Sign in
                    </button>
                </Link>
            </div>
        </div>

        
    </nav>
    
    <div className="hidden flex-col fixed z-2 w-full h-fit bg-gray-200 dark:bg-gray-700 shadow-md rounded-b-[30px] items-center">
        <div className="pt-30 pb-10">
            <NavLink to="/" className={linkClass}>{t("home")}</NavLink>
            <NavLink to="/about" className={linkClass}>{t("about_us")}</NavLink>
            <NavLink to="/contact" className={linkClass}>{t("contact_us")}</NavLink>
        </div>
        <LanguageSelect/>
    </div>
    </>
  )
}

export default Navbar