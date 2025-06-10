import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKnowledgeList, fetchKnowledgeById } from "../redux/slices/knowledgeSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StatusMessage from "../components/ui/StatusMessage";
import ContentRenderer from "../components/ContentRenderer";
import { ArrowLeft } from "lucide-react";

const Knowledge = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { list, current, loading, error } = useSelector((state) => state.knowledge);
  const [selectedId, setSelectedId] = useState(null);

  const isDetailPage = !!id;

  // 获取列表
  useEffect(() => {
    dispatch(fetchKnowledgeList());
  }, [dispatch]);

  // 获取详情
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
  };

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
          {Object.keys(list).length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-base-content/70 py-10">
              <div className="text-4xl mb-4">📄</div>
              <p className="mb-2 font-semibold">知识库为空</p>
              <p className="text-sm">请稍后重试或联系管理员添加内容</p>
              <button
                onClick={() => dispatch(fetchKnowledgeList())}
                className="btn btn-primary btn-sm mt-4"
              >
                重新加载
              </button>
            </div>
          ) : (
            <ul>
              {Object.keys(list).map((category) => (
                <li key={category} className="mb-4">
                  <h3 className="mb-2 text-lg font-semibold">{category}</h3>
                  <ul>
                    {list[category].map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`mb-2 cursor-pointer rounded-full p-2 text-center hover:bg-primary/10 ${
                          selectedId === item.id ? 'bg-primary/20 font-bold' : ''
                        }`}
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </StatusMessage>
      </div>

      {/* 详情区 */}
      <div className={`flex-1 overflow-y-auto p-4 ${!isDetailPage && 'hidden lg:block'}`}>
        {/* 移动端返回按钮 */}
        {isDetailPage && (
          <button
            onClick={handleBack}
            className="mb-4 flex items-center text-sm text-primary lg:hidden"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回列表
          </button>
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
