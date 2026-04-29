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

export const contribute = async (id:number,cashToAdd:number) => {
    const response = await api.put<Goal[]>(`/goals/contribute/${id}`, {
        contribution: cashToAdd
    })
    return response.status
} 
export const getRecomendation = (goal:Goal,cashflow:number) => {
    const percent = 0.35;
    const difference = goal.target_amount - goal.current_amount;
    
    const now = new Date();
    const end = new Date(goal.end_date);

    const months = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
    
    const goalMonthly = months != 0 ? difference / months : difference;

    if (goalMonthly*1.15 > cashflow*percent) {
        return -1;
    }else if (goalMonthly < cashflow*percent*0.9){
        return 1;
    }else{
        return 0;
    }
}
