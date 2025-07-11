const RightPanelWrapper = ({ panelKey, onClose, panelMap }) => {
  if (!panelKey || !panelMap[panelKey]) return null;

  const { component: PanelComponent, title } = panelMap[panelKey];

  return (
    <>
      <div
        className="fixed z-40 left-0 right-0 top-14 bottom-16 lg:top-0 lg:bottom-0 bg-black/40 lg:bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-14 bottom-16 lg:top-0 lg:bottom-0 z-50 w-72 bg-base-200 border-l border-base-300 shadow-xl rounded-l-lg">
        <div className="flex items-center justify-between border-b border-base-300 p-4">
          <h2 className="font-bold text-lg">{title}</h2>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="overflow-y-auto p-4  pb-14 h-full">
          <PanelComponent />
        </div>
      </div>
    </>
  );
};

export default RightPanelWrapper;
