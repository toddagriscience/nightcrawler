// Copyright © Todd Agriscience, Inc. All rights reserved.

import { useTranslations } from 'next-intl';
import { AuthLinks, MenuItem, NewHeaderProps } from './types';

/**
 * Builds the default menu structure and auth links for the marketing header,
 * preferring caller-provided overrides when supplied.
 *
 * @param overrides - Optional `menu` and `auth` overrides from `NewHeaderProps`.
 * @returns Resolved `menuItems` and `authLinks` for the desktop and mobile layouts.
 */
export function useMenuItems({
  menu,
  auth,
}: Pick<NewHeaderProps, 'menu' | 'auth'>): {
  menuItems: MenuItem[];
  authLinks: AuthLinks;
} {
  const t = useTranslations('header');

  const defaultMenu: MenuItem[] = [
    {
      title: t('navigation.research'),
      url: '#',
      items: [
        { title: t('research.researchIndex.title'), url: '#' },
        { title: t('research.researchOverview.title'), url: '#' },
      ],
    },
    {
      title: t('navigation.products'),
      url: '#',
      items: [{ title: t('products.iris.title'), url: '#' }],
    },
    {
      title: t('navigation.company'),
      url: '#',
      items: [
        { title: t('company.about.title'), url: '/who-we-are' },
        { title: t('company.stories.title'), url: '#' },
        { title: t('company.careers.title'), url: '/careers' },
        { title: t('company.press.title'), url: '/news' },
        { title: t('company.brand.title'), url: '/brand' },
      ],
    },
    // TODO: Add foundation menu item when it is available
    { title: t('navigation.foundation'), url: '#' },
  ];

  const menuItems = menu ?? defaultMenu;
  const authLinks: AuthLinks = auth ?? {
    login: { title: t('navigation.logIn'), url: '/login' },
    signup: { title: t('navigation.contact'), url: '/contact' },
  };

  return { menuItems, authLinks };
}
