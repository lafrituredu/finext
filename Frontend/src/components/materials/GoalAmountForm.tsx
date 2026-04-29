import { useEffect, useState } from "react";
import TrendingUpIcon from "/src/assets/icons/Trending-up.svg?react"
import TrendingDownIcon from "/src/assets/icons/Trending-down.svg?react"
import MoneyBagIcon from "/src/assets/icons/Money-bag.svg?react"
import { getCategories, type Category } from '../../api/CategoryService'
import { contribute, type Goal } from "../../api/GoalService"

import React from "react";
import { useForm } from "react-hook-form"

export function GoalAmountForm({ close, goalEdit }: { close: any, goalEdit?: Goal }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [GoalName, setGoalName] = useState<string>(goalEdit?.name || '')
  const [GoalAmount, setGoalAmount] = useState<number>(0)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<Goal>()

  const onSubmit = async (data: Goal) => {
    try {
      const { id, ...dataWithoutId } = data
      if (goalEdit != null) {
       await contribute(goalEdit.id,GoalAmount);
      } else {
        //await createTransaction(dataWithoutId)
      }
      close()
    } catch (error) { console.error(error) }
  }


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
              {goalEdit == null ? 'Añadir Meta' : 'Editar Meta'}
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

          {/* Name */}
          <div>
            <label className={labelCls}>Nombre *</label>
            <input
              {...register("name", { required: "El nombre es obligatorio" })}
              type="text"
              placeholder="Ej. Factura cliente"
              value={GoalName}
              onChange={(e) => setGoalName(e.target.value)}
              className={inputCls}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          {goalEdit != null && <p className={labelCls}>Restante: {goalEdit.target_amount - goalEdit.current_amount}, Aportado: {goalEdit?.current_amount},Recomendado:</p>}


          {/* Amount */}

          {
            goalEdit != null &&
            <div>
              <label className={labelCls}>Cantidad</label>
              <input
              {...register("current_amount", { required: "Introducir la cantidad es obligatorio", max: { value: goalEdit.target_amount - goalEdit.current_amount , message: `la cantidad a aportar no puede ser superior a ${goalEdit.target_amount - goalEdit.current_amount}`} })}
                type="number"
                placeholder="0.00"
                className={inputCls}
                onChange={(e) => setGoalAmount(parseFloat(e.target.value))}
              />
              {errors.current_amount && <p className="mt-1 text-xs text-red-400">{errors.current_amount.message}</p>}
            </div>
          }
          
          {goalEdit == null && (
            <>
              {/* Target Amount */}
              <div>
                <label className={labelCls}>Cantidad objetivo *</label>
                <input
                  {...register("target_amount", {
                    required: "La cantidad objetivo es obligatoria",
                    min: { value: 1, message: "Debe ser mayor que 0" }
                  })}
                  type="number"
                  placeholder="Ej. 1000"
                  className={inputCls}
                />
                {errors.target_amount && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.target_amount.message}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className={labelCls}>Fecha inicio *</label>
                <input
                  {...register("start_date", {
                    required: "La fecha de inicio es obligatoria"
                  })}
                  type="date"
                  className={inputCls}
                />
                {errors.start_date && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.start_date.message}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className={labelCls}>Fecha fin *</label>
                <input
                  {...register("end_date", {
                    required: "La fecha de fin es obligatoria",
                    validate: (value, formValues) => {
                      return (
                        new Date(value) > new Date(formValues.start_date) ||
                        "La fecha fin debe ser posterior a la de inicio"
                      );
                    }
                  })}
                  type="date"
                  className={inputCls}
                />
                {errors.end_date && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.end_date.message}
                  </p>
                )}
              </div>
            </>
          )}

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
              {goalEdit == null ? '✓ Crear meta' : '✓ Actualizar'}
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

export default GoalAmountForm;