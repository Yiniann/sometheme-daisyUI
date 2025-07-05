import { Send, Bot } from "lucide-react";
import { useSelector } from "react-redux";

const TelegramHero = () => {
  const { accountConfig } = useSelector((state) => state.passport);

  const telegramLink = accountConfig?.telegram_discuss_link;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Telegram 讨论组 */}
      {telegramLink && (
        <div className="hero bg-base-200 rounded-xl flex-1">
          <div className="hero-content flex-row">
            <div className="p-4 rounded-full bg-neutral text-neutral-content">
              <Send className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">加入我们的 Telegram 讨论组！</h1>
              <p className="py-2 text-base-content/70">
                获取最新资讯，与其他用户交流互动。
              </p>
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-neutral"
              >
                加入讨论组
              </a>
            </div>
          </div>
        </div>
      )}
      {/* Telegram Bot 绑定 */}
      {accountConfig?.is_telegram === 1 && (
        <div className="hero bg-base-200 rounded-xl flex-1">
          <div className="hero-content flex-row">
            <div className="p-4 rounded-full bg-neutral text-neutral-content">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">绑定 Telegram 机器人</h1>
              <p className="py-2 text-base-content/70">
                启用机器人接收系统消息、提醒等功能。
              </p>
              <button className="btn btn-disabled">暂未开放</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelegramHero;