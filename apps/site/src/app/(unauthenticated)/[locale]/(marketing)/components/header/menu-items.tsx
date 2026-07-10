// Copyright © Todd Agriscience, Inc. All rights reserved.

import { useTranslations } from 'next-intl';
import { AuthLinks, MenuItem, HeaderProps } from './types';

/**
 * Builds the default menu structure and auth links for the marketing header,
 * preferring caller-provided overrides when supplied.
 *
 * @param overrides - Optional `menu` and `auth` overrides from `HeaderProps`.
 * @returns Resolved `menuItems` and `authLinks` for the desktop and mobile layouts.
 */
export function useMenuItems({
  menu,
  auth,
}: Pick<HeaderProps, 'menu' | 'auth'>): {
  menuItems: MenuItem[];
  authLinks: AuthLinks;
} {
  const t = useTranslations('header');

  const defaultMenu: MenuItem[] = [
    {
      title: t('navigation.research'),
      url: '/research',
      items: [
        { title: t('research.researchIndex.title'), url: '/research/index' },
        { title: t('research.researchOverview.title'), url: '/research' },
      ],
    },
    { title: t('navigation.products'), url: '/index/introducing-iris' },
    {
      title: t('navigation.company'),
      url: '/about',
      items: [
        { title: t('company.about.title'), url: '/about' },
        { title: t('company.careers.title'), url: '/careers' },
        { title: t('navigation.news'), url: '/news' },
      ],
    },
    // TODO: Add foundation URL when the route is available
    { title: t('navigation.foundation'), url: '#' },
  ];

  const menuItems = menu ?? defaultMenu;
  const authLinks: AuthLinks = auth ?? {
    login: { title: t('navigation.logIn'), url: '/login' },
    signup: { title: t('navigation.contact'), url: '/contact' },
  };

  return { menuItems, authLinks };
}
