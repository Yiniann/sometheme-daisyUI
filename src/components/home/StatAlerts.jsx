import { X } from "lucide-react";

const StatAlerts = ({
  stat,
  showOrdersAlert,
  showTicketsAlert,
  showInvitesAlert,
  setShowOrdersAlert,
  setShowTicketsAlert,
  setShowInvitesAlert,
}) => {
  if (!stat) return null;

  return (
    <div className="space-y-2">
      {stat.pendingOrders > 0 && showOrdersAlert && (
        <div className="alert alert-vertical flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>您还有未支付的订单</span>
            <a href="/order" className="btn btn-sm btn-neutral">立即支付</a>
          </div>
          <button
            onClick={() => setShowOrdersAlert(false)}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {stat.pendingWorkOrders > 0 && showTicketsAlert && (
        <div className="alert alert-vertical flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>您还有未完结的工单</span>
            <a href="/ticket" className="btn btn-sm btn-neutral">工单详情</a>
          </div>
          <button
            onClick={() => setShowTicketsAlert(false)}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {stat.pendingInvites > 0 && showInvitesAlert && (
        <div className="alert alert-vertical flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>您有新的邀请</span>
            <a href="/invite" className="btn btn-sm btn-neutral">邀请详情</a>
          </div>
          <button
            onClick={() => setShowInvitesAlert(false)}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StatAlerts;