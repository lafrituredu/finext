import { useEffect, useState } from "react";
import TrendingUpIcon from "/src/assets/icons/Trending-up.svg?react";
import TrendingDownIcon from "/src/assets/icons/Trending-down.svg?react";
import MoneyBagIcon from "/src/assets/icons/Money-bag.svg?react"
import { getCategories, type Category } from '../../api/CategoryService'
import { createTransaction, updateTransaction, type Transaction } from "../../api/TransactionService";

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
  status: boolean
  category_id?: number
};

type FormProps = {
  close: () => void;
  onCreated: (transaction: Transaction) => void;
};

export function TransctionForm({ close, transactionEdit }: {close:any, transactionEdit?:Transaction}) {
  const [select, setSelected] = useState<any>(transactionEdit?.type || 'income');
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  if(transactionEdit != null)
  {
    const transactionId = transactionEdit.id
  }
  const [transactionName, setTransactionName] = useState<string>(transactionEdit?.name || '')
  const [transactionImport, setTransactionImport] = useState<number>(transactionEdit?.total_amount || 0)
  const [transactionDate, setTransactionDate] = useState<string>(transactionEdit?.date || '')
  const [transactioniva, setTransactionIva] = useState<number>(transactionEdit?.iva_percent || 0)
  const [transactionDescription, setTransactionDescription] = useState<string>(transactionEdit?.description || '')
  const [transactionClient, setTransactionClient] = useState<string>(transactionEdit?.client || '')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }} = useForm<TransactionFormValues>()

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      const { id, ...dataWithoutId } = data
      if (transactionEdit != null) {
        console.log("ID:", id)
        console.log("Data enviada:", dataWithoutId)
        await updateTransaction(dataWithoutId, id)
      } else {
        await createTransaction(dataWithoutId)
      }
      close()
    } catch (error) { console.error(error) }
  }

    useEffect(()=>{
    getCategories()
      .then(data => setCategories(data))
      .catch(() => setError('Error al cargar las categorias'))
      .finally(() => setLoading(false));
    console.log(select)
    setValue("type", select);
    if (transactionEdit) {
      setValue("id", transactionEdit.id)
    }
  },[select, setValue, transactionEdit])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <input type="hidden" {...register("id")} />
    <div className="flex items-center justify-center fixed bg-[#0000006b] min-w-full min-h-full z-60 top-0 left-0">
      <div className="inter absolute w-[60vh] h-fit bg-background dark:bg-dark-background dark:ring-2 dark:ring-gray-800 shadow-md rounded-2xl z-80 p-3 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col p-2 gap-y-4">
            <p className="flex justify-center items-center text-2xl font-bold"><MoneyBagIcon className="w-8 mx-2"/>{transactionEdit == null ? 'Añadir Transaccion' : 'Editar Transaccion' }</p>
            <div className="flex justify-center">
              <div id='toggle' className='relative bg-[#EFEFEF] dark:bg-[#0F1732] w-fit px-2 py-1 rounded-3xl flex flex-row items-center gap-2 border border-[#0000001a] mb-4 montserrat'>
                <div id='income' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'income' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-2xl text-green-600' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer flex items-center gap-1`}><TrendingUpIcon/>Income</div>
                <div id='expense' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'expense' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-2xl text-red-600' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer flex items-center gap-1`}><TrendingDownIcon/>Expsense</div>
              </div>
            </div>
            <div className="flex flex-col">
              <label>Nombre*</label>
              <input {...register("name", { required: "El nombre es obligatorio" })} type="text" placeholder="Nombre" value={transactionName}
              onChange={(e)=>setTransactionName(e.target.value)}/>
              {errors.name && <span className="text-red-300">{errors.name.message}</span>}
            </div>
            <div className="flex flex-row gap-10">
              <div className="flex flex-col">
                <label>Importe*</label>
                <input type="number" step="0.10" {...register("total_amount", { required: "El importe es obligatorio", valueAsNumber: true })} value={transactionImport}
                onChange={(e)=>setTransactionImport(parseFloat(e.target.value))}/>
                {errors.total_amount && <span className="text-red-300">{errors.total_amount.message}</span>}
              </div>
              <div className="flex flex-col w-full">
                <label>Fecha*</label>
                <input type="date" {...register("date", { required: "La fecha es obligatoria" })} value={transactionDate}
                onChange={(e)=>setTransactionDate(e.target.value)}/>
                {errors.date && <span className="text-red-300">{errors.date.message}</span>}
              </div>
            </div>

            <label>Tipo de IVA</label>
            <select {...register("iva_percent", {setValueAs: (value) => value === "" ? null : Number(value)})} value={transactioniva}
              onChange={(e)=>setTransactionIva(parseInt(e.target.value))}>
              <option value="">0%</option>
              <option value="4">Superreducido 4%</option>
              <option value="10">Reducido 10%</option>
              <option value="21">General 21%</option>
            </select>
            
            <label>Categoria</label>
            <select {...register("category_id", {setValueAs: (value) => value === "" ? null : Number(value)})}>
              <option value="">Select</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label>Description</label>
            <input {...register("description")} type="text" value={transactionDescription}
            onChange={(e)=>setTransactionDescription(e.target.value)}/>

            <label>Client</label>
            <input {...register("client")} type="text" value={transactionClient}
            onChange={(e)=>setTransactionClient(e.target.value)}/>
            <button type="submit" className="bg-primary py-2 px-6 rounded-full shadow-md text-white cursor-pointer hover:scale-104 transition-all duration-200 ease-in-out">{transactionEdit == null ? 'Crear' : 'Actualizar' }</button>
            <button className="bg-red-700 py-2 px-6 rounded-full shadow-md text-white cursor-pointer hover:scale-104 transition-all duration-200 ease-in-out" onClick={close}>Cancelar</button>
        </div>
      </div>
    </div>
    </form>
  );
}

export default TransctionForm;