//Library
import { useTranslation } from 'react-i18next';
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { animate, stagger } from 'animejs';
import dayjs from "dayjs";

//Components
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

//Icons
import SentimentStressedIcon from '/src/assets/icons/Sentiment-stressed-icon.svg?react'
import Heart from '/src/assets/icons/Heart.svg?react'
import MoneyBag from '/src/assets/icons/Money-bag.svg?react'
import Flag from '/src/assets/icons/Flag.svg?react'
import PolyBrain from '/src/assets/icons/PolyBrain.svg?react'
import FiNextIcon from '/src/assets/icons/finext.svg?react'
import Goals from '/src/assets/icons/Goals.svg?react'
import KpiStatsUp from '/src/assets/icons/Kpi-stats-up.svg?react'
import KpiStatsDown from '/src/assets/icons/Kpi-stats-down.svg?react'
import PDFIcon from '/src/assets/icons/PDF-Icon.svg?react'
import ArrowDownDotsIcon from '/src/assets/icons/ArrowDownDots.svg?react'

function Home() {
  const { t } = useTranslation("home");
  const { t:ct } = useTranslation("utils");
  const [PDFanimation,setPDFanimation] = useState(false);

  useEffect(() => {
    animate("#HeroLeft > *",{
        x: ["-100px", "0px"],
        opacity: [0, 1],
        duration: '1000',
        delay: stagger(100)
    });

    animate('#arrowDownIcon',{
        y: ["-50px", "0px"],
        opacity: [0, 1],
        duration: '1500'
    });
    animate('#hr_arrow_left', {
        x: ["-150px", "0px"],
        duration: '1000'
    });
    animate('#hr_arrow_right', {
        x: ["150px", "0px"],
        duration: '1000'
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target as HTMLElement;

        if (el.id === "everything_one_place") {
          animate(`#${el.id}`,{
            y: ["150px", "0px"],
            duration: 1000,
            easing: "easeOutQuad"
          });

          observer.unobserve(el);
        }
        
        if (el.id === "everything_one_place_text") {
          animate('#everything_one_place_text',{
            y: ["150px", "0px"],
            duration: 1000,
            easing: "easeOutQuad"
          });

          observer.unobserve(el);
        }

        if (el.id === "cards_hero") {
          animate('#cards_hero > *',{
            y: ["250px", "0px"],
            opacity: [0, 1],
            duration: 1000,
            delay: stagger(200),
            easing: "easeOutQuad"
          });

          observer.unobserve(el);
        }

        if (el.id === "icons_text") {
          animate('#icons_text > *',{
            opacity: [0,1],
            duration: 1500,
            easing: "easeOutQuad",
            delay: stagger(400)
          });

          observer.unobserve(el);
        }

        if (el.id === "built_for_you") {
          animate('#built_for_you > *', {
            y: ["150px", "0px"],
            opacity: [0,1],
            duration: 1000,
            easing: "easeOutQuad"
          });

          observer.unobserve(el);
        }
      });
    });

    const everything = document.getElementById("everything_one_place");
    const everything_text = document.getElementById("everything_one_place_text");
    const icons_text = document.getElementById("icons_text");
    const cards = document.getElementById("cards_hero");
    const built_for_you = document.getElementById("built_for_you");

    if (everything) observer.observe(everything);
    if (cards) observer.observe(cards);
    if (everything_text) observer.observe(everything_text);
    if (icons_text) observer.observe(icons_text);
    if (built_for_you) observer.observe(built_for_you);

  }, []);

  return (
    <>
      <Navbar/>
      {/* --- COINTAINER HERO --- */}
      <div className="bg-[url(/home/homebg.png)] w-full bg-no-repeat bg-cover xl:bg-[position:center_-80px] bg-[position:center]">
        <div className="flex flex-row xl:justify-center justify-start items-around mx-5 xxl:mx-[120px] pt-50 gap-56">
          {/*Hero Left*/}
          <div id="HeroLeft" className="flex flex-col justify-center text-dark-text gap-3">
            <p className="mont_mid text-xl" >FiNext</p>
            <p className="mont_semibold md:text-6xl text-3xl max-w-160 uppercase">{t('next_step')}</p>
            <p className="inter text-lg">{t('simplest_way')}.</p>
            <div className="pt-12">
              <NavLink to="/dashboard">
                <button className=" inter relative w-42 h-12 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
                  <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                    {t('start_now')}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                    {t('lets_go')}
                  </span>
                </button>
              </NavLink>
            </div>
          </div>
          {/*Hero Right*/}
          <div className="xl:flex hidden">
            <FiNextIcon className="min-w-100"/>
          </div>
        </div>
        <div className="h-64"></div>
      </div>
      <div className="hidden sm:flex flex-row justify-center items-center w-full gap-4 px-10 overflow-hidden">
        <hr id="hr_arrow_left" className="flex-1 border-t border-gray-300 dark:border-gray-700 mx-20" />
        <a id="arrowDownIcon" href="#everything_one_place"><ArrowDownDotsIcon   className="shrink-0 animate-pulse text-gray-500 dark:text-gray-700" /></a>
        <hr id="hr_arrow_right" className="flex-1 border-t border-gray-300 dark:border-gray-700 mx-20" />
      </div>
      {/* --- COINTAINER 1 (Everything in one place) --- */}
      <div className="flex flex-col justify-center items-center mx-5 sm:py-20 py-15">
        <div>
          <h4 id="everything_one_place" className="montserrat text-5xl sm:text-center dark:text-dark-text ">{t('everything_in_one_place')}</h4>
          <p id="everything_one_place_text" className="inter pt-6 max-w-160 sm:text-center text-gray-600 dark:text-dark-text">{t('bring_all')}</p>
        </div>
        {/*--- CARDS HERO ---*/}
        <div id="cards_hero" className="w-full flex justify-center pt-25 xl:gap-20 gap-5">
          {/*--- Card left ---*/}
          <div id="card1" className="flex relative bg-background dark:bg-dark-card w-full sm:w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-[#050b1f]
          hover:-translate-y-4 duration-400 ease-out transition-transform overflow-hidden">
            <div className="p-5 inter">
              <p className="text-2xl bold_montserrat">{t('clear_view')}</p>
            </div>
            <div className="absolute bottom-0 left-5 translate-x-20 translate-y-0 hover:-translate-y-5 transition-all ease-out w-150 bg-white dark:bg-dark-background border border-gray-300 dark:border-gray-800 h-30  rounded-2xl" >
              <p className="flex gap-2 items-center inter border-b border-r px-5 py-3.5 border-gray-200 dark:border-gray-900 inter"><img src="/img/FiNext.png" alt="FiNext-Logo" className="w-5 h-5 min-w-5"/> Finext <span className="font-semibold">@jeremyin</span></p>
            </div>

            <div className="absolute bottom-0 left-5 translate-x-10 translate-y-10 hover:translate-y-5  transition-all ease-out w-150 bg-white dark:bg-dark-background border border-gray-300 dark:border-gray-800 h-30  rounded-2xl" >
              <p className="flex gap-2 items-center inter border-b px-5 py-3.5 border-gray-200 dark:border-gray-900 inter"><img src="/img/FiNext.png" alt="FiNext-Logo" className="w-5 h-5 min-w-5"/> Finext <span className="font-semibold">@erubio</span></p>
            </div>

            <div className="absolute bottom-0 left-5 translate-x-0 translate-y-20 hover:translate-y-15  transition-all ease-out w-150 bg-white dark:bg-dark-background border border-gray-300 dark:border-gray-800 h-30  rounded-2xl" >
              <p className="flex gap-2 items-center inter border-b px-5 py-3.5 border-gray-200 dark:border-gray-900 inter"><img src="/img/FiNext.png" alt="FiNext-Logo" className="w-5 h-5 min-w-5"/> Finext <span className="font-semibold">@magi</span></p>
            </div>
          </div>
          {/*--- Card Middle ---*/}
          <div id="card2" className="lg:flex hidden flex-col bg-background dark:bg-dark-card w-full sm:w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-[#050b1f]
          hover:-translate-y-4 duration-400 ease-out transition-transform relative overflow-clip">
            <div className="p-5 inter">
              <p className="text-2xl bold_montserrat">{t('manage_with_a')} <span className="font-bold">{t('personal_account')}</span></p>
            </div>

            <div className="-bottom-2 left-10 absolute w-fit h-fit flex hover:-translate-x-106 transition-all ease-in-out duration-1000 gap-5">
              <div className='bg-white w-100 border rounded-2xl border-[#0000001a] dark:border-[#1d2344] dark:bg-dark-background px-7 py-5 flex flex-col gap-3'>
                  <div className='flex items-center justify-between'>
                      <span className='flex items-center montserrat'>
                          <span className='bg-[#84A2EB66] p-1 rounded-full me-2'> <Goals /></span> {t('incomes')}
                      </span>
                      <KpiStatsUp className='text-green-600 right-0'/>
                  </div>
                    <p className='text-4xl text-green-600'>112.321€</p>
                    <p className='text-[#040919b3] dark:text-[#D8E0F9]'>{ct('months.may')} {dayjs().year()}</p>
              </div>

              <div className='bg-white w-100 border transition-all ease-out duration-300 rounded-2xl border-[#0000001a] dark:border-[#1d2344] dark:bg-dark-background px-7 py-5 flex flex-col gap-3'>
                  <div className='flex items-center justify-between'>
                      <span className='flex items-center montserrat'>
                          <span className='bg-[#84A2EB66] p-1 rounded-full me-2'> <Goals /></span> {t('outcomes')}
                      </span>
                      <KpiStatsDown className='text-red-600 right-0'/>
                  </div>
                    <p className='text-4xl text-red-600'>112.321€</p>
                    <p className='text-[#040919b3] dark:text-[#D8E0F9]'>{ct('months.may')} {dayjs().year()}</p>
              </div>
            </div>
          </div>
          {/*--- Card Right ---*/}
          <div  id="card3" className="lg:flex hidden bg-background dark:bg-dark-card w-full sm:w-[420px] h-[250px] rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-[#050b1f]
          hover:-translate-y-4 duration-400 ease-out transition-transform relative">
            <div className="p-5 inter">
              <p className="text-2xl bold_montserrat">{t('generate_pdf')} <span className="font-bold">{t('freelancer')}</span></p>
            </div>
              <div className={`absolute w-full h-[50%] bottom-0 left-0 flex items-center justify-center gap-5 overflow-hidden`}>
                <button onClick={() => setPDFanimation(!PDFanimation)} className="relative bg-primary p-2 border border-primary rounded-full cursor-pointer shadow-md hover:scale-110 transition
                after:content-[''] after:absolute after:rounded-full after:w-3 after:h-3 after:bg-red-500 after:top-0 after:right-0 after:animate-ping
                before:content-[''] before:absolute before:rounded-full before:w-3 before:h-3 before:bg-red-500 before:top-0 before:right-0"><PDFIcon className="size-5 text-dark-text" /> </button>
                <div className={`border bg-white border-[#0000001a] dark:border-[#1d2344] h-36  w-60 px-5 py-3 rounded-2xl ${!PDFanimation ? 'translate-y-35' : 'translate-y-4'} transition duration-300 ease-out dark:bg-dark-background`}>
                  <p className="bold_montserrat font-bold">{t('taxes')} <span className="text-sm text-gray-400 font-normal">{t('auto-generated')}</span></p>
                  <p className="montserrat">{t('taxes_of')} { new Date().toLocaleDateString() }</p>
                </div>
              </div>
          </div>
        </div>
      </div>
      {/* --- COINTAINER 2 (SPONSORS) --- */}
      {/* <Sponsors/> */}
      {/* --- COINTAINER 3 (INFO CARDS) --- */}
      <div className="flex flex-col justify-center items-center mx-5 sm:py-20 py-15">
        <div id="built_for_you">
          <h4 className="montserrat text-5xl sm:text-center dark:text-dark-text">{t('built_for_you')}</h4>
          <p className="inter pt-6 max-w-160 sm:text-center text-gray-600 dark:text-dark-text">{t('built_to_simplify')}</p>
        </div>
        <div className="flex flex-col text-black dark:text-dark-text mt-20 gap-10 sticky top-[150px] sm:top-[200px]">
          {/*--- CARD 1 --- */}
          <div className="grid grid-cols-3 max-w-[1280px] min-h-[500px] bg-background dark:bg-dark-card w-full sm:h-[500px] h-fit rounded-3xl shadow-md ring-2 ring-gray-200 dark:ring-[#050b1f] p-10 sticky top-[150px] sm:top-[200px]">
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
              <img src="/img/Cardtop_imagev2.png" alt="test"  className="dark:hidden block"/>
              <img src="/img/Dark_Cardtop_imagev2.png" alt="test" className="hidden dark:block" />
            </div>
          </div>
          {/*--- CARD 2 --- */}
          <div className="grid grid-cols-3 max-w-[1280px] min-h-[500px] bg-background dark:bg-dark-card w-full sm:h-[500px] h-fit rounded-3xl shadow-md ring-2 ring-gray-200 dark:ring-[#050b1f] p-10 sticky top-[150px] sm:top-[200px]">
            <div className= "sm:col-span-2 col-span-3">
              <div className="flex flex-col">
                <div className="flex sm:flex-row flex-col items-center">
                  <Flag className="w-24 h-24 mx-5 mb-5 sm:my-0 min-w-24"/>
                  <p className="mont_semibold sm:text-4xl text-xl">{t('intelligent_expense')}</p>
                </div>
                <p className="inter sm:pt-10 pt-5 text-base/7 sm:text-lg">{t('intelligent_expense_text')}.</p>
              </div>
            </div>
            <div className="sm:flex hidden sm:col-span-1 justify-center items-center italic">
              <img src="/img/Cardmiddle_image.png" alt="test" className="block dark:hidden" />
              <img src="/img/Dark_Cardmiddle_image.png" alt="test" className="hidden dark:block"/>
              </div>
          </div>
          {/*--- CARD 3 --- */}
          <div className="grid grid-cols-3 max-w-[1280px] min-h-[500px] bg-background dark:bg-dark-card w-full sm:h-[500px] h-fit rounded-3xl shadow-md ring-2 ring-gray-200 dark:ring-[#050b1f] p-10 sticky top-[150px] sm:top-[200px]">
            <div className= "sm:col-span-2 col-span-3">
              <div className="flex flex-col">
                <div className="flex sm:flex-row flex-col items-center">
                  <PolyBrain className="w-24 h-24 mx-5 mb-5 sm:my-0 min-w-24"/>
                  <p className="mont_semibold sm:text-4xl text-xl">{t('smart_financial')}</p>
                </div>
                <p className="inter sm:pt-10 pt-5 text-base/7 sm:text-lg">{t('smart_financial_text')}.</p>
              </div>
            </div>
            <div className="sm:flex hidden sm:col-span-1 justify-center items-center italic">
              <img src="/img/Cardbottom_image.png" alt="test" className="block dark:hidden" />
              <img src="/img/Dark_Cardbottom_image.png" alt="test" className="hidden dark:block"/>
              </div>
          </div>
        </div>
      </div>
      {/* --- COINTAINER 4 (VIDEO) --- */}
      <div className="flex items-center justify-center mx-5 sm:py-20 py-15">
          <video
              loop
              playsInline
              controls
              poster="/img/FiNext_Miniatura.png"
            className="w-full aspect-video object-cover md:rounded-4xl rounded-xl max-w-[1280px]">
            <source src="/vid/FiNext_Promo_video.mp4" type="video/mp4" />
          </video>
      </div>
      {/* --- CONTAINER 5 (INFO) --- */}
      <div id="icons_text" className="flex flex-col justify-center items-center text-black dark:text-dark-text mx-4 sm:py-20 py-20">
        <div className="flex flex-col justify-center items-center">
          <SentimentStressedIcon className="w-24 h-24 text-black dark:text-dark-text hover:text-yellow-500 hover:drop-shadow-[0_0_8px_rgba(234,179,8,0.7)] duration-500 ease-out transition-all"/>
          <p className="montserrat text-4xl text-center">{t('managing_money')}</p>
          <p className="inter text-lg max-w-140 text-center pt-5">{t('managing_money_text')}</p>
        </div>
        <div className="flex flex-col justify-center items-center pt-12">
          <Heart className="w-24 h-24 text-black dark:text-dark-text hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.7)] duration-500 ease-out transition-all"/>
          <p className="montserrat text-4xl text-center">{t('why_built')}</p>
          <p className="inter text-lg max-w-140 text-center pt-5">{t('why_built_text')}</p>
        </div>
        <div className="flex flex-col justify-center items-center pt-12">
          <img src="/img/FiNext.png" alt="FiNext-Logo" className="w-18 h-18 m-2 hover:drop-shadow-[0_0_8px_rgba(70,110,255,0.7)] duration-500 ease-out transition-all"/>
          <p className="montserrat text-4xl text-center">{t('ready_try')}</p>
          <p className="inter text-lg max-w-140 text-center pt-5">{t('ready_try_text')}</p>
        </div>
        {/* Start now button */}
        <div className="pt-12">
          <NavLink to="/dashboard">
            <button className="relative overflow-hidden py-3 px-12 font-semibold bg-background dark:bg-dark-background group border-2
            border-primary rounded-full cursor-pointer">
              <span className="absolute inset-0 rounded-full bg-primary scale-0 group-hover:scale-150 transition-transform duration-500"></span>
              <span className="relative z-10 text-primary group-hover:text-white transition-colors duration-500">
                {t('start_now')}
              </span>
            </button>
          </NavLink>
        </div>
      </div>
      
      {/* --- COINTAINER FOOTER --- */}
        <Footer/>
    </>
  )
}

export default Home
