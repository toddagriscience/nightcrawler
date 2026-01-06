// Copyright © Todd Agriscience, Inc. All rights reserved.

import FadeIn from '../utils/fade-in/fade-in';

/** Renders a simple error message for a form & maintains the same amount of space without an error message.
 *
 * @params {string} errorMessage - The error message
 * @returns {JSX.Element} - The rendered conditional error message.*/
export default function FormErrorMessage({
  errorMessage,
}: {
  errorMessage: string | null;
}) {
  return (
    <div className="mb-2">
      {errorMessage ? (
        <FadeIn>
          <p className="text-red-500">{errorMessage}</p>
        </FadeIn>
      ) : (
        <p className="h-6"></p>
      )}
    </div>
  );
}
