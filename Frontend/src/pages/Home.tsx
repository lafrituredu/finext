import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation("home");
  return (
    <>
      <Navbar/>
      {/* --- COINTAINER HERO --- */}
      <div className="bg-[url(/home/homebg.png)] w-full bg-no-repeat xl:bg-[position:center_-120px] bg-[position:center]">
        <div className="flex flex-row justify-between mx-5 xl:mx-[320px] pt-42 max-w-[1280px]">
          {/*Hero Left*/}
          <div className="flex flex-col justify-center text-[#D8E0F9] gap-3">
            <p className="mont_mid text-xl">FiNext</p>
            <p className="mont_semibold md:text-6xl text-3xl max-w-160 uppercase">{t('next_step')}</p>
            <p className="inter text-lg">{t('simplest_way')}.</p>
            <div className="pt-12">
              <button className="bg-[#84A2EB] py-3 px-12 rounded-full text-shadow-white text-white shadow-md cursor-pointer">{t('start_now')}</button>
            </div>
          </div>
          {/*Hero Right*/}
          <div className="xl:flex hidden">
            <img src="/icons/finext.svg" alt="finext" className="min-w-100"/>
          </div>
        </div>
        {/*--- CARDS ---*/}
        <div className="flex justify-center mx-4 xl:mx-[120px] pt-25 xl:gap-20 gap-5">
          {/*--- Card left ---*/}
          <div className="sm:flex hidden bg-white dark:bg-[#0F1732] w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-[#050b1f]"></div>
          {/*--- Card Middle ---*/}
          <div className="flex flex-col bg-white dark:bg-[#0F1732] w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-[#050b1f]">
            <div className="flex flex-row justify-between p-5">
            </div>
          </div>
          {/*--- Card Right ---*/}
          <div className="lg:flex hidden bg-white dark:bg-[#0F1732] w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-[#050b1f]"></div>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center pt-5 gap-2 sm:hidden">
        <div className="bg-gray-700 rounded-full w-2 h-2"></div>
        <div className="bg-gray-700 rounded-full w-2 h-2"></div>
        <div className="bg-gray-700 rounded-full w-2 h-2"></div>
      </div>
      {/* --- COINTAINER 1 --- */}
      <div className="pt-40"></div>
      <div className="flex flex-col justify-center items-center mx-5 xl:mx-[320px]">
        <div>
          <h4 className="montserrat text-5xl sm:text-center dark:text-[#D8E0F9] ">{t('everything_in_one_place')}</h4>
          <p className="inter pt-6 max-w-160 sm:text-center text-gray-600 dark:text-[#D8E0F9]">{t('bring_all')}</p>
        </div>
        <div className="flex flex-row items-center justify-center pt-12 gap-3 w-full">
          <div className="md:flex hidden bg-[#6483d2] w-80 h-100 rounded-3xl"></div>
          <div className="bg-[#84A2EB] w-100 h-120 rounded-3xl"></div>
          <div className="md:flex hidden bg-[#6483d2] w-80 h-100 rounded-3xl"></div>
        </div>
      </div>
      {/* --- COINTAINER 2 --- */}
      <div className="pt-40"></div>
      <div className="bg-gray-300 dark:bg-gray-800 w-full h-30">
      </div>
      {/* --- COINTAINER 3 --- */}
      <div className="pt-40"></div>
      <div className="flex flex-col justify-center items-center mx-5 xl:mx-[320px]">
        <div>
          <h4 className="montserrat text-5xl sm:text-center dark:text-[#D8E0F9]">{t('built_for_you')}</h4>
          <p className="inter pt-6 max-w-160 sm:text-center text-gray-600 dark:text-[#D8E0F9]">{t('built_to_simplify')}</p>
        </div>
        <div className="flex flex-col text-black dark:text-[#D8E0F9] mt-20 gap-10">
        {/*--- CARD 1 --- */}
        <div className="grid grid-cols-3 max-w-[1280px] bg-white dark:bg-[#0F1732] w-full sm:h-[500px] h-fit rounded-3xl shadow-md ring-2 ring-gray-200 dark:ring-[#050b1f] p-10">
          <div className= "sm:col-span-2 col-span-3">
            <div className="flex flex-col">
              <div className="flex sm:flex-row flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#84A2EB" className="w-24 h-24 mx-5 mb-5 sm:my-0"><path d="M336-120q-91 0-153.5-62.5T120-336q0-38 13-74t37-65l142-171-97-194h530l-97 194 142 171q24 29 37 65t13 74q0 91-63 153.5T624-120H336Zm144-200q-33 0-56.5-23.5T400-400q0-33 23.5-56.5T480-480q33 0 56.5 23.5T560-400q0 33-23.5 56.5T480-320Zm-95-360h190l40-80H345l40 80Zm-49 480h288q57 0 96.5-39.5T760-336q0-24-8.5-46.5T728-423L581-600H380L232-424q-15 18-23.5 41t-8.5 47q0 57 39.5 96.5T336-200Z"/></svg>
                <p className="mont_semibold sm:text-4xl text-xl">{t('take_controll')}</p>
              </div>
              <p className="inter sm:pt-10 pt-5 text-base/7 sm:text-lg">{t('take_controll_text')}.</p>
            </div>
          </div>
          <div className="sm:flex hidden sm:col-span-1 justify-center items-center italic">Img here</div>
        </div>
        {/*--- CARD 2 --- */}
        <div className="grid grid-cols-3 max-w-[1280px] bg-white dark:bg-[#0F1732] w-full sm:h-[500px] h-fit rounded-3xl shadow-md ring-2 ring-gray-200 dark:ring-[#050b1f] p-10">
          <div className= "sm:col-span-2 col-span-3">
            <div className="flex flex-col">
              <div className="flex sm:flex-row flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#84A2EB" className="w-24 h-24 mx-5 mb-5 sm:my-0"><path d="M200-80v-760h640l-80 200 80 200H280v360h-80Zm80-440h442l-48-120 48-120H280v240Zm0 0v-240 240Z"/></svg>
                <p className="mont_semibold sm:text-4xl text-xl">{t('intelligent_expense')}</p>
              </div>
              <p className="inter sm:pt-10 pt-5 text-base/7 sm:text-lg">{t('intelligent_expense_text')}.</p>
            </div>
          </div>
          <div className="sm:flex hidden sm:col-span-1 justify-center items-center italic">Img here</div>
        </div>
        {/*--- CARD 3 --- */}
        <div className="grid grid-cols-3 max-w-[1280px] bg-white dark:bg-[#0F1732] w-full sm:h-[500px] h-fit rounded-3xl shadow-md ring-2 ring-gray-200 dark:ring-[#050b1f] p-10">
          <div className= "sm:col-span-2 col-span-3">
            <div className="flex flex-col">
              <div className="flex sm:flex-row flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#84A2EB" className="w-24 h-24 mx-5 mb-5 sm:my-0"><path d="M323-160q-11 0-20.5-5.5T288-181l-78-139h58l40 80h92v-40h-68l-40-80H188l-57-100q-2-5-3.5-10t-1.5-10q0-4 5-20l57-100h104l40-80h68v-40h-92l-40 80h-58l78-139q5-10 14.5-15.5T323-800h97q17 0 28.5 11.5T460-760v160h-60l-40 40h100v120h-88l-40-80h-92l-40 40h108l40 80h112v200q0 17-11.5 28.5T420-160h-97Zm217 0q-17 0-28.5-11.5T500-200v-200h112l40-80h108l-40-40h-92l-40 80h-88v-120h100l-40-40h-60v-160q0-17 11.5-28.5T540-800h97q11 0 20.5 5.5T672-779l78 139h-58l-40-80h-92v40h68l40 80h104l57 100q2 5 3.5 10t1.5 10q0 4-5 20l-57 100H668l-40 80h-68v40h92l40-80h58l-78 139q-5 10-14.5 15.5T637-160h-97Z"/></svg>
                <p className="mont_semibold sm:text-4xl text-xl">{t('smart_financial')}</p>
              </div>
              <p className="inter sm:pt-10 pt-5 text-base/7 sm:text-lg">{t('smart_financial_text')}.</p>
            </div>
          </div>
          <div className="sm:flex hidden sm:col-span-1 justify-center items-center italic">Img here</div>
        </div>
      </div>
      </div>
      {/* --- COINTAINER 4 --- */}
      <div className="pt-40"></div>
      <div className="flex items-center justify-center mx-[320px]">
        <div className="w-full h-180 bg-linear-to-br from-[#70A1FF] to-[#1E4CA3] rounded-4xl max-w-[1280px] min-w-[300px] mix-h-[100px]"></div>
      </div>
      {/* --- CONTAINER 5 --- */}
      <div className="pt-40"></div>
      <div className="flex flex-col justify-center items-center text-black dark:text-[#D8E0F9] mx-4">
        <div className="flex flex-col justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#000000" className="w-24 h-24"><path d="M308-472.92 427.92-560 308-647.08l-20.62 28.77L367.46-560l-80.08 58.31L308-472.92Zm344 0 20.62-28.77L592.54-560l80.08-58.31L652-647.08 532.08-560 652-472.92Zm-232 178 60-60 60 60 60-60 39 39L664.08-341 600-405.08l-60 60-60-60-60 60-60-60L295.92-341 321-315.92l39-39 60 60Zm-80.28 146.58q-65.73-28.34-114.36-76.92-48.63-48.58-76.99-114.26Q120-405.19 120-479.87q0-74.67 28.34-140.41 28.34-65.73 76.92-114.36 48.58-48.63 114.26-76.99Q405.19-840 479.87-840q74.67 0 140.41 28.34 65.73 28.34 114.36 76.92 48.63 48.58 76.99 114.26Q840-554.81 840-480.13q0 74.67-28.34 140.41-28.34 65.73-76.92 114.36-48.58 48.63-114.26 76.99Q554.81-120 480.13-120q-74.67 0-140.41-28.34ZM480-480Zm227 227q93-93 93-227t-93-227q-93-93-227-93t-227 93q-93 93-93 227t93 227q93 93 227 93t227-93Z"/></svg>
          <p className="montserrat text-4xl text-center">{t('managing_money')}</p>
          <p className="inter max-w-140 text-center pt-5">{t('managing_money_text')}</p>
        </div>
        <div className="flex flex-col justify-center items-center pt-12">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#000000" className="w-24 h-24"><path d="m480-173.85-30.31-27.38q-97.92-89.46-162-153.15-64.07-63.7-101.15-112.35-37.08-48.65-51.81-88.04Q120-594.15 120-634q0-76.31 51.85-128.15Q223.69-814 300-814q52.77 0 99 27t81 78.54Q514.77-760 561-787q46.23-27 99-27 76.31 0 128.15 51.85Q840-710.31 840-634q0 39.85-14.73 79.23-14.73 39.39-51.81 88.04-37.08 48.65-100.77 112.35Q609-290.69 510.31-201.23L480-173.85Zm0-54.15q96-86.77 158-148.65 62-61.89 98-107.39t50-80.61q14-35.12 14-69.35 0-60-40-100t-100-40q-47.77 0-88.15 27.27-40.39 27.27-72.31 82.11h-39.08q-32.69-55.61-72.69-82.5Q347.77-774 300-774q-59.23 0-99.62 40Q160-694 160-634q0 34.23 14 69.35 14 35.11 50 80.61t98 107q62 61.5 158 149.04Zm0-273Z"/></svg>
          <p className="montserrat text-4xl text-center">{t('why_built')}</p>
          <p className="inter max-w-140 text-center pt-5">{t('why_built_text')}</p>
        </div>
        <div className="flex flex-col justify-center items-center pt-12">
          <img src="/icons/finext.svg" alt="" className="w-18 h-18 m-2"/>
          <p className="montserrat text-4xl text-center">{t('ready_try')}</p>
          <p className="inter max-w-140 text-center pt-5">{t('ready_try_text')}</p>
        </div>
        <div className="pt-12">
          <button className="bg-[#84A2EB] py-3 px-12 rounded-full text-shadow-white text-white shadow-md cursor-pointer">{t('start_now')}</button>
        </div>
      </div>
      
      {/* --- COINTAINER FOOTER --- */}
      <div className="h-50">
        <Footer/>
      </div>
    </>
  )
}

export default Home