import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ResetButton from './ResetButtom'
import { useNavigate } from "react-router-dom";
import Subscriber from "./Subscriber";
import { Rss } from "lucide-react";

const Subscription = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);


  const subscription = useSelector((state) => state.user.subscription);
  const plans = useSelector((state) => state.plan.plans);
  const loading = useSelector((state) => state.plan.loading);
  const error = useSelector((state) => state.plan.error);

   const currentPlan = plans
    ? plans.find((plan) => plan?.id === subscription?.plan_id)
    : null;

  if (loading.fetchPlan) {
    return (
      <div className="px-4 space-y-4">

        <div className="skeleton h-8 w-1/3 rounded"></div>

        <div className="space-y-2">
          <div className="skeleton h-4 w-full rounded"></div>
          <div className="skeleton h-4 w-5/6 rounded"></div>
          <div className="skeleton h-4 w-2/3 rounded"></div>
        </div>

        <div className="skeleton h-4 w-2/3 rounded"></div>

        <div className="space-y-1">
          <div className="skeleton h-4 w-1/3 rounded"></div>
          <progress className="progress progress-neutral w-full h-4"></progress>
          <div className="skeleton h-4 w-1/2 rounded"></div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="skeleton h-10 w-28 rounded"></div>
          <div className="skeleton h-10 w-28 rounded"></div>
          <div className="skeleton h-10 w-28 rounded"></div>
          <div className="skeleton h-10 w-20 rounded"></div>
        </div>
      </div>
    );
  }


  if (error.fetchPlan) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center">
        <div className="w-full max-w-lg rounded-lg bg-transparent p-8">
          <h1 className="mb-4 text-3xl font-bold">
            错误
          </h1>
          <p className="mb-6 text-lg">
           {error.fetchPlan || "无法获取订阅信息，请稍后再试。"}
          </p>
        </div>
      </div>
    )
  }

  if (!currentPlan) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center">
        <div className="w-full max-w-lg rounded-lg bg-transparent p-8">
          <h1 className="mb-4 text-3xl font-bold">
            订阅信息未找到
          </h1>
          <p className="mb-6 text-lg">
            抱歉，我们无法找到您的订阅信息。请联系管理员以获取更多帮助。
          </p>
        </div>
      </div>
    );
  }

  const planName = currentPlan?.name;
  const planContent = currentPlan?.content;

  const formattedExpiredAt = subscription.expired_at
    ? new Date(subscription.expired_at * 1000).toISOString().split("T")[0]
    : null;

  const bytesToGB = (bytes) => (bytes / 1024 ** 3).toFixed(2);
  const uploadedGB = bytesToGB(subscription.u);
  const downloadedGB = bytesToGB(subscription.d);
  const totalGB = bytesToGB(subscription.transfer_enable);
  const usedGB = (parseFloat(uploadedGB) + parseFloat(downloadedGB)).toFixed(2);
  const usagePercentage = (
    (parseFloat(usedGB) / parseFloat(totalGB)) *
    100
  ).toFixed(2);


  return (
  <div className="px-4">
    <p className="pb-5 text-2xl font-semibold">{planName.toUpperCase()}</p>

    <div
      className="pb-5 text-base"
      dangerouslySetInnerHTML={{ __html: planContent }}
    />

    <p className="text-base">
      本月流量将于
      <span className="text-primary font-medium">
        {subscription.reset_day !== null
          ? `${subscription.reset_day} 日`
          : " 月末 "}
      </span>
      后重置，订阅
      {subscription.expired_at ? (
        <span>
          将于{" "}
          <span className="text-primary font-medium">
            {formattedExpiredAt}
          </span>{" "}
          到期
        </span>
      ) : (
        <span>
          为 <span className="text-accent font-medium">无限期</span> 订阅
        </span>
      )}
    </p>

    {/* 流量使用进度条 */}
    <div className="mt-6">
      <label className="label">
        <span className="label-text text-sm">流量使用情况</span>
      </label>
      <progress
        className="progress w-full h-4"
        value={usagePercentage}
        max="100"
      ></progress>
      <div className="text-right text-sm mt-1">
        已使用：<span className="font-semibold">{usedGB} GB</span>（
        {usagePercentage}%） / 可用：
        <span className="font-semibold">{totalGB} GB</span>
      </div>

      {/* 按钮区域 */}
      <div className="mt-4 flex gap-4">
        <button className="btn btn-outline btn-sm" onClick={() => setShowModal(true)}>
          <Rss size={16} className="mr-1" />
          导入订阅
        </button>
        <ResetButton />
        {/* 下拉菜单按钮 */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-sm">
            More
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
          >
            <li>
              <button onClick={()=>navigate("/plan")} className="btn btn-sm btn-ghost justify-start">续费订阅</button>
            </li>
            <li>
              <button className="btn btn-sm btn-ghost justify-start">重置流量</button>
            </li>
          </ul>
        </div>
      </div>
      <Subscriber isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  </div>
);
}

export default Subscription