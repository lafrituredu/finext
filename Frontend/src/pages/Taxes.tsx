import React, { useEffect, useState } from 'react'
import { useBills, type BillsContextType } from '../contexts/BillContext';
import { getCurrentUser, type UserProfile } from '../api/AuthServices'

function Taxes() {
    const { bills, setBills, refetchBills } = useBills() as BillsContextType;
    const [quarter,setQuarter] = useState(1);
    const [incomes, setIncomes] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [collectedVat, setCollectedVat] = useState(0);
    const [inputVat, setInputVat] = useState(0);
    const [irpf, setIrpf] = useState<any>();
    
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setQuarter(Number(e.currentTarget.value))
        setIncomes(0);
        setCollectedVat(0);
        setExpenses(0);
        setInputVat(0);
    }

    function getCuota(cuota:number = 300){
        let months = 0;
        months = 3;
        if (quarter === 0) {
            months = 12;
        }
        return months*cuota
    }
    
    useEffect(() => {
        let min = (quarter-1)*3;
        let max = quarter*3;
        if (quarter === 0) {
            min = 0;
            max = 12;
        }
        let incomesTotal = 0;
        let expensesTotal = 0;
        let collectedVatTotal = 0;
        let inputVatTotal = 0;

        bills.forEach((bill) => {
            const date = new Date(bill.date);

            if (date.getMonth() < min || date.getMonth() >= max) return;
            if (date.getFullYear() !== new Date().getFullYear()) return;

            const total = Number(bill.total_amount);
            const vat = Number(bill.iva_percent) / 100;

            if (bill.type === "emitida") {
                incomesTotal += total;
                collectedVatTotal += total * vat;
            } else {
                expensesTotal += total;
                inputVatTotal += total * vat;
            }
        });

        setIncomes(incomesTotal);
        setExpenses(expensesTotal);
        setCollectedVat(collectedVatTotal);
        setInputVat(inputVatTotal);
    },[bills,quarter])

    useEffect(() =>{
        getCurrentUser().then(value => setIrpf(value?.autonomo?.irpf)).catch(err => console.log(err))
        
    },[])


  return (
    <>
        <div className='p-10'>
            <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-6 mb-20'>
                <p className='mont_semibold text-4xl'>Taxes</p>
                <button 
                onClick={(e) => alert()}
                className=" inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                    New Goal
                </span>
                <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                    Create
                </span>
                </button>
            </div>

            <div className='w-full grid xl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 content-between justify-between xl:gap-10 gap-5 mb-10'>
                <div className='border rounded-2xl border-[#0000001a] dark:border-[#1d2344] dark:bg-dark-card px-7 py-5 flex flex-col justify-between gap-3'>
                    <div className='flex items-center justify-between'>
                        <span className='flex items-center montserrat'>
                            <span className='bg-[#84A2EB66] p-1 rounded-full me-2'>x</span> asd
                        </span>
                        sds
                    </div>
                    <div>
                        <p className='text-4xl text-green-600'>{incomes}€</p>
                        <p className='text-xl text-green-500'>B.I. {incomes-collectedVat}€</p>
                        <p className='text-xl text-green-500'>IVA Repercutido {collectedVat}€</p>
                    </div>
                    <p className='text-[#040919b3] dark:text-dark-text'>x</p>
                </div>

                <div className='border rounded-2xl border-[#0000001a] dark:border-[#1d2344] dark:bg-dark-card px-7 py-5 flex flex-col justify-between gap-3'>
                    <div className='flex items-center justify-between'>
                        <span className='flex items-center montserrat'>
                            <span className='bg-[#84A2EB66] p-1 rounded-full me-2'>x</span> asd
                        </span>
                        sds
                    </div>
                    <div>
                        <p className='text-4xl text-red-600'>{expenses}€</p>
                        <p className='text-xl text-red-500'>B.I. {expenses-inputVat}€</p>
                        <p className='text-xl text-red-500'>IVA Soportado {inputVat}€</p>
                    </div>
                    <p className='text-[#040919b3] dark:text-dark-text'>x</p>
                </div>
                <div className='border rounded-2xl border-[#0000001a] dark:border-[#1d2344] dark:bg-dark-card px-7 py-5 flex flex-col justify-between gap-3'>
                    <div className='flex items-center justify-between'>
                        <span className='flex items-center montserrat'>
                            <span className='bg-[#84A2EB66] p-1 rounded-full me-2'>x</span> IVA a pagar
                        </span>
                        sds
                    </div>
                    <div>
                        <p className='text-4xl text-orange-5v00'>{Math.abs(inputVat-collectedVat)}€</p>
                    </div>
                    <p className='text-[#040919b3] dark:text-dark-text'>Repercutido - Soportado</p>
                </div>
                <div>
                    <p>IVA a pagar: {Math.abs(inputVat-collectedVat)}€</p>
                    <p>IRPF: {(Number(irpf)/100)*( (incomes-collectedVat) - (expenses-inputVat))}€</p>
                    <p>Cuota de autonomos: {getCuota()}€</p>
                    <p>Reserva recomendada: {Math.abs(inputVat-collectedVat) + ((Number(irpf)/100)*( (incomes-collectedVat) - (expenses-inputVat))) + getCuota()}€ </p>
                </div>

            </div>

            <select name="" id="" onChange={(e) =>  handleChange(e)}>
                <option value="1">T1</option>
                <option value="2">T2</option>
                <option value="3">T3</option>
                <option value="4">T4</option>
                <option value="0">Anual</option>
            </select>
        </div>
    </>
  )
}

export default Taxes