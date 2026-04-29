import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import BillForm from "../components/materials/BillForm"
//dayjs -> Libreria de js utilizada para hacer format de dates
import { deleteTransaction, getTransactions, type Transaction } from '../api/TransactionService'

function Bills() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { t } = useTranslation("bills")
  const [select,setSelected] = useState<any>('total')
  const [selectFilter,setSelectedFilter] = useState('squares')
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)
  const [transactionToEdit,setTransactionToEdit] = useState<Transaction | null>(null)

  useEffect(() => {
    getTransactions()
      .then(data => setTransactions(data))
      .catch(() => setError('Error al cargar las transacciones'))
      .finally(() => setLoading(false));
  }, [showTransactionForm])

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

  function transactionWithIVA(amount:number, iva:any){
    if (amount < 0) throw new Error("Amount must be positive value");
    let i = amount * (iva / 100);
    const total = amount - i
    return total
  }

  //Filtrar transacciones para recoger "income" o "expense", o en caso de no ser ninguna de las 2 recoger todas.
  const filteredTransactions = transactions.filter(t => {
    if (select === 'incomes') return t.type === 'income'
    if (select === 'expenses') return t.type === 'expense'
    return true //'total'
  })

  const displayDataSquares = () => {
    return (<>
    </>);
  }

  const displayDataList = () => {
    return (<>
    </>);
  }

  {/* PARA MOSTRAR LISTA O SQUARESD   */}
  {/* selectFilter == 'list'? displayDataList() : displayDataSquares() */}
  
  {/* TOGGLE PARA SETEAR EL FILTRO */}
  {/*
  <div id='toggleFilter' className='relative bg-[#EFEFEF] dark:bg-dark-card w-fit px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] mb-4 montserrat'>
    <div id='squares'  onClick={(e) => setSelectedFilter(e.currentTarget.id)} className={`${selectFilter == 'squares' && 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-full'} p-2 transition-all ease-in-out duration-200 cursor-pointer`}>
      <Squares className='size-5' />
    </div>
    <div id='list' onClick={(e) => setSelectedFilter(e.currentTarget.id)} className={`${selectFilter == 'list' && 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-full'} p-2  transition-all ease-in-out duration-200 cursor-pointer`}>
      <List className='size-6' />
    </div>
  </div>
  */}
  return (
    <>
    {showTransactionForm && <BillForm close={() => setShowTransactionForm(false)} billEdit={transactionToEdit!}/>}
    <div className='p-10'>
      <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-4'>
        <h2 className='mont_semibold text-4xl'>{t('bills')}</h2>
        <button 
        onClick={() => {setShowTransactionForm(true);setTransactionToEdit(null);}}
        className=" inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
            {t('new_bill')}
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            {t('create')}
          </span>
        </button>
      </div>
    </div>
    </>
  )
}

export default Bills
