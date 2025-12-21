// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import PlaceholderImage from '../placeholder-image/placeholder-image';
import NewsCardProps from './types/news-card';

/**
 * A news article card component that displays article information with image, source, date, and headline.
 *
 * @param {NewsCardProps} props - News Card Info
 * @returns A clickable news card component
 *
 * @example
 * ```tsx
 * <NewsCard
 *   image="/images/news-article.jpg"
 *   source="Tech Times"
 *   date="Dec 15, 2024"
 *   headline="Revolutionary AI Technology Changes Everything"
 *   isDark={false}
 *   link="/news/ai-revolution"
 * />
 * ```
 */
const NewsCard = ({
  image,
  source,
  date,
  excerpt,
  isDark = false,
  className = '',
  link,
  title,
}: NewsCardProps) => {
  return (
    <div
      className={`text-foreground md:mr-4 max-w-150 px-1 py-4 font-light transition-colors duration-300 ${className}`}
    >
      <Link href={link} className="mb-16">
        <div className="rounded-xl bg-transparent">
          <PlaceholderImage
            src={image.url}
            alt={image.alt}
            width={image.width || 600}
            height={image.height || 600}
            className={`mx-auto`}
            fallbackText="News Image"
            isDark={isDark}
          />
          <div className={`p-4 ${isDark ? 'text-white' : ''}`}>
            <h2>{title}</h2>
            <p className="mb-1 text-xl">
              {source} <span className="mx-1">•</span> {date}
            </p>
            <h3 className="text-xl">{excerpt}</h3>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
