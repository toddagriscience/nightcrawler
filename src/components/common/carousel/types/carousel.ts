import { ReactNode } from 'react';

export default interface CarouselProps {
  children: ReactNode;
  isDark?: boolean;
  loop?: boolean;
  className?: string;
  showDots?: boolean;
}
