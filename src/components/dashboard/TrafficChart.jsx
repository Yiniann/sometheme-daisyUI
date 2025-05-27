import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApexCharts from "react-apexcharts";
import { getTrafficLog } from "../../redux/slices/userSlice";
import StatusMessage from "../ui/StatusMessage";

const TrafficChart = () => {
  const dispatch = useDispatch();
  const trafficLogs = useSelector((state) => state.user.trafficLog);
  const loading = useSelector((state) => state.user.loading.getTrafficLog);
  const error = useSelector((state) => state.user.error.getTrafficLog);

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const hasDarkClass = document.documentElement.classList.contains("dark");
      setIsDark(hasDarkClass);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!trafficLogs || trafficLogs.length === 0) {
      dispatch(getTrafficLog());
    }
  }, [dispatch, trafficLogs.length]);

  const chartData = useMemo(
    () => ({
      series: [
        {
          name: "下载用量",
          data: trafficLogs.map((log) => log.d),
        },
        {
          name: "上传用量",
          data: trafficLogs.map((log) => log.u),
        },
        {
          name: "总量",
          data: trafficLogs.map((log) => log.d + log.u),
        },
      ],
      options: {
        theme: {
          mode: isDark ? "dark" : "light",
        },
        chart: {
          type: "area",
          height: 350,
        },
        xaxis: {
          categories: trafficLogs
            .slice()
            .reverse()
            .map((log) =>
              new Date(log.record_at * 1000).toLocaleDateString("zh-CN", {
                month: "2-digit",
                day: "2-digit",
              })
            ),
        },
        yaxis: {
          labels: {
            show: false,
            formatter: (value) => {
              if (value >= 1073741824)
                return (value / 1073741824).toFixed(2) + " GB";
              if (value >= 1048576)
                return (value / 1048576).toFixed(2) + " MB";
              return value + " 字节";
            },
          },
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          labels: {
            colors: isDark ? "#d1d5db" : "#374151",
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        colors: ["#38bdf8", "#f87171", "#6b7280"],
        stroke: {
          curve: "smooth",
          width: [2, 2, 2],
          dashArray: [3, 3, 0],
        },
      },
    }),
    [trafficLogs, isDark]
  );

  return (
    <StatusMessage
      loading={loading}
      error={error}
      loadingText="正在加载流量数据..."
      errorText="加载流量数据失败"
    >
      {trafficLogs && trafficLogs.length > 0 ? (
        <ApexCharts
          options={chartData.options}
          series={chartData.series}
          type="area"
          height="auto"
        />
      ) : (
        <div className="text-sm text-center text-base-content/60 py-4">
          暂无流量数据
        </div>
      )}
    </StatusMessage>
  );
};

export default TrafficChart;
