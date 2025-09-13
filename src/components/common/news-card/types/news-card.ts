// Copyright Todd LLC, All rights reserved.

/**
 * Props for the NewsCard component
 * @param {string} image - The image of the news card
 * @param {string} source - The source of the news card
 * @param {string} date - The date of the news card
 * @param {string} headline - The headline of the news card
 * @param {boolean} isDark - Whether the news card is dark
 * @param {string} className - The class name of the news card
 * @param {string} link - The link of the news card
 */
export default interface NewsCardProps {
  title: string;
  image: {
    url: string;
    alt: string;
  };
  excerpt: string;
  source?: string;
  date: string;
  isDark?: boolean;
  className?: string;
  slug?: string;
}
