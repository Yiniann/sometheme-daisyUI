import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTicket,
  fetchTickets,
  clearCreateStatus,
  fetchTicketDetail,
} from "../../redux/slices/ticketSlice";
import Modal from "./Modal";
import { toast } from "sonner";

const CreateTicketButton = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState(-1); // 默认未选择

  const { loading, error } = useSelector((state) => state.ticket);
  const isCreating = loading.createTicket;


  const handleCreateTicketClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTicket = async (e) => {
  e.preventDefault();
  try {
    const res = await dispatch(createTicket({ subject, message, level })).unwrap();

    if (res.status === "success") {
      toast.success("工单创建成功！");
      const ticketsResult = await dispatch(fetchTickets());
      const newTickets = ticketsResult.payload;
      if (Array.isArray(newTickets) && newTickets.length > 0) {
        dispatch(fetchTicketDetail(newTickets[0].id));
      }

      setSubject("");
      setMessage("");
      setLevel(0);
      setIsModalOpen(false);
      dispatch(clearCreateStatus());
    } else {
      toast.error(res.message || "创建工单失败");
      dispatch(clearCreateStatus());
    }
  } catch (error) {
    toast.error(error || "创建工单异常");
    dispatch(clearCreateStatus());
  }
};

  return (
    <div>
      <button
        className="btn btn-neutral w-full mt-4"
        onClick={handleCreateTicketClick}
      >
        创建新工单
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="创建新工单">
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label htmlFor="subject" className="label">
              <span className="label-text">工单标题</span>
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="label">
              <span className="label-text">工单内容</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea textarea-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">优先级</span>
            </label>

            {/* 优先级选择器 */}
            <form
              className="filter w-full flex gap-2"
              onChange={(e) => setLevel(Number(e.target.value))}
            >
              <input
                className="btn btn-square"
                type="reset"
                value="×"
                onClick={() => setLevel(-1)}
              />
              <input
                className="btn"
                type="radio"
                name="level"
                value={2}
                aria-label="高"
                checked={level === 2}
                readOnly
              />
              <input
                className="btn"
                type="radio"
                name="level"
                value={1}
                aria-label="中"
                checked={level === 1}
                readOnly
              />
              <input
                className="btn"
                type="radio"
                name="level"
                value={0}
                aria-label="低"
                checked={level === 0}
                readOnly
              />
            </form>
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-outline"
              disabled={isCreating}
            >
              取消
            </button>

            <button
              type="submit"
              disabled={isCreating}
              className={`btn btn-neutral ${isCreating ? "btn-disabled" : ""}`}
            >
              {isCreating ? "提交中..." : "提交"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CreateTicketButton;