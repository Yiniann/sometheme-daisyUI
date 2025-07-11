import ContentRenderer from "../ContentRenderer";

const PlanList = ({
  category,
  setCategory,
  availablePeriods,
  selectedPeriod,
  setSelectedPeriod,
  filteredPlans,
  selectedPlan,
  setSelectedPlan,
  periodOptions,
}) => {
  const priceKey =
    category === "cycle" ? selectedPeriod : category === "onetime" ? "onetime_price" : "reset_price";
  const suffix =
    category === "cycle"
      ? periodOptions.find((p) => p.key === selectedPeriod)?.suffix
      : category === "onetime"
      ? " 流量包"
      : " 重置流量";

  return (
    <div className="lg:col-span-2 space-y-4 pb-32 lg:pb-0">
      {/* 一级分类切换 */}
      <div className="flex space-x-2">
        <button
          onClick={() => setCategory("cycle")}
          className={`btn btn-sm ${category === "cycle" ? "btn-neutral" : "btn-outline"}`}
        >
          周期性套餐
        </button>
        <button
          onClick={() => setCategory("onetime")}
          className={`btn btn-sm ${category === "onetime" ? "btn-neutral" : "btn-outline"}`}
        >
          流量包
        </button>
        <button
          onClick={() => setCategory("reset")}
          className={`btn btn-sm ${category === "reset" ? "btn-neutral" : "btn-outline"}`}
        >
          重置包
        </button>
      </div>

      {/* 周期选择器 */}
      {category === "cycle" && (
        <div className="sticky top-[-16px] bg-base-100 z-20 py-2 w-full">
          <div className="flex justify-between rounded-full overflow-hidden border border-base-300 w-full">
            {availablePeriods.map(({ key, label }, index) => (
              <button
                key={key}
                className={`btn btn-sm flex-1 transition-transform active:scale-95 ${
                  selectedPeriod === key
                    ? "bg-neutral text-neutral-content"
                    : "bg-base-100 text-base-content hover:bg-base-300"
                } ${
                  index === 0
                    ? "rounded-l-full"
                    : index === availablePeriods.length - 1
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
      )}

      {/* 套餐列表 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.length === 0 ? (
          <div className="col-span-full text-center text-base-content/70 py-8">
            当前{category === "cycle" ? "周期" : ""}下暂无可用套餐
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`card cursor-pointer transition border ${
                selectedPlan?.id === plan.id
                  ? "border-neutral"
                  : "border-base-300 hover:shadow-lg"
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="card-body space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                  <ContentRenderer content={plan.content} />
                </div>
                <div className="text-xl font-extrabold text-right break-words">
                  ¥{(plan[priceKey] / 100).toFixed(2)}
                  <span className="inline-block max-w-full break-keep">{suffix}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlanList;