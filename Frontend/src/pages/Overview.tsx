import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Goals from '/src/assets/icons/Goals.svg?react'
import KpiStatsUp from '/src/assets/icons/Kpi-stats-up.svg?react'
import KpiStatsDown from '/src/assets/icons/Kpi-stats-down.svg?react'
import { getName, getProducts } from '../services/index'

function Overview() {
// const { t } = useTranslation("home");
const [products, setProducts] = useState<any>(null);

useEffect(() => {
    async function fetchData() {
        try {
            const productsData = await getProducts(3);
            setProducts(productsData);
        } catch (error) {
            console.error(error);
        }
    }

    fetchData();
}, []);

const [select,setSeleceted] = useState<any>(null);



  return (
    <div className='h-full w-full m-auto p-10'>
        {/* VISTA GENERAL */}
        <p className='font-semibold mb-2'>Overview</p>
        <div className='w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 content-between justify-between xl:gap-10 lg:gap-0 gap-5 mb-10'>
            <div className='border rounded-2xl border-[#0000001a] px-7 py-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between'>
                    <span className='flex items-center'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> Incomes 
                    </span>
                    <KpiStatsUp className='text-green-600 right-0'/></p>
                <p className='text-4xl text-green-600'>112.321€</p>
                <p className='text-[#040919b3]'>May 2026</p>
            </div>

            <div className='border rounded-2xl border-[#0000001a] px-7 py-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between'>
                    <span className='flex items-center'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> Outcomes 
                    </span>
                    <KpiStatsUp className='text-red-600 right-0'/></p>
                <p className='text-4xl text-red-600'>112.321€</p>
                <p className='text-[#040919b3]'>May 2026</p>
            </div>

            <div className='border rounded-2xl border-[#0000001a] px-7 py-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between'>
                    <span className='flex items-center'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> Cash flow 
                    </span>
                    <KpiStatsUp className='text-[#84A2EB] right-0'/></p>
                <p className='text-4xl text-[#84A2EB]'>112.321€</p>
                <p className='text-[#040919b3]'>May 2026</p>
            </div>

            <div className='border rounded-2xl border-[#0000001a] px-7 py-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between'>
                    <span className='flex items-center'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> Open Goals 
                    </span>
                    <KpiStatsUp className='text-green-600 right-0'/></p>
                <p className='text-4xl text-green-600'>2</p>
                <p className='text-[#040919b3]'>May 2026</p>
            </div>
        </div>

        <div id='toggle' className='relative bg-[#EFEFEF] w-fit px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a]'>
            <div id='cashflow' onClick={(e) => setSeleceted(e.currentTarget.id)} className='bg-white p-1 rounded-2xl'>Cash flow</div>
            <div id='savings' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'savings' ? 'bg-[#FFF] w-fit px-2 py-1 rounded-2xl' : ''} `} >Savings</div>
        </div>

        <p>Hola { getName() }</p>
        <p>Producto: {products?.title}</p>
    </div>
  )
}

export default Overview