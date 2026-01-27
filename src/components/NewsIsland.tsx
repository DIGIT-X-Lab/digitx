import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  type: 'grant' | 'team' | 'paper' | 'release' | 'award';
  title: string;
  link?: string;
  date: string;
}

const newsItems: NewsItem[] = [
  {
    id: '1',
    type: 'team',
    title: 'Dr. Sahib Julka joins as Research Lead',
    date: '2025-01',
  },
  {
    id: '2',
    type: 'grant',
    title: 'EU Horizon Grant Awarded',
    link: '#',
    date: '2025-01',
  },
  {
    id: '3',
    type: 'release',
    title: 'MOOSE v2.0 Released',
    link: 'https://github.com/QIMP-Team/MOOSE',
    date: '2024-12',
  },
];

const typeIcons: Record<string, string> = {
  grant: '🎯',
  team: '👋',
  paper: '📄',
  release: '🚀',
  award: '🏆',
};

const NewsIsland = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentNews = newsItems[currentIndex];

  // Auto-rotate news items
  useEffect(() => {
    if (isHovered || newsItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleClick = () => {
    if (currentNews.link) {
      window.open(currentNews.link, '_blank');
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      className="news-island"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsExpanded(false);
      }}
      onClick={handleClick}
    >
      <div className="news-island-dot" />
      <span className="news-island-label">New</span>
      <span className="news-island-content">
        {typeIcons[currentNews.type]} {currentNews.title}
      </span>
      {newsItems.length > 1 && (
        <div className="news-island-dots">
          {newsItems.map((_, i) => (
            <span
              key={i}
              className={`news-island-indicator ${i === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsIsland;
