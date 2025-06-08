import { useState } from "react";
import Modal from "../modals/Modal";
import { useSelector } from "react-redux";
import  { QRCodeSVG } from "qrcode.react"; 
import { Copy, QrCode } from "lucide-react";

const SubscriptionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const subscriptionUrl = useSelector((state) => state.user.subscription?.subscribe_url);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(subscriptionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败", err);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="btn btn-outline btn-sm w-full flex items-center gap-2"
      >
        <QrCode className="w-4 h-4" />
        二维码订阅
      </button>

      <Modal isOpen={isOpen} onClose={closeModal} title="订阅信息">
        <div className="space-y-4 text-center">
          <QRCodeSVG value={subscriptionUrl} size={160} className="mx-auto" />
          <div className="flex items-center gap-2 bg-base-200 rounded px-3 py-2">
            <div className="text-sm truncate">{subscriptionUrl}</div>
            <button onClick={handleCopy} className="btn btn-sm btn-ghost">
              <Copy className="w-4 h-4" />
              {copied ? "已复制" : "复制"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SubscriptionButton;
