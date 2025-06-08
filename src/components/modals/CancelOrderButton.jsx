import React, { useState } from "react";
import Modal from "./Modal";
import { CircleX } from "lucide-react";
import useCancelOrder from "../../hooks/useCancelOrder";

const CancelOrderButton = ({ tradeNo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cancelOrder = useCancelOrder();

  const handleCancel = async () => {
    await cancelOrder(tradeNo);
    
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-error w-auto"
      >
        <CircleX className="h-5 w-5" />
        取消订单
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="确认取消订单">
        <p className="mb-4">
          你确定要取消订单 <strong>#{tradeNo}</strong> 吗？
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setIsOpen(false)} className="btn btn-ghost">
            关闭
          </button>
          <button onClick={handleCancel} className="btn btn-error text-white">
            确认取消
          </button>
        </div>
      </Modal>
    </>
  );
};

export default CancelOrderButton;
