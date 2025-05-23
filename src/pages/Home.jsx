import React from "react";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

const Home = () => {
  const userEmail = useSelector((state) => state.user.info?.email);
  const { notices, loading, error, fetchedNotice } = useSelector(
    (state) => state.user
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section className="hero bg-base-200 rounded-lg shadow-lg p-12 text-center min-h-[180px] flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4 leading-snug">
          欢迎回来，{userEmail || "尊敬的用户"}
        </h1>
        <p className="text-lg text-gray-600">
          这里是您的专属代理服务面板，祝您使用愉快！
        </p>
      </section>

      {/* 公告 Timeline */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">最新公告</h2>

        {loading.fetchNotice && (
          <p className="text-center text-gray-500">正在加载公告...</p>
        )}

        {error.fetchNotice && (
          <p className="text-center text-red-500">
            加载公告失败：{error.fetchNotice}
          </p>
        )}

        {!loading.fetchNotice && !error.fetchNotice && fetchedNotice && (
          <>
            {notices && notices.length > 0 ? (
              <div className="timeline timeline-vertical">
                {notices
                  .slice()
                  .reverse()
                  .map(({ title, content, created_at }, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content p-4 bg-base-100 rounded-lg shadow">
                        <h3 className="font-semibold text-lg mb-2">{title}</h3>
                        <div className="prose max-w-full">{parse(content)}</div>
                        <time className="text-xs text-gray-400 mt-2 block">
                          发布时间: {new Date(created_at * 1000).toLocaleString()}
                        </time>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">暂无公告。</p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home
