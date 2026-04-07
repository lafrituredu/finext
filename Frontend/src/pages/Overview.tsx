import React from 'react'
import { useTranslation } from 'react-i18next';
import Goals from '/src/assets/icons/Goals.svg?react'
import KpiStatsUp from '/src/assets/icons/Kpi-stats-up.svg?react'
import KpiStatsDown from '/src/assets/icons/Kpi-stats-down.svg?react'

function Overview() {
const { t } = useTranslation("home");
  return (
    <div className='h-full w-full m-auto p-10'>
        {/* VISTA GENERAL */}
        <p className='font-semibold mb-2'>Overview</p>
        <div className='w-full grid grid-cols-4 content-between justify-between gap-20 mb-10'>
            <div className='border rounded-2xl border-[#0000001a] px-7 py-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between'>
                    <span className='flex items-center'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> Incomes 
                    </span>
                    <KpiStatsUp className='text-green-600 right-0'/></p>
                <p className='text-4xl text-green-600'>112321€</p>
                <p className='text-[#040919b3]'>May 2026</p>
            </div>
            <div>Hola1</div>
            <div>Hola1</div>
            <div>Hola1</div>
        </div>
    </div>
  )
}

export default Overview