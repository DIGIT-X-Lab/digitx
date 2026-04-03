import newsData from './news.json';

export interface NewsItem {
  date: string;
  title: string;
  description: string;
  type: 'grant' | 'release' | 'publication' | 'event' | 'team';
  link?: string;
}

export const news: NewsItem[] = newsData as NewsItem[];
