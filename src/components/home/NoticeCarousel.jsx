import { useEffect, useRef, useState } from "react";

const NoticeCarousel = ({ notices, fetched, onSelect }) => {
  const totalSlides = notices?.length || 0;
  const slideIndexRef = useRef(0);
  const isPausedRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!fetched || totalSlides === 0) return;

    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      slideIndexRef.current = (slideIndexRef.current + 1) % totalSlides;
      const container = document.querySelector(".carousel");
      if (container) {
        container.scrollTo({
          left: container.clientWidth * slideIndexRef.current,
          behavior: "smooth",
        });
      }
      setCurrentIndex(slideIndexRef.current);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetched, totalSlides]);

  useEffect(() => {
    if (!fetched || totalSlides === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id; // e.g., 'slide3'
            const match = id.match(/slide(\d+)/);
            if (match) {
              const visibleIndex = parseInt(match[1], 10) - 1;
              slideIndexRef.current = visibleIndex;
              setCurrentIndex(visibleIndex);
            }
          }
        });
      },
      {
        root: document.querySelector(".carousel"),
        threshold: 0.6,
      }
    );

    notices.forEach((_, index) => {
      const el = document.getElementById(`slide${index + 1}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [fetched, totalSlides, notices]);

  return (
    <>
      <div className="relative">
        <div
          className="carousel w-full rounded-box shadow-md scroll-smooth"
          onMouseEnter={() => (isPausedRef.current = true)}
          onMouseLeave={() => (isPausedRef.current = false)}
        >
          {[...notices].reverse().map((notice, index, arr) => {
            const total = arr.length;
            const currentId = `slide${index + 1}`;
            const prevId = `slide${(index - 1 + total) % total + 1}`;
            const nextId = `slide${(index + 1) % total + 1}`;
            return (
              <div
                key={index}
                id={currentId}
                className="carousel-item relative w-full"
              >
                {notice.img_url ? (
                  <>
                    <img
                      src={notice.img_url}
                      alt={notice.title}
                      className="w-full object-cover h-64 cursor-pointer bg-base-300"
                      onClick={() => onSelect(notice)}
                    />
                    <div className="absolute top-2 left-2 z-10">
                      <span className="badge badge-neutral text-neutral-content text-sm">公告</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="w-full h-64 cursor-pointer bg-neutral/30"
                      style={{
                        backgroundImage: 'url(/background.svg)',
                        backgroundRepeat: 'repeat-x',
                        backgroundSize: 'auto 100%',
                        backgroundPosition: 'center',
                      }}
                      onClick={() => onSelect(notice)}
                    />
                    <div className="absolute top-2 left-2 z-10">
                      <span className="badge badge-neutral text-neutral-content text-sm">公告</span>
                    </div>
                  </>
                )}
                <div
                  className="absolute top-1/2 left-0 text-neutral-content text-3xl p-2"
                  onClick={() => onSelect(notice)}
                >
                  {notice.title}
                </div>
                 <div className="absolute bottom-0 left-0 text-lg text-neutral-content  opacity-80 px-2 pb-5"
                 onClick={() => onSelect(notice)}>
                    {new Date(notice.updated_at * 1000).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 rounded-md px-2 py-1 z-10">
          {notices.slice().reverse().map((_, dotIdx) => {
            const dotId = `slide${dotIdx + 1}`;
            return (
              <a
                key={dotId}
                href={`#${dotId}`}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  currentIndex === dotIdx
                    ? "bg-white"
                    : "bg-white/50 hover:bg-base-content"
                }`}
                onClick={() => {
                  slideIndexRef.current = dotIdx;
                  setCurrentIndex(dotIdx);
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NoticeCarousel;