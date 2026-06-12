import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Classes from "./pages/Classes";
import AppLayout from "./components/AppLayout";
import ClassDetail from "./pages/ClassDetail";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import SecurityPage from "./pages/SecurityPage";
import ChangePassword from "./pages/ChangePassword";
import UserSessions from "./pages/UserSessions";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function ProtectedRoute({ children }) {
  const { accessToken, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-400">
        Loading...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* App */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="settings/security" element={<SecurityPage />} />
          <Route
            path="settings/security/change-password"
            element={<ChangePassword />}
          />
          <Route
            path="settings/security/user-sessions"
            element={<UserSessions />}
          />
          <Route path="classes" element={<Classes />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="classes/:classId" element={<ClassDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
