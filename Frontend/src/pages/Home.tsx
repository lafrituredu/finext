import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import { useTranslation } from 'react-i18next';
import SentimentStressedIcon from '/src/assets/icons/Sentiment-stressed-icon.svg?react'
import Heart from '/src/assets/icons/Heart.svg?react'
import MoneyBag from '/src/assets/icons/Money-bag.svg?react'
import Flag from '/src/assets/icons/Flag.svg?react'
import PolyBrain from '/src/assets/icons/PolyBrain.svg?react'
import FiNextIcon from '/src/assets/icons/finext.svg?react'
import Sponsors from '../components/Sponsors'

function Home() {
  const { t } = useTranslation("home");
  return (
    <>
      <Navbar/>
      {/* --- COINTAINER HERO --- */}
      <div className="bg-[url(/home/homebg.png)] w-full bg-no-repeat bg-cover xl:bg-[position:center_-120px] bg-[position:center]">
        {/* <div className="flex flex-row justify-between items-center mx-5 xxl:mx-[120px] xl:mx-[320px] pt-42 max-w-[1280px]"> */}
        <div className="flex flex-row xl:justify-center justify-start items-arround mx-5 xxl:mx-[120px] pt-50 gap-56">
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
            <FiNextIcon className="min-w-100"/>
          </div>
        </div>
        {/*--- CARDS ---*/}
        <div className="flex justify-center mx-4 pt-25 xl:gap-20 gap-5">
          {/*--- Card left ---*/}
          <div className="lg:flex hidden bg-white dark:bg-[#0F1732] w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-[#050b1f]"></div>
          {/*--- Card Middle ---*/}
          <div className="flex flex-col bg-white dark:bg-[#0F1732] w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-[#050b1f]">
            <div className="flex flex-row justify-between p-5">
            </div>
          </div>
          {/*--- Card Right ---*/}
          <div className="lg:flex hidden bg-white dark:bg-[#0F1732] w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-[#050b1f]"></div>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center pt-5 gap-2 lg:hidden">
        <div className="bg-gray-700 rounded-full w-2 h-2"></div>
        <div className="bg-gray-700 rounded-full w-2 h-2"></div>
        <div className="bg-gray-700 rounded-full w-2 h-2"></div>
      </div>
      {/* --- COINTAINER 1 --- */}
      <div className="flex flex-col justify-center items-center mx-5 py-20">
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
      {/* <Sponsors/> */}
      {/* --- COINTAINER 3 --- */}
      <div className="flex flex-col justify-center items-center mx-5 py-20">
        <div>
          <h4 className="montserrat text-5xl sm:text-center dark:text-[#D8E0F9]">{t('built_for_you')}</h4>
          <p className="inter pt-6 max-w-160 sm:text-center text-gray-600 dark:text-[#D8E0F9]">{t('built_to_simplify')}</p>
        </div>
        <div className="flex flex-col text-black dark:text-[#D8E0F9] mt-20 gap-10 sticky top-[200px]">
          {/*--- CARD 1 --- */}
          <div className="grid grid-cols-3 max-w-[1280px] min-h-[500px] bg-white dark:bg-[#0F1732] w-full sm:h-[500px] h-fit rounded-3xl shadow-md ring-2 ring-gray-200 dark:ring-[#050b1f] p-10 sticky top-[200px]">
            <div className= "sm:col-span-2 col-span-3">
              <div className="flex flex-col">
                <div className="flex sm:flex-row flex-col items-center">
                  <MoneyBag className="w-24 h-24 mx-5 mb-5 sm:my-0 min-w-24"/>
                  <p className="mont_semibold sm:text-4xl text-xl">{t('take_controll')}</p>
                </div>
                <p className="inter sm:pt-10 pt-5 text-base/7 sm:text-lg">{t('take_controll_text')}.</p>
              </div>
            </div>
            <div className="sm:flex hidden sm:col-span-1 justify-center items-center italic">
              <img src="/test/test-img.png" alt="test" />
            </div>
          </div>
          {/*--- CARD 2 --- */}
          <div className="grid grid-cols-3 max-w-[1280px] min-h-[500px] bg-white dark:bg-[#0F1732] w-full sm:h-[500px] h-fit rounded-3xl shadow-md ring-2 ring-gray-200 dark:ring-[#050b1f] p-10 sticky top-[220px]">
            <div className= "sm:col-span-2 col-span-3">
              <div className="flex flex-col">
                <div className="flex sm:flex-row flex-col items-center">
                  <Flag className="w-24 h-24 mx-5 mb-5 sm:my-0 min-w-24"/>
                  <p className="mont_semibold sm:text-4xl text-xl">{t('intelligent_expense')}</p>
                </div>
                <p className="inter sm:pt-10 pt-5 text-base/7 sm:text-lg">{t('intelligent_expense_text')}.</p>
              </div>
            </div>
            <div className="sm:flex hidden sm:col-span-1 justify-center items-center italic"><img src="/test/test-img.png" alt="test" /></div>
          </div>
          {/*--- CARD 3 --- */}
          <div className="grid grid-cols-3 max-w-[1280px] min-h-[500px] bg-white dark:bg-[#0F1732] w-full sm:h-[500px] h-fit rounded-3xl shadow-md ring-2 ring-gray-200 dark:ring-[#050b1f] p-10 sticky top-[240px]">
            <div className= "sm:col-span-2 col-span-3">
              <div className="flex flex-col">
                <div className="flex sm:flex-row flex-col items-center">
                  <PolyBrain className="w-24 h-24 mx-5 mb-5 sm:my-0 min-w-24"/>
                  <p className="mont_semibold sm:text-4xl text-xl">{t('smart_financial')}</p>
                </div>
                <p className="inter sm:pt-10 pt-5 text-base/7 sm:text-lg">{t('smart_financial_text')}.</p>
              </div>
            </div>
            <div className="sm:flex hidden sm:col-span-1 justify-center items-center italic"><img src="/test/test-img.png" alt="test" /></div>
          </div>
        </div>
      </div>
      {/* --- COINTAINER 4 --- */}
      <div className="flex items-center justify-center mx-5 py-20">
        <iframe src="https://www.youtube.com/embed/Xr032EhUDPw"  className="flex justify-center items-center w-full aspect-video bg-linear-to-br from-[#70A1FF] to-[#1E4CA3] md:rounded-4xl rounded-xl max-w-[1280px]">
        </iframe>
        {/* <div className="w-full aspect-video bg-linear-to-br from-[#70A1FF] to-[#1E4CA3] md:rounded-4xl rounded-xl max-w-[1280px] flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" height="250px" viewBox="0 -960 960 960" width="250px" fill="#FFFFFF"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>
        </div> */}
      </div>
      {/* --- CONTAINER 5 --- */}
      <div className="flex flex-col justify-center items-center text-black dark:text-[#D8E0F9] mx-4 py-20">
        <div className="flex flex-col justify-center items-center">
          <SentimentStressedIcon className="w-24 h-24 text-black dark:text-[#D8E0F9]"/>
          <p className="montserrat text-4xl text-center">{t('managing_money')}</p>
          <p className="inter text-lg max-w-140 text-center pt-5">{t('managing_money_text')}</p>
        </div>
        <div className="flex flex-col justify-center items-center pt-12">
          <Heart className="w-24 h-24 text-black dark:text-[#D8E0F9]"/>
          <p className="montserrat text-4xl text-center">{t('why_built')}</p>
          <p className="inter text-lg max-w-140 text-center pt-5">{t('why_built_text')}</p>
        </div>
        <div className="flex flex-col justify-center items-center pt-12">
          <img src="/icons/finext.svg" alt="" className="w-18 h-18 m-2"/>
          <p className="montserrat text-4xl text-center">{t('ready_try')}</p>
          <p className="inter text-lg max-w-140 text-center pt-5">{t('ready_try_text')}</p>
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