import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import ApexCharts from "react-apexcharts";
import StatusMessage from "../ui/StatusMessage";

const TrafficChart = () => {
  const trafficLogs = useSelector((state) => state.user.trafficLog);
  const loading = useSelector((state) => state.user.loading.getTrafficLog);
  const error = useSelector((state) => state.user.error.getTrafficLog);

  const [themeColors, setThemeColors] = useState({
    series: ["#38bdf8", "#f87171", "#6b7280"],
    labelColor: "#4b5563",
  });

  useEffect(() => {
    const isDarkMode = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      return theme === "dark" || theme === "dracula";
    };

    const updateThemeColors = () => {
      setThemeColors({
        series: ["#38bdf8", "#f87171", "#6b7280"],
        labelColor: isDarkMode() ? "#ffffff" : "#4b5563",
      });
    };

    updateThemeColors();

    const observer = new MutationObserver(() => {
      updateThemeColors();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);




  const chartData = useMemo(() => {
    const reversedLogs = trafficLogs ? trafficLogs.slice().reverse() : [];

    return {
      series: [
        {
          name: "下载用量",
          data: reversedLogs.map((log) => log.d),
        },
        {
          name: "上传用量",
          data: reversedLogs.map((log) => log.u),
        },
        {
          name: "总量",
          data: reversedLogs.map((log) => log.d + log.u),
        },
      ],
      options: {
        chart: {
          type: "area",
          height: 350,
          background: "transparent",
          toolbar: {
            show: true,
          },
        },
        xaxis: {
          categories: reversedLogs.map((log) =>
            new Date(log.record_at * 1000).toLocaleDateString("zh-CN", {
              month: "2-digit",
              day: "2-digit",
            }),
          ),
          labels: {
            style: {
              colors: themeColors.labelColor,
              fontWeight: 500,
            },
          },
        },
        yaxis: {
          labels: {
            show: false,
            formatter: (value) => {
              if (value >= 1073741824) return (value / 1073741824).toFixed(2) + " GB";
              if (value >= 1048576) return (value / 1048576).toFixed(2) + " MB";
              return value + " 字节";
            },
          },
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          labels: {
            colors: themeColors.labelColor,
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        colors: themeColors.series,
        stroke: {
          curve: "smooth",
          width: [2, 2, 2],
          dashArray: [3, 3, 0],
        },
        grid: {
          show: false,
        },
        tooltip: {
          theme: false,
          custom: function ({ series, dataPointIndex }) {
            const labels = ["下载用量", "上传用量", "总量"];
            let html = `<div style="background:#1f2937;padding:8px;border-radius:6px;color:#f9fafb">`;

            for (let i = 0; i < series.length; i++) {
              const value = series[i][dataPointIndex];
              let formatted;
              if (value >= 1073741824) formatted = (value / 1073741824).toFixed(2) + " GB";
              else if (value >= 1048576) formatted = (value / 1048576).toFixed(2) + " MB";
              else formatted = value + " 字节";

              html += `<div><strong>${labels[i]}:</strong> ${formatted}</div>`;
            }

            html += `</div>`;
            return html;
          },
        },
      },
    };
  }, [trafficLogs, themeColors]);

  return (
    <StatusMessage
      loading={loading}
      error={error}
      loadingText="流量数据加载中..."
      errorText="加载流量数据失败"
    >
      {trafficLogs && trafficLogs.length > 0 ? (
        <div className="w-full rounded-lg bg-base-100 p-4">
          <ApexCharts
            key={themeColors.labelColor}
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={350}
          />
        </div>
      ) : (
        <div className="text-center text-sm text-base-content/60 py-8">
          暂无流量数据
        </div>
      )}
    </StatusMessage>
  );
};

export default TrafficChart;
