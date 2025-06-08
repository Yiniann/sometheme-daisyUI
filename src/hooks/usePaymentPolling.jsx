import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { checkOrderStatus } from "../redux/slices/orderSlice";

const usePaymentPolling = () => {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  const startPolling = (trade_no, onSuccess, onCancel, onFailure) => {
    if (!trade_no) {
      console.error("未提供订单号，无法启动轮询！");
      return;
    }

    // 避免重复开轮询
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // ✅ 手动立即执行一次轮询请求
    const pollOnce = async () => {
      console.log("立即执行一次轮询... 订单号:", trade_no);
      const response = await dispatch(checkOrderStatus({ trade_no }));
      const { status, message, data } = response.payload;

      if (status === "success") {
        if (data === 3 || data === 4) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onSuccess && onSuccess(message);
        } else if (data === 2) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onCancel && onCancel();
        }
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        onFailure && onFailure(message);
      }
    };

    pollOnce(); // ✅ 立即执行

    intervalRef.current = setInterval(async () => {
      console.log("轮询中... 订单号:", trade_no);
      const response = await dispatch(checkOrderStatus({ trade_no }));

      const { status, message, data } = response.payload;

      if (status === "success") {
        if (data === 3 || data === 4) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onSuccess && onSuccess(message);
        } else if (data === 2) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onCancel && onCancel();
        }
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        onFailure && onFailure(message);
      }
    }, 5000);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 组件卸载时自动清理轮询
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return { startPolling, stopPolling };
};

export default usePaymentPolling;