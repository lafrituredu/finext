import React, { useEffect, useState } from "react";
import TrendingUpIcon from "/src/assets/icons/Trending-up.svg?react";
import TrendingDownIcon from "/src/assets/icons/Trending-down.svg?react";
import MoneyBagIcon from "/src/assets/icons/Money-bag.svg?react"
import { createCategory, updateCategory, type Category } from "../../api/CategoryService";

export function CategoryForm({ close,categoryEdit }: {close:any,categoryEdit?:Category}) {
  const [select, setSeleceted] = useState<any>('income');
  const [category,setCategory] = useState<string>(categoryEdit?.name || '');
  const [color,setColor] = useState<string>(categoryEdit?.color || '#f3f4f6');
  
  const handleSubmit = ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    if (categoryEdit != null) {
      updateCategory(category,categoryEdit.id,color) 
    }else{
      createCategory(category,color);
    }
    close()
  }

  return (
    <div className="flex items-center justify-center fixed bg-[#0000006b] min-w-full min-h-full z-60 top-0 left-0">
      <div className="inter absolute w-[60vh] h-fit bg-background dark:bg-dark-background dark:ring-2 dark:ring-gray-800 shadow-md rounded-2xl z-80 p-3 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <form className="flex flex-col p-2 gap-y-4" onSubmit={(e) => handleSubmit(e)}>
            <p className="flex justify-center items-center text-2xl font-bold"><MoneyBagIcon className="w-8 mx-2"/>{categoryEdit == null ? 'Añadir Categoria' : 'Editar Categoria' }</p>

            <div className="flex flex-col">
              <label>Nombre de la categoria</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Nombre" id="name" name="name" className="rounded-full ring-2 ring-gray-200 py-1 px-2"/>
            </div>

            <div className="flex flex-col">
              <label>Color de la categoria: {color}</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Nombre" id="color" name="color" className="rounded-full ring-2 ring-gray-200 py-1 px-2"/>
            </div>
              
            <input value={categoryEdit == null ? 'Crear' : 'Editar' } type="submit" className="bg-primary py-2 px-6 rounded-full shadow-md text-white cursor-pointer hover:scale-104 transition-all duration-200 ease-in-out"/>
            <button className="bg-red-700 py-2 px-6 rounded-full shadow-md text-white cursor-pointer hover:scale-104 transition-all duration-200 ease-in-out" onClick={close}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}

export default CategoryForm;