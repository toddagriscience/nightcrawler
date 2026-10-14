// Copyright © Todd Agriscience, Inc. All rights reserved.

import { siteConfig } from '@/lib/metadata';
import { Metadata } from 'next';
import { Footer, NewHeader } from './components';
import { getArticleNavigationUrl } from '@/lib/sanity/article-urls';

export const metadata: Metadata = {
  title: { default: 'Marketing', template: `%s | ${siteConfig.name}` },
};

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const productHref = await getArticleNavigationUrl('introducing-iris', locale);
  return (
    <>
      <NewHeader productHref={productHref} />
      {children}
      <Footer />
    </>
  );
}
