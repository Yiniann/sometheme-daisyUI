import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import { logout } from "../../redux/slices/passportSlice";

const LogoutButton = ({ onLogout }) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    if (!loading) setIsOpen(false);
  };
  

  const handleLogout = async () => {
  setLoading(true);
  try {
    await dispatch(logout()); 
    closeModal();
    if (onLogout) onLogout(); 
  } catch (err) {
    // 可以在这里 toast 错误信息
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      <button onClick={openModal} className="btn btn-error text-error-content btn-sm">
        退出登录
      </button>

      <Modal isOpen={isOpen} onClose={closeModal} title="确认退出登录？">
        <p className="mb-4">您确定要退出登录吗？</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={closeModal}
            disabled={loading}
            className="btn btn-outline"
          >
            取消
          </button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="btn btn-error"
          >
            {loading ? "退出中..." : "确认退出"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default LogoutButton;
