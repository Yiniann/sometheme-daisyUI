import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import CancelOrderButton from "../modals/CancelOrderButton";
import StatusMessage from "../../components/ui/StatusMessage";
import {
  CircleCheck,
  Clock4,
  CircleX,
  CircleDollarSign,
  Search,
  ShoppingCart,
  PackageSearch,
} from "lucide-react";

const statusTextMap = {
  0: "待支付",
  2: "已取消",
  3: "已完成",
};

const typeTextMap = {
  1: "新购",
  2: "续费",
  3: "升级",
  4: "补充",
};

const periodTextMap = {
  month_price: "单月订阅",
  quarter_price: "季度订阅",
  half_year_price: "半年订阅",
  year_price: "年度订阅",
  two_year_price: "两年订阅",
  three_year_price: "三年订阅",
  onetime_price: "一次性订阅",
  reset_price: "重置流量",
};

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.order.orders);
const loading = useSelector((state) => state.order.loading.fetchOrders);
  const error = useSelector((state) => state.order.error.fetchOrders);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState(Object.keys(statusTextMap));
  const [selectedTypes, setSelectedTypes] = useState(Object.keys(typeTextMap));

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleOrderClick = (order) => {
    navigate(`/order/${order.trade_no}`);
  };

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.trade_no.includes(searchTerm);
    const matchesStatus = selectedStatuses.includes(String(order.status));
    const matchesType = selectedTypes.includes(String(order.type));
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
      <div className="flex flex-col gap-4 lg:flex-row max-w-7xl mx-auto lg:p-4 h-[calc(100vh-4rem)]">
        <div className="w-auto flex-1 space-y-4 overflow-y-auto scrollbar-hide">
        <StatusMessage
          loading={loading}
          error={error}
          loadingText="正在加载订单列表..."
          errorText="加载订单列表失败，请稍后重试">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="relative rounded-2xl bg-base-100 p-4 shadow-md"
            >
              <div className="absolute top-12 right-4 flex items-center text-sm sm:top-4">
                {order.status === 0 && <Clock4 className="mr-1 h-4 w-4 text-warning" />}
                {order.status === 1 && <CircleCheck className="mr-1 h-4 w-4 text-success" />}
                {order.status === 2 && <CircleX className="mr-1 h-4 w-4 text-error" />}
                {order.status === 3 && <CircleCheck className="mr-1 h-4 w-4 text-primary" />}
                {order.status === 4 && <CircleCheck className="mr-1 h-4 w-4 text-base-content/50" />}
                <span>{statusTextMap[order.status]}</span>
              </div>

              <h2 className="mb-2 text-lg font-semibold text-base-content">#{order.trade_no}</h2>
              <p className="mb-4 text-sm text-base-content/70">
                创建于 {new Date(order.created_at * 1000).toLocaleString()}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-base-content">产品名称</span>
                  <span>{order.plan.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-base-content">付款周期</span>
                  <span className="flex items-center">
                    <CircleDollarSign className="mr-1 h-4 w-4 text-success" />
                    {periodTextMap[order.period] || order.period}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-base-content">产品流量</span>
                  <span>{order.plan.transfer_enable}GB</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-base-content">订单类型</span>
                  <span>{typeTextMap[order.type]}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xl font-medium text-base-content">总计</span>
                  <span className="text-2xl text-netural">
                    ¥
                    {(order.total_amount / 100).toLocaleString("zh-CN", {
                      minimumFractionDigits: 2,
                    })}
                    CNY
                  </span>
                </div>

                {order.status === 0 && (
                  <div className="mt-4 flex flex-row gap-2">
                    <button
                      onClick={() => handleOrderClick(order)}
                      className="btn btn-neutral flex-1"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      结算订单
                    </button>
                    <CancelOrderButton tradeNo={order.trade_no} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="mt-10 flex w-full flex-col items-center justify-center px-4 text-center text-base-content/70">
              <PackageSearch className="mb-4 h-16 w-16 text-base-content/40" />
              <p className="text-lg font-semibold text-base-content">没有符合条件的订单</p>
              <p className="mt-1 text-sm">你可以尝试调整筛选条件或刷新订单列表</p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatuses(Object.keys(statusTextMap));
                  setSelectedTypes(Object.keys(typeTextMap));
                  dispatch(fetchOrders());
                }}
                className="btn btn-primary mt-4"
              >
                重置筛选条件
              </button>

              <div className="my-10 flex w-full max-w-md flex-col items-center">
                <div className="mb-4 w-full border-t" />
                <p className="mb-2 text-lg font-semibold text-base-content">探索我们的订阅服务</p>
                <p className="mt-1 text-sm text-base-content/70">查看我们的计划找到适合自己的服务。</p>
              </div>

              <button
                onClick={() => navigate("/plan")}
                className="btn btn-secondary mt-2"
              >
                查看订阅计划
              </button>
            </div>
          )}
        </StatusMessage>
      </div>

      <div className="hidden space-y-4 rounded p-4 lg:block lg:w-1/4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-base-content/50" />
          <input
            type="text"
            placeholder="搜索订单号"
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <p className="mb-1 text-xl font-medium text-base-content">订单状态</p>
          {Object.entries(statusTextMap).map(([key, label]) => (
            <label key={key} className="my-2 flex items-center space-x-2 text-base-content">
              <input
                type="checkbox"
                value={key}
                checked={selectedStatuses.includes(key)}
                onChange={() => toggleStatus(key)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div>
          <p className="mb-1 text-xl font-medium text-base-content">订单类型</p>
          {Object.entries(typeTextMap).map(([key, label]) => (
            <label key={key} className="my-2 flex items-center space-x-2 text-base-content">
              <input
                type="checkbox"
                value={key}
                checked={selectedTypes.includes(key)}
                onChange={() => toggleType(key)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
