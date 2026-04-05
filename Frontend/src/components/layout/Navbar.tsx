import { Link } from "react-router-dom"
import DarkButton from '../buttons/DarkButton.tsx'
import { useTranslation } from "react-i18next";
import type { ChangeEvent } from "react";

function Navbar() {
    const { i18n, t } = useTranslation("nav");

    const handleChangeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
    };

    const currentLang = i18n.language.startsWith("en") ? "en" : "es";

  return (
    <nav className="flex justify-between items-center fixed w-full bg-white dark:bg-[#040919] text-white h-20 dark:shadow-md px-10">
        {/* Left */}
        <div className="flex flex-row inter">
            <img src="icons/finext.svg" alt="" className="w-10 h-10"/>
            <div className="flex justify-center items-center text-black dark:text-[#D8E0F9]">
                <div className="pl-10 pr-5"><p className="cursor-pointer">{t("home")}</p></div>
                <div className="px-5"><p className="cursor-pointer">{t("about_us")}</p></div>
                <div className="px-5"><p className="cursor-pointer">{t("contact_us")}</p></div>
            </div>

        </div>

        {/* Right */}
        <div className="flex flex-row justify-center items-center inter">
            <select value={currentLang} onChange={handleChangeLanguage} className="text-black dark:text-[#D8E0F9]"> 
            <option value="en" className="text-black dark:text-[#D8E0F9] dark:bg-[#040919]">{t("english")}</option>
            <option value="es" className="text-black dark:text-[#D8E0F9] dark:bg-[#040919]">{t("spanish")}</option>
            </select>
            <DarkButton/>

            <div className="ring-2 ring-white dark:ring-[#0F1732] rounded-full shadow-lg">
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