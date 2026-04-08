import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Goals from '/src/assets/icons/Goals.svg?react'
import KpiStatsUp from '/src/assets/icons/Kpi-stats-up.svg?react'
import KpiStatsDown from '/src/assets/icons/Kpi-stats-down.svg?react'
import { getName, getProducts } from '../services/index'
import Chart from "react-apexcharts";

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

const [select,setSeleceted] = useState<any>('cashflow');

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
          name: 'Incomes',
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        },
        {
          name: 'Outcomes',
          data: [40, 50, 55, 60, 59, 70, 70, 23]
        }
      ],
    };

  return (
    <div className='h-full w-full m-auto p-10 inter'>
        {/* VISTA GENERAL */}
        <p className='font-semibold mb-2 montserrat'>Overview</p>
        <div className='w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 content-between justify-between xl:gap-10 lg:gap-0 gap-5 mb-10'>
            <div className='border rounded-2xl border-[#0000001a] px-7 py-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between'>
                    <span className='flex items-center montserrat'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> Incomes 
                    </span>
                    <KpiStatsUp className='text-green-600 right-0'/></p>
                    <p className='text-4xl text-green-600'>112.321€</p>
                <p className='text-[#040919b3]'>May 2026</p>
            </div>

            <div className='border rounded-2xl border-[#0000001a] px-7 py-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between'>
                    <span className='flex items-center montserrat'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> Outcomes 
                    </span>
                    <KpiStatsUp className='text-red-600 right-0'/></p>
                <p className='text-4xl text-red-600'>112.321€</p>
                <p className='text-[#040919b3]'>May 2026</p>
            </div>

            <div className='border rounded-2xl border-[#0000001a] px-7 py-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between'>
                    <span className='flex items-center montserrat'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> Cash flow 
                    </span>
                    <KpiStatsUp className='text-[#84A2EB] right-0'/></p>
                <p className='text-4xl text-[#84A2EB]'>112.321€</p>
                <p className='text-[#040919b3]'>May 2026</p>
            </div>

            <div className='border rounded-2xl border-[#0000001a] px-7 py-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between'>
                    <span className='flex items-center montserrat'>
                        <span className='bg-[#84A2EB66] p-1 rounded-full me-2'><Goals /></span> Open Goals 
                    </span>
                    <KpiStatsUp className='text-green-600 right-0'/></p>
                <p className='text-4xl text-green-600'>2</p>
                <p className='text-[#040919b3]'>May 2026</p>
            </div>
        </div>

        <div id='toggle' className='relative bg-[#EFEFEF] w-fit px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] mb-4 montserrat'>
            <div id='cashflow' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'cashflow' ? 'bg-[#FFF] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>Cash flow</div>
            <div id='savings' onClick={(e) => setSeleceted(e.currentTarget.id)} className={`${select == 'savings' ? 'bg-[#FFF] w-fit  rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`} >Savings</div>
        </div>

        <div className='bg-[#F9F9FA] px-7 py-5 rounded-2xl mb-3'>
            <p className='montserrat'>Incomes & Outcomes</p>
            <Chart
              options={config.options}
              series={config.series}
              type="line"
              width="100%"
              height={400}
            />
        </div>

        <div className='grid grid-cols-2 gap-2'>
            <div className='w-full bg-[#F9F9FA] px-7 py-5 rounded-2xl border border-[#0000001a]'>
                <p className='flex items-center'><Goals /> Financial Goals</p>
            </div>
            <div className='w-full bg-[#F9F9FA]  px-7 py-5 rounded-2xl border border-[#0000001a]'>
                <p>asdsa</p>
            </div>
        </div>
        
        
        <p>Hola { getName() }</p>
        <p>Producto: {products?.title}</p>

    </div>
  )
}

export default Overview