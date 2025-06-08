import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchPaymentMethods,
  fetchOrderDetails,
  checkout,
} from "../../redux/slices/orderSlice";
import PaymentQRCode from "./PaymentQRCode";
import usePaymentPolling from "../../hooks/usePaymentPolling";
import { toast } from "sonner";
import CancelOrderButton from "../modals/CancelOrderButton";
import StatusMessage from "../../components/ui/StatusMessage";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trade_no } = useParams();
  const {
    orderDetails: order,
    paymentMethods,
    loading,
    error,
  } = useSelector((state) => state.order);
  const { startPolling } = usePaymentPolling();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

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

  useEffect(() => {
    if (trade_no) {
      dispatch(fetchOrderDetails(trade_no));
    }
  }, [dispatch, trade_no]);

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0) {
      setSelectedPaymentMethod(paymentMethods[0]);
    }
  }, [paymentMethods]);

  const handlePaymentChange = (event) => {
    const method = paymentMethods.find(
      (m) => m.id === parseInt(event.target.value),
    );
    setSelectedPaymentMethod(method);
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      toast.error("请选择付款方式");
      return;
    }

    try {
      const result = await dispatch(
        checkout({
          trade_no,
          method: selectedPaymentMethod.id,
        }),
      );

      if (!result || !result.payload) {
        toast.error("请求失败：无响应数据");
        return;
      }

      const { type, data, message } = result.payload;

      if (type === 1) {
        // 跳转支付
        window.open(data, "_blank");
      } else if (type === 0) {
        // 展示二维码
        if (!data) {
          toast.error("二维码生成失败，请稍后再试");
          return;
        }
        setPaymentUrl(data);
        setModalIsOpen(true);
      } else {
        toast.error(message || "未知的支付类型响应");
      }

      if (trade_no) {
        startPolling(
          trade_no,
          (message) => {
            toast.success(`支付成功：${message}`);
            navigate("/order");
          },
          () => {
            toast("订单已取消");
            navigate("/order");
          },
          (message) => {
            toast.error(`支付失败：${message}`);
          },
        );
      } else {
        toast.error("订单号不存在！");
      }
    } catch (error) {
      console.error("checkout error:", error);
      toast.error("结账请求出错，请稍后再试");
    }
  };


  return (
    <StatusMessage
      loading={loading.fetchOrderDetails}
      error={error.fetchOrderDetails}
      loadingText="正在加载订单详情..."
      errorText="加载订单失败"
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* 左侧 */}
        <div className="flex flex-1 flex-col space-y-4">
          {/* 计划信息卡片 */}
          <div className="flex flex-col overflow-hidden rounded bg-base-100 shadow-md">
            <div className="bg-base-200 p-4">
              <h3 className="text-xl font-semibold text-base-content">计划信息</h3>
            </div>
            <div className="space-y-2 p-4 text-base-content">
              <p>
                <strong>计划名称:</strong> {order?.plan?.name || "加载中..."}
              </p>
              <p>
                <strong>类型/周期</strong>{" "}
                {periodTextMap[order?.period] || order?.period}
              </p>
              <p>
                <strong>产品流量:</strong> {order?.plan?.transfer_enable} GB
              </p>
            </div>
          </div>

          {/* 订单信息卡片 */}
          <div className="flex flex-col overflow-hidden rounded bg-base-100 shadow-md">
            <div className="flex items-center justify-between bg-base-200 p-4">
              <h3 className="text-xl font-semibold text-base-content">订单信息</h3>
              <CancelOrderButton tradeNo={order?.trade_no} />
            </div>
            <div className="space-y-2 p-4 text-base-content">
              <p>
                <strong>订单号:</strong> {order?.trade_no}
              </p>
              {order && order?.balance_amount !== null && (
                <p>
                  <strong>使用余额:</strong> ¥
                  {(order.balance_amount / 100).toFixed(2)}
                </p>
              )}
              {order && order?.discount_amount !== null && (
                <p>
                  <strong>优惠金额:</strong> ¥
                  {(order.discount_amount / 100).toFixed(2)}
                </p>
              )}
              {order && order?.surplus_amount !== null && (
                <p>
                  <strong>旧订阅折抵金额</strong> ¥
                  {(order.surplus_amount / 100).toFixed(2)}
                </p>
              )}
              {order && order?.refund_amount !== null && (
                <p>
                  <strong>退款金额:</strong> ¥
                  {(order.refund_amount / 100).toFixed(2)}
                </p>
              )}
              <p>
                <strong>创建时间:</strong>{" "}
                {new Date(order?.created_at * 1000).toLocaleString()}
              </p>
            </div>
          </div>

          {/* 支付方式卡片 */}
          <div className="flex flex-col overflow-hidden rounded bg-base-100 shadow-md">
            <div className="bg-base-200 p-4">
              <h3 className="text-xl font-semibold text-base-content">支付方式</h3>
            </div>
            <div className="space-y-2 p-4 text-base-content">
              <p>
                <strong>选择支付方式:</strong>
              </p>
              <select
                value={selectedPaymentMethod?.id || ""}
                onChange={handlePaymentChange}
                className="select select-bordered w-full"
              >
                {paymentMethods && paymentMethods.length > 0 ? (
                  paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))
                ) : (
                  <option disabled>暂无支付方式</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* 右侧 */}
        <div className="flex w-full flex-shrink-0 flex-col space-y-4 lg:w-80">
          <div className="flex flex-col overflow-hidden rounded shadow-md">
            <h3 className="p-4 text-xl font-semibold bg-base-200">订单总额</h3>

            {/* 原价 */}
            <div className="flex justify-between p-4">
              <span>
                {order?.plan?.name} ×{" "}
                {periodTextMap[order?.period] || order?.period}
              </span>
              <span>¥{(order?.plan?.[order?.period] / 100).toFixed(2)}</span>
            </div>

            {/* 价格明细 */}
            <div className="space-y-2 px-4 pb-4 text-sm ">
              {order?.discount_amount !== null && (
                <p className="flex justify-between">
                  <span>优惠金额</span>
                  <span>- ¥{(order?.discount_amount / 100).toFixed(2)}</span>
                </p>
              )}
              {order?.surplus_amount !== null && (
                <p className="flex justify-between">
                  <span>抵扣订单</span>
                  <span>- ¥{(order?.surplus_amount / 100).toFixed(2)}</span>
                </p>
              )}
              {order?.refund_amount !== null && (
                <p className="flex justify-between">
                  <span>退款金额</span>
                  <span> ¥{(order?.refund_amount / 100).toFixed(2)}</span>
                </p>
              )}
              {order?.balance_amount !== null && (
                <p className="flex justify-between">
                  <span>使用余额</span>
                  <span>- ¥{(order?.balance_amount / 100).toFixed(2)}</span>
                </p>
              )}
            </div>

            {/* 实付金额 + 按钮 */}
            <div className="px-4 pb-4 ">
              <p className="mb-2 flex justify-between text-base font-semibold">
                <span>应付金额</span>
                <span>¥{(order?.total_amount / 100).toFixed(2)}</span>
              </p>
              <button
                onClick={handleCheckout}
                className="mt-2 btn btn-neutral w-full"
                disabled={
                  loading.saveOrder || error.saveOrder || !selectedPaymentMethod
                }
              >
                {loading.saveOrder ? "正在处理结账..." : "结账"}
              </button>
            </div>
          </div>
        </div>

        {/* 显示二维码模态框 */}
        <PaymentQRCode
          isOpen={modalIsOpen}
          paymentUrl={paymentUrl}
          onClose={() => setModalIsOpen(false)}
        />
      </div>
    </StatusMessage>
  );
};

export default OrderDetails;
