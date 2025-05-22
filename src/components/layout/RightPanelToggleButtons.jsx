import { IdCard, Settings } from "lucide-react";

const RightPanelToggleButtons = ({ active, setActive }) => {
  const toggle = (key) => {
    setActive(active === key ? null : key);
  };

  return (
    <>
      <button className="btn btn-square btn-ghost" onClick={() => toggle("info")}>
        <IdCard className="w-5 h-5" />
      </button>
      <button className="btn btn-square btn-ghost" onClick={() => toggle("settings")}>
        <Settings className="w-5 h-5" />
      </button>
    </>
  );
};

export default RightPanelToggleButtons;
