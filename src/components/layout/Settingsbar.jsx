// components/layout/Settingsbar.jsx
import { Sun, Moon, Globe, Languages } from "lucide-react";
import { useState } from "react";

const Settingsbar = () => {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("zh");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-bold">设置</div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">
            <Sun className="w-4 h-4 inline-block mr-2" />
            主题
          </span>
        </label>
        <button className="btn btn-sm w-full" onClick={toggleTheme}>
          切换为 {theme === "light" ? "暗色" : "亮色"} 模式
        </button>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">
            <Languages className="w-4 h-4 inline-block mr-2" />
            语言
          </span>
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

export default Settingsbar;
