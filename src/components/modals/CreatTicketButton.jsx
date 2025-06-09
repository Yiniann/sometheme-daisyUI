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
  const [level, setLevel] = useState(0);

  const { tickets, loading, success, error } = useSelector(
    (state) => state.ticket,
  );
  const isCreating = loading.createTicket;

  useEffect(() => {
    if (error.createTicket) {
      toast.error(error.createTicket);
      dispatch(clearCreateStatus());
    }
  }, [error.createTicket, dispatch]);

  // 这里移除之前依赖 tickets 自动选中的逻辑，改为手动选中

  const handleCreateTicketClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(createTicket({ subject, message, level }));
      if (createTicket.fulfilled.match(resultAction)) {
        toast.success("工单创建成功！");

        // 创建成功后，刷新列表并手动选中第一个工单
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
        // 失败时提示
        toast.error("创建工单失败");
        dispatch(clearCreateStatus());
      }
    } catch (err) {
      toast.error("创建工单异常");
      dispatch(clearCreateStatus());
    }
  };

  return (
    <div>
      <button
        className="btn btn-primary w-full mt-4"
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
            <label htmlFor="level" className="label">
              <span className="label-text">优先级</span>
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="select select-bordered w-full"
            >
              <option value={2}>高</option>
              <option value={1}>中</option>
              <option value={0}>低</option>
            </select>
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
              className={`btn btn-success ${isCreating ? "btn-disabled" : ""}`}
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
