import React, { useState } from 'react'
import TransactionForm from "../components/materials/TransactionForm"

function Transactions() {
  const [select,setSeleceted] = useState<any>('incomes');

  const [showTransactionForm, setShowTransactionForm] = useState(false)
  return (
    <>
    {showTransactionForm && <TransactionForm close={() => setShowTransactionForm(false)}/>}
    <div className='p-10'>
      <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left'>
        <h2 className='mont_semibold text-4xl'>Transacciones</h2>
        <button 
        onClick={() => setShowTransactionForm(true)}
        className=" inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
            New Transaction
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            Create
          </span>
        </button>
      </div>
      <div className='py-10'>
        <div id='toggle' className='relative bg-[#EFEFEF] dark:bg-[#0F1732] w-fit px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] mb-4 montserrat'>
              <div id='incomes' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'incomes' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>Incomes</div>
              <div id='expenses' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'expenses' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`} >Expenses</div>
        </div>
      </div>
      <div className='h-1000'></div>
      </div>
    </>
  )
}

export default Transactions
