// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useCurrentUrl from '@/lib/hooks/useCurrentUrl';
import logger from '@/lib/logger';
import { useState } from 'react';
import { FaFacebookF } from 'react-icons/fa';
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';

/** Primarily used for `/en/news/[slug]`. Provides a few buttons that automatically share articles to social platforms. Facebook is the one exception: due to needing to make an account, among other things, with Facebook's developer platform, clicking on the Facebook icon only copies the link of the article to your clipboard and displays a small "Copied!" dialog.
 *
 * @param {string} title - The title of the article.
 * @returns {JSX.Element} - The buttons, wrapped with a fragment
 * */
/**
 * Appends UTM campaign params to a share URL so social referrals are
 * attributable in analytics. Returns the URL-encoded, tagged string.
 *
 * @param rawUrl - The page URL being shared
 * @param source - The platform the share originates from (e.g. `linkedin`)
 * @returns URL-encoded share URL with utm_source/medium/campaign appended
 */
function taggedShareUrl(rawUrl: string, source: string): string {
  if (!rawUrl) {
    return '';
  }
  try {
    const u = new URL(rawUrl);
    u.searchParams.set('utm_source', source);
    u.searchParams.set('utm_medium', 'social');
    u.searchParams.set('utm_campaign', 'article-share');
    return encodeURIComponent(u.toString());
  } catch {
    return encodeURIComponent(rawUrl);
  }
}

export default function ShareArticleButtons({ title }: { title: string }) {
  const [isFbCopied, setIsFbCopied] = useState(false);
  const [isFbTooltipOpen, setIsFbTooltipOpen] = useState(false);

  const shareUrl = useCurrentUrl();
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
        link={`https://twitter.com/intent/tweet?url=${taggedShareUrl(shareUrl, 'x')}&text=${encodedTitle}`}
      >
        <FaXTwitter className="text-foreground/80" />
      </IconWrapper>

      <IconWrapper
        link={`https://www.linkedin.com/sharing/share-offsite/?url=${taggedShareUrl(shareUrl, 'linkedin')}`}
      >
        <FaLinkedinIn className="text-foreground/80" />
      </IconWrapper>

      {/** Same idea as other uses of IconWrapper, just requires a tooltip. See docs for this component. */}
      <div onMouseLeave={() => setIsFbTooltipOpen(false)}>
        <Tooltip
          onOpenChange={() => setIsFbTooltipOpen(true)}
          open={isFbTooltipOpen}
        >
          <TooltipTrigger asChild>
            <div className="flex items-center border border-foreground/80 rounded-full justify-center w-full h-full">
              <Button
                onMouseOut={() => setIsFbCopied(false)}
                onClick={() => copyToClipboard()}
                variant="ghost"
                size="icon"
                aria-label="Share on Facebook"
              >
                <FaFacebookF className="text-foreground/80" />
              </Button>
            </div>
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            className="px-2 py-0.5 text-sm m-0 relative bottom-2 bg-background"
            onClick={() => copyToClipboard()}
          >
            <p>{isFbCopied ? 'Copied!' : 'Click to copy'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <IconWrapper
        link={`mailto:?subject=${encodedTitle}&body=${taggedShareUrl(shareUrl, 'email')}`}
      >
        <HiOutlineMail className="text-foreground/80" />
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
    <div className="flex items-center border border-foreground/80 rounded-full justify-center w-full h-full">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => window.open(link, '_blank')}
        aria-label="Share via Email"
      >
        {children}
      </Button>
    </div>
  );
}
