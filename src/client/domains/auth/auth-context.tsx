import { createContext, useCallback, useState } from 'react';
import { verifyAdminPassword } from '#/server/auth/auth.controller';

type AuthContextValue = {
  isAdmin: boolean;
  login: (password: string) => Promise<{ success: boolean }>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = useCallback(async (password: string) => {
    const result = await verifyAdminPassword({ data: password });
    if (result.success) {
      setIsAdmin(true);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
