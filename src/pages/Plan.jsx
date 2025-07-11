import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlan, clearCoupon, checkCoupon } from "../redux/slices/planSlice";
import { saveOrder } from "../redux/slices/orderSlice";
import { toast } from "sonner";
import StatusMessage from "../components/ui/StatusMessage";
import PlanList from "../components/plan/PlanList";
import PlanDetail from "../components/plan/PlanDetail";

const periodOptions = [
  { key: "month_price", label: "月付", suffix: "/ 月" },
  { key: "quarter_price", label: "季付", suffix: "/ 季" },
  { key: "half_year_price", label: "半年付", suffix: "/ 半年" },
  { key: "year_price", label: "年付", suffix: "/ 年" },
  { key: "two_year_price", label: "两年付", suffix: "/ 两年" },
  { key: "three_year_price", label: "三年付", suffix: "/ 三年" },
];

const Plan = () => {
  const dispatch = useDispatch();
  const { plans, loading, error, coupon: appliedCoupon } = useSelector((state) => state.plan);
  const loadingCheckCoupon = loading.checkCoupon;
  const { loading: orderLoading } = useSelector((state) => state.order);

  const [category, setCategory] = useState("cycle"); // "cycle" | "onetime" | "reset"
  const [selectedPeriod, setSelectedPeriod] = useState("month_price");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  const cyclePlanKeys = periodOptions.map((p) => p.key);
  const availablePeriods = periodOptions.filter(({ key }) =>
    plans.some((plan) => plan[key] != null)
  );

  const cyclePlans = plans.filter((plan) =>
    cyclePlanKeys.some((key) => plan[key] != null)
  );
  const onetimePlans = plans.filter((plan) => plan["onetime_price"] != null);
  const resetPlans = plans.filter((plan) => plan["reset_price"] != null);

  let filteredPlans = [];
  if (category === "cycle") {
    filteredPlans = cyclePlans.filter((plan) => plan[selectedPeriod] != null);
  } else if (category === "onetime") {
    filteredPlans = onetimePlans;
  } else if (category === "reset") {
    filteredPlans = resetPlans;
  }

  useEffect(() => {
    dispatch(fetchPlan());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearCoupon());
    };
  }, [dispatch]);

  const handleCheckCoupon = async () => {
    if (!coupon.trim()) return toast.warning("请输入优惠券");
    if (!selectedPlan) return toast.warning("请选择套餐");

    try {
      const result = await dispatch(checkCoupon({ code: coupon.trim(), plan_id: selectedPlan.id }));
      if (checkCoupon.fulfilled.match(result)) {
        toast.success("优惠券已应用");
        setShowCouponInput(false);
      } else {
        toast.error(result.payload?.message || "优惠券无效");
      }
    } catch {
      toast.error("验证优惠券时出错");
    }
  };

  const handleOrder = async () => {
    if (!selectedPlan) return toast.warning("请选择套餐");
    const finalCouponCode = appliedCoupon?.code || null;

    try {
      const action = await dispatch(
        saveOrder({
          period: category === "cycle" ? selectedPeriod : category,
          plan_id: selectedPlan.id,
          coupon_code: finalCouponCode,
        })
      );

      if (saveOrder.fulfilled.match(action)) {
        toast.success("下单成功，正在跳转...");
        window.location.href = "/order";
      } else {
        toast.error(action.payload?.message || "下单失败");
      }
    } catch {
      toast.error("提交订单时出错");
    }
  };

  const calculateDiscountedPrice = (price) => {
    if (!appliedCoupon) return price;
    const { type, value } = appliedCoupon;
    if (type === 1) return price - value;
    if (type === 2) return value === 100 ? 0 : price * (1 - value / 100);
    return price;
  };

  const selectedKey =
    category === "cycle" ? selectedPeriod : category === "onetime" ? "onetime_price" : "reset_price";

  const selectedPrice = selectedPlan ? selectedPlan[selectedKey] : null;
  const discountedPrice = selectedPlan && selectedPrice !== null ? calculateDiscountedPrice(selectedPrice) : null;

  return (
    <StatusMessage
      loading={loading.fetchPlan}
      error={error.fetchPlan}
      loadingText="正在加载订阅方案..."
      errorText="加载失败，无法获取订阅方案"
    >
      {plans.length === 0 && !loading.fetchPlan ? (
        <div className="flex min-h-[60vh] items-center justify-center text-center text-lg text-base-content/70 px-4">
          当前暂无可购买的订阅，服务暂未开放购买。
        </div>
      ) : (
        <div className="px-4 py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PlanList
            category={category}
            setCategory={setCategory}
            availablePeriods={availablePeriods}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            filteredPlans={filteredPlans}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            periodOptions={periodOptions}
          />
          <PlanDetail
            selectedPlan={selectedPlan}
            selectedPeriod={selectedPeriod}
            coupon={coupon}
            setCoupon={setCoupon}
            appliedCoupon={appliedCoupon}
            handleCheckCoupon={handleCheckCoupon}
            handleOrder={handleOrder}
            orderLoading={orderLoading}
            discountedPrice={discountedPrice}
            selectedPrice={selectedPrice}
            dispatch={dispatch}
            showCouponInput={showCouponInput}
            setShowCouponInput={setShowCouponInput}
            loadingCheckCoupon={loadingCheckCoupon}
          />
        </div>
      )}
    </StatusMessage>
  );
};

export default Plan;