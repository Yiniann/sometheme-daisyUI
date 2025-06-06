import React, { useState, useEffect } from "react";
import { Gift, BadgeJapaneseYen, Undo2, X } from "lucide-react";
import { checkCoupon, clearCoupon } from "../../redux/slices/planSlice";
import { saveOrder } from "../../redux/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const periodOptions = [
  { key: "month_price", label: "月付" },
  { key: "quarter_price", label: "季付" },
  { key: "half_year_price", label: "半年付" },
  { key: "year_price", label: "年付" },
  { key: "two_year_price", label: "两年付" },
  { key: "three_year_price", label: "三年付" },
  { key: "onetime_price", label: "一次性" },
];

const PlanDetail = ({ plan, onBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const appliedCoupon = useSelector((state) => state.plan.coupon);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearCoupon());
    };
  }, [dispatch]);

  const loadingCheckCoupon = useSelector((state) => state.plan.loading.checkCoupon);
  const loadingSaveOrder = useSelector((state) => state.order.loading.saveOrder);

  const handleCheckCoupon = async () => {
    if (!coupon) return;

    try {
      const resultAction = await dispatch(checkCoupon({ code: coupon, plan_id: plan.id }));
      if (checkCoupon.fulfilled.match(resultAction)) {
        toast.success("优惠券已应用");
      } else {
        toast.error(resultAction.payload?.message || "优惠券无效");
      }
    } catch (e) {
      toast.error("验证优惠券时出错");
    }
  };

  const handleOrder = async () => {
    if (!selectedPeriod) {
      toast.warning("请先选择付款周期");
      return;
    }

    const finalCouponCode = appliedCoupon?.code || null;

    try {
      const action = await dispatch(
        saveOrder({
          period: selectedPeriod,
          plan_id: plan.id,
          coupon_code: finalCouponCode,
        })
      );

      if (saveOrder.fulfilled.match(action)) {
        toast.success("下单成功，正在跳转...");
        navigate("/order");
      } else {
        toast.error(action.payload?.message || "下单失败");
      }
    } catch (error) {
      toast.error("提交订单时出错");
    }
  };

  const selectedPrice = selectedPeriod ? plan[selectedPeriod] : null;

  const calculateDiscountedPrice = (price) => {
    if (!appliedCoupon) return price;

    const { type, value } = appliedCoupon;
    if (type === 1) {
      return price - value;
    } else if (type === 2) {
      if (value === 100) return 0;
      return price * (1 - value / 100);
    }
    return price;
  };

  const discountedPrice = selectedPrice
    ? calculateDiscountedPrice(selectedPrice)
    : null;

  const noPricesAvailable = periodOptions.every(({ key }) => plan[key] == null);

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4">
      <button
        onClick={onBack}
        className="btn btn-link btn-sm normal-case text-neutral"
      >
        <div className="flex items-center justify-center gap-1">
          <Undo2 className="h-5 w-5" />
          <span>返回套餐列表</span>
        </div>
      </button>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 space-y-4">
          {/* 套餐信息 */}
          <div className="rounded-xl bg-base-100 p-4">
            <h2 className="mb-2 text-2xl font-bold text-base-content">
              {plan.name}
            </h2>
            <div
              className="text-sm text-base-content/70"
              dangerouslySetInnerHTML={{ __html: plan.content }}
            />
          </div>

          {/* 周期价格 */}
          <div className="space-y-2 rounded-xl bg-base-100 p-4">
            {noPricesAvailable ? (
              <div className="text-center text-base-content/70">订阅未开放购买</div>
            ) : (
              <>
                <h3 className="mb-2 font-semibold text-base-content">付款周期</h3>
                <div className="grid gap-2">
                  {periodOptions.map(({ key, label }) => {
                    const price = plan[key];
                    if (price == null) return null;
                    const isSelected = selectedPeriod === key;
                    return (
                      <button
                        key={key}
                        className={`btn w-full justify-between normal-case ${
                          isSelected
                            ? "btn-active btn-neutral text-neutral-content"
                            : "btn-outline"
                        }`}
                        onClick={() => setSelectedPeriod(key)}
                      >
                        <span>{label}</span>
                        <span>¥{(price / 100).toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 订单卡片 */}
        <div className="w-full space-y-4 lg:w-auto">
          <div className="rounded-xl bg-base-100 p-4">
            <div className="mb-3 flex gap-2">
              {!appliedCoupon ? (
                <>
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="有优惠券？"
                    className="input input-bordered flex-1 bg-base-200 text-base-content"
                  />
                  <button
                    className="btn btn-neutral btn-sm normal-case"
                    onClick={handleCheckCoupon}
                    disabled={loadingCheckCoupon}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Gift className="h-5 w-5 text-white" />
                      <span>{loadingCheckCoupon ? "处理中..." : "验证"}</span>
                    </div>
                  </button>
                </>
              ) : (
                <div className="flex w-full min-w-[285px] items-center justify-between text-sm text-success">
                  <div className="flex items-center gap-2 truncate">
                    <Gift className="h-5 w-5 shrink-0" />
                    <span className="truncate text-base font-semibold">
                      {appliedCoupon.name}
                    </span>
                  </div>
                  <button
                    onClick={() => dispatch(clearCoupon())}
                    className="btn btn-sm btn-error btn-outline ml-2 normal-case"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-xl bg-base-100 p-4">
              <div className="text-2xl font-bold text-base-content">订单总额</div>

              {selectedPeriod ? (
                <div className="text-center text-sm">
                  <div className="mb-2 border-b border-base-content/20 pb-2 text-base-content">
                    {plan.name}（
                    {periodOptions.find((p) => p.key === selectedPeriod)?.label}
                    ）
                  </div>
                  <div className="text-3xl font-extrabold text-neutral">
                    ¥
                    {discountedPrice !== null
                      ? (discountedPrice / 100).toFixed(2)
                      : (selectedPrice / 100).toFixed(2)}{" "}
                    CNY
                  </div>
                  {appliedCoupon && (
                    <div className="text-sm text-base-content/70">
                      <span className="font-semibold">{appliedCoupon.name}</span>{" "}
                      -{" "}
                      {appliedCoupon.type === 1
                        ? `¥${appliedCoupon.value / 100}`
                        : `${appliedCoupon.value}%`}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-sm text-base-content/50">
                  请先选择付款周期
                </div>
              )}
            </div>

            <button
              onClick={handleOrder}
              disabled={!selectedPeriod || loadingSaveOrder}
              className="btn btn-neutral w-full normal-case"
            >
              <div className="flex items-center justify-center gap-1">
                <BadgeJapaneseYen className="h-5 w-5" />
                <span>{loadingSaveOrder ? "处理中..." : "下单"}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
