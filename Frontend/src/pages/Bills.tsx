import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import BillForm from "../components/materials/BillForm"
import { getBills, deleteBill, type Bill } from '../api/BillService'
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'
import PencilIcon from '/src/assets/icons/Pencil.svg?react'
import { getTransactionsByBill } from '../api/TransactionService'

function Bills() {
  const [bills, setBills] = useState<Bill[]>([])
  const [billsPaid, setBillsPaid] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBillForm, setShowBillForm] = useState(false)
  const [billToEdit, setBillToEdit] = useState<Bill | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null)

  const { t } = useTranslation("bills")

  const fetchBillTransactions = async (bills: Bill[]) => {
    const results: Record<number, number> = {}
    await Promise.all(
      bills.map(async (bill) => {
        try {
          const transactions = await getTransactionsByBill(bill.id)
          const total = transactions.reduce((sum, t) => sum + Number(t.total_amount), 0)
          results[bill.id] = total
        } catch {
          results[bill.id] = 0
        }
      })
    )
    setBillsPaid(results)
  }

  const fetchBills = () => {
    getBills()
      .then(data => {
        setBills(data)
        fetchBillTransactions(data)
      })
      .catch(() => setError('Error al cargar las facturas'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBills()
  }, [showBillForm])

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
      {showBillForm && (<BillForm close={() => setShowBillForm(false)} billEdit={billToEdit ?? undefined}/>)}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        )}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        {!loading && !error && bills.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm">No hay facturas.</p>
        )}

        {/* Cards */}
        {!loading && !error && bills.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bills.map(bill => (
              <div
                key={bill.id}
                className="
                  bg-background dark:bg-dark-background
                  rounded-2xl shadow-sm
                  ring-1 ring-black/5 dark:ring-white/10
                  p-5 flex flex-col gap-2">

                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <div className='flex flex-row items-center gap-2'>
                      {/* Si falta por pagar ping de aviso */}
                      {isPending(bill) ? (
                        <div className='flex'>
                          <div className='w-2.5 h-2.5 bg-indigo-500 rounded-full'></div>
                          <div className='w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping absolute'></div>
                        </div>
                      ) : null}
                      {/* Si se ha pagado de mas ping de aviso */}
                      {isHigher(bill) ? (
                        <div className='flex'>
                          <div className='w-2.5 h-2.5 bg-red-500 rounded-full'></div>
                          <div className='w-2.5 h-2.5 bg-red-500 rounded-full animate-ping absolute'></div>
                        </div>
                      ) : null}
                      <span className="font-semibold text-gray-800 dark:text-gray-100 text-base leading-tight">
                        {bill.name}
                      </span>
                    </div>
                    {bill.client && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {bill.client}
                      </span>
                    )}
                  </div>
                  <div className='flex flex-row justify-center items-center gap-2'>
                    <span className={`
                      text-xs font-semibold px-2.5 py-1 rounded-full shrink-0
                      ${bill.type === 'recibida'
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {bill.type === 'recibida' ? 'Recibida' : 'Emitida'}
                    </span>
                    <PencilIcon className='cursor-pointer text-gray-800 hover:scale-110 transition-all ease-in-out dark:text-dark-text'
                      onClick={() => { setBillToEdit(bill); setShowBillForm(true) }} />
                    <TrashcanIcon className='cursor-pointer text-red-600 hover:scale-104 transition-all ease-in-out hover:bg-red-200 hover:rotate-15 rounded-full'
                      onClick={() => { setBillToDelete(bill); setShowConfirmation(true) }} />
                  </div>
                </div>


                {/* Amount */}
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${bill.type === 'recibida' ? 'text-emerald-500' : 'text-red-400'}`}>
                    {bill.type === 'emitida' && '-'}{Number(bill.total_amount).toFixed(2)} €
                  </span>
                </div>
                <div>
                  {bill.iva_percent > 0 && (
                    <div className='flex flex-row gap-2 items-baseline'>
                      <span className="text-md text-emerald-300">
                        {Number(bill.total_amount).toFixed(2)} €
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        IVA {bill.iva_percent}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs">
                  <span>{new Date(bill.date).toLocaleDateString('es-ES')}</span>
                  {bill.category && (
                    <span className="px-3 py-0.5 rounded-full"
                      style={{ backgroundColor: bill.category.color.concat(`55`), color: `${bill.category?.color}` }}>
                      {bill.category.name}
                    </span>
                  )}
                </div>
                <div className='flex w-full justify-center items-center text-xs'>
                  {isPending(bill) ? (
                    <div className='text-indigo-300'>
                      <p>Faltan plazos por añadir</p>
                    </div>
                  ) : null}
                  {isHigher(bill) ? (
                    <div className='text-red-300'>
                      <p>Se ha pagado mas del importe introducido</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Bills