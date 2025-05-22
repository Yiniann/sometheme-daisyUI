import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AppLayout from "./layouts/AppLayout";
import LoginLayout from "./layouts/LoginLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Plan from "./pages/Plan";
import Order from "./pages/Order";
import Ticket from "./pages/Ticket";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const isAuthenticated = useSelector(
    (state) => state.passport.isAuthenticated
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页：未登录可访问，已登录跳转首页 */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LoginLayout />
          }
        >
          <Route index element={<Login />} />
        </Route>

        {/* 主应用：仅登录后可访问 */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="plan" element={<Plan />} />
          <Route path="order" element={<Order />} />
          <Route path="ticket" element={<Ticket />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 页面 */}
        <Route
          path="*"
          element={
            isAuthenticated ? <NotFound /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
