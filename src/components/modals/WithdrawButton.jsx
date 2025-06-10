import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import {
  withdrawTicket,
  clearWithdrawStatus,
} from "../../redux/slices/ticketSlice";
import { toast } from "sonner";
import { Banknote } from "lucide-react";

const WithdrawButton = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.ticket.loading.withdrawTicket);

  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState("");
  const [method, setMethod] = useState("USDT");

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setAccount("");
    setMethod("USDT");
    dispatch(clearWithdrawStatus());
  };

  const handleWithdraw = async () => {
    if (!account.trim() || !method) {
      toast.error("请填写完整的提现信息");
      return;
    }

    try {
      const result = await dispatch(
        withdrawTicket({ withdraw_account: account.trim(), withdraw_method: method })
      );

      if (withdrawTicket.fulfilled.match(result)) {
        toast.success("提现申请成功,申请将以工单形式发起申请，请耐心等待");
        handleClose();
      } else {
        toast.error(result.payload || "提现失败");
      }
    } catch (err) {
      toast.error("发生错误");
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="btn btn-success btn-sm flex items-center"
      >
        <Banknote className="mr-1 h-4 w-4" />
        提现
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="申请提现">
        <div className="space-y-4">
          <label className="font-semibold" htmlFor="withdraw-method">
            提现方式
          </label>
          <select
            id="withdraw-method"
            className="select select-bordered w-full"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="USDT">USDT</option>
            <option value="支付宝">支付宝</option>
            <option value="Paypal">Paypal</option>
          </select>

          <label className="font-semibold" htmlFor="withdraw-account">
            提现账户
          </label>
          <input
            id="withdraw-account"
            type="text"
            placeholder="提现账户"
            className="input input-bordered w-full"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <button onClick={handleClose} className="btn btn-ghost btn-sm">
              取消
            </button>
            <button
              onClick={handleWithdraw}
              className="btn btn-neutral btn-sm"
              disabled={loading}
            >
              {loading ? "提交中..." : "确认提现"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WithdrawButton;