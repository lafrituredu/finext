import api from './axiosInstance'

export interface AuthResponse {
  user?: {
    username: string
    [key: string]: unknown
  }
  token?: string
  message: string
  requires_verification?: boolean
  code?: string
  email?: string
  already_verified?: boolean
}

export interface AutonomoProfile {
  dni?: string | null
  dni_set?: boolean
  birth_date?: string | null
  modulo_iva?: string | number | null
  civil_state?: string | null
  company?: string | null
  irpf?: string | number | null
}

export interface UserProfile {
  id: number
  username: string
  full_name: string
  phone_number?: string | null
  rol: 'particular' | 'gestor' | 'autonomo'
  email: string
  email_verified_at?: string | null
  avatar?: string | null
  avatar_url?: string | null
  autonomo?: AutonomoProfile | null
  gestor?: Record<string, unknown> | null
}

export interface UpdateUserProfilePayload {
  username: string
  full_name: string
  phone_number?: string
  dni?: string
  birth_date?: string
  modulo_iva?: string
  civil_state?: string
  company?: string
  irpf?: string
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
  locale?: 'en' | 'es'
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/register', data)
  return response.data
}

export const resendVerificationEmail = async (email: string, locale?: 'en' | 'es'): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/email/verification-notification', {
    email,
    locale,
  })

  return response.data
}

export const sendPasswordResetEmail = async (email: string, locale?: 'en' | 'es'): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/forgot-password', {
    email,
    locale,
  })

  return response.data
}

export const resetUserPassword = async (data: {
  token: string
  email: string
  password: string
  password_confirmation: string
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/reset-password', data)

  return response.data
}

// GET CURRENT USER
export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/me');
  return response.data;
};

export const updateCurrentUser = async (
  data: UpdateUserProfilePayload
): Promise<UserProfile> => {
  const response = await api.put<UserProfile>('/me', data);
  return response.data;
};

export const uploadCurrentUserAvatar = async (avatar: File): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append('avatar', avatar);

  const response = await api.post<UserProfile>('/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteCurrentUserAvatar = async (): Promise<UserProfile> => {
  const response = await api.delete<UserProfile>('/me/avatar');
  return response.data;
};

export const deleteCurrentUserAccount = async (): Promise<AuthResponse> => {
  const response = await api.delete<AuthResponse>('/me');
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
