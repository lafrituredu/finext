import React from 'react'
import { useTransactions, type TransactionsContextType } from '../contexts/TransactionContext';
import { useTranslation } from 'react-i18next';
import Chart from "react-apexcharts";

function ReportPage({monthCounter,types,categories}:{monthCounter:number,types:string,categories:string}) {
    const { t } = useTranslation("overview");
    const { t: tUtils } = useTranslation("utils");
    const {transactions} = useTransactions() as TransactionsContextType;
    let filtered:any[] = [];

transactions.forEach( element => {
    let date:number = new Date(element.date).getMonth();
    if (new Date().getFullYear() != new Date(element.date).getFullYear()) {
        return;
    }
    if (element.type == 'income') {
        let total:number = filtered[date]?.incomes == undefined ? Number(element.total_amount) : Number(filtered[date].incomes) + Number(element.total_amount);
        filtered[date] = {incomes: total, expenses: filtered[date]?.expenses}
    }else{
        let total:number = filtered[date]?.expenses == undefined ? Number(element.total_amount) : Number(filtered[date].expenses) + Number(element.total_amount);
        filtered[date] = {incomes: filtered[date]?.incomes , expenses: total}
    }
    
})

let months = [];
for (let i = 0; i <= (monthCounter-1); i++) {
    let _months = ['january','february','march','april','may','june','july','august','september','october','november','december']
    let month = `months.${_months[i]}`
    let obj = {
        name: tUtils(month),
        incomes: filtered[i]?.incomes ?? 0,
        expense: filtered[i]?.expenses ?? 0,
    }
    
    months.push(obj);
}

console.log(months)
const getDynamicSeries = () => {
    switch (types) {
        case 'both':
            return [
                { name: t('incomes'), data: months.map(m => m.incomes),color: '#00FF00'},
                { name: t('outcomes'), data: months.map(m => m.expense),color: '#FF0000'}
            ]
        case 'incomes':
            return [
                { name: t('incomes'), data: months.map(m => m.incomes),color: '#00FF00'}
            ]
        case 'outcomes':
            return [
                { name: t('otucomes'), data: months.map(m => m.expense), color: '#FF0000'}
            ]
        default:
            return [
                { name: t('incomes'), data: months.map(m => m.incomes),color: '#00FF00'},
                { name: t('outcomes'), data: months.map(m => m.expense),color: '#FF0000'}
            ]
    }
}
const config = {
    options: {

    chart: {
        id: "basic-bar",
        toolbar: { show: false },
        zoom: { enabled: false }
    },
    markers: { size: 5 },
    xaxis: {
        categories: months.map(m => m.name)
    }
    
    },
    series: getDynamicSeries(),
};
  return (
    <div id='report-content' className='py-20 px-25 relative flex flex-col gap-10'>
        <div>
            <p className='flex justify-between montserrat text-xl mb-2'> <span>FULLNAME</span> <span>{new Date().toLocaleString()}</span> </p>
            <div className='w-full h-px bg-black inter mb-10' />
        </div>

        <div className='inter mb-5 flex flex-col gap-5'>
            <p className='text-5xl mb-3'>Resumen general</p>
            <ul>
                <li className='text-3xl'>Total ingresos: 0000€</li>
                <li className='text-3xl'>Total ingresos: 0000€</li>
                <li className='text-3xl'>Total ingresos: 0000€</li>
                <li className='text-3xl'>Total ingresos: 0000€</li>
            </ul>
        </div>

        <div className='inter mb-5 flex flex-col gap-5'>
            <p className='text-5xl mb-3'>Resumen mensual</p>
            <table>
                <thead>
                    <tr className='*:text-start *:text-3xl'>
                        <th>Mes</th>
                        <th>Ingresos</th>
                        <th>Gastos</th>
                        <th>Flujo</th>
                    </tr>
                </thead>
                <tbody>
                    {months.map( month => 
                        <tr className='text-3xl *:pt-2'>
                            <td>{month.name}</td>
                            <td>{month.incomes}€</td>
                            <td>{month.expense}€</td>
                            <td>{month.incomes - month.expense}€</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        <p className='text-5xl mb-3'>Grafica General</p>
        <Chart
        options={config.options}
        series={config.series}
        type="line"
        width="100%"
        height={400}
        />
        <div className='absolute bottom-10'>
        <p>Este informe ha sido generado automáticamente por Finext.</p>
        <p>Los datos fiscales son estimaciones orientativas. Consulta con un asesor profesional.</p>
        </div>

    </div>
  )
  
}

export default ReportPage