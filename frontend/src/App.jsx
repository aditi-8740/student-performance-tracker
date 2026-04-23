import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Classes from "./pages/Classes";
import AppLayout from './components/AppLayout';
import ClassDetail from "./pages/ClassDetail"
import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App */}
        <Route path="/app" element={<AppLayout />}>
          <Route path="classes" element={<Classes />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path='classes/:classId' element={<ClassDetail />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
