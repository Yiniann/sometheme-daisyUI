import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKnowledgeList, fetchKnowledgeById } from "../redux/slices/knowledgeSlice";
import { useNavigate, useParams } from "react-router-dom";
import StatusMessage from "../components/ui/StatusMessage";
import ContentRenderer from "../components/ContentRenderer";

const Knowledge = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { list, current, loading, error } = useSelector((state) => state.knowledge);
  const [selectedId, setSelectedId] = useState(null);

  const isDetailPage = !!id;

  useEffect(() => {
    dispatch(fetchKnowledgeList());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      const knowledgeId = Number(id);
      if (current?.id !== knowledgeId) {
        dispatch(fetchKnowledgeById({ id: knowledgeId }));
      }
      setSelectedId(knowledgeId);
    }
  }, [dispatch, id, current?.id]);

  const handleSelect = (itemId) => {
    navigate(`/knowledge/${itemId}`);
    setSelectedId(itemId);
  };

  const handleBack = () => {
    navigate("/knowledge");
    setSelectedId(null);
  };

  // 默认选中第一个知识库条目（大屏幕且当前无选中项）
  useEffect(() => {
    if (!isDetailPage && Object.keys(list).length > 0 && window.innerWidth >= 1024) {
      const firstCategory = Object.keys(list)[0];
      const firstItem = list[firstCategory][0];
      if (firstItem) {
        navigate(`/knowledge/${firstItem.id}`, { replace: true });
      }
    }
  }, [list, isDetailPage, navigate]);

  const isListEmpty = Object.keys(list).length === 0;

  if (isListEmpty && !loading.fetchKnowledgeList) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-base-content/70 p-10">
        <div className="text-4xl mb-4">📄</div>
        <p className="mb-2 font-semibold">知识库为空</p>
        <p className="text-sm">请稍后重试或联系管理员添加内容</p>
        <button
          onClick={() => dispatch(fetchKnowledgeList())}
          className="btn btn-neutral btn-sm mt-4"
        >
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* 列表区 */}
      <div className={`flex-shrink-0 border-base-300 pb-14 lg:w-64 lg:border-r lg:p-4 ${isDetailPage ? 'hidden lg:block' : 'block'} p-4`}>
        <StatusMessage
          loading={loading.fetchKnowledgeList}
          error={error.fetchKnowledgeList}
          loadingText="加载知识库..."
          errorText="加载知识库失败"
        >
          <ul>
            {Object.keys(list).map((category) => (
              <li key={category} className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">{category}</h3>
                <ul>
                  {list[category].map((item) => (
                    <li key={item.id} className="mb-2">
                      <button
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className={`w-full text-left p-3 rounded-lg border border-base-300 mb-2 transition hover:bg-base-200${
                          selectedId === item.id
                            ? " bg-neutral text-neutral-content font-bold"
                            : ""
                        }`}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </StatusMessage>
      </div>

      {/* 详情区 */}
      <div className={`flex-1 overflow-y-auto p-4 ${!isDetailPage && 'hidden lg:block'}`}>
        {isDetailPage && (
          <>
            {/* 面包屑 */}
            <div className="sticky top-[-16px] z-10 bg-base-100 border-b border-base-300">
              <div className="breadcrumbs text-sm">
                <ul>
                  <li>
                    <button
                      onClick={handleBack}
                      className="underline text-primary lg:no-underline lg:text-base-content lg:cursor-default lg:pointer-events-none"
                    >
                      知识库
                    </button>
                  </li>
                  {loading.fetchKnowledgeById ? (
                    <>
                      <li><div className="skeleton h-4 w-16"></div></li>
                      <li><div className="skeleton h-4 w-24"></div></li>
                    </>
                  ) : (
                    <>
                      <li>{current?.category || '未知分类'}</li>
                      <li className="font-semibold text-base-content">{current?.title || '加载中...'}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}

        <StatusMessage
          loading={loading.fetchKnowledgeById}
          error={error.fetchKnowledgeById}
          loadingText="加载知识点详情..."
          errorText="加载知识点详情失败"
        >
          {current ? (
            <ContentRenderer content={current.body} />
          ) : (
            <div className="text-base-content/70">请选择知识库条目</div>
          )}
        </StatusMessage>
      </div>
    </div>
  );
};

export default Knowledge;