//Library
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'
import { useForm, useFieldArray } from "react-hook-form"

//Context & Service
import { createBill, updateBill, type Bill } from "../../api/BillService"
import { useCategories, type CategoriesContextType } from '../../contexts/CategoryContext'
import { useTransactions } from '../../contexts/TransactionContext'

//Icons
import TrendingUpIcon from "/src/assets/icons/Trending-up.svg?react"
import TrendingDownIcon from "/src/assets/icons/Trending-down.svg?react"
import MoneyBagIcon from "/src/assets/icons/Money-bag.svg?react"

//Types
type BillFormValues = {
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
  plazos?: number | null
  installments: { amount: number | string; date: string }[]
};

type BillType = 'emitida' | 'recibida'
type IVAType = '0.00' | '4.00' | '10.00' | '21.00'

const BILL_TYPES: { id: BillType; labelKey: string; Icon: React.FC<any>; activeColor: string }[] = [
  { id: 'emitida',  labelKey: 'type.emitida',  Icon: TrendingUpIcon,   activeColor: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'recibida', labelKey: 'type.recibida', Icon: TrendingDownIcon, activeColor: 'text-red-500 dark:text-red-400' },
]

const IVA_OPTIONS: {id: IVAType; labelKey: string}[] =  [
  {id: "0.00", labelKey: 'fields.iva.options.none'},
  {id: "4.00", labelKey: 'fields.iva.options.superreduced'},
  {id: "10.00", labelKey: 'fields.iva.options.reduced'},
  {id: "21.00", labelKey: 'fields.iva.options.general'},
]

//Interface
interface BillFormProps {
  close: () => void
  billEdit?: Bill
}

