import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={handleBackgroundClick}
    >
      <div className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between text-base-content">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-base-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
