import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { CalendarDays, Megaphone } from "lucide-react";
import WelcomeBanner from "../components/home/WelcomeBanner"

const Home = () => {
  const { notices, loading, error, fetchedNotice } = useSelector(
    (state) => state.user
  );

  return (
    
    <div className="p-2 lg:px-8 space-y-12">
      {/* Hero */}
      <WelcomeBanner />


      {/* 公告列表 */}
      <section>
        {loading.fetchNotice && (
          <ul className="list bg-base-100 rounded-box shadow-md divide-y divide-primary">
            {Array.from({ length: 3 }).map((_, index) => (
              <li
                key={index}
                className="p-4 flex flex-col md:flex-row md:items-start md:gap-4"
              >
                {/* 图标占位 */}
                <div className="flex-shrink-0">
                  <div className="skeleton w-6 h-6 mt-1 rounded-full" />
                </div>

                {/* 内容区 */}
                <div className="flex-grow space-y-2">
                  <div className="skeleton h-5 w-32 rounded" /> {/* 标题 */}
                  <div className="space-y-1">
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-4/5 rounded" />
                    <div className="skeleton h-4 w-3/5 rounded" />
                  </div>
                  <div className="skeleton h-3 w-24 rounded" /> {/* 时间 */}
                </div>
              </li>
            ))}
          </ul>
        )}

        {error.fetchNotice && (
          <p className="text-center text-error">
            加载公告失败：{error.fetchNotice}
          </p>
        )}

        {!loading.fetchNotice && !error.fetchNotice && fetchedNotice && (
          <>
            {notices && notices.length > 0 ? (
              <ul className="list bg-base-100 rounded-box shadow-md divide-y divide-primary">
                {notices
                  .slice()
                  .reverse()
                  .map(({ title, content, created_at }, index) => (
                    <li
                      key={index}
                      className="p-4 flex flex-col md:flex-row md:items-start md:gap-4"
                    >
                      <div className="flex-shrink-0">
                        <CalendarDays className="w-6 h-6 text-primary mt-1" />
                      </div>

                      <div className="flex-grow space-y-1">
                        {/* 标题和时间 */}
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <div className="font-semibold text-lg">{title}</div>
                          <time className="text-xs text-primary whitespace-nowrap">
                            发布时间：{new Date(created_at * 1000).toLocaleString()}
                          </time>
                        </div>

                        {/* 内容 */}
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>

            ) : (
              <p className="text-center text-neutral">暂无公告。</p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
