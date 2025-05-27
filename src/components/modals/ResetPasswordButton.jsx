import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import { changePassword } from "../../redux/slices/userSlice";
import { logout } from "../../redux/slices/passportSlice";


const ResetPasswordButton = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    if (!loading) setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(
        changePassword({
          oldPassword: form.currentPassword,
          newPassword: form.newPassword,
        })
      );

      const isSuccess =
        result.type === "user/changePassword/fulfilled" &&
        result.payload === true;

      if (isSuccess) {

        dispatch(logout());
        localStorage.removeItem("token");
        closeModal();
      } else {

      }
    } catch (error) {
  
    } finally {
      setLoading(false);
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <>
      <button onClick={openModal} className="btn btn-outline btn-neutral text-neutral-content btn-sm w-full">
        修改密码
      </button>

      <Modal isOpen={isOpen} onClose={closeModal} title="修改密码">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <input
              type="password"
              name="currentPassword"
              placeholder="当前密码"
              className="input input-bordered w-full"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <input
              type="password"
              name="newPassword"
              placeholder="新密码"
              className="input input-bordered w-full"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <input
              type="password"
              name="confirmPassword"
              placeholder="确认新密码"
              className="input input-bordered w-full"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="btn btn-outline"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent"
            >
              {loading ? "提交中..." : "确认修改"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ResetPasswordButton;
