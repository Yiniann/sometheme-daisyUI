import { Loader2, AlertCircle } from "lucide-react";

const StatusMessage = ({
  loading,
  error,
  loadingText = "加载中...",
  errorText = "发生错误",
  children,
}) => {
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-10 text-base-content/70">
        <div className="flex flex-col items-center justify-center">
          <span className="loading loading-bars loading-xl"></span>
          <span className="text-base">{loadingText}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center py-10">
        <div className="alert alert-error shadow-lg items-center w-auto max-w-md">
          <AlertCircle className="h-8 w-8 text-error" />
          <div>
            <h3 className="font-bold">{errorText}</h3>
            <div className="text-sm break-words">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default StatusMessage;
