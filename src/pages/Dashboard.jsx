import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Subscriptioninfo from "../components/dashboard/SubscriptionInfo";
import { fetchSubscription } from "../redux/slices/userSlice";
import { fetchPlan } from "../redux/slices/planSlice";
import NodeList from "../components/dashboard/NodeList";
import TrafficChart from "../components/dashboard/TrafficChart";
import StatusMessage from "../components/ui/StatusMessage";

const Dashboard = () => {
  const dispatch = useDispatch();

  const planLoading = useSelector((state) => state.plan.loading.fetchPlan);
  const planError = useSelector((state) => state.plan.error.fetchPlan);
  const subLoading = useSelector((state) => state.user.loading.fetchSubscription);
  const subError = useSelector((state) => state.user.error.fetchSubscription);

  const isLoading = planLoading || subLoading;
  const isError = planError || subError;

  useEffect(() => {
    dispatch(fetchPlan());
    dispatch(fetchSubscription());
  }, [dispatch]);

  return (
    <StatusMessage
      loading={isLoading}
      error={isError}
      loadingText="正在加载仪表盘数据..."
      errorText="加载失败"
    >
      {/* 大框容器：统一外观，不再给每个组件单独边框 */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-4 lg:p-6">
          {/* 页面网格：小屏 1 列，大屏 3 列；左 2 右 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 min-h-[70vh]">
            {/* 左侧（2列）：订阅 + 流量图（无独立边框） */}
            <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
              <div className="p-0 flex-none">
                <Subscriptioninfo />
              </div>
              <div className="p-0 flex-1 min-h-0">
                <TrafficChart />
              </div>
            </div>

            {/* 右侧（1列）：节点列表（可独立滚动） */}
            <aside className="lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <NodeList />
            </aside>
          </div>
        </div>
      </div>
    </StatusMessage>
  );
};

export default Dashboard;