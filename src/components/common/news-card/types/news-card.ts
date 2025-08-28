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
  image: string;
  source: string;
  date: string;
  headline: string;
  isDark?: boolean;
  className?: string;
  link?: string;
}
