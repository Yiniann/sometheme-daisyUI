import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * 受保护路由，仅允许已登录用户访问
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(
    (state) => state.passport.isAuthenticated
  );

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
