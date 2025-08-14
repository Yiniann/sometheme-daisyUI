import { useState } from "react";
import { Send, Bot, Copy } from "lucide-react";
import { useSelector } from "react-redux";
import Modal from "../modals/Modal";

const TelegramHero = () => {
  const { accountConfig } = useSelector((state) => state.passport);
  const {bot, subscription} = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const telegramLink = accountConfig?.telegram_discuss_link;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Telegram 讨论组 */}
      <div className="hero bg-base-200 rounded-xl flex-1 items-center justify-items-start">
        <div className="hero-content flex-row items-center text-left justify-self-start">
          <div className="p-4 rounded-full bg-neutral text-neutral-content">
            <Send className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Telegram 讨论组！</h1>
            <p className="py-2 text-base-content/70">
              欢迎加入我们的讨论组！与我们和其他用户一起互动交流，第一时间掌握最新动态与专属优惠。
            </p>
            {
              telegramLink
                ? (
                  <a
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-neutral"
                  >
                    加入讨论组
                  </a>
                )
                : (
                  <button className="btn btn-neutral" disabled>
                    敬请期待
                  </button>
                )
            }
          </div>
        </div>
      </div>
      {/* Telegram Bot 绑定 */}
      <div className="hero bg-base-200 rounded-xl flex-1 items-center justify-items-start">
        <div className="hero-content flex-row items-center text-left justify-self-start">
          <div className="p-4 rounded-full bg-neutral text-neutral-content">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">绑定 Telegram 机器人</h1>
            <p className="py-2 text-base-content/70">
              将您的账号绑定到我们的 Telegram Bot，第一时间接收重要通知，实时了解账户状态与平台最新消息，尽享更加高效、便捷的服务体验。
            </p>
            {accountConfig?.is_telegram === 1 ? (
              <button onClick={() => setIsModalOpen(true)} className="btn btn-neutral">绑定机器人</button>
            ) : (
              <button className="btn btn-neutral" disabled>
                敬请期待
              </button>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Telegram Bot">
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">第一步</h2>
            <p>
              在 Telegram 中搜索{" "}
              <a
                href={`https://t.me/${bot?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-mono"
              >
                @{bot?.username}
              </a>
            </p>
          </div>
          <div>
            <h2 className="font-semibold">第二步</h2>
            <p>向机器人发送以下指令完成绑定：</p>
            <div className="mt-2 rounded bg-base-300 px-3 py-2 font-mono text-sm break-all flex items-center justify-between">
              <span className="mr-4 break-words">
                /bind {subscription?.subscribe_url}
              </span>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() =>
                  navigator.clipboard.writeText(`/bind ${subscription?.subscribe_url}`)
                }
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TelegramHero;