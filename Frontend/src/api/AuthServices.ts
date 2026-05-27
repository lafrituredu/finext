import api, { API_BASE_URL } from './axiosInstance'

export interface AuthResponse {
  // Common response returned by auth endpoints.
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
  // Extra tax data for autonomo users.
  dni?: string | null
  dni_set?: boolean
  birth_date?: string | null
  modulo_iva?: string | number | null
  civil_state?: string | null
  company?: string | null
  irpf: string | number | null
}

export interface UserProfile {
  // Main user data used by the profile page and protected views.
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
  // Data that can be changed from the profile form.
  username: string
  full_name: string
  phone_number?: string
  birth_date?: string
  modulo_iva?: string
  civil_state?: string
  company?: string
  irpf?: string
}

// LOGIN: send email and password to the backend.
// If they are correct, Laravel returns the user and a Sanctum token.
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/login', {
    email,
    password
  })

  return response.data
}

// REGISTER: send the prepared register data to the backend.
// The backend creates User and maybe Autonomo depending on rol.
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
  // Ask the backend to send the email verification message again.
  const response = await api.post<AuthResponse>('/email/verification-notification', {
    email,
    locale,
  })

  return response.data
}

export const sendPasswordResetEmail = async (email: string, locale?: 'en' | 'es'): Promise<AuthResponse> => {
  // Ask the backend to send a password reset email.
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
  // Send the reset token and the new password to the backend.
  const response = await api.post<AuthResponse>('/reset-password', data)

  return response.data
}

export const getGoogleAuthUrl = (): string =>
  // This URL starts the Google OAuth flow in Laravel.
  `${API_BASE_URL.replace(/\/$/, '')}/auth/google/redirect`

// GET CURRENT USER: protected endpoint.
// It loads the profile and checks that the current token still works.
export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/me');
  return response.data;
};

export const getCurrentUserRole = async (): Promise<UserRole> => {
  // Get only the user role when the frontend does not need the full profile.
  const response = await api.get<CurrentUserRoleResponse>('/me/role');
  return response.data.rol;
};

export const updateCurrentUser = async (
  data: UpdateUserProfilePayload
): Promise<UserProfile> => {
  // Save profile changes for the logged user.
  const response = await api.put<UserProfile>('/me', data);
  return response.data;
};

export const uploadCurrentUserAvatar = async (avatar: File): Promise<UserProfile> => {
  // Upload avatar as multipart form data.
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
  // Delete the current avatar from the backend.
  const response = await api.delete<UserProfile>('/me/avatar');
  return response.data;
};

export const deleteCurrentUserAccount = async (): Promise<AuthResponse> => {
  // Delete the logged user account.
  const response = await api.delete<AuthResponse>('/me');
  return response.data;
};


export const logoutUser = async (): Promise<void> => {
  // Close the backend session token and clean local data.
  await api.post('/logout');
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("session-last-activity");
  
};

// Before register, check if the email is free.
export const checkEmail = async (email: string) => {
  const response = await api.get(`/check-email?email=${email}`)
  return response.data
}

// Before register, check if the username is free.
export const checkUsername = async (username: string) => {
  const response = await api.get(`/check-username?username=${username}`)
  return response.data
}
