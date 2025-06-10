import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKnowledgeById } from "../../redux/slices/knowledgeSlice";
import { useParams } from "react-router-dom";
import StatusMessage from "../ui/StatusMessage";
import ContentRenderer from "../ui/ContentRenderer";

const KnowledgeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((state) => state.knowledge);

  useEffect(() => {
    const knowledgeId = Number(id);
    if (!knowledgeId) return;

    if (current?.id !== knowledgeId) {
      dispatch(fetchKnowledgeById({ id: knowledgeId }));
    }
  }, [dispatch, id, current?.id]);

  return (
    <StatusMessage
      loading={loading.fetchKnowledgeById}
      error={error.fetchKnowledgeById}
      loadingText="加载知识点详情..."
      errorText="加载知识点详情失败"
    >
      {!current ? (
        <div className="flex flex-1 items-center justify-center py-10 text-error">
          未找到该知识点，可能是 ID 无效或数据未加载
        </div>
      ) : (
        <div className="prose dark:prose-invert w-full">
          <h1 className="mb-4">{current.title}</h1>
          <ContentRenderer content={current.body} />
        </div>
      )}
    </StatusMessage>
  );
};

export default KnowledgeDetail;
