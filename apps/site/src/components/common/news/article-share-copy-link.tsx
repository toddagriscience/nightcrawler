// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useCurrentUrl from '@/lib/hooks/useCurrentUrl';
import logger from '@/lib/logger';
import { useState } from 'react';
import { BiLinkAlt } from 'react-icons/bi';

/**
 * Link-styled control that copies the current page URL to the clipboard (same URL used for sharing).
 */
export default function ArticleShareCopyLink() {
  const shareUrl = useCurrentUrl();
  const [copied, setCopied] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  async function copyUrl() {
    const url =
      shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      logger.log(`${url} copied to clipboard`);
      setCopied(true);
      setIsTooltipOpen(true);
      setTimeout(() => {
        setCopied(false);
        setIsTooltipOpen(false);
      }, 1300);
    } catch (e) {
      logger.error(e);
    }
  }

  return (
    <div className="ml-2">
      <Tooltip open={isTooltipOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => void copyUrl()}
            className="bg-transparent p-0 border-0 cursor-pointer text-left text-[14px] font-normal leading-[28px] tracking-normal text-foreground underline-offset-2 hover:underline flex items-center gap-1"
          >
            <BiLinkAlt className="w-4 h-4" />
            Share
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="px-2 py-0.5 text-sm m-0 relative bottom-2 bg-background"
          onClick={() => void copyUrl()}
        >
          <p>Copied!</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
