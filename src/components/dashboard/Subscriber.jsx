import { useSelector } from "react-redux";
import { getValue } from "../../config/runtimeConfig";
import Modal from "../modals/Modal";
import SubscriptionButton from "./SubscriptionButton";
import { toast } from "sonner";
import clientSchemas from "./clientSchemas";

const getPlatform = () => {
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isTouch = navigator.maxTouchPoints > 1;

  if (/iPhone|iPod/.test(ua)) return "ios";
  if (/iPad/.test(ua) || (platform === "MacIntel" && isTouch) || platform === "iPad") return "ios";
  if (/Android/.test(ua)) return "android";
  if (/Macintosh/.test(ua)) return "macos";
  return "desktop";
};

const buildUrl = (scheme, url, name) => {
  return scheme
    .replace(/\{url\}/g, url)
    .replace(/\{url:component\}/g, encodeURIComponent(url))
    .replace(/\{url:base64\}/g, btoa(url))
    .replace(/\{name\}/g, name)
    .replace(/\{name:component\}/g, encodeURIComponent(name));
};


 

const Subscriber = ({ isOpen, onClose }) => {
  const subscription = useSelector((state) => state.user.subscription);
  const isLoading = useSelector((state) => state.user.loading);
  const subscribeUrl = subscription?.subscribe_url;
  const siteName = getValue("siteName") || "";
  const platform = getPlatform();

  if (isLoading.fetchSubscription || !subscribeUrl) return null;

  const filteredClients = clientSchemas.filter((client) =>
    client.platforms.includes(platform)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="导入方式">
      <div className="space-y-2">
        <div className="divider text-sm">订阅信息</div>
        <SubscriptionButton />
        <div className="divider text-sm">一键订阅</div>
        {filteredClients.map((client) => {
          const url = buildUrl(client.scheme, subscribeUrl, siteName);
          return (
            <a
              key={client.name}
              href={url}
              className="btn btn-sm btn-outline w-full flex items-center gap-2 justify-center"
              onClick={() =>
                toast.info(`尝试唤醒 ${client.name}，若无效请手动复制订阅地址`)
              }
            >
              {typeof client.icon === "string" ? (
                <span className={`icon ${client.icon}`} />
              ) : client.icon ? (
                <span className="w-5 h-5 text-neutral">{client.icon}</span>
              ) : null}
              导入到 {client.name}
            </a>
          );
        })}
      </div>
    </Modal>
  );
};

export default Subscriber;
