import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import { useTranslation } from 'react-i18next';
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import api from "../api/axiosInstance";
import { animate, stagger } from "animejs";


type ContactFormValues = {
  name: string
  email: string
  subject: string
  message: string
};

function Contact() {
  const { t } = useTranslation("contact");

  const [isSubmitting, setIsSubmitting] = useState(false)

  // React Hook Form gestiona los valores y valida el formulario antes de enviarlo.
  // La API volvera a validar en Laravel, asi que esta capa es solo ayuda para la vista.
  const {register, handleSubmit, setValue, formState: { errors, isValid }} = useForm<ContactFormValues>({
    mode: "onChange",
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    }
  })

  // Envia el formulario a POST /api/contact. El backend no crea registros:
  // valida los datos y manda una respuesta automatica usando Mailtrap.
    const onSubmit = async (data: ContactFormValues) => {
      if (isSubmitting) return // Evita dobles envios si el usuario pulsa varias veces.
      setIsSubmitting(true)
      try {
        await api.post<{ message: string }>('/contact', data);
      } catch (error) {
        setIsSubmitting(false)
      }
    }

    //Animaciones 
    useEffect(() => {
      animate("#hero > *",{
          y: ["100px", "0px"],
          opacity: [0, 1],
          duration: '1000',
          delay: stagger(100)
      });

      animate('#finext_team',{
          x: ["-100%", "0px"],
          opacity: [0, 1],
          duration: '1000',
          delay: 400
      });
      animate('#contact_form', {
          x: ["-150px", "0px"],
          opacity: [0,1],
          duration: '1000',
          delay: 1000
      });

      animate('#contact_info > *', {
          opacity: [0,1],
          delay: stagger(150, {start: 200} ),
          ease: 'inOut'
      });
    }, []);

  return (
  <>
    <Navbar/>
    
    <div id="hero" className="flex flex-col pt-28 pb-12 sm:pt-45 sm:pb-25 justify-center items-center gap-2 bg-gradient-to-r from-[#7844C9] to-[#3667C8] sm:from-[#7844C9] sm:via-[#3667C8] sm:to-[#5c44c9]">
      <h2 className="montserrat text-5xl sm:text-center text-white text-center">{t('hero_title')}</h2>
      <p className="inter max-w-160 sm:text-center text-dark-text">{t('hero_subtitle')}</p>
    </div>
    <div className="mx-4 sm:mx-6 overflow-hidden">
      <div id="finext_team" className="flex items-center justify-center inter text-gray-500 pt-6 sm:pt-10">
        <div className="flex flex-col items-center justify-center ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm p-4 sm:p-6 rounded-3xl">
          <p className="font-bold text-dark-background dark:text-dark-text">{t('finext_team')}</p>
          <p className="max-w-270 text-center">{t('finext_team_desc')}</p>
        </div>
      </div>
      <div  className="flex flex-col justify-center items-center py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-6 sm:gap-20 w-full">
          <div id="contact_form" className="bg-white dark:bg-dark-card rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-8 ring-1 ring-gray-300 dark:ring-[#1d2344] max-w-160 w-full">
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
                className="w-full bg-primary text-white py-3 rounded-lg mont_semibold text-sm hover:bg-primary/90 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {t('send_button')}
              </button>
            </form>
          </div>
          <div id="contact_info" className="flex flex-col gap-20 w-full max-w-160 lg:w-100 lg:max-w-none">
            <div className="flex flex-col items-center justify-center inter hover:scale-104 transition-all ease-in-out gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75" />
              </svg>
              <p className="font-bold text-black dark:text-white">Email</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">finextcontact@gmail.com</p>
            </div>
            <div className="flex flex-col items-center justify-center inter hover:scale-104 transition-all ease-in-out gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <p className="font-bold text-black dark:text-white">{t('contact_phone')}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('comming_soon')}</p>
            </div>
            <div className="flex flex-col items-center justify-center inter hover:scale-104 transition-all ease-in-out gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <p className="font-bold text-black dark:text-white">{t('contact_address')}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center px-4">L'Hospitalet de Llobregat</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center px-4">Carrer Sant Pius X, 8, 08901.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </>
  );
}

export default Contact;