import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import RecurrentTransactionForm from '../components/materials/RecurrentTransactionForm';
import Confirmation from '../components/materials/Confirmation';
import {
  deleteRecurrentTransaction,
  generateRecurrentTransaction,
  getRecurrentTransactions,
  updateRecurrentTransaction,
  type RecurrentTransaction
} from '../api/RecurrentTransactionService';

import RecurrentIcon from '/src/assets/icons/Recurrent.svg?react';
import TrendingUpIcon from '/src/assets/icons/Trending-up.svg?react';
import TrendingDownIcon from '/src/assets/icons/Trending-down.svg?react';
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react';
import PencilIcon from '/src/assets/icons/Pencil.svg?react';
import TagIcon from '/src/assets/icons/Tag.svg?react';
import CardIcon from '/src/assets/icons/Credit-card.svg?react';
import CoinIcon from '/src/assets/icons/Coin.svg?react';
import BankIcon from '/src/assets/icons/Bank.svg?react';

const frequencyLabels: Record<string, string> = {
  weekly: 'Semanal',
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  yearly: 'Anual'
};

function Recurrent() {
  const [recurrentTransactions, setRecurrentTransactions] = useState<RecurrentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [select, setSelected] = useState('total');
  const [showForm, setShowForm] = useState(false);
  const [recurrentToEdit, setRecurrentToEdit] = useState<RecurrentTransaction | null>(null);
  const [recurrentToDelete, setRecurrentToDelete] = useState<RecurrentTransaction | null>(null);
  const [generatingId, setGeneratingId] = useState<number | null>(null);

  const fetchRecurrentTransactions = (showSkeleton = false) => {
    if (showSkeleton) {
      setLoading(true);
    }
    setError(null);
    getRecurrentTransactions()
      .then(data => setRecurrentTransactions(data))
      .catch(() => setError('Error al cargar las transacciones recurrentes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecurrentTransactions(true);
  }, []);

  const filteredRecurrent = recurrentTransactions.filter(item => {
    if (select === 'incomes') return item.type === 'income';
    if (select === 'expenses') return item.type === 'expense';
    if (select === 'deductible') return item.is_deductible;
    return true;
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteRecurrentTransaction(id);
      setRecurrentTransactions(prev => prev.filter(item => item.id !== id));
    } catch (error: any) {
      setError('Error al eliminar la recurrente');
    }
  };

  const handleGenerate = async (id: number) => {
    if (generatingId) return;
    setGeneratingId(id);
    try {
      const response = await generateRecurrentTransaction(id);
      setRecurrentTransactions(prev => prev.map(item =>
        item.id === id ? response.recurrent_transaction : item
      ));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al generar la transaccion');
    } finally {
      setGeneratingId(null);
    }
  };

  const activeFilteredRecurrent = filteredRecurrent.filter(item => item.active);

  const recurrentAmount = (item: RecurrentTransaction) => Number(item.total_amount);

  const summaryLabel = () => {
    if (select === 'incomes') return 'Ingresos recurrentes activos';
    if (select === 'expenses') return 'Gastos recurrentes activos';
    if (select === 'deductible') return 'Deducible recurrente activo';
    return 'Balance recurrente activo';
  };

  const summaryAmount = () => {
    if (select === 'total') {
      return recurrentTransactions
        .filter(item => item.active)
        .reduce((sum, item) => sum + (item.type === 'income' ? recurrentAmount(item) : -recurrentAmount(item)), 0);
    }

    if (select === 'deductible') {
      return activeFilteredRecurrent.reduce((sum, item) => {
        const deductiblePercent = Number(item.deductible_percent ?? 100) / 100;
        return sum + (recurrentAmount(item) * deductiblePercent);
      }, 0);
    }

    if (select === 'expenses') {
      return -activeFilteredRecurrent.reduce((sum, item) => sum + recurrentAmount(item), 0);
    }

    return activeFilteredRecurrent.reduce((sum, item) => sum + recurrentAmount(item), 0);
  };

  const recurrentPayload = (item: RecurrentTransaction, active: boolean) => ({
    name: item.name,
    type: item.type,
    total_amount: item.total_amount,
    iva_percent: item.iva_percent,
    client: item.client,
    description: item.description,
    payment_method: item.payment_method,
    category_id: item.category_id,
    frequency: item.frequency,
    start_date: item.start_date?.slice(0, 10),
    next_run_date: item.next_run_date?.slice(0, 10),
    end_date: item.end_date ? item.end_date.slice(0, 10) : null,
    active,
    is_deductible: item.is_deductible,
    deductible_percent: item.deductible_percent,
    tax_note: item.tax_note,
  });

  const handleToggleActive = async (item: RecurrentTransaction) => {
    const nextActive = !item.active;

    setRecurrentTransactions(prev => prev.map(current =>
      current.id === item.id ? { ...current, active: nextActive } : current
    ));

    try {
      const updated = await updateRecurrentTransaction(recurrentPayload(item, nextActive), item.id);
      setRecurrentTransactions(prev => prev.map(current =>
        current.id === item.id ? updated : current
      ));
    } catch (error: any) {
      setRecurrentTransactions(prev => prev.map(current =>
        current.id === item.id ? { ...current, active: item.active } : current
      ));
      setError('Error al actualizar el estado');
    }
  };

  function transactionWithIVA(amount: number, iva: any) {
    if (amount < 0) throw new Error("Amount must be positive value");
    const i = amount * (iva / 100);
    return amount - i;
  }

  const nextRunIsDue = (date: string) => {
    return dayjs(date).isBefore(dayjs().add(1, 'day'), 'day');
  };

  const summaryColor = () => {
    if (select === 'deductible') return 'text-primary';
    return summaryAmount() >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <>
      {showForm && (
        <RecurrentTransactionForm
          close={() => { setShowForm(false); setRecurrentToEdit(null); }}
          recurrentEdit={recurrentToEdit}
          onSaved={() => fetchRecurrentTransactions(false)}
        />
      )}

      {recurrentToDelete !== null && (
        <Confirmation
          Icon={TrashcanIcon}
          close={() => setRecurrentToDelete(null)}
          onConfirm={() => { handleDelete(recurrentToDelete.id); setRecurrentToDelete(null); }}>
          Estas seguro de que quieres eliminar <span className='font-bold'>{recurrentToDelete.name}</span>?
        </Confirmation>
      )}

      <div className='p-10 inter'>
        <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-4'>
          <div>
            <h2 className='mont_semibold text-4xl'>Recurrentes</h2>
            <p className='text-sm text-gray-400 mt-1'>Pagos e ingresos periodicos que generan transacciones reales.</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setRecurrentToEdit(null); }}
            className="inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
              Nueva recurrente
            </span>
            <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              Crear
            </span>
          </button>
        </div>

        {recurrentTransactions.length !== 0 && (
          <div className='md:py-10 pt-10 pb-5'>
            <div id='toggle' className='relative bg-[#EFEFEF] dark:bg-dark-card w-fit px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] mb-4 montserrat select-none'>
              <div id='total' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'total' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>Total</div>
              <div id='incomes' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'incomes' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>Ingresos</div>
              <div id='expenses' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'expenses' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>Gastos</div>
              <div id='deductible' onClick={(e) => setSelected(e.currentTarget.id)} className={`${select == 'deductible' ? 'bg-[#FFF] dark:bg-[#1a2957] w-fit rounded-2xl' : ''} px-2 py-1 transition-all ease-in-out duration-200 cursor-pointer`}>Deducibles</div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='bg-gray-100 dark:bg-dark-card rounded-2xl p-5 ring-2 ring-gray-200 dark:ring-[#101a3d]'>
                <p className='text-sm text-gray-400 mb-2'>{summaryLabel()}</p>
                <p className={`${summaryColor()} text-3xl font-bold`}>
                  {summaryAmount().toFixed(2)} EUR
                </p>
                <p className='text-xs text-gray-400 mt-1'>
                  {activeFilteredRecurrent.length} recurrente{activeFilteredRecurrent.length !== 1 ? 's' : ''} activa{activeFilteredRecurrent.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <p className='inter capitalize text-gray-400 mt-4'>{select} recurrentes {'->'} <span className='font-bold'>{filteredRecurrent.length}</span></p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm mt-8">{error}</p>
        ) : recurrentTransactions.length === 0 ? (
          <div className='flex flex-col justify-center items-center inter pt-40'>
            <RecurrentIcon className='w-24 h-24' />
            <p className='text-xl'>No hay transacciones recurrentes</p>
          </div>
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-5 text-text dark:text-dark-text'>
            {filteredRecurrent.map(item => (
              <div key={item.id}
                className={`flex flex-col min-h-[300px] bg-gray-100 dark:bg-dark-card rounded-2xl p-5 ring-2
                  ${nextRunIsDue(item.next_run_date) && item.active ? 'ring-primary/60 shadow-md' : 'ring-gray-200 dark:ring-[#101a3d] shadow-sm'}
                  ${!item.active ? 'opacity-60 grayscale dark:bg-[#0b1024]' : ''}
                  hover:scale-102 transition-transform ease-in-out w-full h-full`}>

                <div className='flex flex-row justify-between items-start w-full gap-3 pb-5'>
                  <div className='flex flex-row items-center truncate gap-2'>
                    <div className='shrink-0'>
                      {item.payment_method == "card" && <CardIcon className='text-text dark:text-dark-text' />}
                      {item.payment_method == "cash" && <CoinIcon className='text-text dark:text-dark-text' />}
                      {item.payment_method == "transfer" && <BankIcon className='text-text dark:text-dark-text' />}
                    </div>
                    <div className='truncate'>
                      <p className='mont_semibold text-lg truncate'>{item.name}</p>
                      <p className='text-xs text-gray-400'>{frequencyLabels[item.frequency]}</p>
                    </div>
                  </div>

                  <div className='flex flex-row gap-2 items-center shrink-0'>
                    <button
                      type='button'
                      onClick={() => handleToggleActive(item)}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer shrink-0
                        ${item.active ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                      aria-label={item.active ? 'Desactivar recurrente' : 'Activar recurrente'}>
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200
                        ${item.active ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className={item.type == 'income'
                      ? 'inter bg-green-200 ring-1 ring-green-500 rounded-full text-green-600 text-xs px-2 py-0.5'
                      : 'inter bg-red-200 ring-1 ring-red-500 rounded-full text-red-600 text-xs px-2 py-0.5'}>
                      <span className='flex justify-center items-center capitalize'>
                        {item.type == 'income'
                          ? <TrendingUpIcon className='w-4 h-4' />
                          : <TrendingDownIcon className='w-4 h-4' />}
                      </span>
                    </span>
                    <PencilIcon className='cursor-pointer text-gray-800 hover:scale-110 transition-all ease-in-out dark:text-dark-text'
                      onClick={() => { setRecurrentToEdit(item); setShowForm(true); }} />
                    <TrashcanIcon className='cursor-pointer text-red-600 hover:scale-104 transition-all ease-in-out hover:bg-red-200 hover:rotate-15 rounded-full'
                      onClick={() => setRecurrentToDelete(item)} />
                  </div>
                </div>

                <div className={item.type == 'income' ? 'text-green-400' : 'text-red-400'}>
                  <p className='inter text-3xl'>{item.type != 'income' && <span>-</span>}{Number(item.total_amount).toFixed(2)} EUR</p>
                  <div className='flex flex-row gap-2'>
                    {item.iva_percent > 0 && (
                      <p>{transactionWithIVA(Number(item.total_amount), item.iva_percent).toFixed(2)} EUR</p>
                    )}
                    <span className='text-gray-400'>IVA {Math.round(item.iva_percent)}%</span>
                  </div>
                </div>

                <div className='flex flex-col gap-3 pt-4 text-sm flex-1'>
                  <div className='flex justify-between gap-2 text-gray-400'>
                    <span>Proxima</span>
                    <span className={nextRunIsDue(item.next_run_date) ? 'text-primary font-semibold' : ''}>
                      {dayjs(item.next_run_date).format('DD-MM-YYYY')}
                    </span>
                  </div>

                  <div className='flex justify-between items-center gap-2'>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0
                      ${item.active
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {item.active ? 'Activa' : 'Pausada'}
                    </span>

                    {item.category !== null && (
                      <span className='inter capitalize rounded-full text-sm py-[2px] px-3 flex flex-row items-center truncate'
                        style={{ backgroundColor: item.category.color.concat(`30`), border: `1px solid ${item.category.color}`, color: `${item.category.color}` }}>
                        <TagIcon className='w-4 mr-1 h-4 shrink-0' /><span className='truncate'>{item.category.name}</span>
                      </span>
                    )}
                  </div>

                  {item.is_deductible && (
                    <div className='rounded-xl bg-primary/10 dark:bg-primary/15 text-primary px-3 py-2 text-xs'>
                      <span className='font-semibold'>Deducible {Number(item.deductible_percent ?? 100)}%</span>
                      {item.tax_note && <span> - {item.tax_note}</span>}
                    </div>
                  )}

                  <button
                    onClick={() => handleGenerate(item.id)}
                    disabled={!item.active || generatingId === item.id}
                    className='mt-auto w-full rounded-xl ring-1 ring-gray-200 dark:ring-[#1b2754]
                      bg-transparent text-gray-500 dark:text-gray-400 font-semibold py-2 text-xs
                      hover:bg-white dark:hover:bg-[#1a2957] hover:text-primary
                      active:scale-[0.98] transition-all duration-150 ease-in-out cursor-pointer
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500'>
                    {generatingId === item.id ? 'Generando...' : 'Generar ahora'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Recurrent;
