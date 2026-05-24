//Library
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form"

//TransactionForm
import { useCategories} from '../../contexts/CategoryContext'
import { createTransaction, updateTransaction, type Transaction } from "../../api/TransactionService"

//Icons
import TrendingUpIcon from "/src/assets/icons/Trending-up.svg?react"
import TrendingDownIcon from "/src/assets/icons/Trending-down.svg?react"
import MoneyBagIcon from "/src/assets/icons/Money-bag.svg?react"

//Types
type TransactionFormValues = {
  id: number
  name: string
  date: string
  type: string
  total_amount: number
  iva_percent: string
  client: string
  description: string
  payment_method: string
  status: boolean
  category_id?: number
};

type TransactionType = 'income' | 'expense'

type IVAType = '0.00' | '4.00' | '10.00' | '21.00'

interface TransactionFormProps {
  close: () => void
  transactionEdit?: Transaction
}

const TRANSACTION_TYPES: { id: TransactionType; labelKey: string; Icon: React.FC<any>; activeColor: string }[] = [
  { id: 'income', labelKey: 'type.income', Icon: TrendingUpIcon, activeColor: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'expense', labelKey: 'type.expense', Icon: TrendingDownIcon, activeColor: 'text-red-500 dark:text-red-400' },
]

const IVA_OPTIONS: {id: IVAType; labelKey: string}[] =  [
  {id: "0.00", labelKey: 'iva.none'},
  {id: "4.00", labelKey: 'iva.superreduced'},
  {id: "10.00", labelKey: 'iva.reduced'},
  {id: "21.00", labelKey: 'iva.general'},
]
//Styles
const inputCls = `w-full rounded-xl border border-gray-200 dark:border-gray-700
  bg-gray-50 dark:bg-[#0f1b35] text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
  px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
  transition-all duration-150`;

const labelCls = `block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1`;

