import { useTranslation } from "react-i18next";

function Footer() {
    const { t } = useTranslation("footer");
  return (
    <>
        <div className="bg-[#374161] w-full h-fit pb-10">
            <div className="bg-white dark:bg-dark-background w-full h-10 sm:h-20 xl:h-30 rounded-b-full"></div>
            <div className="inter flex flex-row justify-center items-center text-white gap-30 py-[5%]">
              <div className="flex flex-col gap-2">
                <strong>Legal Stuff</strong>
                <p>Lorem Ipsum</p>
                <p>Lorem Ipsum</p>
              </div>
              <div className="flex flex-col gap-2">
                <strong>Legal Stuff</strong>
                <p>Lorem Ipsum</p>
                <p>Lorem Ipsum</p>
              </div>
              <div className="flex flex-col gap-2">
                <strong>Legal Stuff</strong>
                <p>Lorem Ipsum</p>
                <p>Lorem Ipsum</p>
              </div>
            </div>
            <div className="flex justify-center items-center inter text-[#ffffff61] text-center">
              <p>© 1996-2026 FiNext, Inc. or its affiliates. All rights reserved.</p>
            </div>

        </div>
    </>
  )
}

export default Footer