import api from './axiosInstance'
import type { Transaction } from './TransactionService'

export type RecurrentFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export interface RecurrentTransaction {
  // Shape of one recurrent transaction returned by Laravel.
  id: number
  user_id: number
  category_id: number | null
  name: string
  type: 'income' | 'expense'
  total_amount: number
  iva_percent: number
  client: string | null
  description: string | null
  payment_method: string | null
  frequency: RecurrentFrequency
  start_date: string
  next_run_date: string
  end_date: string | null
  active: boolean
  creates_bill: boolean
  last_generated_at: string | null
  created_at: string
  user: {
    id: number
    username: string
  }
  category: {
    id: number
    color: string
    name: string
  } | null
}

export interface GenerateRecurrentResponse {
  // The backend returns the new transaction and the updated recurrent item.
  transaction: Transaction
  recurrent_transaction: RecurrentTransaction
}

export const getRecurrentTransactions = async (): Promise<RecurrentTransaction[]> => {
  // Get all recurrent transactions for the logged user.
  const response = await api.get<RecurrentTransaction[]>('/recurrent-transactions')
  return response.data
}

export const createRecurrentTransaction = async (data: any): Promise<RecurrentTransaction> => {
  // Create a new recurrent transaction.
  const response = await api.post<RecurrentTransaction>('/recurrent-transactions', data)
  return response.data
}

export const updateRecurrentTransaction = async (data: any, id: number): Promise<RecurrentTransaction> => {
  // Update one recurrent transaction by id.
  const response = await api.put<RecurrentTransaction>(`/recurrent-transactions/${id}`, data)
  return response.data
}

export const deleteRecurrentTransaction = async (id: number): Promise<void> => {
  // Delete one recurrent transaction by id.
  await api.delete(`/recurrent-transactions/${id}`)
}

export const generateRecurrentTransaction = async (id: number): Promise<GenerateRecurrentResponse> => {
  // Manually create the next real transaction from this recurrent transaction.
  const response = await api.post<GenerateRecurrentResponse>(`/recurrent-transactions/${id}/generate`)
  return response.data
}
