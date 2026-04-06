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
        <div className="flex flex-row justify-between mx-5 xl:mx-[320px] pt-42">
          {/*Hero Left*/}
          <div className="flex flex-col justify-center text-[#D8E0F9] gap-3">
            <p className="mont_mid text-xl">FiNext</p>
            <p className="mont_semibold md:text-6xl text-3xl max-w-160 uppercase">{t('next_step')}</p>
            <p className="inter text-lg">{t('simplest_way')}.</p>
            <div className="pt-12">
              <button className="bg-[#84A2EB] py-3 px-12 rounded-full text-shadow-white text-white shadow-md cursor-pointer">Start Now</button>
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
          <div className="sm:flex hidden bg-white w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200"></div>
          {/*--- Card Middle ---*/}
          <div className="flex flex-col bg-white w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200">
            <div className="flex flex-row justify-between p-5">
              <p className="montserrat text-xl">CARD TITLE</p>
            </div>
          </div>
          {/*--- Card Right ---*/}
          <div className="lg:flex hidden bg-white w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200"></div>
        </div>
      </div>
      {/* --- COINTAINER 1 --- */}
      <div className="pt-40"></div>
      <div className="flex flex-col justify-center items-center mx-5 xl:mx-[320px]">
        <div>
          <h4 className="montserrat text-5xl sm:text-center ">{t('everything_in_one_place')}</h4>
          <p className="inter pt-6 max-w-160 sm:text-center text-gray-600 dark:text-[#D8E0F9]">{t('bring_all')}</p>
        </div>
        <div className="flex flex-row items-center pt-12 gap-3">
          {/* <div className="md:flex hidden bg-[#6483d2] w-80 h-100 rounded-3xl"></div> */}
          <div className="flex bg-[#84A2EB] w-100 h-120 rounded-3xl"></div>
          {/* <div className="md:flex hidden bg-[#6483d2] w-80 h-100 rounded-3xl"></div> */}
        </div>
      </div>
      {/* --- COINTAINER 2 --- */}
      <div className="pt-40"></div>
      <div className="bg-gray-300 w-full h-30"></div>
      {/* --- COINTAINER 3 --- */}
      <div className="pt-40"></div>
            <div className="flex flex-col justify-center items-center mx-5 xl:mx-[320px]">
        <div>
          <h4 className="montserrat text-5xl sm:text-center ">{t('built_for_you')}</h4>
          <p className="inter pt-6 max-w-160 sm:text-center text-gray-600 dark:text-[#D8E0F9]">{t('built_to_simplify')}</p>
        </div>
      </div>
      {/* --- COINTAINER FOOTER --- */}
      <div className="h-500"></div>
      <Footer/>
    </>
  )
}

export default Home