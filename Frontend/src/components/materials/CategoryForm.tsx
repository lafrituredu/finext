import React, { useEffect, useState } from "react";
import TrendingUpIcon from "/src/assets/icons/Trending-up.svg?react";
import TrendingDownIcon from "/src/assets/icons/Trending-down.svg?react";
import MoneyBagIcon from "/src/assets/icons/Money-bag.svg?react"
import { createCategory, updateCategory, type Category } from "../../api/CategoryService";
import { useForm } from "react-hook-form";
export function CategoryForm({ close, categories, categoryEdit }: {close:any,categories:Category[],categoryEdit?:Category}) {
  const [select, setSeleceted] = useState<any>('income');
  const [category,setCategory] = useState<string>(categoryEdit?.name || '');
  const [color,setColor] = useState<string>(categoryEdit?.color || '#f3f4f6');
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Category>({
    defaultValues: categoryEdit || {
      name: "",
      color: "#f3f4f6"
    }
  });

  const onSubmit = async (data: Category) => {
    try {
      if (categoryEdit != null) {
        updateCategory(data.name,categoryEdit.id, data.color?.toString()) 
      }else{
        createCategory(data.name,data.color?.toString());
      }
      close()
    } catch (error) {
      console.error(error)
    }

  }

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
              {categoryEdit ? "Editar Categoria" : "Crear Categoria"}
            </h2>
            <button className="cursor-pointer" onClick={close}>✕</button>
          </div>

          {/* NAME */}
          <div>
            <label className={labelCls}>Nombre *</label>
            <input
              {...register("name", {
                required: "El nombre es obligatorio",
                  validate: (value) => {
                    const exists = categories.some(c => 
                      c.name.toLowerCase() === value.toLowerCase() &&
                      c.id !== categoryEdit?.id
                    );

                    return exists ? "Ya existe una categoría con ese nombre" : true;
                  }
              })}
              className={inputCls}
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>

          {/* TARGET */}
          <div>
            <label className={labelCls}>Color *</label>
            <input
              type="color"
              {...register("color", {
                required: "Obligatorio"
              })}
              className={`${inputCls} py-0.5!`}
            />
            {errors.color && <p className="text-red-400 text-xs">{errors.color.message}</p>}
          </div>




          {/* SUBMIT */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 rounded-xl cursor-pointer hover:brightness-110 active:scale-[0.98]"
            >
              {categoryEdit ? "Actualizar" : "Crear"}
            </button>

            <button
              type="button"
              onClick={close}
              className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CategoryForm;