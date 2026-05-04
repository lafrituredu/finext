import { useEffect, useState } from "react";
import TrendingUpIcon from "/src/assets/icons/Trending-up.svg?react"
import TrendingDownIcon from "/src/assets/icons/Trending-down.svg?react"
import MoneyBagIcon from "/src/assets/icons/Money-bag.svg?react"
import { getCategories, type Category } from '../../api/CategoryService'
import { createBill, updateBill, type Bill } from "../../api/BillService"
import React from "react";
import { useForm } from "react-hook-form"
import { getTransactionsByBill } from '../../api/TransactionService'

type Installment = {
  amount: number | string
  date: string
}

type BillFormValues = {
  id: number
  name: string
  date: string
  type: string
  total_amount: number
  iva_percent: number
  client: string
  description: string
  payment_method: string
  status: boolean
  category_id?: number
  plazos?: number
};

export function BillForm({ close, billEdit }: { close: any, billEdit?: Bill }) {
  const [select, setSelected] = useState<any>(billEdit?.type || 'recibida');
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [billName, setBillName] = useState<string>(billEdit?.name || '')
  const [billImport, setBillImport] = useState<number | string>(billEdit?.total_amount || '')
  const [billDate, setBillDate] = useState<string>(billEdit?.date || '')
  const [billIva, setBillIva] = useState<number | string>(billEdit?.iva_percent || 21.00)
  const [billDescription, setBillDescription] = useState<string>(billEdit?.description || '')
  const [billClient, setBillClient] = useState<string>(billEdit?.client || '')
  const [billPaymentMethod, setBillPaymentMethod] = useState<string>(billEdit?.payment_method || '')
  const [category, setCategory] = useState<number | string>(billEdit?.category_id ?? '')

  // ── Installments ──
  const [isInstallment, setIsInstallment] = useState<boolean>(false)
  const [installments, setInstallments] = useState<Installment[]>([{ amount: '', date: '' }])

  // ── Cargar installments al editar ──
  useEffect(() => {
    if (billEdit?.id) {
      getTransactionsByBill(billEdit.id)
        .then(transactions => {
          if (transactions.length > 0) {
            setIsInstallment(true)
            setInstallments(transactions.map(t => ({
              amount: t.total_amount,
              date: t.date
            })))
          }
        })
        .catch(() => console.error('Error al cargar los plazos'))
    }
  }, [billEdit])

  const addInstallment = () => {
    setInstallments(prev => [...prev, { amount: '', date: '' }])
  }

  const removeInstallment = (index: number) => {
    setInstallments(prev => prev.filter((_, i) => i !== index))
  }

  const updateInstallment = (index: number, field: keyof Installment, value: string) => {
    setInstallments(prev =>
      prev.map((inst, i) =>
        i === index ? { ...inst, [field]: field === 'amount' ? parseFloat(value) || '' : value } : inst
      )
    )
  }

  // ── Installments remaining amount ──
  const totalInstallments = installments.reduce((sum, inst) => sum + (parseFloat(inst.amount as string) || 0), 0)
  const remaining = (parseFloat(billImport as string) || 0) - totalInstallments
  const isOverBudget = remaining < 0

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<BillFormValues>({
    defaultValues: {
      type: billEdit?.type || 'recibida'
    }
  })

  const onSubmit = async (data: BillFormValues) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const { id, ...dataWithoutId } = data
      const payload = {
        ...dataWithoutId,
        type: select,
        plazos: isInstallment ? installments.length : null,
        installments: isInstallment ? installments : []
      }
      if (billEdit != null) {
        await updateBill(payload, billEdit.id)
      } else {
        await createBill(payload)
      }
      close()
    } catch (error: any) {
      console.error('Status:', error.response?.status)
      console.error('Errors:', JSON.stringify(error.response?.data?.errors, null, 2))
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    getCategories()
      .then(data => setCategories(data))
      .catch(() => setError('Error al cargar las categorias'))
      .finally(() => setLoading(false));
    setValue("type", select);
    if (billEdit) {
      setValue("id", billEdit.id)
      setValue("category_id", billEdit.category_id ?? undefined)
    }
  }, [select, setValue, billEdit])

  const inputCls = `w-full rounded-xl border border-gray-200 dark:border-gray-700
    bg-gray-50 dark:bg-[#0f1b35]
    text-gray-800 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    px-4 py-2.5 text-sm font-medium
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    transition-all duration-150`;

  const labelCls = `block text-xs font-semibold uppercase tracking-wide
    text-gray-500 dark:text-gray-400 mb-1`;

  const namePattern = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 flex items-center justify-center p-4"
        onClick={close}>
        <div
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto
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
              {billEdit == null ? 'Añadir Factura' : 'Editar Factura'}
            </h2>
            <button
              type="button"
              onClick={close}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
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
              {[
                { id: 'recibida', label: 'Recibida', Icon: TrendingUpIcon, activeColor: 'text-emerald-600 dark:text-emerald-400' },
                { id: 'emitida', label: 'Emitida', Icon: TrendingDownIcon, activeColor: 'text-red-500 dark:text-red-400' },
              ].map(({ id, label, Icon, activeColor }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelected(id)}
                  className={`
                    flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold
                    transition-all duration-200 ease-in-out cursor-pointer
                    ${select === id
                      ? `bg-white dark:bg-[#1a2957] shadow-sm ${activeColor}`
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className={labelCls}>Nombre *</label>
            <input
              {...register("name", {
                required: "El nombre es obligatorio",
                maxLength: { value: 40, message: "El nombre no puede superar 40 caracteres" },
                pattern: { value: namePattern, message: "Solo se permiten letras, números y espacios" }
              })}
              type="text"
              placeholder="Ej. Factura cliente"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              className={inputCls}/>
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          {/* Amount - Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Importe *</label>
              <input
                type="number"
                step="0.10"
                {...register("total_amount", {
                  required: "El importe es obligatorio",
                  valueAsNumber: true,
                  min: { value: 0.01, message: "El importe debe ser mayor que 0" },
                  max: { value: 1_000_000, message: "El importe no puede superar 1.000.000" }
                })}
                placeholder="0.00 €"
                value={billImport}
                onChange={(e) => setBillImport(parseFloat(e.target.value))}
                className={inputCls}/>
              {errors.total_amount && <p className="mt-1 text-xs text-red-400">{errors.total_amount.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Fecha *</label>
              <input
                type="date"
                {...register("date", { required: "La fecha es obligatoria" })}
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className={inputCls}/>
              {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>}
            </div>
          </div>

          {/* Iva - Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tipo de IVA</label>
              <select
                {...register("iva_percent", { setValueAs: (v) => v === "" ? undefined : parseFloat(v) })}
                value={billIva}
                onChange={(e) => setBillIva(e.currentTarget.value)}
                className={inputCls}>
                <option value="0">Sin IVA — 0%</option>
                <option value="4.00">Superreducido — 4%</option>
                <option value="10.00">Reducido — 10%</option>
                <option value="21.00">General — 21%</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Categoría</label>
              {!loading ? (
                <select
                  {...register("category_id", { setValueAs: (v) => v === "" ? null : Number(v) })}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputCls}>
                  <option value="">Sin categoría</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <div className={`${inputCls} animate-pulse text-gray-400 dark:text-gray-500`}>
                  Cargando categorías…
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Descripción</label>
            <input
              {...register("description", {
                maxLength: { value: 100, message: "La descripción no puede superar 100 caracteres" },
                pattern: { value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]*$/, message: "Solo se permiten letras, números y espacios" }
              })}
              type="text"
              placeholder="Descripción opcional"
              value={billDescription}
              onChange={(e) => setBillDescription(e.target.value)}
              className={inputCls}/>
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* Client - Payment method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Cliente</label>
              <input
                {...register("client", {
                  maxLength: { value: 50, message: "El cliente no puede superar 50 caracteres" },
                  pattern: { value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]*$/, message: "Solo se permiten letras, números y espacios" }
                })}
                type="text"
                placeholder="Nombre del cliente"
                value={billClient}
                onChange={(e) => setBillClient(e.target.value)}
                className={inputCls}/>
              {errors.client && <p className="mt-1 text-xs text-red-400">{errors.client.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Método de pago</label>
              <select
                {...register("payment_method")}
                value={billPaymentMethod}
                onChange={(e) => setBillPaymentMethod(e.currentTarget.value)}
                className={inputCls}>
                <option value="card">Tarjeta de credito</option>
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia bancaria</option>
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
                  className="sr-only peer"/>
                <div className="w-10 h-5 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-primary transition-colors duration-200" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Pago a plazos
              </span>
            </label>

            {isInstallment && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-medium text-gray-400 dark:text-gray-500 px-1">
                  <span>{installments.length} plazo{installments.length !== 1 ? 's' : ''}</span>
                  <span className={isOverBudget ? 'text-red-400' : remaining === 0 ? 'text-emerald-500' : ''}>
                    {remaining === 0
                      ? '✓ Importe cubierto'
                      : isOverBudget
                        ? `⚠ Exceso: ${Math.abs(remaining).toFixed(2)} €`
                        : `Restante: ${remaining.toFixed(2)} €`}
                  </span>
                </div>

                {installments.map((inst, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <input
                      type="number"
                      step="0.10"
                      min="0"
                      placeholder="0.00 €"
                      value={inst.amount}
                      onChange={(e) => updateInstallment(index, 'amount', e.target.value)}
                      className={`${inputCls} flex-1`}/>
                    <input
                      type="date"
                      value={inst.date}
                      onChange={(e) => updateInstallment(index, 'date', e.target.value)}
                      className={`${inputCls} flex-1`}/>
                    {installments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstallment(index)}
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addInstallment}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-dashed border-primary/40 dark:border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-150 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Añadir plazo
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
              {billEdit == null ? '✓ Crear factura' : '✓ Actualizar'}
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
              Cancelar
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}

export default BillForm;