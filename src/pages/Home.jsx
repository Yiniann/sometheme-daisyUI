import { useSelector } from "react-redux";
import ContentRenderer from "../components/ContentRenderer"
import { CalendarDays } from "lucide-react";
import WelcomeBanner from "../components/home/WelcomeBanner";

const Home = () => {
  const { notices, loading, error, fetchedNotice } = useSelector(
    (state) => state.user
  );

  return (
    <div className="x-auto max-w-7xl space-y-4 pb-4 ">
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
                <div className="flex-shrink-0">
                  <div className="skeleton w-6 h-6 mt-1 rounded-full" />
                </div>
                <div className="flex-grow space-y-2">
                  <div className="skeleton h-5 w-32 rounded" />
                  <div className="space-y-1">
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-4/5 rounded" />
                    <div className="skeleton h-4 w-3/5 rounded" />
                  </div>
                  <div className="skeleton h-3 w-24 rounded" />
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
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <div className="font-semibold text-lg">{title}</div>
                          <time className="text-xs text-primary whitespace-nowrap">
                            发布时间：{new Date(created_at * 1000).toLocaleString()}
                          </time>
                        </div>
                        <ContentRenderer content={content} className="prose prose-sm max-w-none pt-2 pl-4" />
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
