// Copyright © Todd Agriscience, Inc. All rights reserved.

import { CarouselItem } from '@/components/ui/carousel';

/**
 * Each item in the contact form.
 *
 * @param {React.ReactNode} children - Contents of the item
 * @returns {JSX.Element} - The item
 * */
export default function ContactFormItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CarouselItem>{children}</CarouselItem>;
}
