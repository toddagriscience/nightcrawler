// Copyright Todd Agriscience, Inc. All rights reserved.

/**
 * Props for the FadeIn component
 * @interface FadeInProps
 * @param {React.ReactNode} children - The content to animate
 * @param {number} duration - The duration of the animation in seconds
 * @param {string} className - The className to apply to the component
 */
export default interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}
