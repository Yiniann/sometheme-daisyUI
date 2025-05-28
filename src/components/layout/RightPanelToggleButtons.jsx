import { IdCard, Settings } from "lucide-react";

const RightPanelToggleButtons = ({ active, setActive }) => {
  const toggle = (key) => {
    setActive(active === key ? null : key);
  };

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip="用户" >
        <button className="btn btn-square btn-ghost" onClick={() => toggle("info")}>
          <IdCard className="w-5 h-5" />
        </button>
      </div>
      <div className="tooltip tooltip-bottom" data-tip="设置" >
        <button className="btn btn-square btn-ghost" onClick={() => toggle("settings")}>
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

export default RightPanelToggleButtons;
