import { Link } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
              Polling App
            </Link>
            <div className="space-x-4">
              <Link to="/polls" className="hover:text-primary">
                Polls
              </Link>
              <Link to="/admin/dashboard" className="hover:text-primary">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}