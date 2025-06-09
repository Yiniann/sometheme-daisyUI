import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchTicketDetail } from "../redux/slices/ticketSlice";

const pollInterval = 5000;

const usePollTicketDetail = (ticketId) => {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!ticketId) return;

    // 先立即拉一次详情
    dispatch(fetchTicketDetail(ticketId));

    // 清除旧的轮询定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      console.log("Clearing previous interval");
    }

    // 设置新的轮询
    intervalRef.current = setInterval(() => {
      console.log(`Polling for ticket ID: ${ticketId}`);
      dispatch(fetchTicketDetail(ticketId));
    }, pollInterval);

    // 清理定时器
    return () => {
      clearInterval(intervalRef.current);
      console.log("Cleaning up interval on unmount or ticket change");
    };
  }, [ticketId, dispatch]);
};

export default usePollTicketDetail;