import { useSelector } from "react-redux";
import { getValue } from "../../config/runtimeConfig";

// 获取用户平台
const getPlatform = () => {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  if (/Macintosh/.test(ua)) return "macos";
  return "desktop";
};

// 构造替换 URL
const buildUrl = (scheme, url, name) => {
  return scheme
    .replace(/\{url\}/g, url)
    .replace(/\{url:component\}/g, encodeURIComponent(url))
    .replace(/\{url:base64\}/g, btoa(url))
    .replace(/\{name\}/g, name)
    .replace(/\{name:component\}/g, encodeURIComponent(name));
};

// 客户端配置列表
const clientSchemas = [
  {
    name: "Clash",
    scheme: "clash://install-config?url={url:component}",
    platforms: ["desktop", "android"],
    icon: "iClash",
  },
  {
    name: "Shadowrocket",
    scheme: "shadowrocket://add/sub://{url:base64}?remarks={name:component}",
    platforms: ["ios"],
    icon: "iShadowrocket",
  },
  {
    name: "Surge",
    scheme: "surge:///install-config?url={url:component}",
    platforms: ["desktop", "ios"],
    icon: "iSurge",
  },
 {
    name: "Sing Box",
    scheme: "sing-box://import-remote-profile?url={url:component}#{name:component}",
    platforms: ["desktop", "ios", "android"],
    icon: null,
  },
  {
    name: "Stash",
    scheme: "stash://install-config?url={url:component}&name={name:component}",
    platforms: ["ios"],
    icon: null,
  },
  {
    name: "Hiddify",
    scheme: "hiddify://import/{url}#{name:component}",
    platforms: ["desktop", "ios", "android"],
    icon: "iHiddify",
  },
  {
    name: "Surfboard",
    scheme: "surfboard:///install-config?url={url:component}",
    platforms: ["android"],
    icon: "iSurfboard",
  },
  {
    name: "Quantumult",
    scheme: "quantumult://configuration?server={url:component}",
    platforms: ["ios"],
    icon: "iQuantumult",
  },
  {
    name: "Quantumult X",
    scheme:
      "quantumult-x:///update-configuration?remote-resource=%7B%22server_remote%22%3A%5B%22{url:component}%2C%20tag%3D{name:component}%22%5D%7D",
    platforms: ["ios"],
    icon: "iQuantumult",
  },
  {
    name: "Streisand",
    scheme: "streisand://import/{url}#{name:component}",
    platforms: ["ios"],
    icon: null,
  },
];

const Subscriber = () => {
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
    <div className="flex flex-wrap gap-2 mt-3 px-4">
      {filteredClients.map((client) => {
        const url = buildUrl(client.scheme, subscribeUrl, siteName);
        return (
          <button
            key={client.name}
            onClick={() => (window.location.href = url)}
            className="btn btn-sm btn-primary flex items-center gap-1"
          >
            {client.icon && (
              <span className={`icon ${client.icon}`} />
            )}
            导入到 {client.name}
          </button>
        );
      })}
    </div>
  );
};

export default Subscriber;
