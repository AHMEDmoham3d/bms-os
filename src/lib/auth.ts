import type { AuthUser } from './types';

const AUTH_KEY = 'bmc_auth_user';

const VALID_CREDENTIALS = {
  username: 'ahmrd',
  password: 'ahmed'
};

export async function login(usernameOrEmail: string, password: string): Promise<AuthUser | null> {
  if (usernameOrEmail === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
    const user: AuthUser = {
      id: '1',
      username: usernameOrEmail,
      email: 'ahmedmoham3dceo@gmail.com',
      role: 'admin'
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }

  console.error('Login failed: Invalid credentials');
  return null;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser(): AuthUser | null {
  try {
    const userJson = localStorage.getItem(AUTH_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    logout();
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

