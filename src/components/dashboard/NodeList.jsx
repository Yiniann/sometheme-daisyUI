import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServerList } from "../../redux/slices/userSlice";
import StatusMessage from "../ui/StatusMessage";

const NodeList = () => {
  const dispatch = useDispatch();
  const { servers, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchServerList());
  }, [dispatch]);

  const onlineCount = servers?.filter((n) => n.is_online).length || 0;

  return (
    <StatusMessage
      loading={loading.fetchServerList}
      error={error.fetchServerList}
      loadingText="节点数据加载中..."
      errorText="加载节点数据失败"
    >
      {!loading.fetchServerList && (!servers || servers.length === 0) ? (
        <div className="p-6 text-center text-base-content">
          <h2 className="text-lg font-semibold">当前共 0 个节点可用</h2>
          <p className="text-sm">暂无节点数据。</p>
        </div>
      ) : (
        <div className="bg-base-100">
          {/* 顶部统计（粘顶） */}
          <div className="p-4 sticky top-0 bg-base-100 z-10">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-base">节点列表</h2>
              <span className="text-sm text-base-content/70">
                {onlineCount} / {servers.length} 在线
              </span>
            </div>
            <div className="flex justify-end">
              <p className="text-sm text-base-content/70">
                可用率：{((onlineCount / servers.length) * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* 列表区 */}
          <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-1">
            {servers.map((node) => (
              <div
                key={node.id}
                className={`card shadow-md ${
                  node.is_online ? "bg-success/10" : "bg-error/10"
                }`}
              >
                <div className="card-body p-4">
                  {/* 标题和状态 */}
                  <div className="flex justify-between items-center">
                    <h3 className="card-title text-base">{node.name}</h3>
                    <div
                      className="relative flex h-3 w-3 items-center justify-center"
                      title={node.is_online ? "在线" : "离线"}
                    >
                      {node.is_online ? (
                        <>
                          <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping bg-success"></span>
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success"></span>
                        </>
                      ) : (
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-error animate-bounce"></span>
                      )}
                    </div>
                  </div>

                  {/* 标签 + 类型 */}
                  <div className="flex justify-between items-center text-sm gap-4">
                    <div className="flex flex-wrap gap-1">
                      {node.tags?.length ? (
                        node.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="badge badge-outline badge-sm text-xs"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs opacity-60">无标签</span>
                      )}
                    </div>
                    <span className="text-xs text-base-content/60 whitespace-nowrap">
                      {node.type}
                    </span>
                  </div>

                  <p className="text-right text-xs text-base-content/60 mt-2">
                    最后检测：{new Date(node.last_check_at * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </StatusMessage>
  );
};

export default NodeList;