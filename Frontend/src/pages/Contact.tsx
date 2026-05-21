import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import { useTranslation } from 'react-i18next';
import { useForm } from "react-hook-form";
import { useState } from "react";

import CoinIcon from '/src/assets/icons/Coin.svg?react'


type ContactFormValues = {
  name: string
  email: string
  subject: string
  message: string
};

function Contact() {
  const { t } = useTranslation("contact");

  const [isSubmitting, setIsSubmitting] = useState(false)

  //React form hook
  const {register, handleSubmit, setValue, formState: { errors, isValid }} = useForm<ContactFormValues>({
    mode: "onChange",
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    }
  })

  //Submit form
    const onSubmit = async (data: ContactFormValues) => {
      if (isSubmitting) return //Return so it doesn't send duplicates
      setIsSubmitting(true)
      try {
        console.log("Name: " + data.name)
        console.log("Email: " + data.email)
        console.log("Subject: " + data.subject)
        console.log("Message: " + data.message)
      } catch (error) {
        setIsSubmitting(false)
      }
    }

  return (
  <>
    <Navbar/>
    <div className="flex flex-col pt-40 pb-20 justify-center items-center gap-2">
      <h2 className="montserrat text-5xl sm:text-center dark:text-dark-text ">{t('hero_title')}</h2>
      <p className="inter max-w-160 sm:text-center text-gray-600 dark:text-dark-text">{t('hero_subtitle')}</p>
    </div>
    <div className="flex flex-col justify-center items-center">
      <div className="bg-white dark:bg-dark-card rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-8 ring-1 ring-gray-300 dark:ring-[#1d2344] w-[35%]">
        <h3 className="mont_semibold text-xl md:text-2xl text-black dark:text-white mb-2">
          {t('form_title')}
        </h3>
        <p className="inter text-gray-600 dark:text-gray-300 mb-6 text-xs md:text-sm">
          {t('intro_description')}
        </p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="inter text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
              {t('name_label')}*
            </label>
            <input
              {...register("name", { required: t('errors.nameRequired'),
              maxLength: {
                value: 40,
                message: t('errors.nameTooLong')
              },
              pattern: {
                value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/,
                message: t('errors.nameInvalidChars')
              }
              })}
              type="text"
              name="name"
              placeholder={t('name_placeholder')}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white inter text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="inter text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
              {t('email_label')}*
            </label>
            <input
              {...register("email", {required: t('errors.emailRequired'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('errors.emailInvalid')
                }
              })}
              type="email"
              name="email"
              placeholder={t('email_placeholder')}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white inter text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="inter text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
              {t('subject_label')}*
            </label>
            <input
              {...register("subject", { required: t('errors.subjectRequired'),
                maxLength: {
                  value: 100,
                  message: t('errors.subjectTooLong')
                }
              })}
              type="text"
              name="subject"
              placeholder={t('subject_placeholder')}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white inter text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="inter text-sm text-gray-700 dark:text-gray-300 mb-1.5 block">
              {t('message_label')}*
            </label>
            <textarea
              {...register("message", { required: t('errors.messageRequired'),
                maxLength: {
                  value: 100,
                  message: t('errors.messageTooLong')
                }
              })}
              name="message"
              placeholder={t('message_placeholder')}
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white inter text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            ></textarea>
            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
          </div>
          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-primary text-white py-3 rounded-lg mont_semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {t('send_button')}
          </button>
        </form>
      </div>
    </div>
    <div className="grid grid-cols-3 justify-center items-center m-4 pt-20 gap-20 mx-20">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <CoinIcon className="w-12 h-12"/>
        <h3 className="montserrat text-2xl">{t('reason1_title')}</h3>
        <span className="inter text-sm">{t('reason1_description')}</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <CoinIcon className="w-12 h-12"/>
        <h3 className="montserrat text-2xl">{t('reason2_title')}</h3>
        <span className="inter text-sm">{t('reason2_description')}</span>
      </div>      
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <CoinIcon className="w-12 h-12"/>
        <h3 className="montserrat text-2xl">{t('reason3_title')}</h3>
        <span className="inter text-sm">{t('reason3_description')}</span>
      </div>
    </div>
    <Footer/>
  </>
  );
}

export default Contact;
