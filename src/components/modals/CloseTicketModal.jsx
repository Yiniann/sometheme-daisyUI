import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  closeTicket,
  clearCloseStatus,
  fetchTicketDetail,
  fetchTickets,
} from "../../redux/slices/ticketSlice";
import { toast } from "sonner";

const CloseTicketModal = ({ isOpen, onClose, selectedTicket }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ticket);

  const closeLoading = loading.closeTicket;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    setIsProcessing(true);
    try {
      const res = await dispatch(closeTicket(selectedTicket.id)).unwrap();

      if (res?.status === "success" && res?.data === true) {
        toast.success("工单已成功关闭");
        dispatch(fetchTicketDetail(selectedTicket.id)); // 刷新详情
        dispatch(clearCloseStatus());
        dispatch(fetchTickets());
        onClose();
      } else {
        toast.error("关闭工单失败");
      }
    } catch (error) {
      toast.error(`关闭失败：${error}`);
    } finally {
      setIsProcessing(false);
      dispatch(clearCloseStatus());
    }
  };

  // 弹窗关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      dispatch(clearCloseStatus());
    }
  }, [isOpen, dispatch]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="确认关闭工单">
      <div className="space-y-6 text-base-content">
        <p>你确定要关闭此工单吗？关闭后将无法继续回复。</p>
        <div className="flex justify-end gap-4">

          <button onClick={onClose} className="btn btn-outline">
            取消
          </button>
          <button
            onClick={handleCloseTicket}
            disabled={closeLoading || isProcessing}
            className={`btn btn-neutral ${
              closeLoading || isProcessing ? "btn-disabled" : ""
            }`}
          >
            {closeLoading || isProcessing ? "关闭中..." : "确认关闭"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CloseTicketModal;
