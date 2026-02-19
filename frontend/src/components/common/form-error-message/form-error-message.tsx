// Copyright © Todd Agriscience, Inc. All rights reserved.

import FadeIn from '../utils/fade-in/fade-in';

/** Renders a simple error message for a form & maintains the same amount of space without an error message.
 *
 * @params {string} errorMessage - The error message
 * @returns {JSX.Element} - The rendered conditional error message.*/
export default function FormErrorMessage({
  errorMessage,
  className = '',
}: {
  errorMessage: string;
  className?: string;
}) {
  return (
    <div>
      <FadeIn>
        <p
          className={`leading-snug text-red-500 text-sm font-medium ${className}`.trim()}
        >
          {errorMessage}
        </p>
      </FadeIn>
    </div>
  );
}
