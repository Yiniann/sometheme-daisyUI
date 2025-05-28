import { Loader2, AlertCircle } from "lucide-react";

const StatusMessage = ({ loading, error, loadingText = "加载中...", errorText = "发生错误", children }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-base-content/70">
        <Loader2 className="animate-spin h-15 w-15 mb-2 text-neutral" />
        <span>{loadingText}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <AlertCircle className="h-15 w-15 text-error" />
        <div>
          <h3 className="font-bold">{errorText}</h3>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default StatusMessage;
