/**
 * Servicio de autenticación para manejar Google OAuth y JWT tokens
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: User;
}

class AuthService {
  /**
   * Eliminador muy simple de tags HTML (solo para defensa básica)
   * Nota: para sanitización más robusta usar DOMPurify.
   */
  private stripTags(value?: string | null): string {
    if (!value) return "";
    return value.replace(/<[^>]*>/g, "");
  }
  /**
   * Guarda los tokens de autenticación en localStorage
   */
  saveTokens(accessToken: string, refreshToken: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  /**
   * Obtiene el access token del localStorage
   */
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  /**
   * Obtiene el refresh token del localStorage
   */
  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  /**
   * Obtiene la información del usuario del localStorage
   */
  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * Refresca el access token usando el refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access);
      }
      
      return data.access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return null;
    }
  }

  /**
   * Realiza una petición autenticada al backend
   */
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    let accessToken = this.getAccessToken();

    // Primer intento con el token actual
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // Si el token expiró, intenta refrescarlo
    if (response.status === 401) {
      accessToken = await this.refreshAccessToken();
      
      if (accessToken) {
        // Reintenta la petición con el nuevo token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      }
    }

    return response;
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
  }

  /**
   * Procesa los parámetros de la URL después del callback de Google
   */
  handleAuthCallback(): { success: boolean; error?: string } {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      const error = params.get('error');
      if (error) {
        return { success: false, error };
      }

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const userId = params.get('user_id');
      const email = params.get('email');
      const firstName = params.get('first_name');
      const lastName = params.get('last_name');

      if (accessToken && refreshToken && userId && email) {
        this.saveTokens(accessToken, refreshToken, {
          id: userId,
          email: this.stripTags(email || ''),
          first_name: this.stripTags(firstName || ''),
          last_name: this.stripTags(lastName || ''),
          username: this.stripTags(email || ''),
        });

        // Limpiar la URL
        window.history.replaceState({}, document.title, window.location.pathname);

        return { success: true };
      }
    }

    return { success: false };
  }
}

export const authService = new AuthService();
export default authService;
