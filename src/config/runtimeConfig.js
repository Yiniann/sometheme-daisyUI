let config = null;

export const loadRuntimeConfig = async () => {
  try {
    const res = await fetch("/config.json", { cache: "no-store" });
    if (!res.ok) throw new Error("配置文件加载失败");
    config = await res.json();
  } catch (error) {
    console.error("[Config Load Error]", error);
    config = {};
  }
};

export const getConfig = () => {
  if (!config) throw new Error("配置尚未加载");
  return config;
};

export const getValue = (key, defaultValue = "") =>
  getConfig()?.[key] ?? defaultValue;
