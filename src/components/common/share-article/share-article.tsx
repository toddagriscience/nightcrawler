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

/** Primarily used for `/en/news/[slug]`. Provides a few buttons that automatically share articles to social platforms. Facebook is the one exception: due to needing to make an account, among other things, with Facebook's developer platform, clicking on the Facebook icon only copies the link of the article to your clipboard and displays a small "Copied!" dialog.
 *
 * @param {string} title - The title of the article.
 * @returns {JSX.Element} - The buttons, wrapped with a fragment
 * */
export default function ShareArticleButtons({ title }: { title: string }) {
  const [isFbCopied, setIsFbCopied] = useState(false);
  const [isFbTooltipOpen, setIsFbTooltipOpen] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            '_blank'
          )
        }
        aria-label="Share on X"
      >
        <FaXTwitter />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          window.open(
            `https://www.linkedin.com/feed?shareActive&mini=true&text=${encodedUrl}`,
            '_blank'
          )
        }
        aria-label="Share on LinkedIn"
      >
        <RiLinkedinLine />
      </Button>

      <div onMouseLeave={() => setIsFbTooltipOpen(false)}>
        <Tooltip
          onOpenChange={() => setIsFbTooltipOpen(true)}
          open={isFbTooltipOpen}
        >
          <TooltipTrigger asChild>
            <Button
              onMouseOut={() => setIsFbCopied(false)}
              onClick={() => copyToClipboard()}
              variant={'ghost'}
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

      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          window.open(
            `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
            '_blank'
          )
        }
        aria-label="Share via Email"
      >
        <HiOutlineMail />
      </Button>
    </>
  );
}
