import api from './axiosInstance'

export interface Bill {
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

export const getBills = async (): Promise<Bill[]> => {
    const response = await api.get<Bill[]>('/transactions')
    return response.data
}

export const createBill = async (data: any) => {
  const response = await api.post("/transactions", data);
  return response.data;
};

export const updateBill = async(data:any,id:number) => {
    const response = await api.put(`/transactions/${id}`, data)
    return response.data;
}

export const deleteBill = async (id:number): Promise<void> => {
    await api.delete(`/transactions/${id}`)
}