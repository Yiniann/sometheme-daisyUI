import { useEffect } from "react";

export const useThemeInit = () => {
  useEffect(() => {
    const storedFollow = localStorage.getItem("followSystem");
    const storedTheme = localStorage.getItem("theme");
    const followSystem = storedFollow === null ? true : storedFollow === "true";

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const systemIsDark = mql.matches;

    const themeToApply = followSystem
      ? systemIsDark ? "dark" : "light"
      : storedTheme || "light";

    document.documentElement.setAttribute("data-theme", themeToApply);

    // 如果跟随系统，设置监听
    if (followSystem) {
      const handler = (e) => {
        const newTheme = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
      };
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
  }, []);
};
