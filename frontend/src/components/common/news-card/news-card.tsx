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
      className={`text-foreground w-full px-2 py-2 font-light transition-colors duration-300 ${className}`}
    >
      <Link href={link} className="mb-16">
        <div>
          <PlaceholderImage
            src={image.url}
            alt={image.alt}
            width={image.width || 600}
            height={image.height || 600}
            className="mx-auto w-full"
            fallbackText="News Image"
            isDark={isDark}
          />
          {/* <div className={`p-4 ${isDark ? 'text-white' : ''}`}> */}
          <div className="p-4 gap-1 flex flex-col">
            <h2 className="line-clamp-2 min-h-[2.5rem] md:min-h-[2.75rem] lg:min-h-[3rem] text-sm md:text-normal lg:text-base font-thin leading-tight">
              {title}
            </h2>
            <p className="mb-1 text-xl">
              {source} <span className="mx-1">•</span> {date}
            </p>
            <h3 className="line-clamp-2 text-lg md:text-xl italic font-light">
              {excerpt}
            </h3>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
