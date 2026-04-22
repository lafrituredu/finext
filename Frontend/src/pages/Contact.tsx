import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

function Contact() {
  const { t } = useTranslation("contact");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Mensaje enviado correctamente');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
  <>
    <Navbar/>
    <div className="min-h-screen bg-white dark:bg-dark-background pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#5B3FD8] via-[#5545C8] to-[#7B5FE8] dark:from-[#3023AE] dark:to-[#5B47D8] py-12 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mont_semibold text-3xl md:text-5xl text-white mb-4">
            {t('hero_title')}
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-6 py-2">
            <p className="inter text-white text-xs md:text-sm">
              {t('hero_subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Intro Section */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="mont_semibold text-2xl md:text-3xl text-black dark:text-white mb-3 md:mb-4 leading-tight">
            {t('intro_title')}
          </h2>
          <p className="inter text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {t('intro_description')}
          </p>
        </div>

        {/* Form and Contact Info Section */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-16">
          {/* Contact Form */}
          <div className="bg-gray-50 dark:bg-dark-card rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-8">
            <h3 className="mont_semibold text-xl md:text-2xl text-black dark:text-white mb-2">
              {t('form_title')}
            </h3>
            <p className="inter text-gray-600 dark:text-gray-300 mb-6 text-xs md:text-sm">
              {t('form_description')}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="inter text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  {t('name_label')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('name_placeholder')}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white inter text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="inter text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  {t('email_label')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('email_placeholder')}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white inter text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="inter text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  {t('subject_label')}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t('subject_placeholder')}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white inter text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="inter text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
                  {t('message_label')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('message_placeholder')}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white inter text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg mont_semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('sending') : t('send_button')}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-dark-card rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-8">
              <h3 className="mont_semibold text-xl md:text-2xl text-black dark:text-white mb-6">
                {t('contact_info_title')}
              </h3>
              <div className="space-y-4">
                {/* Email General */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="mont_semibold text-sm text-black dark:text-white mb-1">
                      {t('contact_email')}
                    </p>
                    <p className="inter text-xs text-gray-600 dark:text-gray-400">
                      {t('email_general')}
                    </p>
                  </div>
                </div>

                {/* Email Support */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="mont_semibold text-sm text-black dark:text-white mb-1">
                      {t('contact_support')}
                    </p>
                    <p className="inter text-xs text-gray-600 dark:text-gray-400">
                      {t('email_support')}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="mont_semibold text-sm text-black dark:text-white mb-1">
                      {t('contact_phone')}
                    </p>
                    <p className="inter text-xs text-gray-600 dark:text-gray-400">
                      {t('phone')}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="mont_semibold text-sm text-black dark:text-white mb-1">
                      {t('contact_address')}
                    </p>
                    <p className="inter text-xs text-gray-600 dark:text-gray-400">
                      {t('address')}
                    </p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="mont_semibold text-sm text-black dark:text-white mb-1">
                      {t('contact_hours')}
                    </p>
                    <p className="inter text-xs text-gray-600 dark:text-gray-400">
                      {t('office_hours')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Contact Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="mont_semibold text-2xl md:text-3xl text-black dark:text-white mb-3">
            {t('why_contact_title')}
          </h2>
        </div>

        {/* Reasons Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Reason 1 */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-5 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="mont_semibold text-base text-black dark:text-white mb-2">
              {t('reason1_title')}
            </h3>
            <p className="inter text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              {t('reason1_description')}
            </p>
          </div>

          {/* Reason 2 */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-5 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mont_semibold text-base text-black dark:text-white mb-2">
              {t('reason2_title')}
            </h3>
            <p className="inter text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              {t('reason2_description')}
            </p>
          </div>

          {/* Reason 3 */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-5 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="mont_semibold text-base text-black dark:text-white mb-2">
              {t('reason3_title')}
            </h3>
            <p className="inter text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              {t('reason3_description')}
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </>
  );
}

export default Contact;