import {
  Monitor,
  Apple,
  Smartphone,
} from "lucide-react";
import { getValue } from "../../config/runtimeConfig";

const platforms = [
  {
    key: "windows_download_url",
    name: "Windows",
    icon: <Monitor className="w-6 h-6 text-neutral shrink-0" />,
  },
  {
    key: "macos_download_url",
    name: "macOS",
    icon: <Apple className="w-6 h-6 text-neutral shrink-0" />,
  },
  {
    key: "ios_download_url",
    name: "iPhone",
    icon: <Smartphone className="w-6 h-6 text-neutral shrink-0" />,
  },
  {
    key: "android_download_url",
    name: "Android",
    icon: <Smartphone className="w-6 h-6 text-neutral shrink-0" />,
  },
];

const AppDownload = () => {
  const availablePlatforms = platforms
    .map((p) => ({
      ...p,
      url: getValue(p.key),
    }))
    .filter((p) => p.url);

  if (availablePlatforms.length === 0) return null;

  return (
    <div className="rounded-box bg-base-200 p-4 w-full">
      <h2 className="text-xl font-semibold mb-4">客户端下载</h2>
      <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {availablePlatforms.map((platform) => (
          <a
            key={platform.key}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-base-100 rounded-box border p-4 flex flex-row items-center justify-center gap-2 hover:shadow text-sm"
          >
            {platform.icon}
            <span>{platform.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AppDownload;