import { useTranslation } from "react-i18next";

function Footer() {
    const { t } = useTranslation("footer");
  return (
    <>
        <div className="bg-[#374161] w-full h-fit pb-4">
            <div className="bg-white dark:bg-dark-background w-full h-10 sm:h-20 xl:h-30 rounded-b-full"></div>
            <div className="flex justify-center items-center">
              <div className="inter grid md:grid-cols-3 grid-cols-2 text-white gap-12 py-[10%] md:py-[5%] mx-12">
                <div className="col-span-1 gap-2 md:px-8">
                  <strong>Legal Stuff</strong>
                  <p>Lorem Ipsum</p>
                  <p>Lorem Ipsum</p>
                  <p>Lorem Ipsum</p>
                </div>
                <div className="col-span-1 gap-2 md:px-8">
                  <strong>Legal Stuff</strong>
                  <p>Lorem Ipsum</p>
                  <p>Lorem Ipsum</p>
                </div>
                <div className="md:col-span-1 col-span-2 gap-2 md:px-8">
                  <strong>Legal Stuff</strong>
                  <p>Lorem Ipsum</p>
                  <p>Lorem Ipsum</p>
                </div>
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