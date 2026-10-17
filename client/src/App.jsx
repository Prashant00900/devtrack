import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
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
import Learn from "./pages/Learn";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Tracker from "./pages/Tracker";
import MockInterview from "./pages/MockInterview";
import EnglishCoach from "./pages/EnglishCoach";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

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
        <Route path="/promotion" element={<Promotion />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/english-coach" element={<EnglishCoach />} />
        <Route path="/ai-analysis" element={<AiAnalysis />} />
        <Route path="/github" element={<Github />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;