import { Routes, Route, Navigate } from 'react-router-dom';
import BuilderPage from './pages/BuilderPage';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="*" element={<Navigate to="/builder" replace />} />
    </Routes>
  );
}
