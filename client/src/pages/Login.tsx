// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { useAdmin } from '@/contexts/AdminContext';

// export default function Login() {
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useAdmin();
//   const navigate = useNavigate();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (login(password)) {
//       navigate('/admin/dashboard');
//     } else {
//       setError('Invalid password');
//     }
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-md">
//       <Card>
//         <CardHeader>
//           <h1 className="text-2xl font-bold">Admin Login</h1>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input
//               type="password"
//               placeholder="Enter admin password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             <Button type="submit" className="w-full">Login</Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }