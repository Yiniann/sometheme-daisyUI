import { useSelector } from "react-redux";
import { getValue } from "../../config/runtimeConfig";

const Subscriber = () => {
  const subscription = useSelector((state) => state.user.subscription);
  const subscribeUrl = subscription?.subscribe_url;
  const siteName = getValue("siteName") || "";

  const buttons = [
    {
      name: "Clash",
      url: `clash://install-config?url=${encodeURIComponent(subscribeUrl)}`,
      style: "btn-primary",
    },
    {
      name: "Surge",
      url: `surge://install-config?url=${encodeURIComponent(subscribeUrl)}`,
      style: "btn-secondary",
    },
    {
      name: "Hiddify",
      url: `hiddify://import/${subscribeUrl}#${siteName}`,
      style: "btn-accent",
    },
    {
      name: "Sing-box",
      url: `sing-box://import-remote-profile?url=${encodeURIComponent(subscribeUrl)}#${siteName}`,
      style: "btn-info",
    },
  ];

  const handleClick = (url) => {
    window.location.href = url;
  };
  
  if (!subscribeUrl) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 px-4">
      {buttons.map((btn) => (
        <button
          key={btn.name}
          onClick={() => handleClick(btn.url)}
          className={`btn btn-sm ${btn.style}`}
        >
          导入到 {btn.name}
        </button>
      ))}
    </div>
  );
};

export default Subscriber;
