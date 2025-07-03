import { useDispatch } from "react-redux";
import { cancelOrder, fetchOrders } from "../redux/slices/orderSlice";
import {fetchInfo} from "../redux/slices/userSlice";
import {toast} from "sonner";
import { useNavigate } from "react-router-dom";

const useCancelOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cancel = async (trade_no) => {
    try {
      // 取消订单
      const response = await dispatch(cancelOrder(trade_no)).unwrap();

      if (response.data === true) {
        toast.success("订单取消成功！");
        await dispatch(fetchOrders());
        await dispatch(fetchInfo());
        navigate("/order");
      } else {
        toast.error("取消订单失败：" + (response?.message || "未知原因"));
      }
    } catch (error) {
      toast.error("取消订单失败: " + (error.message || "未知错误"));
    }
  };

  return cancel;
};

export default useCancelOrder;