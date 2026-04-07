import { useTranslation } from "react-i18next";

function Footer() {
    const { t } = useTranslation("footer");
  return (
    <>
        <div className="bg-[#374161] w-full h-100">
            <div className="bg-white dark:bg-[#040919] w-full h-10 sm:h-20 xl:h-30 rounded-b-full"></div>
            <div>footer content xd</div>
        </div>
    </>
  )
}

export default Footer