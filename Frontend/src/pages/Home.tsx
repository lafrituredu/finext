import Navbar from "../components/layout/Navbar"
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation("home");
  return (
    <>
        <Navbar/>
        {/* <div className="bg-linear-to-br from-[#353391] to-[#7943C9] h-160"> */}
        <div className="bg-[url(/home/homebg.png)] bg-no-repeat bg-contain bg-[position:center_-120px]">
          <main className="pt-8 text-black dark:text-[#D8E0F9]">
            {/* --- COINTAINER HERO --- */}
            <div className="mx-[320px] flex flex-row justify-between">
              {/*Left*/}
              <div className="pt-40 text-[#D8E0F9] flex flex-col">
                <p className="mont_mid text-xl">FiNext</p>
                <p className="mont_semibold text-6xl max-w-160 pb-3 pt-1 uppercase">{t('next_step')}</p>
                <p className="inter">{t('simplest_way')}.</p>
                <div className="pt-12">
                  <button className="bg-[#84A2EB] py-3 px-12 rounded-full text-shadow-white text-white shadow-md cursor-pointer">Start Now</button>
                </div>
              </div>
              {/*Right*/}
              <div className="pt-32">
                <img src="/icons/finext.svg" alt="finext" className="w-100"/>
              </div>
            </div>
            <div className="flex flex-row justify-between mx-[260px] pt-20 gap-x-10">
              <div className="card w-100 h-60 bg-white dark:bg-[#0F1732] shadow-lg rounded-2xl ring-1 ring-gray-200 dark:ring-gray-900">
              </div>
              <div className="card w-100 h-60 bg-white dark:bg-[#0F1732] shadow-lg rounded-2xl ring-1 ring-gray-200 dark:ring-gray-900">
              </div>
              <div className="card w-100 h-60 bg-white dark:bg-[#0F1732] shadow-lg rounded-2xl ring-1 ring-gray-200 dark:ring-gray-900">
              </div>
              
            </div>
            {/* --- COINTAINER 1 --- */}
            <div className="pt-[140px] flex flex-col items-center justify-center">
              <div>
                <h4 className="montserrat text-5xl text-center ">{t('everything_in_one_place')}</h4>
                <p className="inter pt-6 max-w-160 text-center text-gray-600 dark:text-[#D8E0F9]">{t('bring_all')}</p>
              </div>
              <div className="flex flex-row justify-center items-center pt-12 gap-3">
                <div className="bg-[#6483d2] w-90 h-120 rounded-3xl"></div>
                <div className="bg-[#84A2EB] w-120 h-150 rounded-3xl"></div>
                <div className="bg-[#6483d2] w-90 h-120 rounded-3xl"></div>
              </div>
            </div>
            {/* --- COINTAINER 2 --- */}
            <div className="flex flex-row justify-center text-3xl gap-40 py-[180px]">
              <p>Lorem Ipsum</p>
              <p>Lorem Ipsum</p>
              <p>Lorem Ipsum</p>
              <p>Lorem Ipsum</p>
              <p>Lorem Ipsum</p>
            </div>
            {/* --- COINTAINER 3 --- */}
            <div className="flex flex-col items-center justify-center">
              <div>
                <h4 className="montserrat text-5xl text-center ">{t('built_for_you')}</h4>
                <p className="inter pt-6 max-w-160 text-center text-gray-600 dark:text-[#D8E0F9]">{t('built_to_simplify')}</p>
              </div>
              <div className="mx-[340px]">
                <div className="bg-white dark:bg-[#0F1732] w-320 h-140 shadow-lg rounded-4xl mt-20"></div>
                <div className="bg-white dark:bg-[#0F1732] w-320 h-140 shadow-lg rounded-4xl mt-20"></div>
                <div className="bg-white dark:bg-[#0F1732] w-320 h-140 shadow-lg rounded-4xl mt-20"></div>
              </div>
            </div>
          </main>
        </div>
    </>
  )
}

export default Home