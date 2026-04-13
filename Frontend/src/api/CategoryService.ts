import api from './axiosInstance'

export interface Category {
    id: number,
    name: string,
    user: {
        id: number,
        username: string
    } | null
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories')
    return response.data
}