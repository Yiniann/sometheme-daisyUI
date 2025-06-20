import { BadgeJapaneseYen, Gift, X } from "lucide-react";
import { clearCoupon } from "../../redux/slices/planSlice";

const PlanDetail = ({
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
    <>
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

      <div className="fixed bottom-16 left-0 right-0 border-t border-base-300 bg-base-100 p-4 lg:hidden z-20 flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <div className="text-lg font-bold mb-1">总计</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-extrabold">
                {selectedPlan ? `¥${(discountedPrice !== null ? discountedPrice : selectedPrice) / 100}.00` : "¥0.00"}
              </div>
              {appliedCoupon && (
                <div className="text-xs text-success">
                  <span className="font-semibold">{appliedCoupon.name}</span> - {appliedCoupon.type === 1 ? `¥${(appliedCoupon.value / 100).toFixed(2)}` : `${appliedCoupon.value}%`}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end gap-2 flex-wrap">
            {!appliedCoupon ? (
              !showCouponInput ? (
                <button className="btn btn-ghost btn-sm" onClick={() => setShowCouponInput(true)}>
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
                  <button className="btn btn-ghost btn-md" onClick={() => setShowCouponInput(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </>
              )
            ) : (
              <div className="flex items-center gap-2 text-sm text-success">
                <Gift className="h-4 w-4" />
                <span className="text-base font-semibold">{appliedCoupon.name}</span>
                <button onClick={() => dispatch(clearCoupon())} className="btn btn-md btn-error btn-outline">
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
    </>
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
        <div className="space-y-4 rounded-xl bg-base-100 p-4">
          <div className="text-2xl font-bold text-base-content">总计</div>
          <div className="text-center text-sm">
            {selectedPlan ? (
              <>
                <div className="mb-2 border-b border-base-content/20 pb-2 text-base-content">
                  {selectedPlan.name}（{selectedPeriod === "month_price" ? "月付" : selectedPeriod === "quarter_price" ? "季付" : selectedPeriod === "half_year_price" ? "半年付" : selectedPeriod === "year_price" ? "年付" : selectedPeriod === "two_year_price" ? "两年付" : selectedPeriod === "three_year_price" ? "三年付" : selectedPeriod === "onetime_price" ? "流量包" : "重制流量"}）
                </div>
                <div className="text-3xl font-extrabold">
                  ¥{(discountedPrice !== null ? discountedPrice : selectedPrice) / 100}.00 CNY
                </div>
                {appliedCoupon && (
                  <div className="text-sm text-base-content/70">
                    <span className="font-semibold">{appliedCoupon.name}</span> - {appliedCoupon.type === 1 ? `¥${(appliedCoupon.value / 100).toFixed(2)}` : `${appliedCoupon.value}%`}
                  </div>
                )}
              </>
            ) : (
              <div className="text-3xl font-extrabold">¥0.00 CNY</div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {!appliedCoupon ? (
            !showCouponInput ? (
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCouponInput(true)}>
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
                <button className="btn btn-ghost btn-sm" onClick={() => setShowCouponInput(false)}>
                  <X className="h-5 w-5" />
                </button>
              </>
            )
          ) : (
            <div className="flex w-full min-w-[285px] items-center justify-between text-sm text-success">
              <div className="flex items-center gap-2 truncate">
                <Gift className="h-5 w-5 shrink-0" />
                <span className="truncate text-base font-semibold">{appliedCoupon.name}</span>
              </div>
              <button onClick={() => dispatch(clearCoupon())} className="btn btn-sm btn-error btn-outline ml-2">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

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

export default PlanDetail;