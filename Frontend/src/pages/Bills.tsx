import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import BillForm from "../components/materials/BillForm"
import { deleteBill, type Bill } from '../api/BillService'
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'
import PencilIcon from '/src/assets/icons/Pencil.svg?react'
import FileIcon from '/src/assets/icons/File.svg?react'
import ReceiptIcon from '/src/assets/icons/Receipt.svg?react'
import ProfileIcon from '/src/assets/icons/Profile-icon.svg?react'
import CardIcon from '/src/assets/icons/Credit-card.svg?react'
import CoinIcon from '/src/assets/icons/Coin.svg?react'
import BankIcon from '/src/assets/icons/Bank.svg?react'
import InfoIcon from '/src/assets/icons/Info.svg?react'
import CalendarIcon from '/src/assets/icons/Calendar.svg?react'
import MoveUpIcon from '/src/assets/icons/Move-up.svg?react'

import { getTransactionsByBill } from '../api/TransactionService'
import { useBills, type BillsContextType } from '../contexts/BillContext'

function Bills() {
  const { bills, setBills, refetchBills } = useBills() as BillsContextType
  const [billsPaid, setBillsPaid] = useState<Record<number, number | null>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showBillForm, setShowBillForm] = useState(false)
  const [billToEdit, setBillToEdit] = useState<Bill | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null)

  const { t } = useTranslation("bills")

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

  const isPending = (bill: Bill): boolean => {
    const paid = billsPaid[bill.id] ?? null
    if (paid === null) return false
    return paid < Number(bill.total_amount)
  }
  const isHigher = (bill: Bill): boolean => {
    const paid = billsPaid[bill.id] ?? null
    if (paid === null) return false
    return paid > Number(bill.total_amount)
  }

  function billWithIVA(amount: number, iva: any) {
    if (amount < 0) throw new Error("Amount must be positive value");
    let i = amount * (iva / 100);
    const total = amount - i
    return total
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteBill(id)
      setBills(prev => prev.filter(b => b.id !== id))
      setShowConfirmation(false)
      setBillToDelete(null)
    } catch (error: any) {
      setError('Error al eliminar la factura')
    }
  }

  return (
    <>
      {showBillForm && (<BillForm close={() => setShowBillForm(false)} billEdit={billToEdit ?? undefined} />)}

      {/* --- Confirmacion eliminar PROVISIONAL --- */}
      {showConfirmation && billToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 flex items-center justify-center p-4 inter">
          <div className="bg-background dark:bg-dark-background rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 p-6 flex flex-col gap-4 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">¿Eliminar factura?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Se eliminará <span className="font-semibold">{billToDelete.name}</span> y todas sus transacciones asociadas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(billToDelete.id)}
                className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-xl hover:brightness-110 transition-all cursor-pointer">
                Eliminar
              </button>
              <button
                onClick={() => { setShowConfirmation(false); setBillToDelete(null) }}
                className="flex-1 ring-1 ring-gray-200 dark:ring-gray-700 text-gray-600 dark:text-gray-300 font-semibold py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* -------------------------------------------------- */}
      <div className='p-10 inter'>
        {/* Header */}
        <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-4 mb-8'>
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
              <div key={bill.id}
                className="flex flex-col bg-background dark:bg-dark-card rounded-2xl ring-1 
                ring-gray-300 p-5 gap-2 inter">
                  <div className='flex flex-row w-full justify-between items-center gap-2'>
                    <div className='flex gap-2 items-center'>
                      <ReceiptIcon className='text-gray-700'/>
                      <span className='text-gray-700 font-semibold text-2xl'>{bill.name}</span>
                    </div>
                    <div className='flex flex-row gap-4 items-center'>
                      {bill.type == 'emitida' ? 
                      (<div className='bg-green-300 rounded-full px-3 text-sm text-green-800'>Emitida</div>):
                      (<div className='bg-red-300 rounded-full px-3 text-sm text-red-800'>Recibida</div>)}
                      <div className='flex flex-row items-center gap-2'>
                      <PencilIcon className='cursor-pointer text-gray-800 hover:scale-110 transition-all ease-in-out dark:text-dark-text'
                        onClick={() => { setBillToEdit(bill); setShowBillForm(true) }} />
                      <TrashcanIcon className='cursor-pointer text-red-600 hover:scale-104 transition-all ease-in-out hover:bg-red-200 hover:rotate-15 rounded-full'
                        onClick={() => { setBillToDelete(bill); setShowConfirmation(true) }} />
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-2 py-8'>
                    <div className='flex flex-col'>
                      <div className='flex flex-row items-center gap-1'>
                        <CalendarIcon className='text-gray-500 w-4 h-4'/>
                        <span className='text-gray-500 text-sm'>Date</span>
                      </div>
                      <span className='text-gray-800 text-md pl-1'>{bill.date}</span>
                    </div>
                    <div className='flex flex-col'>
                      <div className='flex flex-row items-center gap-1'>
                        <span className='text-gray-500 text-sm'>% IVA</span>
                      </div>
                      <span className='text-gray-800 text-md pl-1'>{bill.iva_percent}</span>
                    </div>
                    {bill.plazos != null && (
                    <div className='flex flex-col'>
                      <div className='flex flex-row items-center gap-1'>
                        <MoveUpIcon className='text-gray-500 w-4 h-4'/>
                        <span className='text-gray-500 text-sm'>Plazos</span>
                      </div>
                      <span className='text-gray-800 text-md pl-1'>{bill.plazos} {bill.plazos > 1 ? "Plazos" : "Plazo"}</span>
                    </div>
                    )}
                    {bill.client != null && (
                    <div className='flex flex-col'>
                      <div className='flex flex-row items-center gap-1'>
                        <ProfileIcon className='text-gray-500 w-4 h-4'/>
                        <span className='text-gray-500 text-sm'>Client</span>
                      </div>
                      <span className='text-gray-800 text-md pl-1'>{bill.client}</span>
                    </div>
                    )}
                  </div>
                  <div className='flex flex-row bg-gray-100 w-full rounded-sm py-1 px-4 gap-2 ring-1 ring-gray-200'>
                    <InfoIcon className='text-gray-500 w-5 h-5'/>
                    <span className='text-gray-500 text-sm truncate'>{bill.description}</span>
                  </div>
                  <hr className="border-t border-gray-300 my-4"></hr>
                  <div className='flex flex-row justify-between items-end'>
                    <div className='flex flex-col'>
                      <span className='text-gray-500 text-sm'>Base Imponible {Number(billWithIVA(bill.total_amount, bill.iva_percent))} €</span>
                      <span className='text-accent text-3xl'>{bill.total_amount}€</span>
                    </div>
                    <div className='flex flex-col items-end'>
                      <div className='ring-1 ring-gray-300 rounded-md px-2 w-fit'>
                        {bill.payment_method == 'card' && (<div className='flex flex-row gap-2 text-gray-600 items-center'><CardIcon className='w-5 h-5'/><span> Credit card</span></div>)}
                        {bill.payment_method == 'cash' && (<div className='flex flex-row gap-2 text-gray-600 items-center'><CoinIcon className='w-5 h-5'/><span> Cash</span></div>)}
                        {bill.payment_method == 'transfer' && (<div className='flex flex-row gap-2 text-gray-600 items-center'><BankIcon className='w-5 h-5'/><span> Bank transfer</span></div>)}
                      </div>
                      <div className='flex w-full justify-start items-center text-xs select-none pt-2 gap-2'>
                        {isPending(bill) ? (
                        <div className="cursor-pointer flex flex-row items-center gap-2" onClick={() => { setBillToEdit(bill); setShowBillForm(true) }}>
                          <div className='relative w-2.5 h-2.5 bg-indigo-500 rounded-full'>
                            <div className='w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping absolute'></div>
                          </div>
                          <div className='text-indigo-300 hover:text-indigo-500 transition-colors ease-in-out duration-200'>
                            <p>Faltan plazos por añadir</p>
                          </div></div>
                        ) : null}
                        {isHigher(bill) ? (
                        <div className="cursor-pointer flex flex-row items-center gap-2" onClick={() => { setBillToEdit(bill); setShowBillForm(true) }}>
                          <div className='relative w-2.5 h-2.5 bg-red-500 rounded-full'>
                            <div className='w-2.5 h-2.5 bg-red-500 rounded-full animate-ping absolute'></div>
                          </div>
                          <div className='text-red-300 hover:text-red-500 transition-colors ease-in-out duration-200'>
                            <p>Se ha pagado mas del importe introducido</p>
                          </div></div>
                        ) : null}
                      </div>
                    </div>
                  </div>
              </div>
             ))}
          </div>
        </>
        )}
      </div>
    </>
  )
}

export default Bills