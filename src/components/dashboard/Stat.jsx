import { useSelector } from "react-redux";

const StatSkeleton = () => {
  return (
    <div className="space-y-4 mt-4">
      {/* 第一行骨架 */}
      <div className="grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="stat shadow p-4">
            <div className="stat-title skeleton h-4 w-1/2 mb-2"></div>
            <div className="stat-value skeleton h-6 w-3/4 mb-1"></div>
            <div className="stat-desc skeleton h-3 w-2/3"></div>
          </div>
        ))}
      </div>

      {/* 第二行骨架 */}
      <div className="grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="stat shadow p-4">
            <div className="stat-title skeleton h-4 w-1/2 mb-2"></div>
            <div className="stat-value skeleton h-6 w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Stat = () => {
  const subscription = useSelector((state) => state.user.subscription);
  const loading = useSelector((state) => state.user.loading);

  if (loading.fetchSubscription) return <StatSkeleton />;
  if (!subscription) return null;

  const formattedExpiredAt = subscription.expired_at
    ? new Date(subscription.expired_at * 1000).toISOString().split("T")[0]
    : "无限期";

  const resetDay = subscription.reset_day !== null
    ? `${subscription.reset_day} 日后`
    : "月末";

  const bytesToGB = (bytes) => (bytes / 1024 ** 3).toFixed(0);
  const uploadedGB = bytesToGB(subscription.u);
  const downloadedGB = bytesToGB(subscription.d);
  const totalGB = bytesToGB(subscription.transfer_enable);
  const usedGB = (parseFloat(uploadedGB) + parseFloat(downloadedGB)).toFixed(0);

  return (
    <div className="space-y-4 mt-4">
      {/* 第一行：时间 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="stat shadow">
          <div className="stat-title text-sm">流量重置日</div>
          <div className="stat-value text-lg">{resetDay}</div>
          <div className="stat-desc text-xs">每月自动重置</div>
        </div>

        <div className="stat shadow">
          <div className="stat-title text-sm">订阅到期</div>
          <div className="stat-value text-sm lg:text-lg">{formattedExpiredAt}</div>
          <div className="stat-desc text-xs">
            {subscription.expired_at ? "请注意续订" : "无限期有效"}
          </div>
        </div>

        <div className="stat shadow">
          <div className="stat-title text-sm">套餐流量</div>
          <div className="stat-value text-lg">{totalGB} GB</div>
          <div className="stat-desc text-xs">总可用流量</div>
        </div>
      </div>

      {/* 第二行：上传下载总流量 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="stat shadow">
          <div className="stat-title text-sm">上传流量</div>
          <div className="stat-value text-lg">{uploadedGB} GB</div>
        </div>

        <div className="stat shadow">
          <div className="stat-title text-sm">下载流量</div>
          <div className="stat-value text-lg">{downloadedGB} GB</div>
        </div>

        <div className="stat shadow">
          <div className="stat-title text-sm">总用量</div>
          <div className="stat-value text-lg">{usedGB} GB</div>
        </div>
      </div>
    </div>
  );
};

export default Stat;
