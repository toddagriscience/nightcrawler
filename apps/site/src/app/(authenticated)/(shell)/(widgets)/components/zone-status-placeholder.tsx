// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Button from '@/components/common/button/button';

/** Zone lifecycle states that render a full-page placeholder instead of data. */
export type ZonePlaceholderStatus = 'pending' | 'rejected';

/** Copy and controls for a zone that is not yet active. */
export interface ZoneStatusPlaceholderProps {
  /** Derived or future stored zone status. */
  status: ZonePlaceholderStatus;
}

const REJECTED_REASON =
  'This management zone did not meet current program requirements.';

/**
 * Centered pending or rejected placeholder, styled like the authenticated
 * error page. Rejected includes a no-op Appeal button for a later flow.
 *
 * @param {ZoneStatusPlaceholderProps} props - Component props.
 * @returns {React.ReactNode} The placeholder.
 */
export function ZoneStatusPlaceholder({ status }: ZoneStatusPlaceholderProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 text-center">
      <div className="flex flex-col items-center">
        {status === 'pending' ? (
          <>
            <h1 className="text-[28px]/[38px] font-normal">Under Review</h1>
            <p className="text-[14px]/[24px] font-normal mt-3.5">
              This management zone is pending.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-[28px]/[38px] font-normal">
              This zone was rejected.
            </h1>
            <p className="text-[14px]/[24px] font-normal mt-3.5       ">
              {REJECTED_REASON}
            </p>
            <Button
              text="Appeal"
              variant="outline"
              size="sm"
              showArrow={false}
              className="font-normal h-[42px] w-fit rounded-full border-[0.75px] border-[#848484] px-[20px] text-[14px]/[40px] mt-6"
              onClick={() => undefined}
            />
          </>
        )}
      </div>
    </div>
  );
}
