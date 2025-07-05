import { useEffect, useRef } from "react";

const NoticeCarousel = ({ notices, fetched, onSelect }) => {
  const totalSlides = notices?.length || 0;
  const slideIndexRef = useRef(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    if (!fetched || totalSlides === 0) return;

    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      slideIndexRef.current = (slideIndexRef.current + 1) % totalSlides;
      const nextSlideId = `slide${slideIndexRef.current + 1}`;
      const el = document.getElementById(nextSlideId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 5000);

    return () => clearInterval(interval);
  }, [fetched, totalSlides]);

  return (
    <div
      className="carousel w-full rounded-box shadow-md"
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
            <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between pointer-events-none">
              <a
                href={`#${prevId}`}
                className="w-10 h-20 bg-base-100/45 rounded shadow-md hover:bg-base-200 transition-colors duration-200 flex items-center justify-center text-lg pointer-events-auto"
              >❮</a>
              <a
                href={`#${nextId}`}
                className="w-10 h-20 bg-base-100/45 rounded shadow-md hover:bg-base-200 transition-colors duration-200 flex items-center justify-center text-lg pointer-events-auto"
              >❯</a>
            </div>
            <div
              className="absolute bottom-0 left-0 text-white text-2xl rounded-tr-2xl p-2"
              onClick={() => onSelect(notice)}
            >
              <div>{notice.title}</div>
              <div className="text-xs opacity-80">
                {new Date(notice.updated_at * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NoticeCarousel;