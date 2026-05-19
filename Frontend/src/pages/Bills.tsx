//Library
import { useEffect, useState } from 'react'
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

function Bills() {
  //Variables-------------------
  const { t } = useTranslation("bills")
  const { t:ct } = useTranslation("catTrans")

  //Bills
  const { bills, setBills, refetchBills } = useBills() as BillsContextType
  const [billsPaid, setBillsPaid] = useState<Record<number, number | null>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showBillForm, setShowBillForm] = useState(false)
  const [billToEdit, setBillToEdit] = useState<Bill | null>(null)
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null)


  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchBillTransactions = async (bills: Bill[]) => {
    const results: Record<number, number | null> = {}
    await Promise.all(
      bills.map(async (bill) => {
        try {
          const transactions = await getTransactionsByBill(bill.id)
          if (transactions.length === 0) {
            results[bill.id] = null
          } else {
            results[bill.id] = transactions.reduce((sum, t) => sum + Number(t.total_amount), 0)
          }
        } catch {
          results[bill.id] = null
        }
      })
    )
    setBillsPaid(results)
  }

  useEffect(() => {
    refetchBills()
  }, [showBillForm])

  useEffect(() => {
    if (bills.length > 0) {
      fetchBillTransactions(bills)
    }
  }, [bills])

  const handleDelete = async (id: number) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      await deleteBill(id)
      setBills(prev => prev.filter(b => b.id !== id))
      setBillToDelete(null)
    } catch{
      setError(t('error.delete'))
    } finally{
      setIsSubmitting(false)
    }
  }

  return (
    <>
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
        <hr className="-mx-6 sm:-mx-10 my-6 border-t border-gray-100 dark:border-gray-900 shadow-sm" />
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

        {/* Cards */}
        {!loading && !error && bills.length > 0 && (
        <>  
          <div className='grid gird-cols-1 xl:grid-cols-2 gap-4'>
             {bills.map(bill => (
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