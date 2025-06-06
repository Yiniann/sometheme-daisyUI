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

  if (loading.fetchPlan || error.fetchPlan) {
    return <StatusMessage loading={loading} error={error} />;
  }

  return selectedPlan ? (
    <PlanDetail plan={selectedPlan} onBack={() => setSelectedPlan(null)} />
  ) : (
    <PlanList plans={plans} onSelect={(plan) => setSelectedPlan(plan)} />
  );
};

export default Plan;
