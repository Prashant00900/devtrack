import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Certifications from "./pages/Certifications";
import SkillMap from "./pages/SkillMap";
import TargetRole from "./pages/TargetRole";
import GapAnalysis from "./pages/GapAnalysis";
import Roadmap from "./pages/Roadmap";
import Github from "./pages/Github";
import AiAnalysis from "./pages/AiAnalysis";
import Promotion from "./pages/Promotion";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/skill-map" element={<SkillMap />} />
        <Route path="/target-role" element={<TargetRole />} />
        <Route path="/gap-analysis" element={<GapAnalysis />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/github" element={<Github />} />
        <Route path="/ai-analysis" element={<AiAnalysis />} />
        <Route path="/promotion" element={<Promotion />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;