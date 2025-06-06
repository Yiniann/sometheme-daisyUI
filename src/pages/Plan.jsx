import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlan } from "../redux/slices/planSlice";
import StatusMessage from "../components/ui/StatusMessage";
import PlanList from "../components/plan/PlanList";
import PlanDetail from "../components/plan/PlanDetail";

const Plan = () => {
  const dispatch = useDispatch();
  const { plans, loading, error } = useSelector((state) => state.plan);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    dispatch(fetchPlan());
  }, [dispatch]);

  return (
    <StatusMessage
      loading={loading.fetchPlan}
      error={error.fetchPlan}
      loadingText="正在加载订阅方案..."
      errorText="加载失败，无法获取订阅方案"
    >
      {selectedPlan ? (
        <PlanDetail plan={selectedPlan} onBack={() => setSelectedPlan(null)} />
      ) : (
        <PlanList plans={plans} onSelect={(plan) => setSelectedPlan(plan)} />
      )}
    </StatusMessage>
  );
};

export default Plan;
