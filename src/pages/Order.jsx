import { Outlet } from "react-router-dom";

const Order = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-base-100">
      <h2 className="text-xl font-bold mb-4 p-4 shrink-0">订单中心</h2>
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto min-h-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Order;
