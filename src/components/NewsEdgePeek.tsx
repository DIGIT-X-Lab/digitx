import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  title: string;
  link?: string;
}

const newsItems: NewsItem[] = [
  { id: '1', title: 'Looking for your Master thesis topic? Positions open now.' },
  { id: '2', title: 'Research positions available — join our growing team!' },
  { id: '3', title: 'Welcome Sameer, joining us for his Master\'s research.' },
  { id: '4', title: 'Proud to announce our first research grant from ICPO!' },
];

const NewsEdgePeek = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (newsItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="news-edge-peek">
      <div className="news-edge-tab">
        <div className="news-edge-pulse" />
        <span className="news-edge-tab-text">News</span>
      </div>
      <div className="news-edge-content">
        <div className="news-edge-header">
          <span className="news-edge-label">What's New</span>
          <span className="news-edge-count">{currentIndex + 1}/{newsItems.length}</span>
        </div>
        <div className="news-edge-titles">
          {newsItems.map((item, i) => (
            <p
              key={item.id}
              className={`news-edge-title ${i === currentIndex ? 'active' : ''}`}
            >
              {item.title}
            </p>
          ))}
        </div>
        {newsItems.length > 1 && (
          <div className="news-edge-nav">
            {newsItems.map((_, i) => (
              <button
                key={i}
                className={`news-edge-dot ${i === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsEdgePeek;
