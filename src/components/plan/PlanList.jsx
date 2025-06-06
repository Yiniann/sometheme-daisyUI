const formatTraffic = (bytes) => {
  if (!bytes) return "∞";
  return bytes >= 1024
    ? `${(bytes / 1024).toFixed(2)} TB`
    : `${bytes} GB`;
};

const PlanList = ({ plans, onSelect }) => {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <h2 className="pb-5 text-2xl font-semibold">
        选择合适的套餐
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg transition cursor-pointer"
            onClick={() => onSelect(plan)}
          >
            <div className="card-body flex flex-col justify-between space-y-4">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-base-content">{plan.name}</h3>
                  <span className="text-sm text-primary">
                    {formatTraffic(plan.transfer_enable)}
                  </span>
                </div>
               <div
                className="prose max-w-none text-sm text-base-content/80"
                dangerouslySetInnerHTML={{ __html: plan.content }}
              />
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(plan);
                }}
              >
                订阅
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanList;
