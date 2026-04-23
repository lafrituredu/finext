import {  useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Goals from '/src/assets/icons/Goals.svg?react'
import KpiStatsUp from '/src/assets/icons/Kpi-stats-up.svg?react'
import KpiStatsDown from '/src/assets/icons/Kpi-stats-down.svg?react'
import Chart from "react-apexcharts";
import File from "/src/assets/icons/File.svg?react"
import { getTransactions, type Transaction } from '../api/TransactionService';


function Overview() {
const { t } = useTranslation("overview");

const [select,setSeleceted] = useState<any>('cashflow');
const [transactions, setTransactions] = useState<Transaction[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
getTransactions()
    .then(data => setTransactions(data))
    .catch(() => setError('Error al cargar las transacciones'))
    .finally(() => setLoading(false));
}, [])

const config = {
    options: {

    chart: {
        id: "basic-bar",
        toolbar: { show: false },
        zoom: { enabled: false }
    },
    markers: { size: 5 },
    xaxis: {
        categories: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August','September', 'October', 'November','December']
    }
    
    },
    series: [
    {
        name: t('incomes'),
        data: [30, 40, 45, 50, 49, 60, 70, 91]
    },
    {
        name: t('outcomes'),
        data: [40, 50, 55, 60, 59, 70, 70, 23]
    }
    ],
};

function calculateIncomes(){
    return transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.total_amount), 0)
        .toFixed(2)
}

function calculateIncomesIva(){
    return transactions
        .filter(t => t.type ==='income')
        .reduce((acc, t) => {
            const amount = Number(t.total_amount)
            const iva = Number(t.iva_percent)
            return acc + amount - (amount * (iva / 100))
        }, 0)
        .toFixed(2)
}

function calculateExpenses(){
    return transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.total_amount), 0)
        .toFixed(2)
}
function calculateExpensesIva(){
    return transactions
        .filter(t => t.type ==='expense')
        .reduce((acc, t) => {
            const amount = Number(t.total_amount)
            const iva = Number(t.iva_percent)
            return acc + amount - (amount * (iva / 100))
        }, 0)
        .toFixed(2)
}

function calculateCashflow(){
    const incomes = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.total_amount), 0)
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.total_amount), 0)
    return (incomes - expenses).toFixed(2)
}
  return (
    <div className='min-h-full w-full p-10 inter'>
        {/* VISTA GENERAL */}
        <p className='font-semibold mb-2 montserrat'>{t('overview')}</p>
        <div className='w-full grid xl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 content-between justify-between xl:gap-10 gap-5 mb-10'>
            <div className='border rounded-2xl border-[#0000001a] dark:border-[#1d2344] dark:bg-[#0F1732] px-7 py-5 flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                    <span className='flex items-center montserrat'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> {t('incomes')}
                    </span>
                    <KpiStatsUp className='text-green-600 right-0'/>
                </div>
                <div>
                    <p className='text-4xl text-green-600'>{calculateIncomes()}€</p>
                    <p className='text-xl text-green-500'>{calculateIncomesIva()}€</p>
                </div>
                <p className='text-[#040919b3] dark:text-[#D8E0F9]'>May 2026</p>
            </div>

            <div className='border rounded-2xl border-[#0000001a] dark:border-[#1d2344] dark:bg-[#0F1732] px-7 py-5 flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                    <span className='flex items-center montserrat'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> {t('outcomes')}
                    </span>
                    <KpiStatsDown className='text-red-600 right-0'/>
                </div>
                <div>
                    <p className='text-4xl text-red-600'>{calculateExpenses()}€</p>
                    <p className='text-xl text-red-500'>{calculateExpensesIva()}€</p>
                </div>
                <p className='text-[#040919b3] dark:text-[#D8E0F9]'>May 2026</p>
            </div>

            <div className='border rounded-2xl border-[#0000001a] dark:border-[#1d2344] dark:bg-[#0F1732] px-7 py-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between'>
                    <span className='flex items-center montserrat'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> {t('cash_flow')}
                    </span>
                    <KpiStatsUp className='text-[#84A2EB] right-0'/></p>
                <p className='text-4xl text-[#84A2EB]'>{calculateCashflow()}€</p>
                <p className='text-[#040919b3] dark:text-[#D8E0F9]'>May 2026</p>
            </div>

            <div className='border rounded-2xl border-[#0000001a] dark:border-[#1d2344] dark:bg-[#0F1732] px-7 py-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between'>
                    <span className='flex items-center montserrat'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> {t('open_goals')}
                    </span>
                    <KpiStatsUp className='text-green-600 right-0'/></p>
                <p className='text-4xl text-green-600'>0</p>
                <p className='text-[#040919b3] dark:text-[#D8E0F9]'>May 2026</p>
            </div>
        </div>

        <div id='toggle' className='relative bg-[#EFEFEF] dark:bg-[#0F1732] w-fit px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] mb-4 montserrat'>
            <div id='cashflow' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'cashflow' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>{t('cash_flow')}</div>
            <div id='savings' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'savings' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`} >{t('savings')}</div>
        </div>

        <div className='bg-[#F9F9FA] dark:bg-[#0F1732] px-7 py-5 rounded-2xl mb-10 border border-[#0000001a] dark:border-[#1d2344]'>
            <div id='cashflow_content' className={`${select == 'cashflow' ? 'visible' : 'hidden' }`}>
                <p className='montserrat'>{t('incomes_outcomes')}</p>
                <Chart
                options={config.options}
                series={config.series}
                type="line"
                width="100%"
                height={400}
                />
            </div>

            <div id='cashflow_content' className={`${select == 'savings' ? 'visible' : 'hidden' }`}>
                <p className='montserrat'>{t('savings')}</p>
                <p>Not yet!</p>
            </div>
        </div>

        {/* Financial goals + summary */}
        <div className='grid md:grid-cols-2 grid-cols-1 gap-10'>
            {/* FINANCIAL GOALS */}
            <div className='w-full bg-[#F9F9FA] px-7 py-5 rounded-2xl border border-[#0000001a] dark:bg-[#0F1732] dark:border-[#1d2344]'>
                <p className='flex items-center montserrat font-semibold gap-2 mb-3'><Goals className='size-6' /> {t('financial_goals')}</p>
                
                <div className='mb-8'>
                    <p className='flex justify-between text-[#7B7B7B] dark:text-[#D8E0F9] text-xl mb-1'>
                        <span>Goal 1</span>
                        <span>1400€ / 1800€</span>
                    </p>
                    <div className='relative w-full bg-[#D9D9D9] h-3 rounded-2xl overflow-hidden
                    after:bg-[#641895] after:w-10/12 after:h-full after:absolute after:bg-clip-border'></div>
                    <p className='text-green-600'>You need to save 200€/m. You’re doing great!</p>
                </div>

                <div className='mb-3'>
                    <p className='flex justify-between text-[#7B7B7B] dark:text-[#D8E0F9] text-xl mb-1'>
                        <span>Goal 1</span>
                        <span>1400€ / 1800€</span>
                    </p>
                    <div className='relative w-full bg-[#D9D9D9] h-3 rounded-2xl overflow-hidden
                    after:bg-[#641895] after:w-1/12 after:h-full after:absolute after:bg-clip-border'></div>
                    <p className='text-[#FF9D00]'>You need to save 375€/m. But your average cashflow is about 1100€/m.</p>
                </div>
            </div>

            {/* SUMMARY */}
            <div className='w-full bg-[#F9F9FA] h-fit px-7 py-5 rounded-2xl border border-[#0000001a] dark:bg-[#0F1732] dark:border-[#1d2344] dark:text-[#D8E0F9]'>
                <p className='flex items-center montserrat font-semibold gap-2 mb-3'><File className='size-6' /> {t('summary')}</p>
                
                {/* TOTAL INCOMES */}
                <p className='flex justify-between text-lg mb-2'>
                    <span className='text-[#7B7B7B] dark:text-[#D8E0F9]'>{t('total_incomes')}</span>
                    <span className='text-green-600'>1000€</span>
                </p>

                {/* TOTAL INCOMES */}
                <p className='flex justify-between text-lg mb-2'>
                    <span className='text-[#7B7B7B] dark:text-[#D8E0F9]'>{t('total_outcomes')}</span>
                    <span className='text-red-600'>500€</span>
                </p>

                <div className='w-full h-px mb-2 bg-[#0000001a] dark:bg-[#D8E0F9]'></div>
                
                {/* TOTAL INCOMES */}
                <p className='flex justify-between text-lg'>
                    <span className='text-[#7B7B7B] dark:text-[#D8E0F9]'>{t('cash_flow')}</span>
                    <span className='text-green-600'>500€</span>
                </p>

            </div>
        </div>
    </div>
  )
}

export default Overview