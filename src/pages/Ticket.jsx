import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTickets,
  fetchTicketDetail,
  clearTicketDetail,
  setSelectedTicket,
} from "../redux/slices/ticketSlice";
import usePollTicketDetail from "../hooks/usePollTicketDetail";
import TicketDetail from "../components/ticket/TicketDetail";
import CreateTicketButton from "../components/modals/CreatTicketButton";
import { CircleCheck, MessageCircleMore, HelpCircle } from "lucide-react";
import StatusMessage from "../components/ui/StatusMessage";

const Ticket = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error, selectedTicket } = useSelector(
    (state) => state.ticket
  );
  const [isMobileDetailVisible, setIsMobileDetailVisible] = useState(false);
  const hasSelectedDefault = useRef(false);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  useEffect(() => {
    if (tickets.length > 0 && !hasSelectedDefault.current) {
      dispatch(setSelectedTicket(tickets[0]));
      dispatch(fetchTicketDetail(tickets[0].id));
      hasSelectedDefault.current = true;
    }
  }, [tickets, dispatch]);

  usePollTicketDetail(selectedTicket?.id);

  const handleTicketClick = (ticket) => {
    dispatch(clearTicketDetail());
    dispatch(setSelectedTicket(ticket));
    dispatch(fetchTicketDetail(ticket.id));
    setIsMobileDetailVisible(true);
  };

  const handleBackToList = () => {
    setIsMobileDetailVisible(false);
    dispatch(setSelectedTicket(null));
  };

  const renderTicketList = () => (
    <ul>
      {tickets.map((ticket) => (
        <li
          key={ticket.id}
          className={`mb-2 cursor-pointer rounded-lg p-4 hover:bg-base-300 ${
            selectedTicket?.id === ticket.id
              ? "bg-primary/10 dark:bg-primary/20"
              : ""
          }`}
          onClick={() => handleTicketClick(ticket)}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-base-content">
                {ticket.subject}
              </div>
              <div className="pt-1 text-sm text-base-content/70 ">
                {new Date(ticket.created_at * 1000).toLocaleString()}
              </div>
            </div>
            <div className="ml-4 flex flex-col items-end text-sm whitespace-nowrap text-base-content/70">
              <div>
                {ticket.status === 1
                  ? "已完结"
                  : ticket.reply_status === 1
                  ? "待回复"
                  : "已回复"}
              </div>
              <div className="mt-1">
                {ticket.status === 1 ? (
                  <CircleCheck className="h-5 w-5 text-success" />
                ) : (
                  <MessageCircleMore className="h-5 w-5 text-info" />
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  if (!loading.fetchTickets && !error.fetchTickets && tickets.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-base-100 px-4 text-center">
        <HelpCircle className="h-20 w-20 text-primary" />
        <p className="text-3xl font-semibold text-primary">遇到问题了吗？</p>
        <p className="mt-2 text-lg text-base-content/80">
          发起工单寻求帮助，我们会在第一时间为你解决！
        </p>
        <p className="mt-1 text-sm text-base-content/60">
          如果你遇到技术故障、账号问题或其他疑问，请随时联系我们。
        </p>
        {/* 只有这里显示创建按钮 */}
        <CreateTicketButton className="flex items-center mt-4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-base-100">
      {/* 主体区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 大屏：左右布局 */}
        <div className="hidden lg:flex flex-1 h-full">
          {/* 左边列表：可滚动 */}
          <div className="w-80 flex flex-col border-r border-base-300 h-full min-h-0">
            <StatusMessage
              loading={loading.fetchTickets}
              error={error.fetchTickets}
              loadingText="加载工单列表中..."
              errorText="加载工单失败"
            >
              <div className="flex-1 overflow-y-auto scrollbar-hide p-4 min-h-0">
                {renderTicketList()}
              </div>
            </StatusMessage>
            <div className="border-t border-base-300 bg-base-100 p-4">
              {/* 只有这里显示创建按钮 */}
              <CreateTicketButton className="w-full" />
            </div>
          </div>

          {/* 右边详情：可滚动 */}
          <div className="flex-1 flex flex-col h-full min-h-0 overflow-y-auto p-4">
            {selectedTicket ? (
              <TicketDetail
                selectedTicket={selectedTicket}
                detailLoading={loading.fetchTicketDetail}
                detailError={error.fetchTicketDetail}
                onBack={null}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-base-content/60">
                请选择一个工单查看详情
              </div>
            )}
          </div>
        </div>

        {/* 小屏：单列布局 */}
        <div className="flex lg:hidden flex-1 flex-col h-full min-h-0">
          {!isMobileDetailVisible ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <StatusMessage
                loading={loading.fetchTickets}
                error={error.fetchTickets}
                loadingText="加载工单列表中..."
                errorText="加载工单失败"
              >
                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 min-h-0">
                  {renderTicketList()}
                </div>
              </StatusMessage>
              <div className="border-t border-base-300 bg-base-100 p-4">
                {/* 只有这里显示创建按钮 */}
                <CreateTicketButton className="w-full" />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <TicketDetail
                selectedTicket={selectedTicket}
                detailLoading={loading.fetchTicketDetail}
                detailError={error.fetchTicketDetail}
                onBack={handleBackToList}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticket;
