import React from "react";
import { useSelector } from "react-redux";
import { getValue } from "../../config/runtimeConfig";

const WelcomeBanner = () => {
  const userEmail = useSelector((state) => state.user.info?.email);
  const loading = useSelector((state) => state.user.loading.fetchInfo);
  const error = useSelector((state) => state.user.error.fetchInfo);
  const headerImage = getValue("headerImage", "");

  const currentHour = new Date().getHours();
  let greeting = "你好";
  if (currentHour < 12) {
    greeting = "早上好";
  } else if (currentHour < 18) {
    greeting = "下午好";
  } else {
    greeting = "晚上好";
  }

  if (loading) {
    return (
      <section className="min-h-[320px] rounded-lg overflow-hidden shadow-lg bg-base-200 flex items-end justify-start">
        <div className="m-6 max-w-md">
          <div className="skeleton h-10 w-40 mb-2 rounded" />
          <div className="skeleton h-10 w-60 mb-2 rounded" />
        </div>
      </section>
    );
  }

  if (error) {
    return null; // 或者渲染错误信息
  }

  return (
    <section
      className="min-h-[320px] rounded-lg overflow-hidden shadow-lg flex items-end justify-start"
      style={{
        backgroundImage: `url(${headerImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-neutral-content text-left m-6 max-w-md">
        <h1 className="mb-2 text-4xl font-bold">{greeting},</h1>
        <p className="mb-2 ml-5 text-4xl">{userEmail?.split("@")[0]}</p>
      </div>
    </section>
  );
};

export default WelcomeBanner;
