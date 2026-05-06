import React, { useState } from "react";
import { useForm } from "react-hook-form";
import MoneyBagIcon from "/src/assets/icons/Money-bag.svg?react";
import { createGoal, updateGoal, type Goal } from "../../api/GoalService";

export function GoalForm({close,goalEdit}: {close: () => void;goalEdit?: Goal;}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Goal>({
    defaultValues: goalEdit || {
      name: "",
      target_amount: 0,
      current_amount: 0,
      start_date: "",
      end_date: "",
      completed: 0
    }
  });

  const [isSubmitting,setIsSubmitting] = useState(false); 

  const onSubmit = async (data: Goal) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (goalEdit) {
        await updateGoal(data);
      } else {
        await createGoal(data);
      }
      close();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false)
    }
  };

  const startDate = watch("start_date");

  /* styles */
  const inputCls = `
    w-full rounded-xl border border-gray-200 dark:border-gray-700
    bg-gray-50 dark:bg-[#0f1b35]
    text-gray-800 dark:text-gray-100
    px-4 py-2.5 text-sm font-medium
    focus:outline-none focus:ring-2 focus:ring-primary/50
  `;

  const labelCls = `
    block text-xs font-semibold uppercase tracking-wide
    text-gray-500 dark:text-gray-400 mb-1
  `;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 flex items-center justify-center p-4"
        onClick={close}
      >
        <div
          className="w-full max-w-lg bg-background dark:bg-dark-background p-6 rounded-2xl flex flex-col gap-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <MoneyBagIcon className="w-6 h-6" />
              {goalEdit ? "Editar Meta" : "Crear Meta"}
            </h2>
            <button onClick={close}>✕</button>
          </div>

          {/* NAME */}
          <div>
            <label className={labelCls}>Nombre *</label>
            <input
              {...register("name", {
                required: "El nombre es obligatorio"
              })}
              className={inputCls}
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>

          {/* TARGET */}
          <div>
            <label className={labelCls}>Cantidad objetivo *</label>
            <input
              type="number"
              {...register("target_amount", {
                required: "Obligatorio",
                valueAsNumber: true,
                min: { value: 1, message: "Debe ser mayor a 0" }
              })}
              className={inputCls}
            />
            {errors.target_amount && <p className="text-red-400 text-xs">{errors.target_amount.message}</p>}
          </div>

          {/* CURRENT */}
          <div>
            <label className={labelCls}>Cantidad actual</label>
            <input
              type="number"
              {...register("current_amount", {
                valueAsNumber: true,
                min: { value: 0, message: "No puede ser negativa" }
              })}
              className={inputCls}
            />
          </div>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Inicio *</label>
              <input
                type="date"
                {...register("start_date", {
                  required: "Obligatorio"
                })}
                className={inputCls}
              />
              {errors.start_date && <p className="text-red-400 text-xs">{errors.start_date.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Fin *</label>
              <input
                type="date"
                {...register("end_date", {
                  required: "Obligatorio",
                  validate: (value) => {
                    const end = new Date(value);
                    const start = new Date(startDate);
                    const today = new Date();

                    today.setHours(0, 0, 0, 0);
                    start.setHours(0, 0, 0, 0);
                    end.setHours(0, 0, 0, 0);

                    if (end <= today) {
                      return "Debe ser una fecha futura";
                    }

                    if (end <= start) {
                      return "Debe ser posterior a la fecha de inicio";
                    }

                    return true;
                  }
                })}
                className={inputCls}
              />
              {errors.end_date && <p className="text-red-400 text-xs">{errors.end_date.message}</p>}
            </div>
          </div>

          {/* STATUS */}
          {/* <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("completed", {setValueAs: (value) => value ? 0 : false})}
            />
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Meta completada
            </label>
          </div> */}

          {/* SUBMIT */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-white py-2 rounded-xl cursor-pointer"
            >
              {goalEdit ? "Actualizar" : "Crear"}
            </button>

            <button
              type="button"
              onClick={close}
              className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