export function TransactionForm({ close, transactionEdit }: TransactionFormProps) {
  //Variables-------------------------
  const { t } = useTranslation("transactionsForm")
  const { t:ct } = useTranslation("catTrans")
  //TransactionForm
  const { categories, loading } = useCategories()
  
  const [transactionType, setTransactionType] = useState<TransactionType>(transactionEdit?.type || 'income');
  const [isSubmitting, setIsSubmitting] = useState(false)

  //React form hook
  const {register, handleSubmit, setValue, formState: { errors }} = useForm<TransactionFormValues>({
    defaultValues: {
      name: transactionEdit?.name || '',
      total_amount: transactionEdit?.total_amount,
      date: transactionEdit?.date || '',
      iva_percent: transactionEdit?.iva_percent.toString() ?? "0.00",
      description: transactionEdit?.description || '',
      client: transactionEdit?.client || '',
      payment_method: transactionEdit?.payment_method || 'card',
      category_id: transactionEdit?.category_id ?? undefined,
      type: transactionEdit?.type || 'income',
      id: transactionEdit?.id
    }
  })

  //Submit form
  const onSubmit = async (data: TransactionFormValues) => {
    if (isSubmitting) return //Return so it doesn't send duplicates
    setIsSubmitting(true)
    try {
      const { id, ...dataWithoutId } = data
      //Update or create Transaction
      if (transactionEdit != null) {
        await updateTransaction(dataWithoutId, id)
      } else {
        await createTransaction(dataWithoutId)
      }
      close() //Close TransactionForm
    } catch (error) {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Transaction ID */}
      <input type="hidden" {...register("id")} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 flex items-center justify-center p-4">
        <div
          className="
            relative w-full max-w-lg max-h-[90vh] overflow-y-auto
            bg-background dark:bg-dark-background
            rounded-2xl shadow-2xl
            ring-1 ring-black/5 dark:ring-white/10
            p-6 sm:p-8
            flex flex-col gap-5
            inter"
          onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <MoneyBagIcon className="w-7 h-7" />
              {transactionEdit == null ? t('title.create') : t('title.edit')}
            </h2>
            <button
              type="button"
              onClick={close}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg> {/* X svg */}
            </button>
          </div>

          {/* Income / Expense */}
          <div className="flex justify-center">
            <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 dark:bg-[#0F1732]
              rounded-2xl border border-gray-200 dark:border-gray-700 montserrat">
                {TRANSACTION_TYPES.map(({ id, labelKey, Icon, activeColor }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setTransactionType(id); setValue("type", id) }}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold
                    transition-all duration-200 ease-in-out cursor-pointer
                    ${transactionType === id
                      ? `bg-white dark:bg-[#1a2957] shadow-sm ${activeColor}`
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                  <Icon className="w-4 h-4" />
                  {t(labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className={labelCls}>{t('fields.name')} *</label>
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
              placeholder={t('placeholders.name')}
              className={inputCls}/>
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          {/* Amount - Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t('fields.amount')} *</label>
              <input
                type="number"
                step="0.10"
                {...register("total_amount", { required: t('errors.amountRequired'), 
                  valueAsNumber: true,
                min:{
                  value:0.01,
                  message: t('errors.amountMin')
                },
                max:{
                  value:1_000_000,
                  message: t('errors.amountMax')
                },
              })}
                placeholder={t('placeholders.amount')}
                className={inputCls}/>
              {errors.total_amount && <p className="mt-1 text-xs text-red-400">{errors.total_amount.message}</p>}
            </div>
            <div>
              <label className={labelCls}>{t('fields.date')} *</label>
              <input
                type="date"
                {...register("date", { required: t('errors.dateRequired') })}
                className={inputCls}/>
              {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>}
            </div>
          </div>

          {/* Iva - Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t('fields.iva')}</label>
              <select
                {...register("iva_percent", { setValueAs: (v) => v === "" ? undefined : parseFloat(v) })}
                className={inputCls}>
              {IVA_OPTIONS.map(({ id, labelKey }) => (
                <option value={id}>{t(labelKey)}</option>
              ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t('fields.category')}</label>
              {!loading ? (
                <select
                  {...register("category_id", { setValueAs: (v) => v === "" ? null : Number(v) })}
                  className={`${inputCls} capitalize`}
                >
                  <option value="">{t('placeholders.noCategory')}</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{ct(`categoryNames.${c.name}`, c.name)}</option>
                  ))}
                </select>
              ) : (
                <div className={`${inputCls} animate-pulse text-gray-400 dark:text-gray-500`}>
                  {t('placeholders.loadingCategories')}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>{t('fields.description')}</label>
            <input
              {...register("description", {
                maxLength: {
                value: 100,
                message: t('errors.descriptionTooLong')
              },
              pattern: {
                value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s,\.]*$/,
                message: t('errors.descriptionInvalidChars')
              }
              })}
              type="text"
              placeholder={t('placeholders.description')}
              className={inputCls}/>
              {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* Client - Payment method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t('fields.client')}</label>
              <input
                {...register("client", {               
                maxLength: {
                value: 20,
                message: t('errors.clientTooLong')
              },
              pattern: {
                value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/,
                message: t('errors.clientInvalidChars')
              }
              })}
                type="text"
                placeholder={t('placeholders.client')}
                className={inputCls}/>
                {errors.client && <p className="mt-1 text-xs text-red-400">{errors.client.message}</p>}
            </div>
            <div>
              <label className={labelCls}>{t('fields.paymentMethod')}</label>
              <select
                {...register("payment_method")}
                className={inputCls}>
                <option value="card">{t('payment.card')}</option>
                <option value="cash">{t('payment.cash')}</option>
                <option value="transfer">{t('payment.transfer')}</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                flex-1 bg-primary text-white font-semibold py-2.5 px-6 rounded-xl shadow-md
                hover:brightness-110 active:scale-[0.98] transition-all duration-150 ease-in-out cursor-pointer">
              {transactionEdit == null ? t('buttons.create') : t('buttons.update')}
            </button>
            <button
              type="button"
              onClick={close}
              className="flex-1 sm:flex-none sm:w-36 bg-background dark:bg-dark-background
                ring-1 ring-gray-200 dark:ring-gray-700 text-gray-600 dark:text-gray-300 font-semibold
                py-2.5 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98]
                transition-all duration-150 ease-in-out cursor-pointer">
              {t('buttons.cancel')}
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}

export default TransactionForm;