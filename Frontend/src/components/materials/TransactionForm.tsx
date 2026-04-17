import { useEffect, useState } from "react";
import TrendingUpIcon from "/src/assets/icons/Trending-up.svg?react";
import TrendingDownIcon from "/src/assets/icons/Trending-down.svg?react";
import MoneyBagIcon from "/src/assets/icons/Money-bag.svg?react"
import { getCategories, type Category } from '../../api/CategoryService'

export function TransctionForm({ close }: any) {
  const [select, setSeleceted] = useState<any>('income');
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{
    getCategories()
      .then(data => setCategories(data))
      .catch(() => setError('Error al cargar las categorias'))
      .finally(() => setLoading(false));
    console.log(select)
  },[select])

  return (
    <div className="flex items-center justify-center fixed bg-[#0000006b] min-w-full min-h-full z-60 top-0 left-0">
      <div className="inter absolute w-[60vh] h-fit bg-background dark:bg-dark-background dark:ring-2 dark:ring-gray-800 shadow-md rounded-2xl z-80 p-3 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col p-2 gap-y-4">
            <p className="flex justify-center items-center text-2xl font-bold"><MoneyBagIcon className="w-8 mx-2"/>Añadir transacción</p>
            <div className="flex justify-center">
              <div id='toggle' className='relative bg-[#EFEFEF] dark:bg-[#0F1732] w-fit px-2 py-1 rounded-3xl flex flex-row items-center gap-2 border border-[#0000001a] mb-4 montserrat'>
                <div id='income' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'income' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-2xl text-green-600' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer flex items-center gap-1`}><TrendingUpIcon/>Income</div>
                <div id='expense' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'expense' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-2xl text-red-600' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer flex items-center gap-1`}><TrendingDownIcon/>Expsense</div>
              </div>
              {/* Input oculto que guarda el valor */}
              <input type="hidden" name="type" value={select}/>
            </div>
            <div className="flex flex-col">
              <label>Nombre</label>
              <input type="text" placeholder="Nombre" className="rounded-full ring-2 ring-gray-200 py-1 px-2"/>
            </div>
            <div className="flex flex-row gap-10">
              <div className="flex flex-col">
                <label>Importe*</label>
                <input type="number" placeholder="0.00€" className="rounded-md ring-2 ring-gray-200 py-1 px-2 max-w-40"/>
              </div>
              <div className="flex flex-col w-full">
                <label>Fecha*</label>
                <input type="date" className="rounded-md ring-2 ring-gray-200 py-1 px-2" />
              </div>
            </div>
            <label>Tipo de IVA*</label>
            <select>
            <option>Selecciona</option>
            <option>Superreducido 4%</option>
            <option>Reducido 10%</option>
            <option>General 21%</option>
            </select>
            
            <label>Categoria</label>
            <select>
              <option value="">Select</option>
              {categories.map(c =>
              <option value={c.id}>{c.name}</option>
              )}
            </select>

            <label>Description</label>
            <input type="text" placeholder="Text..." className="h-24" />

            <label>Client</label>
            <input type="text" placeholder="Text..." />

            <label>Método de pago</label>
            <select>
                <option>Cash</option>
                <option>Tarjeta de credito</option>
                <option>Trueque</option>
            </select>
              <button className="bg-primary py-2 px-6 rounded-full shadow-md text-white cursor-pointer hover:scale-104 transition-all duration-200 ease-in-out">Añadir</button>
              <button className="bg-red-700 py-2 px-6 rounded-full shadow-md text-white cursor-pointer hover:scale-104 transition-all duration-200 ease-in-out" onClick={close}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default TransctionForm;