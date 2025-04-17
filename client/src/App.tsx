import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/dashboard';
import PollsList from './pages/polls';
import PollResults from './pages/results';
import Layout from './pages/layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/polls" element={<PollsList />} />
          <Route path="/results/:pollId" element={<PollResults />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;