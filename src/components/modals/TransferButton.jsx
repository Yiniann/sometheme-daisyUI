import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { transferCommission, fetchInfo } from "../../redux/slices/userSlice";
import { fetchInviteData } from "../../redux/slices/inviteSlice";
import { toast } from "sonner";
import { WalletCards, AlertCircle } from "lucide-react";

const TransferButton = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading.transferCommission);
  const commissionBalance = useSelector((state) => state.user.info.commission_balance);

  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setAmount("");
  };

  const handleTransfer = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("请输入有效金额");
      return;
    }

    try {
      const result = await dispatch(
        transferCommission({ transferAmount: amount * 100 })
      );

      if (transferCommission.fulfilled.match(result)) {
        toast.success("划转成功");
        handleClose();
        dispatch(fetchInfo());
        dispatch(fetchInviteData());
      } else {
        toast.error(result.payload || "划转失败");
      }
    } catch (err) {
      toast.error("发生错误");
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="btn btn-primary btn-sm flex items-center"
      >
        <WalletCards className="mr-1 h-4 w-4" />
        划转
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="划转佣金">
        <div className="space-y-4">
          {/* 提示框 */}
          <div className="alert alert-warning">
            <AlertCircle className="h-5 w-5" />
            <span>划转后的余额仅用于消费使用</span>
          </div>

          {/* 可划转金额 */}
          <div className="text-base-content">
            可划转金额：
            <span className="text-neutral">
              ¥{(commissionBalance / 100).toFixed(2)}
            </span>
          </div>

          {/* 输入框 */}
          <input
            type="number"
            placeholder="输入划转金额"
            className="input input-bordered w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* 操作按钮 */}
          <div className="flex justify-end gap-2">
            <button onClick={handleClose} className="btn btn-ghost btn-sm">
              取消
            </button>
            <button
              onClick={handleTransfer}
              className="btn btn-neutral btn-sm"
              disabled={loading}
            >
              {loading ? "划转中..." : "确认划转"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TransferButton;