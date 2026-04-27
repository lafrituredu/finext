import api from './axiosInstance'

export interface AuthResponse {
  user?: any
  token?: string
  message: string
  requires_verification?: boolean
  code?: string
  email?: string
  already_verified?: boolean
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
  dni?: string
  birthdate?: string
  modulo_iva?: string
  estado_civil?: string
  empresa?: string
  irpf?: string
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/register', data)
  return response.data
}

export const resendVerificationEmail = async (email: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/email/verification-notification', {
    email,
  })

  return response.data
}

// GET CURRENT USER
export const getCurrentUser = async (): Promise<any> => {
  const response = await api.get('/me');
  return response.data;
};

// LOGOUT
export const logoutUser = async (): Promise<void> => {
  await api.post('/logout');
};

// CHECK EMAIL
export const checkEmail = async (email: string) => {
  const response = await api.get(`/check-email?email=${email}`)
  return response.data
}

// CHECK USERNAME
export const checkUsername = async (username: string) => {
  const response = await api.get(`/check-username?username=${username}`)
  return response.data
}
