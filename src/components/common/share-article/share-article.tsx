// Copyright Todd Agriscience, Inc. All rights reserved.
'use client';

import { RiLinkedinLine } from 'react-icons/ri';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebook } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { Button } from '@/components/ui';
import logger from '@/lib/logger';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import useCurrentUrl from '@/lib/hooks/useCurrentUrl';

/** Primarily used for `/en/news/[slug]`. Provides a few buttons that automatically share articles to social platforms. Facebook is the one exception: due to needing to make an account, among other things, with Facebook's developer platform, clicking on the Facebook icon only copies the link of the article to your clipboard and displays a small "Copied!" dialog.
 *
 * @param {string} title - The title of the article.
 * @returns {JSX.Element} - The buttons, wrapped with a fragment
 * */
export default function ShareArticleButtons({ title }: { title: string }) {
  const [isFbCopied, setIsFbCopied] = useState(false);
  const [isFbTooltipOpen, setIsFbTooltipOpen] = useState(false);

  const shareUrl = useCurrentUrl();
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  function copyToClipboard() {
    setIsFbCopied(true);
    navigator.clipboard.writeText(shareUrl).then(() => {
      logger.log(`${shareUrl} copied to clipboard`);
    });
    setTimeout(() => setIsFbTooltipOpen(false), 1300);
  }

  return (
    <>
      <IconWrapper
        link={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
      >
        <FaXTwitter />
      </IconWrapper>

      <IconWrapper
        link={`https://www.linkedin.com/feed?shareActive&mini=true&text=${encodedUrl}`}
      >
        <RiLinkedinLine />
      </IconWrapper>

      {/** Same idea as other uses of IconWrapper, just requires a tooltip. See docs for this component. */}
      <div onMouseLeave={() => setIsFbTooltipOpen(false)}>
        <Tooltip
          onOpenChange={() => setIsFbTooltipOpen(true)}
          open={isFbTooltipOpen}
        >
          <TooltipTrigger asChild>
            <Button
              onMouseOut={() => setIsFbCopied(false)}
              onClick={() => copyToClipboard()}
              variant="ghost"
              size="icon"
              aria-label="Share on Facebook"
            >
              <FaFacebook />
            </Button>
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            className="px-2 py-0.5 text-sm m-0 relative bottom-2"
            onClick={() => copyToClipboard()}
          >
            <p>{isFbCopied ? 'Copied!' : 'Click to copy'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <IconWrapper link={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}>
        <HiOutlineMail />
      </IconWrapper>
    </>
  );
}

function IconWrapper({
  children,
  link,
}: {
  children: React.ReactNode;
  link: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => window.open(link, '_blank')}
      aria-label="Share via Email"
    >
      {children}
    </Button>
  );
}
