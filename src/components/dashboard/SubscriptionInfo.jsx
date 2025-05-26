import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import SubscriptionButton from "./SubscriptionButton"
import ResetButton from './ResetButtom'

const Subscription = () => {
  const subscription = useSelector((state) => state.user.subscription);
  const plans = useSelector((state) => state.plan.plans);
  const loading = useSelector((state) => state.plan.loading);
  const error = useSelector((state) => state.plan.error);
  
  //当前订阅  
  const currentPlan = plans
    ? plans.find((plan) => plan?.id === subscription?.plan_id)
    : null;

    if (!currentPlan) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center p-5 text-center">
        <div className="w-full max-w-lg rounded-lg bg-transparent p-8  ">
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

  const toBase64 = (str) => {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(str);
    let binary = "";
    uint8Array.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  };


  return (
    <div className="px-4">
      <p className="pb-5 text-3xl">{planName.toUpperCase()}</p>

      <div
        className="pb-5 text-base"
        dangerouslySetInnerHTML={{ __html: planContent }}
      />

      <p className="text-base">
        本月流量将于
        <span className="text-primary">
          {subscription.reset_day !== null
            ? `${subscription.reset_day} 日`
            : " 月末 "}
        </span>
        后重置，订阅
        {subscription.expired_at ? (
          <span>
            将于{" "}
            <span className="text-primary">
              {formattedExpiredAt}
            </span>{" "}
            到期
          </span>
        ) : (
          <span>
            为 <span className="text-accent">无限期</span> 订阅
          </span>
        )}
      </p>
      {/* 流量使用进度条 */}
      <div className="mt-6">
        <label className="label">
          <span className="label-text">流量使用情况</span>
        </label>
        <progress
          className="progress progress-info w-full h-4"
          value={usagePercentage}
          max="100"
        ></progress>
        <div className="text-right text-sm mt-1">
          已使用：<span className="font-medium text-base-content">{usedGB} GB</span>（
          {usagePercentage}%） / 可用：<span className="font-medium text-base-content">{totalGB} GB</span>
        </div>
        {/*按钮区域*/}
        <div className="mt-2 flex gap-4">
          <SubscriptionButton />
          <ResetButton />
        </div>

      </div>

    </div>
  )
}

export default Subscription