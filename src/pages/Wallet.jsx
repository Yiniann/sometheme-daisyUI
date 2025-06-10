import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInfo } from "../redux/slices/userSlice";
import { fetchInviteData, createInviteCode } from "../redux/slices/inviteSlice";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import StatusMessage from "../components/ui/StatusMessage";
import TransferButton from "../components/modals/TransferButton";
import WithdrawButton from "../components/modals/WithdrawButton";

const Wallet = () => {
  const dispatch = useDispatch();

  const { info, loading, error } = useSelector((state) => state.user);
  const { data: inviteData, loading: inviteLoading, creating, error: inviteError } = useSelector((state) => state.invite);

  useEffect(() => {
    dispatch(fetchInfo());
    dispatch(fetchInviteData());
  }, [dispatch]);

  const onClickCreate = async () => {
    const result = await dispatch(createInviteCode());
    if (createInviteCode.fulfilled.match(result)) {
      dispatch(fetchInviteData());
      toast.success("邀请码创建成功");
    } else {
      toast.error(result.payload || "邀请码创建失败");
    }
  };

  const onClickCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("复制成功");
    } catch (err) {
      toast.error("复制失败");
    }
  };

  const safeToFixed = (value, digits = 2) => {
    return typeof value === "number" ? value.toFixed(digits) : "0.00";
  };

  return (
    <div className="mx-auto space-y-6 p-4">
      <StatusMessage loading={loading.fetchInfo} error={error.fetchInfo} loadingText="加载用户信息..." errorText="加载用户信息失败">
        <div className="rounded-lg bg-base-100 p-6 shadow">
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold text-base-content">我的钱包</h2>
            <div className="text-4xl font-semibold text-neutral">
              ¥{safeToFixed(info?.balance / 100)}
              <span className="ml-1 align-middle text-base text-base-content/60">CNY</span>
            </div>
            <p className="text-sm text-base-content/60">账户余额（仅限消费）</p>
          </div>
        </div>
      </StatusMessage>

      <StatusMessage loading={inviteLoading.fetchInviteData} error={inviteError.fetchInviteData} loadingText="加载邀请信息..." errorText="加载邀请信息失败">
        <div className="rounded-lg bg-base-100 p-6 shadow">
          <div className="flex flex-col lg:flex-row items-start justify-between">
            <div className="flex flex-col space-y-2">
              <h2 className="text-xl font-semibold text-base-content">我的邀请</h2>
              <div className="text-4xl font-semibold">
                ¥{safeToFixed(info?.commission_balance / 100)}
                <span className="ml-1 align-middle text-base text-base-content/60">CNY</span>
              </div>
              <p className="text-sm text-base-content/60">当前剩余佣金</p>

              <div className="mt-1 flex space-x-2">
                <TransferButton />
                <WithdrawButton />
              </div>
            </div>

            <div className="flex pt-5 w-64 flex-col space-y-1 text-sm text-base-content/80">
              <div className="flex justify-between">
                <span>已注册用户数：</span>
                <span>{inviteData?.stat[0]} 人</span>
              </div>
              <div className="flex justify-between">
                <span>佣金比例：</span>
                <span>{inviteData?.stat[3]}%</span>
              </div>
              <div className="flex justify-between">
                <span>确认中的佣金：</span>
                <span>¥{safeToFixed(inviteData?.stat[2] / 100)}</span>
              </div>
              <div className="flex justify-between">
                <span>有效的佣金：</span>
                <span>¥{safeToFixed(inviteData?.stat[1] / 100)}</span>
              </div>
              <div className="flex justify-between">
                <span>可用佣金：</span>
                <span>¥{safeToFixed(inviteData?.stat[4] / 100)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-base-100 p-6 shadow">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-base-content">我的邀请码</h2>
              <button
                onClick={onClickCreate}
                disabled={creating}
                className={`btn btn-neutral btn-sm ${creating ? "btn-disabled loading" : ""}`}
              >
                {creating ? "生成中..." : "生成邀请码"}
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {inviteData?.codes.length === 0 ? (
                <p className="text-base-content/60">暂无邀请码</p>
              ) : (
                inviteData.codes.map((invite, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-base-300 p-4">
                    <div className="text-xl font-semibold">
                      {invite.code}
                      <small className="block text-right text-xs text-base-content/60">
                        创建时间: {new Date(invite.created_at * 1000).toLocaleString()}
                      </small>
                    </div>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => onClickCopy(invite.code)}
                    >
                      <Copy className="mr-1 h-4 w-4" />
                      复制
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </StatusMessage>
    </div>
  );
};

export default Wallet;