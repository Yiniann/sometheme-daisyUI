import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  replyToTicket,
  clearReplyStatus,
  fetchTicketDetail,
} from "../../redux/slices/ticketSlice";
import { toast } from "sonner";
import CloseTicketModal from "../../components/modals/CloseTicketModal";
import { CircleUser, ArrowLeft } from "lucide-react";
import StatusMessage from "../../components/ui/StatusMessage";

const TicketDetail = ({ selectedTicket, detailLoading, detailError, onBack }) => {
  const info = useSelector((state) => state.user.info);
  const fetchedDetail = useSelector((state) => state.ticket.fetchedDetail);
  const { loading} = useSelector((state) => state.ticket);

  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const lastSentMessageRef = useRef("");

  
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("请输入消息");
      return;
    }

    try {
      await dispatch(replyToTicket({ id: selectedTicket.id, message })).unwrap();
      toast.success("消息已发送");
      lastSentMessageRef.current = message;
      setMessage("");

      // 请求最新工单详情
      dispatch(fetchTicketDetail(selectedTicket.id));
    } catch (err) {
        const message = typeof err === 'string' ? err : err?.message || '未知错误';
        toast.error(`发送失败：${message}`);
      }

  };


  return (
    <div className="flex flex-col h-full">
      {/* 移动端返回按钮 */}
      {onBack && (
        <div className="mb-2 flex justify-start">
          <button
            onClick={onBack}
            className="btn btn-ghost btn-md flex items-center justify-start"
            style={{ width: "auto" }}
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </button>
        </div>
      )}

      {/* 顶部加载和错误信息 */}
      <StatusMessage
        loading={detailLoading && !fetchedDetail}
        error={detailError}
        errorText="加载工单详细错误"
      />

      {selectedTicket && fetchedDetail && (
        <>
          {/* 顶部标题和操作按钮 */}
          <div className="mb-2 px-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-bold">{selectedTicket.subject}</h2>
            {selectedTicket.status === 0 ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-error btn-sm"
              >
                关闭工单
              </button>
            ) : (
              <span className="badge badge-success badge-outline">已完结</span>
            )}
          </div>

          {/* 优先级标签 */}
          <div className="px-4 mb-2 flex-shrink-0">
            <div
              className={`badge ${
                selectedTicket.level === 2
                  ? "badge-error"
                  : selectedTicket.level === 1
                  ? "badge-warning"
                  : "badge-success"
              } gap-2`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedTicket.level === 2
                    ? "bg-red-500"
                    : selectedTicket.level === 1
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              />
              优先级：{["低", "中", "高"][selectedTicket.level]}
            </div>
          </div>

          <div className="divider my-2 flex-shrink-0" />

          {/* 消息列表 + 输入框，强制 flex 分区 */}
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">
              {selectedTicket.message.map((msg) => {
                const isMe = msg.is_me;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}
                  >
                    {!isMe && (
                      <div className="mr-2 flex flex-col items-center self-center">
                        <CircleUser className="h-10 w-10 text-gray-400" />
                        <p className="mt-1 text-xs text-gray-500">Admin</p>
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 break-words text-sm ${
                        isMe
                          ? "bg-primary/20 dark:bg-slate-500 dark:text-white"
                          : "bg-base-200 text-base-content"
                      }`}
                      style={{ maxWidth: "80%" }}
                    >
                      <p>{msg.message}</p>
                      <small className="block text-right text-xs text-gray-400 dark:text-black">
                        {new Date(msg.created_at * 1000).toLocaleString()}
                      </small>
                    </div>
                    {isMe && (
                      <img
                        src={info.avatar_url}
                        alt="用户头像"
                        className="ml-2 h-10 w-10 self-center rounded-full"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* 底部输入区，固定在底部 */}
            <div className="mt-2 flex items-center gap-2 flex-shrink-0 p-2">
              <input
                type="text"
                value={
                  selectedTicket.status === 1
                    ? "此工单已关闭，如需帮助请重新发起"
                    : message
                }
                onChange={(e) => setMessage(e.target.value)}
                placeholder="请输入消息..."
                className="input input-bordered flex-1"
                readOnly={selectedTicket.status === 1}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading.replyToTicket || selectedTicket.status === 1}
                className="btn btn-primary"
              >
                发送
              </button>
            </div>

          </div>

          <CloseTicketModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedTicket={selectedTicket}
          />
        </>
      )}
    </div>
  );
};

export default TicketDetail;
