import { Outlet } from "react-router-dom";

const Order = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 h-full">订单中心</h2>
      <Outlet />
    </div>
  );
};

export default Order;
