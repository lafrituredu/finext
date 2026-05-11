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
        let total:number = filtered[date]?.incomes == undefined ? element.total_amount : Number(filtered[date].incomes) + Number(element.total_amount);
        filtered[date] = {incomes: total, expenses: filtered[date]?.expenses}
    }else{
        let total:number = filtered[date]?.expenses == undefined ? element.total_amount : Number(filtered[date].expenses) + Number(element.total_amount);
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
    <div id='report-content' className='p-10'>
        <p className='flex justify-between montserrat text-sm mb-2'> <span>FULLNAME</span> <span>{new Date().toLocaleString()}</span> </p>
        <div className='w-full h-px inter mb-10' />
        <p className='text-xl'>Reporte de los {monthCounter} meses del año, {types == 'both' ? 'De ingresos y gastos' : `de solo ${types}`}</p>
        <Chart
        options={config.options}
        series={config.series}
        type="line"
        width="100%"
        height={400}
        />
    </div>
  )
  
}

export default ReportPage