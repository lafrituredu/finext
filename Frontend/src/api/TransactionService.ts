import api from './axiosInstance'

export interface Transaction {
    id: number
    user_id: number
    category_id: number | null
    name: string
    date: string
    type: 'income' | 'expense'
    total_amount: number
    iva_percent: number
    client: string | null
    description: string | null
    payment_method: string | null
    status: boolean | null
    recurrent: boolean
    recurrent_timer: string | null
    created_at: string
    user: {
        id: number
        username: string}
    category: {
        id: number
        name: string
    }
}

export const getTransactions = async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions')
    return response.data
}

export const createTransaction = async (data: any) => {
  const response = await api.post("/transactions", data);
  return response.data;
};

export const updateTransaction = async(data:any,id:number) => {
    const response = await api.put(`/transactions/${id}`, data)
    return response.data;
}

export const deleteTransaction = async (id:number): Promise<void> => {
    await api.delete(`/transactions/${id}`)
}