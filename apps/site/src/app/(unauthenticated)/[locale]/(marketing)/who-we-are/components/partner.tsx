// Copyright © Todd Agriscience, Inc. All rights reserved.

import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

/** A single partner logo
 * @returns {JSX.Element} - The logo for a given partner, formatted to fit in the Partners component correctly. */
export default function Partner({ src }: { src: StaticImport }) {
  return <Image src={src} alt="" className="w-25 object-scale-down" />;
}
