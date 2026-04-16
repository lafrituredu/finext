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

// Devolvems el status para ver si es 201
export const createCategory = async(): Promise<Number> => {
    const response = await api.post<Category>('/categories', {
        name: 'prueba'
    });
    return response.status;
}

export const deleteCategory = async(id:number): Promise<Number> => {
    const response = await api.delete<Category>(`/categories/${id}`);
    return response.status;
}