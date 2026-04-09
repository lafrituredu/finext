import { useEffect, useState, type ChangeEvent } from "react"
import { useTranslation } from "react-i18next"

export default function Language() {

    const { i18n, t } = useTranslation("nav");

    const [currentLang,setCurrentLang] = useState("en")

    useEffect(()=>{
        const savedLang = localStorage.getItem("Lang") ?? "en";
        setCurrentLang(savedLang)
        i18n.changeLanguage(savedLang)
    },[i18n])
    
    //Arrow function handleChangeLanguage: Detecta el "idioma" seleccionado y lo guarda en localStorage
    const handleChangeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value
        setCurrentLang(newLang)
        i18n.changeLanguage(newLang)
        localStorage.setItem("Lang", newLang)
    };


  return (
    <select value={currentLang} onChange={handleChangeLanguage} className="text-black dark:text-[#D8E0F9] md:flex hidden outline-0"> 
        <option value="en" className="text-black dark:text-[#D8E0F9] dark:bg-[#040919]">{t("english")}</option>
        <option value="es" className="text-black dark:text-[#D8E0F9] dark:bg-[#040919]">{t("spanish")}</option>
    </select>
  )
}