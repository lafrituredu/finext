/**
 * Utilidades para manejo de autenticación
 */

// Obtener el token de autenticación
export const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// Obtener los datos del usuario
export const getUser = (): any | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Cerrar sesión (eliminar token y datos del usuario)
export const logout = async (): Promise<void> => {
  const token = getAuthToken();

  if (token) {
    try {
      // Llamar al endpoint de logout del backend
      await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  // Limpiar localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Redirigir al login
  window.location.href = "/login";
};

// Hacer peticiones autenticadas a la API
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Si el token expiró o es inválido, cerrar sesión
  if (response.status === 401) {
    await logout();
    throw new Error("Sesión expirada");
  }

  return response;
};