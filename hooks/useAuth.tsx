import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userRole: 'super-agent' | 'agent' | 'customer' | null;
  login: (role: 'super-agent' | 'agent' | 'customer') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<'super-agent' | 'agent' | 'customer' | null>(null);

  // In a real app, you'd fetch user role from async storage or an API after login
  useEffect(() => {
    // Simulate a logged-in user for testing purposes
    // setUserRole('super-agent'); // Uncomment to test super-agent tabs
    // setUserRole('agent'); // Uncomment to test agent tabs
    // setUserRole('customer'); // Uncomment to test customer tabs
  }, []);

  const login = (role: 'super-agent' | 'agent' | 'customer') => {
    setUserRole(role);
  };

  const logout = () => {
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
