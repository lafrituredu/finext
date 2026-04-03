import Navbar from "../components/layout/Navbar"
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation("home");
  return (
    <>
        <Navbar/>
        <p className="h-1000 pt-20 dark:text-[#D8E0F9]">{t("welcome")}</p>
    </>
  )
}

export default Home