export function BillForm({ close, billEdit }: BillFormProps) {
  const { t } = useTranslation("billsform")
  const { t:ct } = useTranslation("catTrans")

  const [billType, setBillType] = useState<BillType>(billEdit?.type as BillType || 'emitida');
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { categories } = useCategories() as CategoriesContextType
  const { transactions, refetchTransactions } = useTransactions()

  //Check if the "billEdit" has installments
  const [isInstallment, setIsInstallment] = useState<boolean>(billEdit?.plazos != null && billEdit.plazos > 0)

  const {
    register,
    handleSubmit,
    setValue, //changes values manually
    control,
    watch, //listen changes real time
    formState: { errors }
  } = useForm<BillFormValues>({
    defaultValues: {
      name: billEdit?.name || '',
      total_amount: billEdit?.total_amount,
      date: billEdit?.date || '',
      iva_percent: billEdit?.iva_percent.toString() ?? "21.00",
      description: billEdit?.description || '',
      client: billEdit?.client || '',
      payment_method: billEdit?.payment_method || 'card',
      category_id: billEdit?.category_id ?? undefined,
      type: billEdit?.type || 'emitida',
      id: billEdit?.id,
      installments: [{ amount: '', date: '' }]
    }
  })

  //useFieldArray -> Manage inputs dynamic arrays
  //fields= render array - append= add installment - remove= remove installment - replace= reeplace all
  const { fields, append, remove, replace } = useFieldArray({
    control, //connects useFieldArray with the current form state
    name: 'installments' //name of the array field
  })

  //Load installments
  useEffect(() => {
    //If we are editing:
    if (billEdit?.id) {
      //Search associated transactions
      const billTransactions = transactions.filter(t => t.bill_id === billEdit.id)
      //If transactions of that bill exists:
      if (billTransactions.length > 0) {
        //Replace "installments" array with the news installments
        replace(billTransactions.map(t => ({
          amount: t.total_amount, //Get the transaction amount
          date: t.date  //Get the transaction date
        })))
      }
    }
  }, [billEdit, transactions])

  //Listen for installments changes
  const watchedInstallments = watch('installments') ?? []

  //Calculate all the installments
  const totalInstallments = watchedInstallments.reduce(
    (sum, inst) => sum + (parseFloat(inst.amount as string) || 0), 0
  )

  //Listen for total_amount changes
  const watchedAmount = watch('total_amount') ?? 0

  //Cash left to cover
  const remaining = (watchedAmount || 0) - totalInstallments

  //Check if the total was surpassed
  const isOverBudget = remaining < 0

  const onSubmit = async (data: BillFormValues) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const { id, ...dataWithoutId } = data
      const payload = {
        ...dataWithoutId,
        type: billType,
        plazos: isInstallment ? data.installments.length : null, //plazos = installments length or null
        installments: isInstallment ? data.installments : [] //installments = installments or empty array
      }
      if (billEdit != null) {
        await updateBill(payload, billEdit.id)
      } else {
        await createBill(payload)
      }
      await refetchTransactions()
      close()
    } catch (error: any) {
      console.error('Status:', error.response?.status)
      console.error('Errors:', JSON.stringify(error.response?.data?.errors, null, 2))
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    //Update type
    setValue("type", billType); //Everytime billType changes, the form type also changes
    if (billEdit) {
      setValue("id", billEdit.id) //Detect id for the edit
      setValue("category_id", billEdit.category_id ?? undefined) //Detect category for the edit
    }
  }, [billType, setValue, billEdit])

  //Styles

  const inputCls = `w-full rounded-xl border border-gray-200 dark:border-gray-700
    bg-gray-50 dark:bg-[#0f1b35]
    text-gray-800 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    px-4 py-2.5 text-sm font-medium
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    transition-all duration-150`;

  const labelCls = `block text-xs font-semibold uppercase tracking-wide
    text-gray-500 dark:text-gray-400 mb-1`;

  //Pattern
  const namePattern = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto
            bg-background dark:bg-dark-background
            rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10
            p-6 sm:p-8 flex flex-col gap-5 inter"
          onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <MoneyBagIcon className="w-7 h-7" />
              {billEdit == null ? t('header.create') : t('header.edit')}
            </h2>
            <button
              type="button"
              onClick={close}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <input type="hidden" {...register("id")} />

          {/* Recibida / Emitida */}
          <div className="flex justify-center">
            <div className="
              flex items-center gap-1.5 p-1.5
              bg-gray-100 dark:bg-[#0F1732]
              rounded-2xl border border-gray-200 dark:border-gray-700
              montserrat">
              {BILL_TYPES.map(({ id, labelKey, Icon, activeColor }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setBillType(id)}
                  className={`
                    flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold
                    transition-all duration-200 ease-in-out cursor-pointer
                    ${billType === id
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
            <label className={labelCls}>{t('fields.name.label')} *</label>
            <input
              {...register("name", {
                required: t('fields.name.required'),
                maxLength: { value: 40, message: t('fields.name.max_length') },
                pattern: { value: namePattern, message: t('fields.name.pattern') }
              })}
              type="text"
              placeholder={t('fields.name.placeholder')}
              className={inputCls} />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          {/* Amount - Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t('fields.amount.label')} *</label>
              <input
                type="number"
                step="0.01"
                {...register("total_amount", {
                  required: t('fields.amount.required'),
                  valueAsNumber: true,
                  min: { value: 0.01, message: t('fields.amount.min') },
                  max: { value: 1_000_000, message: t('fields.amount.max') }
                })}
                placeholder={t('fields.amount.placeholder')}
                className={inputCls} />
              {errors.total_amount && <p className="mt-1 text-xs text-red-400">{errors.total_amount.message}</p>}
            </div>
            <div>
              <label className={labelCls}>{t('fields.date.label')} *</label>
              <input
                type="date"
                {...register("date", { required: t('fields.date.required') })}
                className={inputCls} />
              {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>}
            </div>
          </div>

          {/* Iva - Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t('fields.iva.label')}</label>
              <select
                {...register("iva_percent", { setValueAs: (v) => v === "" ? undefined : parseFloat(v) })}
                className={inputCls}>
              {IVA_OPTIONS.map(({ id, labelKey }) => (
                <option value={id}>{t(labelKey)}</option>
              ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t('fields.category.label')}</label>
              <select
                {...register("category_id", { setValueAs: (v) => v === "" ? null : Number(v) })}
                className={`${inputCls} capitalize`}>
                <option value="">{t('fields.category.none')}</option>
                {categories.map(c => (
                  <option className="capitalize" key={c.id} value={c.id}>{ct(`categoryNames.${c.name}`, c.name)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>{t('fields.description.label')}</label>
            <input
              {...register("description", {
                maxLength: { value: 100, message: t('fields.description.max_length') },
                pattern: { value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s,\.]*$/, message: t('fields.description.pattern') }
              })}
              type="text"
              placeholder={t('fields.description.placeholder')}
              className={inputCls} />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* Client - Payment method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t('fields.client.label')}</label>
              <input
                {...register("client", {
                  maxLength: { value: 50, message: t('fields.client.max_length') },
                  pattern: { value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]*$/, message: t('fields.client.pattern') }
                })}
                type="text"
                placeholder={t('fields.client.placeholder')}
                className={inputCls} />
              {errors.client && <p className="mt-1 text-xs text-red-400">{errors.client.message}</p>}
            </div>
            <div>
              <label className={labelCls}>{t('fields.payment_method.label')}</label>
              <select
                {...register("payment_method")}
                className={inputCls}>
                <option value="card">{t('fields.payment_method.options.card')}</option>
                <option value="cash">{t('fields.payment_method.options.cash')}</option>
                <option value="transfer">{t('fields.payment_method.options.transfer')}</option>
              </select>
            </div>
          </div>

          {/* Installments */}
          <div className="
            rounded-xl border border-gray-200 dark:border-gray-700
            bg-gray-50/50 dark:bg-[#0f1b35]/50
            p-4 flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isInstallment}
                  onChange={(e) => setIsInstallment(e.target.checked)}
                  className="sr-only peer" />
                <div className="w-10 h-5 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-primary transition-colors duration-200" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('installments.toggle')}
              </span>
            </label>

            {isInstallment && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-medium text-gray-400 dark:text-gray-500 px-1">
                  <span>{fields.length} {fields.length !== 1 ? t('installments.plural') : t('installments.singular')}</span>
                  <span className={isOverBudget ? 'text-red-400' : remaining === 0 ? 'text-emerald-500' : ''}>
                    {remaining === 0
                      ? t('installments.status.covered')
                      : isOverBudget
                        ? `${t('installments.status.excess')} ${Math.abs(remaining).toFixed(2)} €`
                        : `${t('installments.status.remaining')} ${remaining.toFixed(2)} €`
                    }
                  </span>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={t('installments.amount_placeholder')}
                        {...register(`installments.${index}.amount`, {
                          required: t('installments.validation.amount_required'),
                          valueAsNumber: true,
                          min: { value: 0.01, message: t('installments.validation.amount_min') }
                        })}
                        className={`${inputCls} flex-1`} />
                      <input
                        type="date"
                        {...register(`installments.${index}.date`, {
                          required: t('installments.validation.date_required')
                        })}
                        className={`${inputCls} flex-1`} />
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="flex-shrink-0 cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {(errors.installments?.[index]?.amount || errors.installments?.[index]?.date) && (
                      <div className="flex gap-2 pl-8">
                        {errors.installments?.[index]?.amount && (
                          <p className="flex-1 text-xs text-red-400">
                            {errors.installments[index].amount.message}
                          </p>
                        )}
                        {errors.installments?.[index]?.date && (
                          <p className="flex-1 text-xs text-red-400">
                            {errors.installments[index].date.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => append({ amount: '', date: '' })}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-dashed border-primary/40 dark:border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-150 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {t('installments.add')}
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                flex-1 bg-primary text-white font-semibold
                py-2.5 px-6 rounded-xl shadow-md
                hover:brightness-110 active:scale-[0.98]
                transition-all duration-150 ease-in-out
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
              {billEdit == null ? t('actions.create') : t('actions.update')}
            </button>
            <button
              type="button"
              onClick={close}
              className="
                flex-1 sm:flex-none sm:w-36
                bg-background dark:bg-dark-background
                ring-1 ring-gray-200 dark:ring-gray-700
                text-gray-600 dark:text-gray-300 font-semibold
                py-2.5 px-6 rounded-xl
                hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98]
                transition-all duration-150 ease-in-out
                cursor-pointer">
              {t('actions.cancel')}
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}

export default BillForm;