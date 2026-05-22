import React, { useEffect, useState } from 'react'
import { useBills, type BillsContextType } from '../contexts/BillContext';
import { getCurrentUser, type UserProfile } from '../api/AuthServices'
import { useTranslation } from 'react-i18next';
import InfoIcon from '/src/assets/icons/Info.svg?react'
import { ToggleContainer } from '../components/materials/ToggleContainer';
import { ToggleOption } from '../components/materials/ToggleOption';

function Taxes() {
    const { bills, setBills, refetchBills } = useBills() as BillsContextType;
    const [quarter,setQuarter] = useState(1);
    const [incomes, setIncomes] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [collectedVat, setCollectedVat] = useState(0);
    const [inputVat, setInputVat] = useState(0);
    const [irpf, setIrpf] = useState<any>(15);
    const [reserva,setReserva] = useState<number>();
    const [baseIRPF,setBaseIRPF] = useState<number>();
    const [payIRPF,setPayIRPF] = useState<number>();
    const [cuota,setCuota] = useState<number>(900);
    const [alertIrpfNotSet,setAlertIrpfNotSet] = useState(false);
    const today = new Date();
    const todayMonth = today.getMonth();
    const { t: tUtils } = useTranslation("utils");

    useEffect(() => {
        
    },[]);
    
    useEffect(() => {
        let min = (quarter-1)*3;
        let max = quarter*3;
        if (quarter === 0) {
            min = 0;
            max = 12;
            setCuota(3600)
        }else{
            setCuota(900)
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

        let base_irpf = (incomesTotal-collectedVatTotal) - expensesTotal; 
        let _irpf = base_irpf*(irpf/100); 

        setIncomes(incomesTotal);
        setExpenses(expensesTotal);
        setCollectedVat(collectedVatTotal);
        setInputVat(inputVatTotal);
        setBaseIRPF(base_irpf);
        setPayIRPF(_irpf);

    },[bills,quarter])

    useEffect(() =>{
        async function getIrpf() {
            let _irpf = await getCurrentUser().then(value => {return value?.autonomo?.irpf});
            if (_irpf == null) {
                _irpf = 15;
                setAlertIrpfNotSet(true);
            }
            setIrpf(_irpf);
        }
        getIrpf()

        let quarter = 0;
        if (todayMonth < 3) {
            quarter = 1;
        }else if (todayMonth >= 3 && todayMonth < 6) {
            quarter = 2;
        }else if (todayMonth >= 6 && todayMonth < 9) {
            quarter = 3;
        }else if (todayMonth >= 6 && todayMonth < 12) {
            quarter = 4;
        }
        setQuarter(quarter)
    },[])

    // const FILTERS: {id: string; label:string}[] = [
    //     {id: '1', label: 'T1'},
    //     {id: '2', label: 'T2'},
    //     {id: '3', label: 'T3'},
    //     {id: '4', label: 'T4'},
    //     {id: '0', label: 'Anual'},
    // ]

const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];

  return (
    <>
    
        <div className='p-6 sm:p-10 inter'>
            <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-6'>
                <p className='mont_semibold text-4xl'>Taxes</p>
                {/* <button 
                onClick={(e) => alert()}
                className=" inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                    New Goal
                </span>
                <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                    Create
                </span>
                </button> */}
            </div>
            <hr className="-mx-6 sm:-mx-10 my-6 border-t border-gray-100 dark:border-gray-900 shadow-sm" />

            {alertIrpfNotSet &&
            <div className='inter px-8 py-5 bg-sky-50 dark:bg-blue-950 dark:text-white rounded-2xl mb-5'>
                <p className='text-xl flex items-center gap-2'><InfoIcon /> Aviso sobre IRPF no configurado</p>
                <p>No tienes ningún tipo de IRPF asignado en tu cuenta. Para poder realizar cálculos más precisos y adaptados a tu situación fiscal, es recomendable que actualices tu porcentaje de IRPF en la configuración. Esto permitirá obtener resultados más ajustados a la realidad de tu caso.</p>
            </div>}

            <div id='toggle' className='relative bg-[#EFEFEF] dark:bg-[#0F1732] w-full px-2 py-1 rounded-3xl flex justify-between items-center gap-5 border border-[#0000001a] mb-4 montserrat'>
                <div id='1' onClick={(e) => setQuarter(Number(e.currentTarget.id))} className={`${quarter == 1 ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} flex gap-3 items-center justify-center text-center w-full px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>T1 {todayMonth < 3 && <span className='w-2 h-2 bg-primary rounded-2xl relative after:w-2 after:h-2 after:bg-primary after:rounded-2xl after:animate-ping after:top-0 after:left-0 after:absolute '/>}</div>
                <div id='2' onClick={(e) => setQuarter(Number(e.currentTarget.id))} className={`${quarter == 2 ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} flex gap-3 items-center justify-center text-center w-full px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`} >T2 {todayMonth >= 3 && todayMonth < 6 && <span className='w-2 h-2 bg-primary rounded-2xl relative after:w-2 after:h-2 after:bg-primary after:rounded-2xl after:animate-ping after:top-0 after:left-0 after:absolute '/>}</div>
                <div id='3' onClick={(e) => setQuarter(Number(e.currentTarget.id))} className={`${quarter == 3 ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} flex gap-3 items-center justify-center text-center w-full px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`} >T3 {todayMonth >= 6 && todayMonth < 9 && <span className='w-2 h-2 bg-primary rounded-2xl relative after:w-2 after:h-2 after:bg-primary after:rounded-2xl after:animate-ping after:top-0 after:left-0 after:absolute '/>}</div>
                <div id='4' onClick={(e) => setQuarter(Number(e.currentTarget.id))} className={`${quarter == 4 ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} flex gap-3 items-center justify-center text-center w-full px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`} >T4 {todayMonth >= 9 && <span className='w-2 h-2 bg-primary rounded-2xl relative after:w-2 after:h-2 after:bg-primary after:rounded-2xl after:animate-ping after:top-0 after:left-0 after:absolute '/>}</div>
                <div id='0' onClick={(e) => setQuarter(Number(e.currentTarget.id))} className={`${quarter == 0 ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} flex gap-3 items-center justify-center text-center w-full px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`} >Anual</div>
            </div>

            {/* <div id='toggle' className='relative bg-[#EFEFEF] dark:bg-[#0F1732] w-full px-2 py-1 rounded-3xl flex justify-between items-center gap-5 border border-[#0000001a] mb-4 montserrat'>
                {FILTERS.map( el => <>
                    <div id={el.id} onClick={(e) => setQuarter(Number(e.currentTarget.id))} className={`${quarter == Number(el.id) ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit  rounded-2xl' : ''} flex gap-3 items-center justify-center text-center w-full px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>{el.label}</div>
                </>)}
            </div> */}

            <div className='inter *:inter w-full h-full border border-[#0000001a] rounded-2xl py-5 px-8 flex flex-col gap-5'>
                {quarter != 0 ? <p>Trimestre {quarter} -  {tUtils(`months.${months[(quarter-1)*3]}`).slice(0,3)}-{tUtils(`months.${months[quarter*3-1]}`).slice(0,3)} {today.getFullYear()}</p> : <p>Anual</p>}
                <div>
                    <p className='text-xl mb-2'>Base de cálculo</p>
                    <div className='flex lg:flex-row flex-col gap-6 *:px-4 *:py-3 *:w-full *:flex *:justify-between *:rounded-2xl'>
                        <div className='dark:bg-green-200 dark:border-green-800 dark:text-black bg-green-50 border-[#E9E8F0] border'><span>Ingresos totales</span> <span>{incomes}€</span></div>
                        <div className='dark:bg-red-200  dark:border-red-800 dark:text-black bg-red-50 border-[#E9E8F0] border'><span>Gastos totales</span> <span>{expenses}€</span></div>
                        <div className='dark:bg-blue-200  dark:border-blue-800 dark:text-black bg-blue-50 border-[#E2E8F0] border'><span>Base imponible</span> <span>{baseIRPF}€</span></div>
                    </div>
                    
                </div>

                <div className='lg:hidden block w-full h-px bg-gray-300'/>
                <div>
                    <p className='text-xl mb-2'>IVA - Modelo 303</p>
                    <div className='flex lg:flex-row flex-col gap-6 *:px-4 *:py-3 *:w-full *:flex *:justify-between *:rounded-2xl'>
                        <div className='dark:bg-green-200 dark:border-green-800 dark:text-black bg-green-50 border-[#E2E8F0] border'><span>IVA repercutido</span> <span>{collectedVat}€</span></div>
                        <div className='dark:bg-red-200 dark:border-red-800 dark:text-black bg-red-50 border-[#E2E8F0] border'><span>IVA soportado</span> <span>{inputVat}€</span></div>
                        <div className='dark:bg-blue-200 dark:border-blue-800 dark:text-black bg-blue-50 border-[#E2E8F0] border'><span>IVA a pagar</span> <span>{collectedVat-inputVat}€</span></div>
                    </div>
                </div>
                <div className='lg:hidden block w-full h-px bg-gray-300'/>

                <div>
                    <p className='text-xl mb-2'>IRPF + Cuota autonomos</p>
                    <div className='flex lg:flex-row flex-col gap-6 *:px-4 *:py-3 *:w-full *:flex *:justify-between *:rounded-2xl'>
                        <div className='dark:bg-green-200 dark:border-green-800 dark:text-black bg-green-50 border-[#E2E8F0] border'><span>IRPF</span> <span>{payIRPF}€</span></div>
                        <div className='dark:bg-red-200 dark:border-green-800 dark:text-black bg-red-50 border-[#E2E8F0] border'><span>Cuota autonomos</span> <span>{cuota}€</span></div>
                        <div className='dark:bg-blue-200 dark:border-green-800 dark:text-black bg-blue-50 border-[#E2E8F0] border'><span>IRPF + Cuota </span> <span>{(Number(irpf)/100)*( (incomes-collectedVat) - (expenses))+cuota}€</span></div>
                    </div>
                </div>
                <div className='lg:hidden block w-full h-px bg-gray-400'/>
                
                <div>
                    <p className='text-xl mb-2'>Reserva recomendada</p>
                    <div className='flex lg:flex-row flex-col gap-6 *:px-4 *:py-3 *:w-full *:flex *:justify-between *:rounded-2xl'>
                        <div className='bg-orange-100 border border-orange-300 dark:bg-orange-200 dark:text-black'><span>Total a pagar (IRPF {Number(irpf)}% + Cuota + IVA):</span> <span>{Math.abs(collectedVat-inputVat) + payIRPF! + cuota}€</span></div>
                    </div>
                </div>
            </div>

            {Number(irpf) != null && 
                <div className='inter px-8 py-5 bg-orange-50 dark:bg-orange-300 dark:text-black rounded-2xl mt-5'>
                    <p className='text-xl flex items-center gap-2'><InfoIcon /> Aviso sobre carácter orientativo de los cálculos</p>
                    <p>Los cálculos mostrados son aproximados y tienen únicamente carácter informativo. Pueden no reflejar con exactitud la cantidad final a pagar, ya que dependen de factores fiscales, normativos y personales que pueden variar. Para una información definitiva, consulta con un asesor fiscal o con la administración tributaria correspondiente.</p>
                </div>
            }
        </div>
    </>
  )
}

export default Taxes