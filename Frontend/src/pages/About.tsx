import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import { useTranslation } from 'react-i18next';

import { NavLink } from "react-router-dom";
import WrenchIcon from '/src/assets/icons/wrench.svg?react'
function About() {
  const { t } = useTranslation("about");

  return (
    <>
      <Navbar />
      <div className="flex flex-col pt-28 pb-12 sm:pt-45 sm:pb-25 justify-center items-center gap-2 bg-gradient-to-r from-[#7844C9] to-[#3667C8] sm:from-[#7844C9] sm:via-[#3667C8] sm:to-[#5c44c9]">
        <h2 className="montserrat text-5xl sm:text-center text-white ">{t('hero_title')}</h2>
        <p className="inter max-w-160 sm:text-center text-dark-text">{t('hero_subtitle')}</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center py-14 max-w-300 text-center">
          <p className="inter text-gray-600 px-4 dark:text-dark-text">FiNext is an financial dashboard built by three developers who believe that understanding your finances shouldn't require a finance degree. We focus on clean data visualization, intuitive UX, and a codebase worth being proud of.</p>
        </div>
        {/* Us */}
        <hr className="mb-6 border-t border-gray-300 dark:border-gray-700 w-full" />
        <div className="flex flex-row justify-center items-center gap-2">
          <WrenchIcon className="w-10 h-10"/>
          <p className="montserrat text-gray-800 dark:text-dark-text text-3xl text-center">FiNext Developers</p>
        </div>
        <hr className="my-6 border-t border-gray-300 dark:border-gray-700 w-full" />
        {/* CARD 1 */}
        <div className="w-full max-w-7xl py-10 px-4">
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
                    Eduardo Rubio Chaparro
                  </p>
                  <p className="inter text-gray-600 dark:text-gray-400">
                    Full Stack Web Developer
                  </p>
                </div>
                <p className="inter text-gray-500 dark:text-gray-300">Frontend-focused Full Stack Developer with experience building modern web applications using React, Angular,
                  TypeScript and Laravel. Strong interest in frontend architecture, user experience and scalable web applications.
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <p>GitHub</p>
                  <p>LinkedIn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-t border-gray-300 dark:border-gray-700 w-full" />
        {/* CARD 2 */}
        <div className="w-full max-w-7xl py-10 px-4">
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
                    Jeremy Intriago
                  </p>
                  <p className="inter text-gray-600 dark:text-gray-400">
                    Full Stack Web Developer
                  </p>
                </div>
                <p className="inter text-gray-500 dark:text-gray-300">Frontend-focused Full Stack Developer with experience building modern web applications using React, Angular,
                  TypeScript and Laravel. Strong interest in frontend architecture, user experience and scalable web applications.
                </p>
                <div className="flex gap-4 justify-center md:justify-end">
                  <p>GitHub</p>
                  <p>LinkedIn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-t border-gray-300 dark:border-gray-700 w-full" />
        {/* CARD 3 */}
        <div className="w-full max-w-7xl py-10 px-4">
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
                    Marc apellidos
                  </p>
                  <p className="inter text-gray-600 dark:text-gray-400">
                    Full Stack Web Developer
                  </p>
                </div>
                <p className="inter text-gray-500 dark:text-gray-300">Frontend-focused Full Stack Developer with experience building modern web applications using React, Angular,
                  TypeScript and Laravel. Strong interest in frontend architecture, user experience and scalable web applications.
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <p>GitHub</p>
                  <p>LinkedIn</p>
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