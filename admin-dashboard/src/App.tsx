import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import DashboardHome from './pages/DashboardHome';
import Datasets from './pages/Datasets';
import Ingestion from './pages/Ingestion';
import Annotation from './pages/Annotation';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#050505]">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          {/* Topbar placeholder if needed, usually just search and profile */}
          <div className="flex justify-end mb-8">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono">JD</div>
          </div>

          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/ingestion" element={<Ingestion />} />
            <Route path="/annotation" element={<Annotation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
