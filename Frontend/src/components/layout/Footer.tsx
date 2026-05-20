import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation("footer");

  return (
    <>
      <div className="h-fit w-full bg-[#374161] pb-4">
        <div className="h-10 w-full rounded-b-full bg-white dark:bg-dark-background sm:h-20 xl:h-30"></div>
        <div className="flex items-center justify-center">
          <div className="inter mx-12 grid grid-cols-2 gap-12 py-[10%] text-white md:grid-cols-3 md:py-[5%]">
            <div className="col-span-1 gap-2 md:px-8">
              <strong>{t("legal_title")}</strong>
              <p>
                <Link className="transition-colors hover:text-[#B6C3F2]" to="/aviso-legal">
                  {t("legal_notice")}
                </Link>
              </p>
              <p>
                <Link className="transition-colors hover:text-[#B6C3F2]" to="/cookies">
                  {t("cookies")}
                </Link>
              </p>
              <p>
                <Link className="transition-colors hover:text-[#B6C3F2]" to="/privacidad">
                  {t("privacy")}
                </Link>
              </p>
            </div>
            <div className="col-span-1 gap-2 md:px-8">
              <strong>{t("company_title")}</strong>
              <p>
                <Link className="transition-colors hover:text-[#B6C3F2]" to="/about">
                  {t("about")}
                </Link>
              </p>
              <p>
                <Link className="transition-colors hover:text-[#B6C3F2]" to="/contact">
                  {t("contact")}
                </Link>
              </p>
            </div>
            <div className="col-span-2 gap-2 md:col-span-1 md:px-8">
              <strong>{t("product_title")}</strong>
              <p>
                <Link className="transition-colors hover:text-[#B6C3F2]" to="/dashboard">
                  {t("dashboard")}
                </Link>
              </p>
              <p>
                <Link className="transition-colors hover:text-[#B6C3F2]" to="/dashboard/reports">
                  {t("reports")}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="inter flex items-center justify-center text-center text-[#ffffff61]">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </>
  );
}

export default Footer;
