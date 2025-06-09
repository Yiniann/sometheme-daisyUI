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
  const errorMessage = planError || subError;

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
      <div className="flex flex-col lg:flex-row ">
        <div className="lg:w-2/3 flex flex-col">
          <Subscriptioninfo />
          <TrafficChart />
        </div>

        <div className="lg:w-1/3 flex flex-col overflow-y-auto scrollbar-hide">
          <NodeList />
        </div>
      </div>
    </StatusMessage>
  );
};

export default Dashboard;
