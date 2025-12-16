// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import { MenuItem } from '@/lib/types/components';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/** Helper component for rendering header items.
 *
 * @param {MenuItem[]} menuItems - The list of items to render
 * @param {(_: boolean) => void} onClickCallback - Callback function, usually a setState function
 * @returns {JSX.Element} - The header items, rendered with animation horizontally.*/
export default function HeaderItems({
  menuItems,
  onClickCallback,
  className = '',
}: {
  menuItems: MenuItem[];
  onClickCallback: (arg0: boolean) => void;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <div className={`flex gap-5 md:gap-8 ${className}`}>
      {menuItems.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <AnimatePresence key={`nav-${item.label}`}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: 1,
                x: -0.5,
                transition: { delay: index * 0.15 },
              }}
              exit={{ opacity: 0, x: -5 }}
              className="flex items-center justify-center gap-1 h-full"
            >
              <Link
                href={item.href}
                onClick={() => onClickCallback(false)}
                className={`rounded-md p-1 text-underline decoration-[0.5px] transition-all duration-300 ease-in-out flex items-center justify-center cursor-pointer ${
                  isActive ? 'text-underline-active' : ''
                }`}
                data-testid={`nav-link-${item.label.toLowerCase()}`}
              >
                <span className="">{item.label}</span>
              </Link>
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
}
