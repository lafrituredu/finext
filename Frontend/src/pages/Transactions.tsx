//Library
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs' //dayjs -> JS library used to format dates.

//Transactions
import { useTransactions, type TransactionsContextType } from '../contexts/TransactionContext'
import { deleteTransaction, getTransactions, type Transaction } from '../api/TransactionService'
import TransactionForm from "../components/materials/TransactionForm"
import TransactionCard from '../components/transactions/TransactionCard'

//Extra
import Notifications from '../components/materials/Notifications'
import Confirmation from '../components/materials/Confirmation'

//Icons
import ArrowsLeftRight from '/src/assets/icons/ArrowsLeftRight.svg?react'
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'
import CycleIcon from '/src/assets/icons/Cycle.svg?react'

//Types
type FilterType = 'total' | 'incomes' | 'expenses'
type SortOrder = 'asc' | 'desc'

function Transactions() {
  //Variables-------------------------
  const { t } = useTranslation("transactions")

  //Transactions
  const { transactions, setTransactions, refetchTransactions } = useTransactions() as TransactionsContextType
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)

  //Filters
  const [activeFilter, setActiveFilter] = useState<FilterType>('total')
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const availableYears = useMemo<number[]>(() => 
    [...new Set(transactions.map(t => dayjs(t.date).year()))].sort((a, b) => b - a), 
  [transactions])

  const FILTERS: {id: FilterType; label:string}[] = [
    {id: 'total', label: t('type.total')},
    {id: 'incomes', label: t('type.incomes')},
    {id: 'expenses', label: t('type.expenses')}
  ]
  
  const activeFilterLabel = FILTERS.find(
    filter => filter.id === activeFilter
  )?.label

  //UseEffect-------------------------
  useEffect(() => {
    if (!showTransactionForm) {
      refetchTransactions()
    }
  }, [showTransactionForm])

  //Functions-------------------------
  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (error: any) {
      setError('Error al eliminar la transaccion')
    }
  }

  //Sort transactions by type, date and Order transaction by transaction date
  //useMemo -> React hook to save the result at the cache (Only render the data that changed)
  const sortedTransactions = useMemo (()=>{
    const filtered = transactions.filter(t => {
      const date = dayjs(t.date)
      if (selectedMonth && date.month() + 1 !== parseInt(selectedMonth)) return false
      if (selectedYear && date.year() !== parseInt(selectedYear)) return false

      if (activeFilter === 'incomes') return t.type === 'income'
      if (activeFilter === 'expenses') return t.type === 'expense'

      return true //'total'
    })

    return filtered.sort((a,b) => {
      if(sortOrder === 'asc'){
        return dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
      }else{
        return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
      }
    })
  },[transactions, activeFilter, selectedMonth, selectedYear, sortOrder])
  
  //---------------------------------------------------------------------------------------
  return (
    <>
    {/* Delete confirmation */}
    {transactionToDelete !== null && (
      <Confirmation
        Icon={TrashcanIcon}
        close={() => setTransactionToDelete(null)}
        onConfirm={() => {handleDelete(transactionToDelete.id!); setTransactionToDelete(null)}}>
        {t('confirmation')} <span className='font-bold'>{transactionToDelete.name}</span>?
      </Confirmation>
    )}
    {/* Edit Form */}
    {showTransactionForm && <TransactionForm close={() => setShowTransactionForm(false)} transactionEdit={transactionToEdit!}/>}

    <div className='p-6 sm:p-10'>
      <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-4'>
        {/* Title */}
        <h2 className='mont_semibold text-4xl'>{t('transactions')}</h2>
        {/* Create button */}
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
        {/* <button onClick={()=> {setShowTransactionForm(true); setTransactionToEdit(null);}}
          className='inter bg-primary w-50 h-10 rounded-full cursor-pointer hover:scale-104 transition-all ease-in-out duration-150'>
          <span className='text-white'>{t('new_transaction')}</span>
        </button> */}
      </div>
      {/* Body */}
      {transactions.length !== 0 ? (
      <div>
        <div className='flex justify-between items-start md:items-center gap-2 flex-col md:flex-row'>
          <div className='flex sm:flex-row flex-col items-center md:py-10 pt-10 pb-5 gap-6'>
            <div className='relative bg-[#EFEFEF] dark:bg-dark-card w-fit sm:px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] montserrat select-none'>
              {FILTERS.map(({ id, label }) => (
                <div
                  key={id}
                  onClick={() => setActiveFilter(id)}
                  className={`${activeFilter === id ? 'bg-[#FFF] dark:bg-[#1a2957] rounded-2xl' : ''} 
                  px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>
                  {label}
                </div>
              ))}
            </div>
            
            {/* Filtro por mes y año */}
            <div className='flex items-center gap-2'>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className='montserrat text-md rounded-full px-3 py-1 bg-[#EFEFEF] dark:bg-dark-card dark:border-[#1d2344] border border-[#0000001a] cursor-pointer'>
                <option value=''>{t('months')}</option> {/* All months */}
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {dayjs().month(i).format('MMMM')}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className='montserrat text-md rounded-full px-3 py-1 bg-[#EFEFEF] dark:bg-dark-card dark:border-[#1d2344] border border-[#0000001a] cursor-pointer'>
                <option value=''>{t('years')}</option> {/* All years */}
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='pb-6 md:pb-0'>
            <button onClick={() =>setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFEFEF] dark:bg-dark-card
              border border-[#0000001a] dark:border-[#1d2344] hover:bg-white dark:hover:bg-[#1a2957]
              transition-all duration-200 inter text-sm font-medium select-none cursor-pointer">
              <span>
                {sortOrder === 'asc' ? t('order.old') : t('order.new')}
              </span>
              <span className={`transition-transform duration-200 ${sortOrder === 'asc' ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>
          </div>
        </div>
        <p className='inter capitalize text-gray-400 pb-2'>{activeFilterLabel} {t('transactions')} → <span className='font-bold'>{sortedTransactions.length}</span></p>
      </div>):(<></>)}
      {loading ? (
        <div className='flex flex-col justify-center items-center w-full h-[50vh]'>
          <CycleIcon className='animate-spin h-16 w-16 text-gray-400'/>
        </div>
      ) : 
      error ? (<p>{error}</p>) : 
      transactions.length === 0 ? (
      <div className='flex flex-col justify-center items-center inter pt-40'>
        <ArrowsLeftRight className='w-24 h-24'/>
        <p className='text-xl'>{t('no_transactions')}</p>
      </div>
      ) : 
      (
      <div className='grid sm:grid-cols-2 grid-cols-1 gap-5 text-text dark:text-dark-text'>
        {sortedTransactions.map(transaction => (
          <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onEdit={()=>{setTransactionToEdit(transaction), setShowTransactionForm(true)}}
          onDelete={()=>{setTransactionToDelete(transaction)}}/>
        ))}
      </div>
      )}
    </div>
    </>
  )
}

export default Transactions
