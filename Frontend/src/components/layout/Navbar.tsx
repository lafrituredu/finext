import { Link, NavLink } from "react-router-dom"
import DarkButton from '../buttons/DarkButton.tsx'
import { useTranslation } from "react-i18next";
import type { ChangeEvent } from "react";

function Navbar() {
    const { i18n, t } = useTranslation("nav");

    //Arrow function handleChangeLanguage: Detecta el "idioma" seleccionado
    const handleChangeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
    };

    const currentLang = i18n.language.startsWith("en") ? "en" : "es";

    //Arrow function linkClass: Detecta la ruta que esta activa y le da un estilo diferente
    const linkClass = ({ isActive }: { isActive: boolean }) => `cursor-pointer px-8 transition ${isActive ? "text-[#84A2EB] drop-shadow-[0_0_6px_rgb(59,130,246,0.2)] font-bold" : "text-black dark:text-[#D8E0F9] hover:text-[#9bb3ef]"}`

  return (
    <nav className="flex justify-between items-center fixed w-full bg-white dark:bg-[#040919] text-white h-20 dark:shadow-md px-10">
        {/* Left */}
        <div className="flex flex-row inter">
            <img src="icons/finext.svg" alt="" className="w-10 h-10 min-w-10 mr-5"/>
            <div className="flex justify-center items-center text-black dark:text-[#D8E0F9]">
                <NavLink to="/home" className={linkClass}>{t("home")}</NavLink>
                <NavLink to="/about" className={linkClass}>{t("about_us")}</NavLink>
                <NavLink to="/contact" className={linkClass}>{t("contact_us")}</NavLink>
                <NavLink to="/something" className={linkClass}>Something else</NavLink>
            </div>

        </div>

        {/* Right */}
        <div className="flex flex-row justify-center items-center inter">
            <select value={currentLang} onChange={handleChangeLanguage} className="text-black dark:text-[#D8E0F9]"> 
            <option value="en" className="text-black dark:text-[#D8E0F9] dark:bg-[#040919]">{t("english")}</option>
            <option value="es" className="text-black dark:text-[#D8E0F9] dark:bg-[#040919]">{t("spanish")}</option>
            </select>
            <DarkButton/>

            <div className="ring-2 ring-white dark:ring-[#0F1732] rounded-full shadow-md">
                <Link to="/login">
                    <button className="bg-linear-to-r from-[#B6C3F2] to-[#DC94EE] p-2 w-40 rounded-full cursor-pointer">
                        Sign in
                    </button>
                </Link>
            </div>
        </div>
    </nav>
  )
}

export default Navbar