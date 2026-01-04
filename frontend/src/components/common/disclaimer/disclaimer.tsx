// Copyright © Todd Agriscience, Inc. All rights reserved.

import { useTranslations } from 'next-intl';

const DISCLAIMER_COUNT = 7;

/**
 * Disclaimer component. Renders legal disclaimers via next-intl
 *
 * @returns {JSX.Element} - The disclaimer component
 * */
export function Disclaimer() {
  const t = useTranslations('common.disclaimers');

  return (
    <section className="mb-32 max-w-[1200px] w-[80vw] mx-auto space-y-1 text-sm leading-relaxed font-light">
      {/* <p key={index}> */}
      {/*   {index + 1}. {text} */}
      {/* </p> */}
      {Array.from({ length: DISCLAIMER_COUNT }).map((_, i) => (
        <p key={i}>
          {i + 1}. {t(String(i))}
        </p>
      ))}
    </section>
  );
}
