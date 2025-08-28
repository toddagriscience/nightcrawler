import PlaceholderImage from '../placeholder-image/placeholder-image';
import { themeUtils } from '@/lib/theme';
import { Link } from '@/i18n/config';

interface NewsCardProps {
  image: string;
  source: string;
  date: string;
  headline: string;
  isDark?: boolean;
  className?: string;
  link?: string;
}

const NewsCard = ({
  image,
  source,
  date,
  headline,
  isDark = false,
  className = '',
  link = '/news',
}: NewsCardProps) => {
  const textColor = themeUtils.getContrastText(isDark);

  return (
    <div
      className={`min-w-[90%] md:min-w-[45%] lg:min-w-[50%] max-w-full px-4 py-4 font-light transition-colors duration-300 ${className}`}
      style={{ color: textColor }}
    >
      <Link href={link}>
        <div className="rounded-xl overflow-hidden bg-transparent">
          <PlaceholderImage
            src={image}
            alt={headline}
            width={800}
            height={600}
            className="w-full h-auto object-cover"
            fallbackText="News Image"
            isDark={isDark}
          />
          <div className="p-4">
            <p className="text-xl mb-1">
              {source} <span className="mx-1">•</span> {date}
            </p>
            <h3 className="text-2xl">{headline}</h3>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
