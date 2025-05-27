import { useSelector } from "react-redux";
import { getValue } from "../../config/runtimeConfig";
import Modal from "../modals/Modal";
import SubscriptionButton from "./SubscriptionButton";


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

const clientSchemas = [
  { name: "Shadowrocket", scheme: "shadowrocket://add/sub://{url:base64}?remarks={name:component}", platforms: ["ios"], icon: "iShadowrocket" },
  { name: "Clash", scheme: "clash://install-config?url={url:component}", platforms: ["desktop", "android", "macos"], icon: "iClash" },
  { name: "Surge", scheme: "surge:///install-config?url={url:component}", platforms: ["desktop", "ios", "macos"], icon: "iSurge" },
  { name: "Sing Box", scheme: "sing-box://import-remote-profile?url={url:component}#{name:component}", platforms: ["desktop", "ios", "android", "macos"], icon: null },
  { name: "Stash", scheme: "stash://install-config?url={url:component}&name={name:component}", platforms: ["ios"], icon: null },
  { name: "Hiddify", scheme: "hiddify://import/{url}#{name:component}", platforms: ["desktop", "ios", "android", "macos"], icon: "iHiddify" },
  { name: "Surfboard", scheme: "surfboard:///install-config?url={url:component}", platforms: ["android"], icon: "iSurfboard" },
  { name: "Quantumult", scheme: "quantumult://configuration?server={url:component}", platforms: ["ios"], icon: "iQuantumult" },
  { name: "Quantumult X", scheme: "quantumult-x:///update-configuration?remote-resource=%7B%22server_remote%22%3A%5B%22{url:component}%2C%20tag%3D{name:component}%22%5D%7D", platforms: ["ios"], icon: "iQuantumult" },
  { name: "Streisand", scheme: "streisand://import/{url}#{name:component}", platforms: ["ios"], icon: null },
];

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
        <SubscriptionButton />
        <div className="divider">一键订阅</div>
        {filteredClients.map((client) => {
          const url = buildUrl(client.scheme, subscribeUrl, siteName);
          return (
            <a
              key={client.name}
              href={url}
              className="btn btn-sm btn-outline w-full flex items-center gap-2 justify-center"
            >
              {client.icon && <span className={`icon ${client.icon}`} />}
              导入到 {client.name}
            </a>
          );
        })}
      </div>
    </Modal>
  );
};

export default Subscriber;
