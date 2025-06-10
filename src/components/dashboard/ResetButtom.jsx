import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "../modals/Modal";
import { resetSecurity } from "../../redux/slices/userSlice";
import { RotateCcw } from "lucide-react";

const ResetButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const onResetConfirm = async () => {
    try {
      const actionResult = await dispatch(resetSecurity());
      if (resetSecurity.fulfilled.match(actionResult)) {
        setIsOpen(false);
      } else {
        throw new Error("请求未成功");
      }
    } catch (error) {
      console.error("重置失败:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-dash btn-error btn-sm flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        重置链接
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="确认重置订阅链接？">
        <div className="space-y-4">
          <p className="text-sm">
            原有链接将失效，您需要重新在代理客户端中导入新链接以继续使用服务。
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-sm btn-ghost"
            >
              取消
            </button>
            <button
              onClick={onResetConfirm}
              className="btn btn-sm btn-neutral"
            >
              确认重置
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ResetButton;
