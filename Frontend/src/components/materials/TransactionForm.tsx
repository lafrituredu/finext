export function TransctionForm({ close }: any) {
  return (
    <div className="flex items-center justify-center fixed bg-[#0000006b] min-w-full min-h-full z-60 top-0 left-0"
      onClick={close}>
      <div className="absolute w-[60vh] h-fit bg-background dark:bg-dark-background dark:ring-2 dark:ring-gray-800 shadow-md rounded-2xl z-80 p-3 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col p-2 gap-y-4">
            <p className="flex justify-center text-2xl font-bold">Añadir transacción</p>

            <label>Nombre*</label>
            <input type="text" placeholder="Nombre" />

            <label>Tipo de transacción*</label>
            <select>
            <option>Ingreso</option>
            <option>Gasto</option>
            </select>

            <label>Importe*</label>
            <input type="number" placeholder="0.00€"/>

            <label>Fecha*</label>
            <input type="date" />

            <label>Tipo de IVA*</label>
            <select>
            <option>Selecciona</option>
            <option>Superreducido 4%</option>
            <option>Reducido 10%</option>
            <option>General 21%</option>
            </select>

            <label>Description</label>
            <input type="text" placeholder="Text..." />

            <label>Client</label>
            <input type="text" placeholder="Text..." />

            <label>Método de pago</label>
            <select>
                <option>Cash</option>
                <option>Tarjeta de credito</option>
                <option>Trueque</option>
            </select>

            <button className="bg-primary py-2 px-6 rounded-full shadow-md text-white cursor-pointer">Añadir</button>
        </div>
      </div>
    </div>
  );
}

export default TransctionForm;