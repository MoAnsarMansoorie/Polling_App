// import { createContext, useContext, useState } from 'react';

// interface AdminContextType {
//   isAdmin: boolean;
//   login: (password: string) => boolean;
//   logout: () => void;
// }

// const AdminContext = createContext<AdminContextType | undefined>(undefined);

// export function AdminProvider({ children }: { children: React.ReactNode }) {
//   const [isAdmin, setIsAdmin] = useState(() => {
//     return localStorage.getItem('isAdmin') === 'true';
//   });

//   const login = (password: string) => {
//     if (password === 'admin123') {
//       setIsAdmin(true);
//       localStorage.setItem('isAdmin', 'true');
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setIsAdmin(false);
//     localStorage.removeItem('isAdmin');
//   };

//   return (
//     <AdminContext.Provider value={{ isAdmin, login, logout }}>
//       {children}
//     </AdminContext.Provider>
//   );
// }

// export const useAdmin = () => {
//   const context = useContext(AdminContext);
//   if (!context) throw new Error('useAdmin must be used within AdminProvider');
//   return context;
// };