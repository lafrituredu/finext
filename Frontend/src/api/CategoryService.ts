import { getCurrentUser } from './AuthServices'
import api from './axiosInstance'

export interface Category {
    id: number,
    name: string,
    user_id: number,
    user: {
        id: number,
        username: string
    } | null
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories')
    return response.data
}

// Devolvems el status para ver si es 201
export const createCategory = async(paramName:string): Promise<Number> => {
    if (paramName == undefined || paramName == "") {
        return 500;
    }
    const response = await api.post('/categories', {
        name: paramName
    });
    return response.status;
}

export const deleteCategory = async(id:number): Promise<Number> => {
    const response = await api.delete<Category>(`/categories/${id}`);
    return response.status;
}