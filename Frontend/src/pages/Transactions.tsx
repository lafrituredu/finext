import React, { useEffect, useState } from 'react'
import TransactionForm from "../components/materials/TransactionForm"
import { useTranslation } from 'react-i18next'

import Trending_up from '/src/assets/icons/Trending-up.svg?react'
import Trending_down from '/src/assets/icons/Trending-down.svg?react'

import { getTransactions, type Transaction } from '../api/TransactionService'

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { t } = useTranslation("transactions")
  const [select,setSeleceted] = useState<any>('full')

  const [showTransactionForm, setShowTransactionForm] = useState(false)

  useEffect(() => {
    getTransactions()
      .then(data => setTransactions(data))
      .catch(() => setError('Error al cargar las transacciones'))
      .finally(() => setLoading(false))
  }, [])
  
  return (
    <>
    {showTransactionForm && <TransactionForm close={() => setShowTransactionForm(false)}/>}
    <div className='p-10'>
      <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left'>
        <h2 className='mont_semibold text-4xl'>{t('transactions')}</h2>
        <button 
        onClick={() => setShowTransactionForm(true)}
        className=" inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
            {t('new_transaction')}
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            {t('create')}
          </span>
        </button>
      </div>
      <div className='py-10'>
        <div id='toggle' className='relative bg-[#EFEFEF] dark:bg-dark-card w-fit px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] mb-4 montserrat'>
              <div id='full' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'full' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>Full</div>
              <div id='incomes' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'incomes' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>Incomes</div>
              <div id='expenses' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'expenses' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`} >Expenses</div>
        </div>
      </div>
      {/* TRANSACTIONS CARDS */}
      {loading ? (
        //LOADING
        <div className='flex flex-col justify-center items-center w-full h-[20vh]'>
          <svg xmlns="http://www.w3.org/2000/svg" height="64px" viewBox="0 -960 960 960" width="64px" fill="#999999" className='animate-spin'><path d="M314-115q-104-48-169-145T80-479q0-26 2.5-51t8.5-49l-46 27-40-69 191-110 110 190-70 40-54-94q-11 27-16.5 56t-5.5 60q0 97 53 176.5T354-185l-40 70Zm306-485v-80h109q-46-57-111-88.5T480-800q-55 0-104 17t-90 48l-40-70q50-35 109-55t125-20q79 0 151 29.5T760-765v-55h80v220H620ZM594 0 403-110l110-190 69 40-57 98q118-17 196.5-107T800-480q0-11-.5-20.5T797-520h81q1 10 1.5 19.5t.5 20.5q0 135-80.5 241.5T590-95l44 26-40 69Z"/></svg>
        </div>
      ) : 
      error ? (<p>{error}</p>) : 
      transactions.length === 0 ? (<p>No hay transacciones</p>) : 
      (
      <div className='grid sm:grid-cols-2 grid-cols-1 gap-5'>
        {transactions.map(t => (
          <div key={t.id} className='flex flex-col bg-gray-100 rounded-2xl p-4 ring-2 ring-gray-200'>
            <div className='flex flex-row justify-between items-center w-full pb-6'>
              <p className='mont_semibold text-black text-xl truncate mr-2'>{t.name}</p>
              <div className={t.type == 'income' ?
                'inter bg-green-200 ring-1 ring-green-500 rounded-full text-green-600 text-xs px-2' : 
                'inter bg-red-200 ring-1 ring-red-500 rounded-full text-red-600 text-xs px-2'}>
                <p className='flex justify-center items-center capitalize'>
                  {t.type == 'income'?<Trending_up className='mr-2 text-green-600 w-5'/>:
                  <Trending_down className='mr-2 text-red-600 w-5'/>}{t.type}
                </p>
              </div>
            </div>
            <div className={t.type == 'income'?'text-green-500':'text-red-500'}><p className='inter text-4xl'>{t.total_amount}€</p></div>
            <div className='flex flex-row justify-between items-center w-full pt-1'>
              <p className='inter text-gray-400 text-xl '>{t.date}</p>
              <div className='inter capitalize bg-blue-200 ring-1 ring-blue-500 rounded-full text-blue-600 text-xs py-1 px-2'>
                <p>{t.category.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}</div>
    </>
  )
}

export default Transactions
