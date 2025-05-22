import { Languages, Palette } from "lucide-react";
import { useState, useEffect } from "react";

const themes = ["light", "dark", "nord","valentine", "cupcake", "dracula", "cyberpunk"];

const Settingsbar = () => {
  const [followSystem, setFollowSystem] = useState(true);
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("zh");

  // 初始化设置
  useEffect(() => {
    const storedFollow = localStorage.getItem("followSystem");
    const storedTheme = localStorage.getItem("theme");
    const follow = storedFollow === null ? true : storedFollow === "true";
    const currentTheme = storedTheme || "light";

    setFollowSystem(follow);
    setTheme(currentTheme);

    if (!follow) {
      document.documentElement.setAttribute("data-theme", currentTheme);
    }
  }, []);

  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleFollowSystem = () => {
    const newFollow = !followSystem;
    setFollowSystem(newFollow);
    localStorage.setItem("followSystem", newFollow.toString());

    if (newFollow) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    } else {
      applyTheme(theme);
    }
  };

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    if (!followSystem) {
      applyTheme(selectedTheme);
    }
  };

  return (
    <div className="space-y-4">
      {/* 跟随系统 */}
      <div className="form-control flex flex-row items-center space-x-2">
        <label className="label cursor-pointer flex items-center">
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={followSystem}
            onChange={toggleFollowSystem}
          />
          <span className="label-text ml-2 select-none">跟随系统主题</span>
        </label>
      </div>

      {/* 自定义主题选择 */}
      {!followSystem && (
        <div className="form-control">
          <label className="label flex items-center">
            <Palette className="w-4 h-4 mr-2" />
            UI 主题
          </label>
          <select
            className="select select-bordered select-sm w-full"
            value={theme}
            onChange={handleThemeChange}
          >
            {themes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 语言切换 */}
      <div className="form-control">
        <label className="label flex items-center">
          <Languages className="w-4 h-4 mr-2" />
          语言
        </label>
        <select
          className="select select-bordered select-sm w-full"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="zh">简体中文</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
};

Settingsbar.title = "设置";

export default Settingsbar;
