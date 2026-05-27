//Library
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";
import { animate, stagger } from "animejs";

//Components
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

//Icons
import WrenchIcon from '/src/assets/icons/wrench.svg?react'
import GithubIcon from '/src/assets/icons/Github.svg?react'
import LinkedinIcon from '/src/assets/icons/Linkedin.svg?react'


function About() {
  const { t } = useTranslation("about");

  //Animations
  useEffect(() => {
      animate("#hero > *",{
          y: ["100px", "0px"],
          opacity: [0, 1],
          duration: '1000',
          delay: stagger(100)
      });

      animate('#whats_finext',{
          x: ["-100%", "0px"],
          opacity: [0, 1],
          duration: '1000',
          delay: 400
      });
      animate('#devops',{
          x: ["100%", "0px"],
          opacity: [0, 1],
          duration: '1000',
          delay: 400
      });
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;

          if (el.id === "card1") {
            animate(`#${el.id}`,{
              translateX: ["300px", "0px"],
              opacity: [0,1],
              duration: 1000,
              easing: "easeOutQuad",
              delay: 300
            });

            observer.unobserve(el);
          }

          if (el.id === "card2") {
            animate(`#${el.id}`,{
              translateX: ["-300px", "0px"],
              opacity: [0,1],
              duration: 1000,
              easing: "easeOutQuad",
              delay: 300
            });

            observer.unobserve(el);
          }

          if (el.id === "card3") {
            animate(`#${el.id}`,{
              translateX: ["300px", "0px"],
              opacity: [0,1],
              duration: 1000,
              easing: "easeOutQuad",
              delay: 300
            });

            observer.unobserve(el);
          }

        });
      });

      const card1 = document.getElementById("card1");
      const card2 = document.getElementById("card2");
      const card3 = document.getElementById("card3");

      if (card1) observer.observe(card1);
      if (card2) observer.observe(card2);
      if (card3) observer.observe(card3);
  }, []);
  return (
    <>
      <Navbar />
      <div id="hero" className="flex flex-col pt-28 pb-12 sm:pt-45 sm:pb-25 justify-center items-center gap-2 bg-gradient-to-r from-[#7844C9] to-[#3667C8] sm:from-[#7844C9] sm:via-[#3667C8] sm:to-[#5c44c9]">
        <h2 className="montserrat text-5xl sm:text-center text-white ">{t('hero_title')}</h2>
        <p className="inter max-w-160 sm:text-center text-dark-text">{t('hero_subtitle')}</p>
      </div>
      <div className="flex flex-col items-center justify-center overflow-hidden">
        <div id="whats_finext" className="flex flex-col items-center justify-center py-14 max-w-300 text-center">
          <p className="inter text-gray-600 px-4 dark:text-dark-text">{t('description')}</p>
        </div>
        {/* Us */}
        <hr className="mb-6 border-t border-gray-300 dark:border-gray-700 w-full" />
        <div id="devops" className="flex flex-row justify-center items-center gap-2">
          <WrenchIcon className="w-10 h-10"/>
          <p className="montserrat text-gray-800 dark:text-dark-text text-3xl text-center">FiNext Developers</p>
        </div>
        <hr className="my-6 border-t border-gray-300 dark:border-gray-700 w-full" />
        {/* CARD 1 */}
        <div id="card1" className="w-full max-w-7xl py-10 px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="flex justify-center md:w-1/4">
              <div className="flex justify-center items-center bg-primary rounded-full w-28 h-28 sm:w-36 sm:h-36">
                <p className="inter text-4xl sm:text-5xl text-white">E</p>
              </div>
            </div>
            {/* Content */}
            <div className="md:w-3/4 text-center md:text-left">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="montserrat text-2xl">
                    {t('edu.title')}
                  </p>
                  <p className="inter text-gray-600 dark:text-gray-400">
                    {t('edu.sub_title')}
                  </p>
                </div>
                <p className="inter text-gray-500 dark:text-gray-300">
                  {t('edu.description')}
                </p>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <a href="https://github.com/eru9927" target="_blank" className="py-1 px-5 bg-[#24292F] text-white cursor-pointer flex gap-2 items-center rounded-xl  hover:bg-[#1B1F23] transition-all duration-200 shadow-md hover:scale-105">
                      GitHub
                      <GithubIcon className="size-5" />
                    </a>

                    <a href="https://www.linkedin.com/in/eduardo-rubio-chaparro-577811232/" target="_blank" className="py-1 px-5 bg-[#0077B5] text-white cursor-pointer flex gap-2 items-center rounded-xl  hover:bg-[#005E93] transition-all duration-200 shadow-md hover:scale-105">
                      LinkedIn
                      <LinkedinIcon className="size-5 " />
                    </a>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-t border-gray-300 dark:border-gray-700 w-full" />
        {/* CARD 2 */}
        <div id="card2" className="w-full max-w-7xl py-10 px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            {/* Avatar */}
            <div className="flex justify-center md:w-1/4">
              <div className="flex justify-center items-center bg-primary rounded-full w-28 h-28 sm:w-36 sm:h-36">
                <p className="inter text-4xl sm:text-5xl text-white">J</p>
              </div>
            </div>
            {/* Content */}
            <div className="md:w-3/4 text-center md:text-right">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="montserrat text-2xl">
                    {t('jeremy.title')}
                  </p>
                  <p className="inter text-gray-600 dark:text-gray-400">
                    {t('jeremy.sub_title')}
                  </p>
                </div>
                <p className="inter text-gray-500 dark:text-gray-300">
                  {t('jeremy.description')}
                </p>
                  <div className="flex gap-4 justify-center md:justify-end">
                    <a href="https://github.com/injerr/" target="_blank" className="py-1 px-5 bg-[#24292F] text-white cursor-pointer flex gap-2 items-center rounded-xl  hover:bg-[#1B1F23] transition-all duration-200 shadow-md hover:scale-105">
                      GitHub
                      <GithubIcon className="size-5" />
                    </a>

                    <a href="https://www.linkedin.com/in/jeremy-intriago-6735202b3/" target="_blank" className="py-1 px-5 bg-[#0077B5] text-white cursor-pointer flex gap-2 items-center rounded-xl  hover:bg-[#005E93] transition-all duration-200 shadow-md hover:scale-105">
                      LinkedIn
                      <LinkedinIcon className="size-5 " />
                    </a>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-t border-gray-300 dark:border-gray-700 w-full" />
        {/* CARD 3 */}
        <div id="card3" className="w-full max-w-7xl py-10 px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="flex justify-center md:w-1/4">
              <div className="flex justify-center items-center bg-primary rounded-full w-28 h-28 sm:w-36 sm:h-36">
                <p className="inter text-4xl sm:text-5xl text-white">M</p>
              </div>
            </div>
            {/* Content */}
            <div className="md:w-3/4 text-center md:text-left">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="montserrat text-2xl">
                    {t('marc.title')}
                  </p>
                  <p className="inter text-gray-600 dark:text-gray-400">
                    {t('marc.sub_title')}
                  </p>
                </div>
                <p className="inter text-gray-500 dark:text-gray-300">
                  {t('marc.description')}
                </p>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <a href="https://github.com/" target="_blank" className="py-1 px-5 bg-[#24292F] text-white cursor-pointer flex gap-2 items-center rounded-xl  hover:bg-[#1B1F23] transition-all duration-200 shadow-md hover:scale-105">
                      GitHub
                      <GithubIcon className="size-5" />
                    </a>

                    <a href="https://linkedin.com/" target="_blank" className="py-1 px-5 bg-[#0077B5] text-white cursor-pointer flex gap-2 items-center rounded-xl  hover:bg-[#005E93] transition-all duration-200 shadow-md hover:scale-105">
                      LinkedIn
                      <LinkedinIcon className="size-5 " />
                    </a>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default About;