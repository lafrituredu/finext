import React, { useEffect, useState } from 'react'
import TransactionForm from "../components/materials/TransactionForm"
import { useTranslation } from 'react-i18next'
//dayjs -> Libreria de js utilizada para hacer format de dates
import dayjs from 'dayjs'

import Trending_up from '/src/assets/icons/Trending-up.svg?react'
import Trending_down from '/src/assets/icons/Trending-down.svg?react'
import ArrowsLeftRight from '/src/assets/icons/ArrowsLeftRight.svg?react'
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'
import TagIcon from '/src/assets/icons/Tag.svg?react'
import { deleteTransaction, getTransactions, type Transaction } from '../api/TransactionService'
import Notifications from '../components/materials/Notifications'
import Confirmation from '../components/materials/Confirmation'
import { getCategories, type Category } from '../api/CategoryService'
import PencilIcon from '/src/assets/icons/Pencil.svg?react'
function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { t } = useTranslation("transactions")
  const [select,setSelected] = useState<any>('total')
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)
  const [transactionToEdit,setTransactionToEdit] = useState<Transaction | null>(null)
  useEffect(() => {
    getTransactions()
      .then(data => setTransactions(data))
      .catch(() => setError('Error al cargar las transacciones'))
      .finally(() => setLoading(false));
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (error: any) {
      console.log('Status:', error.response?.status)
      console.log('Mensaje:', error.response?.data)
      setError('Error al eliminar la transaccion')
    }
  }

  //Filtrar transacciones para recoger "income" o "expense", o en caso de no ser ninguna de las 2 recoger todas.
  const filteredTransactions = transactions.filter(t => {
    if (select === 'incomes') return t.type === 'income'
    if (select === 'expenses') return t.type === 'expense'
    return true //'total'
  })
  
  return (
    <>
    <div className='flex justify-center items-center'>
      {/* <Notifications type="alert">Transaction successfully deleted!</Notifications> */}
    </div>
    {transactionToDelete !== null && (
      <Confirmation
        Icon={TrashcanIcon}
        close={() => setTransactionToDelete(null)}
        onConfirm={() => {handleDelete(transactionToDelete.id!); setTransactionToDelete(null)}}>
        Estas seguro de que quieres eliminar <span className='font-bold'>{transactionToDelete.name}</span>?
      </Confirmation>)}
    {showTransactionForm && <TransactionForm close={() => setShowTransactionForm(false)} transactionEdit={transactionToEdit!}/>}
    <div className='p-10'>
      <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-4'>
        <h2 className='mont_semibold text-4xl'>{t('transactions')}</h2>
        <button 
        onClick={() => {setShowTransactionForm(true);setTransactionToEdit(null);}}
        className=" inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
            {t('new_transaction')}
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            {t('create')}
          </span>
        </button>
      </div>
      {transactions.length !== 0 ? (
      <div className='md:py-10 pt-10 pb-5'>
        <div id='toggle' className='relative bg-[#EFEFEF] dark:bg-dark-card w-fit px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] mb-4 montserrat select-none'>
              <div id='total' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'total' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>Total</div>
              <div id='incomes' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'incomes' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>Incomes</div>
              <div id='expenses' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'expenses' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`} >Expenses</div>
        </div>
        <p className='inter capitalize text-gray-400'>{select} transactions → <span className='font-bold'>{filteredTransactions.length}</span></p>
      </div>):(<></>)}
      {/* TRANSACTIONS CARDS */}
      {loading ? (
        //LOADING
        <div className='flex flex-col justify-center items-center w-full h-[50vh]'>
          <svg xmlns="http://www.w3.org/2000/svg" height="64px" viewBox="0 -960 960 960" width="64px" fill="#999999" className='animate-spin'><path d="M314-115q-104-48-169-145T80-479q0-26 2.5-51t8.5-49l-46 27-40-69 191-110 110 190-70 40-54-94q-11 27-16.5 56t-5.5 60q0 97 53 176.5T354-185l-40 70Zm306-485v-80h109q-46-57-111-88.5T480-800q-55 0-104 17t-90 48l-40-70q50-35 109-55t125-20q79 0 151 29.5T760-765v-55h80v220H620ZM594 0 403-110l110-190 69 40-57 98q118-17 196.5-107T800-480q0-11-.5-20.5T797-520h81q1 10 1.5 19.5t.5 20.5q0 135-80.5 241.5T590-95l44 26-40 69Z"/></svg>
        </div>) : 
      error ? (<p>{error}</p>) : 
      transactions.length === 0 ? (
      <div className='flex flex-col justify-center items-center inter pt-40'>
        <ArrowsLeftRight className='w-24 h-24'/>
        <p className='text-xl'>{t('no_transactions')}</p>
      </div>
      ) : 
      (
      <div className='grid sm:grid-cols-2 grid-cols-1 gap-5 text-text dark:text-dark-text'>
        {filteredTransactions.map(t => (
          <div key={t.id} className='flex flex-col bg-gray-100 dark:bg-dark-card rounded-2xl p-4 ring-2 ring-gray-200 dark:ring-[#101a3d]
            hover:scale-102 transition-transform ease-in-out w-full h-full'>
            <div className='flex flex-row justify-between items-center w-full pb-6'>
              {/* <div className='flex flex-row items-center gap-2'>
              <div className='bg-gray-200 h-8 w-8 rounded-full ring-1 ring-gray-400'></div> */}
              <p className='mont_semibold text-xl truncate mr-2'>{t.name}</p>
              {/* </div> */}
              <div className='flex flex-row gap-2 items-center'>
                <div className={t.type == 'income' ?
                  'inter bg-green-200 ring-1 ring-green-500 rounded-full text-green-600 text-xs px-2' : 
                  'inter bg-red-200 ring-1 ring-red-500 rounded-full text-red-600 text-xs px-2'}>
                  <p className='flex justify-center items-center capitalize'>
                    {t.type == 'income'?<Trending_up className='sm:mr-2 text-green-600 w-5'/>:
                    <Trending_down className='sm:mr-2 text-red-600 w-5'/>}<span className='sm:flex hidden'>{t.type}</span>
                  </p>
                </div>
                <PencilIcon className='cursor-pointer text-gray-700 hover:scale-110 transition-all ease-in-out dark:text-dark-text'
                onClick={() => {setTransactionToEdit(t);setShowTransactionForm(true)}}/>
                <TrashcanIcon className='cursor-pointer text-red-600 hover:scale-104 transition-all ease-in-out hover:bg-red-200 rounded-full'
                onClick={()=>setTransactionToDelete(t)}/>
              </div>
              
            </div>
            <div className={t.type == 'income'?'text-green-400':'text-red-400'}><p className='inter text-4xl'>{t.total_amount}€</p></div>
            <div className='flex flex-row justify-between items-center w-full pt-1'>
              <p className='inter text-gray-400 text-lg '>{dayjs(t.date).format('DD-MM-YYYY')}</p>
              {t.category !== null && (
              <div className='inter capitalize bg-blue-200 rounded-full text-blue-400 text-sm py-[2px] px-3 flex flex-row items-center'>
                <TagIcon className='w-4 mr-1 h-4'/><p>{t.category.name}</p>
              </div>)}
            </div>
          </div>
        ))}
      </div>

      )}
    </div>
    </>
  )
}

export default Transactions
