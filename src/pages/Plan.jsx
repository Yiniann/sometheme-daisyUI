import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlan, clearCoupon, checkCoupon } from "../redux/slices/planSlice";
import { saveOrder } from "../redux/slices/orderSlice";
import { toast } from "sonner";
import StatusMessage from "../components/ui/StatusMessage";
import ContentRenderer from "../components/ContentRenderer";
import { BadgeJapaneseYen, Gift, X } from "lucide-react";

const periodOptions = [
  { key: "month_price", label: "月付", suffix: "/月" },
  { key: "quarter_price", label: "季付", suffix: "/季" },
  { key: "half_year_price", label: "半年付", suffix: "/半年" },
  { key: "year_price", label: "年付", suffix: "/年" },
  { key: "two_year_price", label: "两年付", suffix: "/两年" },
  { key: "three_year_price", label: "三年付", suffix: "/三年" },
  { key: "onetime_price", label: "一次性", suffix: "流量包" },
  { key: "reset_price", label: "重制包", suffix: "重制流量" },
];

const Plan = () => {
  const dispatch = useDispatch();
  const { plans, loading, error, coupon: appliedCoupon } = useSelector((state) => state.plan);
  const loadingCheckCoupon = loading.checkCoupon;
  const { loading: orderLoading } = useSelector((state) => state.order);

  const [selectedPeriod, setSelectedPeriod] = useState("month_price");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  const availablePeriods = periodOptions.filter(({ key }) =>
    plans.some(plan => plan[key] != null)
  );

  useEffect(() => {
    dispatch(fetchPlan());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearCoupon());
    };
  }, [dispatch]);

  const handleCheckCoupon = async () => {
    if (!coupon.trim()) {
      toast.warning("请输入优惠券");
      return;
    }

    if (!selectedPlan) {
      toast.warning("请选择套餐");
      return;
    }
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
    if (!selectedPlan) {
      toast.warning("请选择套餐");
      return;
    }
    const finalCouponCode = appliedCoupon?.code || null;
    try {
      const action = await dispatch(
        saveOrder({
          period: selectedPeriod,
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

  const selectedPrice = selectedPlan ? selectedPlan[selectedPeriod] : null;
  const discountedPrice = selectedPlan && selectedPrice !== null ? calculateDiscountedPrice(selectedPrice) : null;

  const filteredPlans = plans.filter(plan => plan[selectedPeriod] != null);


  return (
    <StatusMessage
      loading={loading.fetchPlan}
      error={error.fetchPlan}
      loadingText="正在加载订阅方案..."
      errorText="加载失败，无法获取订阅方案"
    >
      {plans.length === 0 && !loading.fetchPlan && (
        <div className="flex min-h-[60vh] items-center justify-center text-center text-lg text-base-content/70 px-4">
          当前暂无可购买的订阅，服务暂未开放购买。
        </div>
      )}
      <div className="mx-auto max-w-7xl px-4 py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：套餐列表 */}
        <div className="lg:col-span-2 space-y-4 pb-32 lg:pb-0"> 
          {/* period filter moved here */}
          <div className="sticky top-[-16px] bg-base-100 z-50 py-2 w-full">
            <div className="flex justify-between rounded-full overflow-hidden border border-base-300 w-full">
              {availablePeriods.map(({ key, label }, index) => (
                <button
                  key={key}
                  className={`btn btn-outline btn-sm flex-1 transition-transform active:scale-95 ${
                    selectedPeriod === key ? "bg-neutral text-neutral-content" : "bg-base-100 text-base-content hover:bg-base-300"
                  } ${
                    index === 0
                      ? "rounded-l-full"
                      : index === periodOptions.length - 1
                      ? "rounded-r-full"
                      : "rounded-none border-l-0"
                  }`}
                  onClick={() => setSelectedPeriod(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.length === 0 ? (
              <div className="col-span-full text-center text-base-content/70 py-8">
                当前周期下暂无可用套餐
              </div>
            ) : (
              filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`card cursor-pointer transition border ${selectedPlan?.id === plan.id ? "border-neutral" : "border-base-300 hover:shadow-lg"}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="card-body space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                      <ContentRenderer content={plan.content} />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-right break-words">
                        ¥{(plan[selectedPeriod] / 100).toFixed(2)}&nbsp;
                        <span className="inline-block max-w-full break-keep">
                          {periodOptions.find(p => p.key === selectedPeriod)?.suffix}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 右侧：订单信息 (PC显示) */}
        <div className="space-y-4 hidden lg:block sticky top-20 self-start">
          <OrderDetail
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
      </div>

      {/* 小屏订单信息 吸底固定 */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-base-300 bg-base-100 p-4 lg:hidden z-50 flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <div className="text-lg font-bold mb-1">总计</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-extrabold">
                {selectedPlan ? `¥${(discountedPrice !== null ? discountedPrice : selectedPrice) / 100}.00` : "¥0.00"}
              </div>
              {appliedCoupon && (
                <div className="text-xs text-success">
                  <span className="font-semibold">{appliedCoupon.name}</span> -{" "}
                  {appliedCoupon.type === 1
                    ? `¥${(appliedCoupon.value / 100).toFixed(2)}`
                    : `${appliedCoupon.value}%`}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end gap-2 flex-wrap">
            {!appliedCoupon ? (
              !showCouponInput ? (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowCouponInput(true)}
                >
                  <Gift className="h-4 w-4" />
                  使用优惠卷
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="有优惠券？"
                    className="input input-bordered w-36 bg-base-200 text-base-content"
                  />
                  <button
                    className="btn btn-neutral btn-md"
                    onClick={handleCheckCoupon}
                    disabled={!selectedPlan || loadingCheckCoupon}
                  >
                    <div className="flex items-center gap-1">
                      <Gift className="h-5 w-5 text-white" />
                      <span>{loadingCheckCoupon ? "处理中..." : "核验"}</span>
                    </div>
                  </button>
                  <button
                    className="btn btn-ghost btn-md"
                    onClick={() => setShowCouponInput(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              )
            ) : (
              <div className="flex items-center gap-2 text-sm text-success">
                <Gift className="h-4 w-4" />
                <span className="text-base font-semibold">{appliedCoupon.name}</span>
                <button
                  onClick={() => dispatch(clearCoupon())}
                  className="btn btn-md btn-error btn-outline"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {showCouponInput ? null : (
              <button
                onClick={handleOrder}
                disabled={!selectedPlan || orderLoading.saveOrder}
                className="btn btn-neutral btn-md"
              >
                <div className="flex items-center justify-center gap-1">
                  <BadgeJapaneseYen className="h-4 w-4" />
                  <span>{orderLoading.saveOrder ? "处理中..." : "下单"}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </StatusMessage>
  );
};

const OrderDetail = ({
  selectedPlan,
  selectedPeriod,
  coupon,
  setCoupon,
  appliedCoupon,
  handleCheckCoupon,
  handleOrder,
  orderLoading,
  discountedPrice,
  selectedPrice,
  dispatch,
  showCouponInput,
  setShowCouponInput,
  loadingCheckCoupon,
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-base-100 p-4 space-y-4">
        {/* 小记（订单总额标题更改） */}
        <div className="space-y-4 rounded-xl bg-base-100 p-4">
          <div className="text-2xl font-bold text-base-content">总计</div>
          <div className="text-center text-sm">
            {selectedPlan ? (
              <>
                <div className="mb-2 border-b border-base-content/20 pb-2 text-base-content">
                  {selectedPlan.name}（{periodOptions.find((p) => p.key === selectedPeriod)?.label}）
                </div>
                <div className="text-3xl font-extrabold">
                  ¥{(discountedPrice !== null ? discountedPrice : selectedPrice) / 100}.00 CNY
                </div>
                {appliedCoupon && (
                  <div className="text-sm text-base-content/70">
                    <span className="font-semibold">{appliedCoupon.name}</span> -{" "}
                    {appliedCoupon.type === 1
                      ? `¥${(appliedCoupon.value / 100).toFixed(2)}`
                      : `${appliedCoupon.value}%`}
                  </div>
                )}
              </>
            ) : (
              <div className="text-3xl font-extrabold">¥0.00 CNY</div>
            )}
          </div>
        </div>

        {/* 优惠券输入 */}
        <div className="flex gap-2">
          {!appliedCoupon ? (
            !showCouponInput ? (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowCouponInput(true)}
              >
                <Gift className="h-4 w-4" />
                使用优惠卷
              </button>
            ) : (
              <>
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="有优惠券？"
                  className="input input-bordered flex-1 bg-base-200 text-base-content"
                />
                <button
                  className="btn btn-neutral btn-sm"
                  onClick={handleCheckCoupon}
                  disabled={!selectedPlan || loadingCheckCoupon}
                >
                  <div className="flex items-center gap-1">
                    <Gift className="h-5 w-5 text-white" />
                    <span>{loadingCheckCoupon ? "处理中..." : "核验"}</span>
                  </div>
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowCouponInput(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )
          ) : (
            <div className="flex w-full min-w-[285px] items-center justify-between text-sm text-success">
              <div className="flex items-center gap-2 truncate">
                <Gift className="h-5 w-5 shrink-0" />
                <span className="truncate text-base font-semibold">{appliedCoupon.name}</span>
              </div>
              <button
                onClick={() => dispatch(clearCoupon())}
                className="btn btn-sm btn-error btn-outline ml-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* 下单按钮 */}
        {showCouponInput ? null : (
          <button
            onClick={handleOrder}
            disabled={!selectedPlan || orderLoading.saveOrder}
            className="btn btn-neutral w-full"
          >
            <div className="flex items-center justify-center gap-1">
              <BadgeJapaneseYen className="h-5 w-5" />
              <span>{orderLoading.saveOrder ? "处理中..." : "下单"}</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Plan;