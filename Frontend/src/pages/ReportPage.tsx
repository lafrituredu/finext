import React from 'react'
import { useTransactions, type TransactionsContextType } from '../contexts/TransactionContext';
import { useTranslation } from 'react-i18next';
import Chart from "react-apexcharts";
import type { ApexOptions } from 'apexcharts';

function ReportPage({monthCounter,types,categories}:{monthCounter:number,types:string,categories:string}) {
    const { t } = useTranslation("overview");
    const { t: tUtils } = useTranslation("utils");
    const { transactions } = useTransactions() as TransactionsContextType;
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


let dataPerCategories = new Map<string,any>();
transactions.forEach( t => {
    let name = t.category?.name ?? "no category";
    let obj = dataPerCategories.get(name) ?? {incomes: 0,expenses: 0} ;
    if (t.type == 'income') {
        obj.incomes = Number(obj.incomes)+Number(t.total_amount);
        obj.expenses = obj.expenses;
    }else{
        obj.incomes = obj.incomes;
        obj.expenses = Number(obj.expenses)+Number(t.total_amount);
    }
    dataPerCategories.set(name,obj);
});

console.log(dataPerCategories)
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
const config: { options: ApexOptions; series: any } = {
  options: {
    chart: {
      id: "basic-bar",
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "Inter, sans-serif"
    },

    stroke: {
      curve: "smooth",
      width: 3
    },

    markers: {
      size: 4,
      hover: {
        size: 6
      }
    },

    xaxis: {
      categories: months.map(m => m.name)
    },

    tooltip: {
      theme: "light"
    }
  },

  series: getDynamicSeries()
};
let seriesPieIncomes = Array.from(dataPerCategories.values()).map(el => el.incomes);
let seriesPieOutcomes = Array.from(dataPerCategories.values()).map(el => el.expenses);

let total_incomes = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() < monthCounter && new Date(t.date).getFullYear() == new Date().getFullYear())
    .reduce((acc, t) => acc + Number(t.total_amount), 0)
    .toFixed(2)

let total_expenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() < monthCounter && new Date(t.date).getFullYear() == new Date().getFullYear())
    .reduce((acc, t) => acc + Number(t.total_amount), 0)
    .toFixed(2)

let cashflow = Number(total_incomes) - Number(total_expenses);

const pieConfig = {
  options: {
    chart: { toolbar: { show: false } },

    labels: Array.from(dataPerCategories.keys()),

    // legend: {
    //   position: "bottom"
    // },

    dataLabels: {
      enabled: true
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  }
};
  return (
    <div id='report-content' className='py-20 px-25 relative flex flex-col gap-10 inter *:inter'>
        <div>
            <p className='flex justify-between montserrat text-xl mb-2'> <span>FULLNAME</span> <span>{new Date().toLocaleString()}</span> </p>
            <div className='w-full h-px bg-black inter mb-' />
        </div>

        <div className='inter mb-5 flex flex-col gap-2'>
            <p className='text-3xl mb-3'>Resumen general</p>
            <ul>
                <li className='text-2xl'>Total ingresos: {total_incomes}€</li>
                <li className='text-2xl'>Total Gastos: {total_expenses}€</li>
                <li className='text-2xl'>Flujo de caja: {cashflow}€</li>
            </ul>
        </div>

        <div className='inter mb-5 flex flex-col gap-2'>
            <p className='text-3xl mb-3'>Resumen mensual</p>
            <table>
                <thead>
                    <tr className='*:text-start *:text-2xl'>
                        <th>Mes</th>
                        <th>Ingresos</th>
                        <th>Gastos</th>
                        <th>Flujo</th>
                    </tr>
                </thead>
                <tbody>
                    {months.map( (month,key) => 
                        <tr key={key} className='text-2xl *:pt-1'>
                            <td>{month.name}</td>
                            <td>{month.incomes}€</td>
                            <td>{month.expense}€</td>
                            <td>{month.incomes - month.expense}€</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        <p className='text-3xl mb-3'>Gráfica General (ingresos y gastos) </p>
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

        {categories == 'all' &&
        <>
        <div className='inter mb-5 flex flex-col gap-2'>
            <p className='text-3xl mb-3'>Resumen por categorias</p>

        <table>
            <thead>
                <tr className='*:text-start text-2xl'>
                    <th>Categoria</th>
                    <th>Ingresos</th>
                    <th>Gastos</th>
                </tr>
            </thead>
            <tbody>
                {Array.from(dataPerCategories.entries()).map(([key, value]) => (
                    <tr key={key} className='text-2xl *:pt-2'>
                        <td>{key}</td>
                        <td>{value.incomes}€</td>
                        <td>{value.expenses}€</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>

        <div className='grid grid-cols-2'>
            <Chart
            options={pieConfig.options}
            series={seriesPieIncomes}
            type="pie"
            width="100%"
            height={250}
            />

            <Chart
            options={pieConfig.options}
            series={seriesPieOutcomes}
            type="pie"
            width="100%"
            height={250}
            />
        </div>
        </>}

    </div>
  )
  
}

export default ReportPage