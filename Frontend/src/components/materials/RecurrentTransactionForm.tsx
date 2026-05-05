import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TrendingUpIcon from "/src/assets/icons/Trending-up.svg?react";
import TrendingDownIcon from "/src/assets/icons/Trending-down.svg?react";
import RecurrentIcon from "/src/assets/icons/Recurrent.svg?react";
import { getCategories, type Category } from "../../api/CategoryService";
import {
  createRecurrentTransaction,
  updateRecurrentTransaction,
  type RecurrentTransaction
} from "../../api/RecurrentTransactionService";
import DropdownSelect from "./DropdownSelect";

type RecurrentFormValues = {
  id: number
  name: string
  type: string
  total_amount: number
  iva_percent: number
  client: string
  description: string
  payment_method: string
  category_id?: number | null
  frequency: string
  start_date: string
  next_run_date: string
  end_date?: string | null
  active: boolean
  is_deductible: boolean
  deductible_percent?: number | null
  tax_note?: string | null
}

export function RecurrentTransactionForm({
  close,
  recurrentEdit,
  onSaved
}: {
  close: () => void,
  recurrentEdit?: RecurrentTransaction | null,
  onSaved?: () => void
}) {
  const dateInputValue = (value?: string | null) => value ? value.slice(0, 10) : '';
  const [select, setSelected] = useState(recurrentEdit?.type || 'expense');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState(recurrentEdit?.name || '');
  const [amount, setAmount] = useState<number | string>(recurrentEdit?.total_amount || '');
  const [iva, setIva] = useState<number | string>(recurrentEdit?.iva_percent ?? 21.00);
  const [client, setClient] = useState(recurrentEdit?.client || '');
  const [description, setDescription] = useState(recurrentEdit?.description || '');
  const [paymentMethod, setPaymentMethod] = useState(recurrentEdit?.payment_method || 'card');
  const [category, setCategory] = useState<number | string>(recurrentEdit?.category_id ?? '');
  const [frequency, setFrequency] = useState(recurrentEdit?.frequency || 'monthly');
  const [startDate, setStartDate] = useState(dateInputValue(recurrentEdit?.start_date));
  const [nextRunDate, setNextRunDate] = useState(dateInputValue(recurrentEdit?.next_run_date || recurrentEdit?.start_date));
  const [endDate, setEndDate] = useState(dateInputValue(recurrentEdit?.end_date));
  const [active, setActive] = useState(recurrentEdit?.active ?? true);
  const [isDeductible, setIsDeductible] = useState(recurrentEdit?.is_deductible ?? false);
  const [deductiblePercent, setDeductiblePercent] = useState<number | string>(recurrentEdit?.deductible_percent ?? 100);
  const [taxNote, setTaxNote] = useState(recurrentEdit?.tax_note || '');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<RecurrentFormValues>();

  useEffect(() => {
    getCategories()
      .then(data => setCategories(data))
      .catch(() => setError('Error al cargar las categorias'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setValue("type", select);
    setValue("frequency", frequency);
    setValue("active", active);
    setValue("is_deductible", isDeductible);
    if (recurrentEdit) {
      setValue("id", recurrentEdit.id);
      setValue("category_id", recurrentEdit.category_id ?? null);
    }
  }, [active, frequency, isDeductible, recurrentEdit, select, setValue]);

  useEffect(() => {
    if (!nextRunDate && startDate) {
      setNextRunDate(startDate);
      setValue("next_run_date", startDate);
    }
  }, [nextRunDate, setValue, startDate]);

  useEffect(() => {
    if (select === 'income') {
      setIsDeductible(false);
      setDeductiblePercent(100);
      setTaxNote('');
      setValue("is_deductible", false);
    }
  }, [select, setValue]);

  const onSubmit = async (data: RecurrentFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { id, ...dataWithoutId } = data;
    const payload = {
      ...dataWithoutId,
      type: select,
      frequency,
      active,
      is_deductible: select === 'expense' ? isDeductible : false,
      iva_percent: Number(iva || 0),
      payment_method: paymentMethod,
      category_id: category === '' ? null : Number(category),
      end_date: endDate || null,
      deductible_percent: select === 'expense' && isDeductible ? Number(deductiblePercent || 100) : null,
      tax_note: select === 'expense' && isDeductible ? taxNote || null : null,
    };

    try {
      if (recurrentEdit) {
        await updateRecurrentTransaction(payload, id);
      } else {
        await createRecurrentTransaction(payload);
      }
      onSaved?.();
      close();
    } catch (error: any) {
      console.error('Status:', error.response?.status);
      console.error('Errors:', error.response?.data);
      setIsSubmitting(false);
    }
  };

  const inputCls = `w-full rounded-xl border border-gray-200 dark:border-gray-700
    bg-gray-50 dark:bg-[#0f1b35] text-gray-800 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    px-4 py-2.5 text-sm font-medium
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    transition-all duration-150`;

  const labelCls = `block text-xs font-semibold uppercase tracking-wide
    text-gray-500 dark:text-gray-400 mb-1`;

  const dropdownButtonCls = `w-full rounded-xl border border-gray-200 dark:border-gray-700
    bg-gray-50 dark:bg-[#0f1b35] text-gray-800 dark:text-gray-100
    px-4 py-2.5 text-sm font-medium shadow-sm
    hover:border-primary/60 dark:hover:border-primary/60
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    transition-all duration-150`;

  const frequencyOptions = [
    { label: "Semanal", value: "weekly" },
    { label: "Mensual", value: "monthly" },
    { label: "Trimestral", value: "quarterly" },
    { label: "Anual", value: "yearly" },
  ];

  const ivaOptions = [
    { label: "Sin IVA - 0%", value: "0" },
    { label: "Superreducido - 4%", value: "4.00" },
    { label: "Reducido - 10%", value: "10.00" },
    { label: "General - 21%", value: "21.00" },
  ];

  const paymentOptions = [
    { label: "Tarjeta", value: "card" },
    { label: "Efectivo", value: "cash" },
    { label: "Transferencia", value: "transfer" },
  ];

  const categoryOptions = [
    { label: "Sin categoria", value: "" },
    ...categories.map((category) => ({
      label: category.name,
      value: String(category.id),
    })),
  ];

  const namePattern = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto
          bg-background dark:bg-dark-background rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10
          p-6 sm:p-8 flex flex-col gap-5 inter"
          onClick={(e) => e.stopPropagation()}>

          <div className="flex items-center justify-between mb-1">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <RecurrentIcon className="w-7 h-7" />
              {recurrentEdit == null ? 'Nueva recurrente' : 'Editar recurrente'}
            </h2>
            <button type="button" onClick={close}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 dark:bg-[#0F1732]
              rounded-2xl border border-gray-200 dark:border-gray-700 montserrat">
              {[
                { id: 'income', label: 'Ingreso', Icon: TrendingUpIcon, activeColor: 'text-emerald-600 dark:text-emerald-400' },
                { id: 'expense', label: 'Gasto', Icon: TrendingDownIcon, activeColor: 'text-red-500 dark:text-red-400' },
              ].map(({ id, label, Icon, activeColor }) => (
                <button key={id} type="button" onClick={() => setSelected(id as 'income' | 'expense')}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold
                    transition-all duration-200 ease-in-out cursor-pointer
                    ${select === id
                      ? `bg-white dark:bg-[#1a2957] shadow-sm ${activeColor}`
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Nombre *</label>
            <input {...register("name", {
              required: "El nombre es obligatorio",
              maxLength: { value: 40, message: "El nombre no puede superar 40 caracteres" },
              pattern: { value: namePattern, message: "Solo se permiten letras, numeros y espacios" }
            })}
              type="text" placeholder="Ej. Alquiler local"
              value={name} onChange={(e) => setName(e.target.value)}
              className={inputCls} />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Importe *</label>
              <input type="number" step="0.10"
                {...register("total_amount", {
                  required: "El importe es obligatorio",
                  valueAsNumber: true,
                  min: { value: 0.01, message: "El importe debe ser mayor que 0" },
                  max: { value: 1_000_000, message: "El importe no puede superar 1.000.000" }
                })}
                placeholder="0.00 EUR" value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className={inputCls} />
              {errors.total_amount && <p className="mt-1 text-xs text-red-400">{errors.total_amount.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Frecuencia *</label>
              <DropdownSelect
                name="frequency"
                value={frequency}
                placeholder="Selecciona frecuencia"
                options={frequencyOptions}
                onChange={(_, value) => setFrequency(value as any)}
                buttonClassName={dropdownButtonCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Inicio *</label>
              <input type="date" {...register("start_date", { required: "La fecha de inicio es obligatoria" })}
                value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className={inputCls} />
              {errors.start_date && <p className="mt-1 text-xs text-red-400">{errors.start_date.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Proxima ejecucion *</label>
              <input type="date" {...register("next_run_date", { required: "La proxima fecha es obligatoria" })}
                value={nextRunDate} onChange={(e) => setNextRunDate(e.target.value)}
                className={inputCls} />
              {errors.next_run_date && <p className="mt-1 text-xs text-red-400">{errors.next_run_date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Fin opcional</label>
              <input type="date" {...register("end_date", { setValueAs: (v) => v === "" ? null : v })}
                value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>IVA</label>
              <DropdownSelect
                name="iva_percent"
                value={String(iva)}
                placeholder="Selecciona IVA"
                options={ivaOptions}
                onChange={(_, value) => setIva(value)}
                buttonClassName={dropdownButtonCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Categoria</label>
              {!loading ? (
                <DropdownSelect
                  name="category_id"
                  value={String(category)}
                  placeholder="Sin categoria"
                  options={categoryOptions}
                  onChange={(_, value) => setCategory(value)}
                  buttonClassName={dropdownButtonCls}
                />
              ) : (
                <div className={`${inputCls} animate-pulse text-gray-400 dark:text-gray-500`}>
                  Cargando categorias...
                </div>
              )}
              {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
            </div>
            <div>
              <label className={labelCls}>Metodo de pago</label>
              <DropdownSelect
                name="payment_method"
                value={paymentMethod}
                placeholder="Selecciona metodo"
                options={paymentOptions}
                onChange={(_, value) => setPaymentMethod(value)}
                buttonClassName={dropdownButtonCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Descripcion</label>
            <input {...register("description", { maxLength: { value: 100, message: "La descripcion no puede superar 100 caracteres" } })}
              type="text" placeholder="Descripcion opcional"
              value={description} onChange={(e) => setDescription(e.target.value)}
              className={inputCls} />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
          </div>

          <div>
            <label className={labelCls}>{select === 'income' ? 'Cliente' : 'Proveedor'}</label>
            <input {...register("client", { maxLength: { value: 50, message: "No puede superar 50 caracteres" } })}
              type="text" placeholder={select === 'income' ? 'Ej. Cliente mensual' : 'Ej. Arrendador, Netflix, gestoria...'}
              value={client} onChange={(e) => setClient(e.target.value)}
              className={inputCls} />
            {errors.client && <p className="mt-1 text-xs text-red-400">{errors.client.message}</p>}
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0f1b35]/50 p-4 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                <input type="checkbox" checked={active}
                  {...register("active")}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-primary" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Activa</span>
              </label>
              {select === 'expense' && (
                <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                  <input type="checkbox" checked={isDeductible}
                    {...register("is_deductible")}
                    onChange={(e) => setIsDeductible(e.target.checked)}
                    className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Deducible</span>
                </label>
              )}
            </div>

            {select === 'expense' && isDeductible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>% deducible</label>
                  <input type="number" step="0.01" min="0" max="100"
                    {...register("deductible_percent", { valueAsNumber: true })}
                    value={deductiblePercent}
                    onChange={(e) => setDeductiblePercent(e.target.value)}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Nota fiscal</label>
                  <input {...register("tax_note")}
                    type="text" placeholder="Ej. Local de trabajo"
                    value={taxNote} onChange={(e) => setTaxNote(e.target.value)}
                    className={inputCls} />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 bg-primary text-white font-semibold py-2.5 px-6 rounded-xl shadow-md
                hover:brightness-110 active:scale-[0.98] transition-all duration-150 ease-in-out cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed">
              {recurrentEdit == null ? 'Crear recurrente' : 'Actualizar'}
            </button>
            <button type="button" onClick={close}
              className="flex-1 sm:flex-none sm:w-36 bg-background dark:bg-dark-background
                ring-1 ring-gray-200 dark:ring-gray-700 text-gray-600 dark:text-gray-300 font-semibold
                py-2.5 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98]
                transition-all duration-150 ease-in-out cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default RecurrentTransactionForm;
