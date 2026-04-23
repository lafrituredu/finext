import api from './axiosInstance'

export interface Goal {
    user_id: number,
    name: string,
    target_amount: number,
    current_amount: number,
    start_date: Date | string,
    end_date: Date | string,
    completed: boolean
}

export const getGoals = async (): Promise<Goal[]> => {
    const response = await api.get<Goal[]>('/goals')
    return response.data
}