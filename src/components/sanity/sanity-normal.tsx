import { PortableTextBlock, PortableTextComponentProps } from 'next-sanity';

/**
 * Renders a standard "normal" text block for PortableText.
 *
 * @param {React.ReactNode} props - Props provided by PortableText, including the block's children.
 * @returns {JSX.Element} - A paragraph wrapping the block's children.
 */
export default function SanityNormal(
  props: PortableTextComponentProps<PortableTextBlock>
) {
  return <p className="">{props.children}</p>;
}
