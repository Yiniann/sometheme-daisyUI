import React, { useEffect, useState } from "react";
import Modal from "../../components/modals/Modal";
import { QRCodeSVG } from "qrcode.react";

const PaymentQRCode = ({ isOpen, paymentUrl, onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDark = () =>
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="支付二维码">
      <div className="flex items-center justify-center">
        <QRCodeSVG
          value={paymentUrl}
          size={150}
          fgColor={isDarkMode ? "#ffffff" : "#000000"}
          bgColor="transparent"
        />
      </div>
    </Modal>
  );
};

export default PaymentQRCode;