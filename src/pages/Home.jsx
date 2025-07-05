import { useSelector } from "react-redux";
import { useState } from "react";
import ContentRenderer from "../components/ContentRenderer"
import Modal from "../components/modals/Modal";
import StatusMessage from "../components/ui/StatusMessage";
import { X } from "lucide-react";
import TelegramHero from "../components/home/TelegramHero"
import NoticeCarousel from "../components/home/NoticeCarousel";
import StatAlerts from "../components/home/StatAlerts";

const Home = () => {
  const { notices, loading, error, fetchedNotice, stat } = useSelector(
    (state) => state.user
  );
  

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showOrdersAlert, setShowOrdersAlert] = useState(true);
  const [showTicketsAlert, setShowTicketsAlert] = useState(true);
  const [showInvitesAlert, setShowInvitesAlert] = useState(true);

  const openModal = (notice) => {
    setSelectedNotice(notice);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNotice(null);
  };

  return (
    <StatusMessage
      loading={loading.fetchNotice}
      error={error.fetchNotice}
      loadingText="加载公告中..."
      errorText="加载公告失败"
    >
      <div className="space-y-4 pb-4">
        {fetchedNotice && notices?.length > 0 && (
          <NoticeCarousel notices={notices} fetched={fetchedNotice} onSelect={openModal} />
        )}

        <StatAlerts
          stat={stat}
          showOrdersAlert={showOrdersAlert}
          showTicketsAlert={showTicketsAlert}
          showInvitesAlert={showInvitesAlert}
          setShowOrdersAlert={setShowOrdersAlert}
          setShowTicketsAlert={setShowTicketsAlert}
          setShowInvitesAlert={setShowInvitesAlert}
        />

        <TelegramHero />

        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={selectedNotice?.title}
        >
          <ContentRenderer
            content={selectedNotice?.content}
            className="prose prose-sm max-w-none"
          />
        </Modal>
      </div>
    </StatusMessage>
  );
};

export default Home;
