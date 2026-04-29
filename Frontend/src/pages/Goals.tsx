import React, { useEffect, useState } from 'react'

import { getGoals, getRecomendation, type Goal } from '../api/GoalService';
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'
import { deleteTransaction, getTransactions, type Transaction } from '../api/TransactionService'

function Goals() {
  const [goals,setGoals] = useState<Goal[]>();
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    getGoals()
    .then(value => setGoals(value))
    .catch(err => err)

    getTransactions()
      .then(data => setTransactions(data))
      .catch(() => setError('Error al cargar las transacciones'))
      .finally(() => setLoading(false));
  },[]);
  
  function calculateCashflow(){
    const incomes = transactions
        .filter(t => t.type === 'income' && new Date(t.date).getMonth() == new Date().getMonth())
        .reduce((acc, t) => acc + Number(t.total_amount), 0)
    const expenses = transactions
        .filter(t => t.type === 'expense' && new Date(t.date).getMonth() == new Date().getMonth())
        .reduce((acc, t) => acc + Number(t.total_amount), 0)
    return (incomes - expenses).toFixed(2)
  }

  return (
    <>
        <div className='p-10'>
         <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-6 mb-20'>
            <p className='mont_semibold text-4xl'>Goals</p>
            <button 
            onClick={(e) => console.log(getGoals())}
            className=" inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                Nueva categoria
              </span>
              <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                Crear
              </span>
            </button>
          </div>

          <div className='w-full grid grid-cols-2 gap-15'>
            {goals?.map( (goal,key) => 
            { const recomendation = getRecomendation(goal,parseInt(calculateCashflow()));
              const diffDays = Math.floor( (new Date(goal.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24) )
              const progress = (goal.current_amount / goal.target_amount * 100).toFixed(2);
              return (
                <div key={key} className='inter w-full border border-[#0000001a] rounded-2xl px-8 py-5 flex flex-col gap-4 dark:bg-dark-card'>
                  <p className='font-semibold montserrat flex justify-between'>{goal.name}<TrashcanIcon className='text-red-500' /> </p>
                  <div>
                    <p className='flex justify-between text-[#A1A1A1]'><span>{diffDays} días</span> <span>{goal.target_amount}€</span></p>
                    <div className='relative w-full bg-[#D9D9D9] h-3 rounded-2xl overflow-hidden'>
                      <div className="bg-[#00540C] h-full" style={{ width: `${progress}%` }} /> 
                    </div>
                  </div>

                  {recomendation == 1 && <div className='bg-[#98EE841a] p-2'><p>You’re <span className='text-green-600 font-semibold'>ahead of pace</span> and should reach your goal <b>{progress}%</b> ahead of schedule</p></div>}
                  {recomendation == -1 && <div className='bg-[#ee84841a] p-2'><p>You’re <span className='text-red-600 font-semibold'>ahead of pace</span> and should reach your goal <b>{progress}%</b> ahead of schedule</p></div>}
                  {recomendation == 0 && <div className='bg-[#98EE841a] p-2'><p>You’re <span className='text-orange-600 font-semibold'>ahead of pace</span> and should reach your goal <b>{progress}%</b> ahead of schedule</p></div>}
                    {/* <p>You’re <span className='text-green-600 font-semibold'>ahead of pace</span> and should reach your goal <b>{progress}%</b> ahead of schedule</p> */}

                  <div className='w-full h-px bg-slate-200' />

                  <button className='w-full p-2 bg-black text-white dark:bg-primary cursor-pointer hover:scale-[102%] transition rounded-lg'>Aportar</button>
                </div>
              )
            }
          
            )}
          </div>
        </div>
    </>
  )
}

export default Goals