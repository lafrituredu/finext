import { useEffect, useState } from "react";
import TrendingUpIcon from "/src/assets/icons/Trending-up.svg?react"
import TrendingDownIcon from "/src/assets/icons/Trending-down.svg?react"
import MoneyBagIcon from "/src/assets/icons/Money-bag.svg?react"
import { getCategories, type Category } from '../../api/CategoryService'
import { createTransaction, updateTransaction, type Transaction } from "../../api/TransactionService"

import React from "react";
import { useForm } from "react-hook-form"

type TransactionFormValues = {
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
};

export function TransctionForm({ close, transactionEdit }: { close: any, transactionEdit?: Transaction }) {
  const [select, setSelected] = useState<any>(transactionEdit?.type || 'income');
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [transactionName, setTransactionName] = useState<string>(transactionEdit?.name || '')
  const [transactionImport, setTransactionImport] = useState<number | string>(transactionEdit?.total_amount || '')
  const [transactionDate, setTransactionDate] = useState<string>(transactionEdit?.date || '')
  const [transactioniva, setTransactionIva] = useState<number | string>(transactionEdit?.iva_percent || 21.00)
  const [transactionDescription, setTransactionDescription] = useState<string>(transactionEdit?.description || '')
  const [transactionClient, setTransactionClient] = useState<string>(transactionEdit?.client || '')
  const [transactionPaymentMethod, setTransactionPaymentMethod] = useState<string>(transactionEdit?.payment_method || '')
  const [category, setCategory] = useState<number | string>(transactionEdit?.category_id ?? '')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<TransactionFormValues>()

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      const { id, ...dataWithoutId } = data
      if (transactionEdit != null) {
        await updateTransaction(dataWithoutId, id)
      } else {
        await createTransaction(dataWithoutId)
      }
      close()
    } catch (error) { console.error(error) }
  }

  useEffect(() => {
    getCategories()
      .then(data => setCategories(data))
      .catch(() => setError('Error al cargar las categorias'))
      .finally(() => setLoading(false));
    setValue("type", select);
    if (transactionEdit) {
      setValue("id", transactionEdit.id)
      setValue("category_id", transactionEdit.category_id ?? undefined)
    }
  }, [select, setValue, transactionEdit])

  /* ─── shared input classes ─── */
  const inputCls = `
    w-full rounded-xl border border-gray-200 dark:border-gray-700
    bg-gray-50 dark:bg-[#0f1b35]
    text-gray-800 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    px-4 py-2.5 text-sm font-medium
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    transition-all duration-150
  `;

  const labelCls = `
    block text-xs font-semibold uppercase tracking-wide
    text-gray-500 dark:text-gray-400 mb-1
  `;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />

      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 flex items-center justify-center p-4"
        onClick={close}
      >
        {/* ── Modal card ── */}
        <div
          className="
            relative w-full max-w-lg max-h-[90vh] overflow-y-auto
            bg-background dark:bg-dark-background
            rounded-2xl shadow-2xl
            ring-1 ring-black/5 dark:ring-white/10
            p-6 sm:p-8
            flex flex-col gap-5
            inter
          "
          onClick={(e) => e.stopPropagation()}
        >

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-1">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <MoneyBagIcon className="w-7 h-7" />
              {transactionEdit == null ? 'Añadir Transacción' : 'Editar Transacción'}
            </h2>
            {/* Close X */}
            <button
              type="button"
              onClick={close}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Income / Expense */}
          <div className="flex justify-center">
            <div className="
              flex items-center gap-1.5 p-1.5
              bg-gray-100 dark:bg-[#0F1732]
              rounded-2xl border border-gray-200 dark:border-gray-700
              montserrat
            ">
              {[
                { id: 'income', label: 'Income', Icon: TrendingUpIcon, activeColor: 'text-emerald-600 dark:text-emerald-400' },
                { id: 'expense', label: 'Expense', Icon: TrendingDownIcon, activeColor: 'text-red-500 dark:text-red-400' },
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
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}
                  `}
                >
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
              {...register("name", { required: "El nombre es obligatorio" })}
              type="text"
              placeholder="Ej. Factura cliente"
              value={transactionName}
              onChange={(e) => setTransactionName(e.target.value)}
              className={inputCls}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          {/* Amount - Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Importe *</label>
              <input
                type="number"
                step="0.10"
                {...register("total_amount", { required: "El importe es obligatorio", valueAsNumber: true })}
                placeholder="0.00 €"
                value={transactionImport}
                onChange={(e) => setTransactionImport(parseFloat(e.target.value))}
                className={inputCls}
              />
              {errors.total_amount && <p className="mt-1 text-xs text-red-400">{errors.total_amount.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Fecha *</label>
              <input
                type="date"
                {...register("date", { required: "La fecha es obligatoria" })}
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className={inputCls}
              />
              {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>}
            </div>
          </div>

          {/* Iva - Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tipo de IVA</label>
              <select
                {...register("iva_percent", { setValueAs: (v) => v === "" ? undefined : parseFloat(v) })}
                value={transactioniva}
                onChange={(e) => setTransactionIva(e.currentTarget.value)}
                className={inputCls}
              >
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
                  className={inputCls}
                >
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
              {...register("description")}
              type="text"
              placeholder="Descripción opcional"
              value={transactionDescription}
              onChange={(e) => setTransactionDescription(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Client - Payment method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Cliente</label>
              <input
                {...register("client")}
                type="text"
                placeholder="Nombre del cliente"
                value={transactionClient}
                onChange={(e) => setTransactionClient(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Método de pago</label>
              <select
                {...register("payment_method")}
                value={transactionPaymentMethod}
                onChange={(e) => setTransactionPaymentMethod(e.currentTarget.value)}
                className={inputCls}
              >
                <option value="card">💳 Tarjeta de crédito</option>
                <option value="cash">💵 Efectivo</option>
              </select>
            </div>
          </div>
          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-8">
            <button
              type="submit"
              className="
                flex-1 bg-primary text-white font-semibold
                py-2.5 px-6 rounded-xl shadow-md
                hover:brightness-110 active:scale-[0.98]
                transition-all duration-150 ease-in-out
                cursor-pointer
              "
            >
              {transactionEdit == null ? '✓ Crear transacción' : '✓ Actualizar'}
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
                cursor-pointer
              "
            >
              Cancelar
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}

export default TransctionForm;