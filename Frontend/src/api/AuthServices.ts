import api from './axiosInstance'

export interface AuthResponse {
  user: any
  token: string
  message: string
}

// LOGIN
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/login', {
    email,
    password
  })

  return response.data
}

// REGISTER
export const registerUser = async (data: {
  email: string
  password: string
  username: string
  full_name: string
  phone_number: string
  rol: string
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/register', data)
  return response.data
}