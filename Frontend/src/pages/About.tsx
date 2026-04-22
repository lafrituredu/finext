import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import { useTranslation } from 'react-i18next';

import { NavLink } from "react-router-dom";
import { useState } from "react";

function About() {
  const { t } = useTranslation("about");

  return (
  <>
      <Navbar/>
    <div className="min-h-screen bg-white dark:bg-dark-background pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#5B3FD8] via-[#5545C8] to-[#7B5FE8] dark:from-[#3023AE] dark:to-[#5B47D8] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mont_semibold text-5xl text-white mb-4">
            {t('hero_title')}
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
            <p className="inter text-white text-sm">
              {t('hero_subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Intro Section */}
        <div className="text-center mb-16">
          <h2 className="mont_semibold text-3xl text-black dark:text-white mb-4 leading-tight">
            {t('intro_title')}
          </h2>
          <p className="inter text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base leading-relaxed">
            {t('intro_description')}
          </p>
        </div>

        {/* Control Section with Mini Cards */}
        <div className="bg-gray-50 dark:bg-dark-card rounded-3xl shadow-sm p-10 mb-16">
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10">
            {/* Left Side - Control */}
            <div>
              <h3 className="mont_semibold text-2xl text-black dark:text-white mb-4">
                {t('control_title')}
              </h3>
              <p className="inter text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                {t('control_description')}
              </p>
              <ul className="space-y-3">
                <li className="inter text-gray-700 dark:text-gray-300 flex items-start text-sm">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>{t('control_bullet1')}</span>
                </li>
                <li className="inter text-gray-700 dark:text-gray-300 flex items-start text-sm">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>{t('control_bullet2')}</span>
                </li>
                <li className="inter text-gray-700 dark:text-gray-300 flex items-start text-sm">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>{t('control_bullet3')}</span>
                </li>
                <li className="inter text-gray-700 dark:text-gray-300 flex items-start text-sm">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>{t('control_bullet4')}</span>
                </li>
              </ul>
            </div>

            {/* Right Side - Three Mini Cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* Categories Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
                <h4 className="mont_semibold text-sm text-black dark:text-white mb-3">
                  {t('category_title')}
                </h4>
                <div className="space-y-2">
                  {[
                    { key: 'category_item1', color: 'bg-blue-500' },
                    { key: 'category_item2', color: 'bg-purple-500' },
                    { key: 'category_item3', color: 'bg-pink-500' },
                    { key: 'category_item6', color: 'bg-green-500' },
                    { key: 'category_item7', color: 'bg-orange-500' }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-600 rounded-lg px-3 py-2 flex items-center shadow-sm"
                    >
                      <div className={`w-1.5 h-1.5 ${item.color} rounded-full mr-2.5`}></div>
                      <span className="inter text-gray-700 dark:text-gray-200 text-xs">
                        {t(item.key)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goals Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
                <h4 className="mont_semibold text-sm text-black dark:text-white mb-3">
                  {t('goals_title')}
                </h4>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-600 rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="inter text-gray-700 dark:text-gray-200 text-xs">
                        {t('goal1_name')}
                      </span>
                      <span className="inter text-gray-600 dark:text-gray-300 text-xs font-medium">
                        {t('goal1_progress')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-2 mb-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <p className="inter text-green-600 dark:text-green-400 text-xs">
                      {t('goal1_message')}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="inter text-gray-700 dark:text-gray-200 text-xs">
                        {t('goal2_name')}
                      </span>
                      <span className="inter text-gray-600 dark:text-gray-300 text-xs font-medium">
                        {t('goal2_progress')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-2 mb-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <p className="inter text-orange-600 dark:text-orange-400 text-xs">
                      {t('goal2_message')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Summary Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
                <h4 className="mont_semibold text-sm text-black dark:text-white mb-3">
                  {t('summary_title')}
                </h4>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-600 rounded-lg px-3 py-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="inter text-gray-600 dark:text-gray-300 text-xs">
                        {t('summary_incomes')}
                      </span>
                      <span className="mont_semibold text-green-600 dark:text-green-400 text-sm">
                        1.213,21€
                      </span>
                    </div>
                    <p className="inter text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                      {t('summary_date')}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 rounded-lg px-3 py-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="inter text-gray-600 dark:text-gray-300 text-xs">
                        {t('summary_cashflow')}
                      </span>
                      <span className="mont_semibold text-blue-600 dark:text-blue-400 text-sm">
                        1.213,21€
                      </span>
                    </div>
                    <p className="inter text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                      {t('summary_date')}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 rounded-lg px-3 py-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="inter text-gray-600 dark:text-gray-300 text-xs">
                        {t('summary_outcome')}
                      </span>
                      <span className="mont_semibold text-red-600 dark:text-red-400 text-sm">
                        1.213,21€
                      </span>
                    </div>
                    <p className="inter text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                      {t('summary_date')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Made For Section */}
        <div className="text-center mb-12">
          <h2 className="mont_semibold text-3xl text-black dark:text-white mb-3">
            {t('made_for_title')}
          </h2>
          <p className="inter text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base leading-relaxed">
            {t('made_for_description')}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-5 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mont_semibold text-base text-black dark:text-white mb-2">
              {t('feature1_title')}
            </h3>
            <p className="inter text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              {t('feature1_description')}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-5 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mont_semibold text-base text-black dark:text-white mb-2">
              {t('feature2_title')}
            </h3>
            <p className="inter text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              {t('feature2_description')}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mont_semibold text-base text-black dark:text-white mb-2">
              {t('feature3_title')}
            </h3>
            <p className="inter text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              {t('feature3_description')}
            </p>
          </div>
        </div>
      </div>
    </div>
    {/* --- COINTAINER FOOTER --- */}
        <Footer/>
    </>
  );
};
export default About;