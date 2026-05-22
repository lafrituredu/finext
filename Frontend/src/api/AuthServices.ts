import api, { API_BASE_URL } from './axiosInstance'

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
  irpf: string | number | null
}

export interface UserProfile {
  id: number
  username: string
  full_name: string
  phone_number?: string | null
  rol: 'particular' | 'autonomo'
  email: string
  email_verified_at?: string | null
  avatar?: string | null
  avatar_url?: string | null
  autonomo: AutonomoProfile | null
}

export type UserRole = UserProfile['rol']

export interface CurrentUserRoleResponse {
  rol: UserRole
}

export interface UpdateUserProfilePayload {
  username: string
  full_name: string
  phone_number?: string
  birth_date?: string
  modulo_iva?: string
  civil_state?: string
  company?: string
  irpf?: string
}

// LOGIN: envia credenciales al backend. Si son validas, Laravel devuelve
// el usuario y un token Sanctum que la vista guardara en localStorage.
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/login', {
    email,
    password
  })

  return response.data
}

// REGISTER: recibe el payload ya preparado desde la vista. El backend decide
// si crea solo User o tambien Autonomo segun el campo rol.
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
  google_setup_token?: string
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

export const getGoogleAuthUrl = (): string =>
  `${API_BASE_URL.replace(/\/$/, '')}/auth/google/redirect`

// GET CURRENT USER: endpoint protegido. Sirve para cargar perfil y tambien
// para comprobar si el token actual sigue siendo valido.
export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/me');
  return response.data;
};

export const getCurrentUserRole = async (): Promise<UserRole> => {
  const response = await api.get<CurrentUserRoleResponse>('/me/role');
  return response.data.rol;
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


export const logoutUser = async (): Promise<void> => {
  await api.post('/logout');
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("session-last-activity");
  
};

//validacion previa al registro para avisar antes de enviar todo el formulario.
export const checkEmail = async (email: string) => {
  const response = await api.get(`/check-email?email=${email}`)
  return response.data
}

//validacion previa al registro para evitar usernames duplicados.
export const checkUsername = async (username: string) => {
  const response = await api.get(`/check-username?username=${username}`)
  return response.data
}
