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
import OrderList from "./components/order/OrderList";
import OrderDetail from "./components/order/OrderDetail";
import Ticket from "./pages/Ticket";
import Knowledge from './pages/Knowledge'
import Wallet from "./pages/Wallet";

import { useThemeInit } from "./hooks/useThemeInit";//主题初始化
import ProtectedRoute from "./components/ProtectedRoute";//保护路由
import { HelmetProvider,Helmet } from "react-helmet-async";//Helmet
import { getValue } from "./config/runtimeConfig";

const App = () => {
  const siteName = getValue("siteName","App")
  const favicon = getValue("favicon","")
  const isAuthenticated = useSelector(
    (state) => state.passport.isAuthenticated
  );
  useThemeInit()

  return (
     <HelmetProvider>
      <Helmet>
        <title>{siteName}</title>
        <meta name="description" content="Network Server" />
        <link rel="icon" href={favicon} />
      </Helmet>
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

            <Route path="order" element={<Order />}>
              <Route index element={<OrderList />} />
              <Route path="/order/:trade_no" element={<OrderDetail />} />
            </Route>

            <Route path="ticket" element={<Ticket />} />
            <Route path="knowledge" element={<Knowledge />}>
              <Route path=":id" element={<Knowledge />} />
            </Route>
            <Route path="wallet" element={<Wallet />} />
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
    </HelmetProvider>
  );
};

export default App;
