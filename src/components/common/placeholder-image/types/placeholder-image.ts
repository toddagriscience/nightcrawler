// Copyright Todd LLC, All rights reserved.

/**
 * Props for the PlaceholderImage component
 * @param {string} src - The source of the placeholder image
 * @param {string} alt - The alt text of the placeholder image
 * @param {number} width - The width of the placeholder image
 * @param {number} height - The height of the placeholder image
 * @param {string} className - The class name of the placeholder image
 * @param {string} fallbackText - The fallback text of the placeholder image
 * @param {boolean} isDark - Whether the placeholder image is dark
 */
export default interface PlaceholderImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
  isDark?: boolean;
}
