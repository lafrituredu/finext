import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar"

import { useTranslation } from 'react-i18next';

function Error404() {
  const { t } = useTranslation("error404");
  return (
    <>
        <Navbar/>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#040919] text-black dark:text-[#D8E0F9]">
            <div className="flex flex-col items-center justify-center gap-4 sm:px-0 px-10">
                <p className="montserrat text-4xl font-bold">404</p>
                <p className="montserrat text-lg">{t('page_not_found')}</p>
                <p className="inter max-w-140 text-center">{t('page_not_found_text')}.</p>
                <div className="pt-5">
                     <Link to="/"><button className="bg-[#84A2EB] py-3 px-12 rounded-full text-shadow-white text-white shadow-md cursor-pointer">{t('back_home')}</button></Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default Error404