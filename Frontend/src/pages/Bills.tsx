//Library
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

//Bills
import BillForm from "../components/materials/BillForm"
import { useBills, type BillsContextType } from '../contexts/BillContext'
import { deleteBill, type Bill } from '../api/BillService'
//Bills-Transactions
import { getTransactionsByBill } from '../api/TransactionService'

//Icons
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'
import FileIcon from '/src/assets/icons/File.svg?react'

//Material
import Confirmation from '../components/materials/Confirmation'
import BillCard from '../components/bills/BillCard'
import dayjs from 'dayjs'

//Types
type FilterType = 'total' | 'emitida' | 'recibida'
type SortOrder = 'asc' | 'desc'

function Bills() {
  //Variables-------------------
  const { t } = useTranslation("bills")
  const { t:u } = useTranslation("utils")

  //Bills
  const { bills, setBills, refetchBills } = useBills() as BillsContextType
  //Saves how much money has been paid at every bill - KEY: number - VALUE: number or null
  const [billsPaid, setBillsPaid] = useState<Record<number, number | null>>({}) //Record is Key = Value
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showBillForm, setShowBillForm] = useState(false)
  const [billToEdit, setBillToEdit] = useState<Bill | null>(null)
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null)


  const [isSubmitting, setIsSubmitting] = useState(false)

  //Filters
  const [activeFilter, setActiveFilter] = useState<FilterType>('total')
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  //Get the avariable years declared at the bills, and sort them from recent to oldest
  //Set -> Delete duplicated years.
  const availableYears = useMemo<number[]>(() => 
      [...new Set(bills.map(bill => dayjs(bill.date).year()))].sort((a, b) => b - a), 
    [bills])

  const FILTERS: {id: FilterType; label:string}[] = [
    {id: 'total', label: t('type.total')},
    {id: 'emitida', label: t('type.emitida')},
    {id: 'recibida', label: t('type.recibida')}
  ]

  const months = []
  for (let i = 0; i < 12; i++) {
    months.push(i)
  }

  //Recive the active filter and get the label to print it
  const activeFilterLabel = FILTERS.find(
    filter => filter.id === activeFilter
  )?.label

  //Obtains the transactions related to the bills
  const fetchBillTransactions = async (bills: Bill[]) => {
    const results: Record<number, number | null> = {}
    await Promise.all(
      bills.map(async (bill) => {
        try {
          //Obtain transactions from the bill
          const transactions = await getTransactionsByBill(bill.id)

          if (transactions.length === 0) {
            results[bill.id] = null //Key = id Value = null
          } else {
            results[bill.id] = transactions.reduce((sum, t) => sum + Number(t.total_amount), 0) //Key = id Value = total amount
          }
        } catch {
          results[bill.id] = null
        }
      })
    )
    setBillsPaid(results) //Saves the results at billsPaid
    console.log(results)
  }

  //Filters
  const sortedBills = useMemo (()=>{
    const filtered = bills.filter(bill => {
      const date = dayjs(bill.date)
      if (selectedMonth && date.month() + 1 !== parseInt(selectedMonth)) return false
      if (selectedYear && date.year() !== parseInt(selectedYear)) return false

      if (activeFilter === 'emitida') return bill.type === 'emitida'
      if (activeFilter === 'recibida') return bill.type === 'recibida'

      return true //'total'
    })

    return filtered.sort((a,b) => {
      if(sortOrder === 'asc'){
        return dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
      }else{
        return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
      }
    })
  },[bills, activeFilter, selectedMonth, selectedYear, sortOrder])

  useEffect(() => {
    refetchBills()
  }, [showBillForm])

  useEffect(() => {
    if (bills.length > 0) {
      fetchBillTransactions(bills)
    }
  }, [bills])

  const handleDelete = async (id: number) => {
    if (isSubmitting) return //Prevent multiple POST's
    setIsSubmitting(true)

    try {
      await deleteBill(id) //Delete bill
      setBills(prev => prev.filter(b => b.id !== id)) //Refetch
      setBillToDelete(null)
    } catch{
      setError(t('error.delete'))
    } finally{
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* --- Bill form --- */}
      {showBillForm  && (<BillForm close={() => setShowBillForm(false)} billEdit={billToEdit ?? undefined} />)}
      {/* --- Confirmacion eliminar --- */}
      {billToDelete && (
      <Confirmation
        Icon={TrashcanIcon}
        close={() => { setBillToDelete(null) }}
        onConfirm={() => { handleDelete(billToDelete.id)}}
      >
        {t("confirm.delete")} <span className='font-semibold'>{billToDelete.name}</span> {t("confirm.delete_trans")}
      </Confirmation>)}
      {/* ----------------------------- */}
      <div className='p-6 sm:p-10 inter'>
        {/* Header */}
        <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-4'>
          <h2 className='mont_semibold text-4xl'>{t('bills')}</h2>
          <button
            onClick={() => { setShowBillForm(true); setBillToEdit(null) }}
            className="inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
              {t('new_bill')}
            </span>
            <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              {t('create')}
            </span>
          </button>
        </div>
        <hr className="-mx-6 sm:-mx-10 mt-6 border-t border-gray-100 dark:border-gray-900 shadow-sm" />
        <div>
        {/* Filters */}
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
            
            {/* Filters by month and year */}
            <div className='flex items-center gap-2'>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className='montserrat text-md rounded-full px-3 py-1 bg-[#EFEFEF] dark:bg-dark-card dark:border-[#1d2344] border border-[#0000001a] cursor-pointer'>
                <option value=''>{t('months')}</option> {/* All months */}
                {months.map(month => (
                  <option key={month + 1} value={month + 1}>
                    {u(`months.${dayjs().month(month).format('MMMM').toLocaleLowerCase()}`)}
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
          {/* Filters by order */}
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
        <p className='inter capitalize text-gray-400 pb-2'>{activeFilterLabel} {t('transactions')} → <span className='font-bold'>{sortedBills.length}</span></p>
      </div>
        {/* States */}
        {loading && (
          <div className='flex flex-col justify-center items-center w-full h-[50vh]'>
            <svg xmlns="http://www.w3.org/2000/svg" height="64px" viewBox="0 -960 960 960" width="64px" fill="#999999" className='animate-spin'><path d="M314-115q-104-48-169-145T80-479q0-26 2.5-51t8.5-49l-46 27-40-69 191-110 110 190-70 40-54-94q-11 27-16.5 56t-5.5 60q0 97 53 176.5T354-185l-40 70Zm306-485v-80h109q-46-57-111-88.5T480-800q-55 0-104 17t-90 48l-40-70q50-35 109-55t125-20q79 0 151 29.5T760-765v-55h80v220H620ZM594 0 403-110l110-190 69 40-57 98q118-17 196.5-107T800-480q0-11-.5-20.5T797-520h81q1 10 1.5 19.5t.5 20.5q0 135-80.5 241.5T590-95l44 26-40 69Z"/></svg>
          </div>
        )}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        {!loading && !error && bills.length === 0 && (
          <div className='flex flex-col justify-center items-center inter pt-40'>
            <FileIcon className='w-24 h-24' />
            <p className='text-xl'>{t('no_bills')}</p>
          </div>
        )}
        {!loading && !error && bills.length > 0 && (
        <>  
          <div className='grid gird-cols-1 xl:grid-cols-2 gap-4'>
             {sortedBills.map(bill => (
              <BillCard 
                key={bill.id}
                bill={bill}
                billPaid={billsPaid[bill.id] ?? null}
                onEdit={()=>{setBillToEdit(bill); setShowBillForm(true)}}
                onDelete={()=>{setBillToDelete(bill)}}/>
             ))}
          </div>
        </>
        )}
      </div>
    </>
  )
}

export default Bills