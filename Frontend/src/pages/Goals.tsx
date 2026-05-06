import React, { useEffect, useState } from 'react'

import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'
import GoalIcon from '/src/assets/icons/Goals.svg?react'
import PencilIcon from '/src/assets/icons/Pencil.svg?react'

import { getGoals, getRecomendation, destroyGoal , type Goal } from '../api/GoalService';
import { deleteTransaction, getTransactions, type Transaction } from '../api/TransactionService'
import  { GoalAmountForm } from "../components/materials/GoalAmountForm"
import  { GoalForm } from "../components/materials/GoalForm"
import Confirmation from '../components/materials/Confirmation';
import { useGoals, type GoalsContextType } from '../contexts/GoalContext';
import { useTransactions, type TransactionsContextType } from '../contexts/TransactionContext';
import { useTranslation } from 'react-i18next';

function Goals() {
  const { goals, setGoals, refetchGoals } = useGoals() as GoalsContextType;
  const { transactions, setTransactions, refetchTransactions } = useTransactions() as TransactionsContextType;
  const [goalEdit,setGoalEdit] = useState<Goal>();
  const [goalDelete,setGoalDelete] = useState<Goal>();
  // const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const [showGoalAmountForm, setShowGoalAmountForm] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const { t } = useTranslation("goals");

  useEffect(() => {
    // getGoals()
    // .then(value => setGoals(value))
    // .catch(err => err)

    // getTransactions()
    //   .then(data => setTransactions(data))
    //   .catch(() => setError('Error al cargar las transacciones'))
    //   .finally(() => setLoading(false));
    refetchGoals()
    refetchTransactions()
  },[showGoalAmountForm,goalDelete,showGoalForm]);
  
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
            <p className='mont_semibold text-4xl'>{t('title')}</p>
            <button 
            onClick={(e) => setShowGoalForm(true)}
            className=" inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                {t('newGoal')}
              </span>
              <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                {t('create')}
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
                  <p className='font-semibold montserrat flex justify-between'>{goal.name}
                    <span className='flex gap-1 items-center'>
                      <PencilIcon className='cursor-pointer text-gray-800 hover:scale-110 transition-all ease-in-out dark:text-dark-text' onClick={() => {setShowGoalForm(true);setGoalEdit(goal)}} />
                      <TrashcanIcon onClick={() => setGoalDelete(goal)} className='text-red-400 cursor-pointer hover:rotate-12 transition-all hover:bg-red-100 dark:hover:bg-red-300 dark:text-red-400 dark:hover:text-red-500 rounded-xl' />
                    </span>
                  </p>
                  <div>
                    <p className='flex justify-between text-[#A1A1A1]'><span>{diffDays} {t('days')}</span> <span>{goal.current_amount}€ / {goal.target_amount}€</span></p>
                    <div className='relative w-full bg-[#D9D9D9] h-3 rounded-2xl overflow-hidden'>
                      <div className="bg-[#00540C] h-full" style={{ width: `${progress}%` }} /> 
                    </div>
                  </div>

                  <div className={`${recomendation.bg} p-2`}>
                    <p>{recomendation.message}</p>
                  </div>
                    {/* <p>You’re <span className='text-green-600 font-semibold'>ahead of pace</span> and should reach your goal <b>{progress}%</b> ahead of schedule</p> */}

                  <div className='w-full h-px bg-slate-200' />
                  <button  disabled={goal.completed == 1} onClick={() => {setGoalEdit(goal);setShowGoalAmountForm(true)} } className='w-full p-2 bg-black text-white dark:bg-primary cursor-pointer hover:scale-[102%] transition rounded-lg disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed disabled:hover:scale-100'>{t('contribute')}</button>
                </div>
              )
            }
          
            )}

          </div>
          
          {goals.length == 0 &&
            <div className='flex flex-col justify-center items-center inter pt-40'>
              <GoalIcon className='w-24 h-24' />
              <p className='text-xl'>No {t('goal')}</p>
            </div>
          }

        </div>
        {showGoalAmountForm && <GoalAmountForm close={() => {setShowGoalAmountForm(false);setGoalEdit(undefined)}} goalEdit={goalEdit}/> }
        {goalDelete !== undefined && (
        <Confirmation
          Icon={TrashcanIcon}
          close={() => setGoalDelete(undefined)}
          onConfirm={() => {destroyGoal(goalDelete!);setGoalDelete(undefined)}}>
          {t('confirm.deleteMessage')} <span className='font-bold'>{goalDelete?.name}</span>?
        </Confirmation>)}
        {showGoalForm && goalEdit != null &&  <GoalForm close={() => {setShowGoalForm(false);setGoalEdit(undefined)} } goalEdit={goalEdit} />}
        {showGoalForm && goalEdit == null && <GoalForm close={() => setShowGoalForm(false)}/>}
    </>
  )
}

export default Goals