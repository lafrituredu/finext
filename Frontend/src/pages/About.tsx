import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import { useTranslation } from 'react-i18next';

import { NavLink } from "react-router-dom";

function About() {
  const { t } = useTranslation("about");

  return (
  <>
    <Navbar/>
    <div className="flex flex-col pt-28 pb-12 sm:pt-45 sm:pb-25 justify-center items-center gap-2 bg-gradient-to-r from-[#7844C9] to-[#3667C8] sm:from-[#7844C9] sm:via-[#3667C8] sm:to-[#5c44c9]">
      <h2 className="montserrat text-5xl sm:text-center text-white ">{t('hero_title')}</h2>
      <p className="inter max-w-160 sm:text-center text-dark-text">{t('hero_subtitle')}</p>
    </div>
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center py-20 max-w-300 text-center">
        <p className="inter text-gray-500">FiNext is an financial dashboard built by three developers who believe that understanding your finances shouldn't require a finance degree. We focus on clean data visualization, intuitive UX, and a codebase worth being proud of.</p>
      </div>
      {/* Us */}
      <hr className="mb-6 border-t border-gray-300 w-full" />
      <p className="montserrat text-gray-800 dark:text-dark-text text-3xl">FiNext Developers</p>
      <hr className="my-6 border-t border-gray-300 w-full" />
      {/* Person1 */}
      <div id="card1" className="h-60 w-full flex flex-row justify-between items-center px-50 gap-12">
        <div className="w-1/3 flex items-center justify-end">
          <div className="flex justify-center items-center bg-primary rounded-full w-40 h-40">
            <p className="inter text-5xl text-white">E</p>
          </div>
        </div>
        <div className="w-2/3 flex items-center justify-start">
          <div className="flex flex-col justify-center items-start gap-2">
            <div className="">
              <p className="montserrat text-2xl">Eduardo Rubio Chaparro</p>
              <p className="inter text-gray-600">Full Stack Web Developer</p>
            </div>
            <p className="inter text-gray-500">Frontend-focused Full Stack Developer with experience building modern web applications using React, Angular, TypeScript and Laravel. Strong interest in frontend architecture, user experience and scalable web applications.</p>
            <div className="flex flex-row gap-4">
              <p>git</p>
              <p>linkedin</p>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-6 border-t border-gray-300 w-full" />
      {/* Person2 */}
      <div id="card2" className="h-60 w-full flex flex-row justify-between items-center px-50 gap-12">
        <div className="w-2/3 flex items-center justify-start">
          <div className="flex flex-col justify-center items-end gap-2 text-right">
            <div>
              <p className="montserrat text-2xl">Jeremy Intriago</p>
              <p className="inter text-gray-600">Full Stack Web Developer</p>
            </div>
            <p className="inter text-gray-500">Frontend-focused Full Stack Developer with experience building modern web applications using React, Angular, TypeScript and Laravel. Strong interest in frontend architecture, user experience and scalable web applications.</p>
            <div className="flex flex-row gap-4">
              <p>git</p>
              <p>linkedin</p>
            </div>
          </div>
        </div>
        <div className="w-1/3 flex items-center justify-start">
          <div className="flex justify-center items-center bg-primary rounded-full w-40 h-40">
            <p className="inter text-5xl text-white">J</p>
          </div>
        </div>
        
      </div>
      <hr className="my-6 border-t border-gray-300 w-full" />
      {/* Person3 */}
      <div id="card3" className="h-60 w-full flex flex-row justify-between items-center px-50 gap-12">
        <div className="w-1/3 flex items-center justify-end">
          <div className="flex justify-center items-center bg-primary rounded-full w-40 h-40">
            <p className="inter text-5xl text-white">E</p>
          </div>
        </div>
        <div className="w-2/3 flex items-center justify-start">
          <div className="flex flex-col justify-center items-start gap-2">
            <div className="">
              <p className="montserrat text-2xl">Eduardo Rubio Chaparro</p>
              <p className="inter text-gray-600">Full Stack Web Developer</p>
            </div>
            <p className="inter text-gray-500 max-w-200">Frontend-focused Full Stack Developer with experience building modern web applications using React, Angular, TypeScript and Laravel. Strong interest in frontend architecture, user experience and scalable web applications.</p>
            <div className="flex flex-row gap-4">
              <p>git</p>
              <p>linkedin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </>
  );
}

export default About;