// Copyright © Todd Agriscience, Inc. All rights reserved.

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center px-6">
      <div className="w-full max-w-xs text-left space-y-3">
        <h1 className="text-2xl font-semibold">Contact Us</h1>

        <p>Contact us at any time.</p>

        <p>
          Email:{' '}
          <a href="mailto:service.us@toddagriscience.com" className="underline">
            service.us@toddagriscience.com
          </a>
        </p>

        <p>
          Phone:{' '}
          <a href="tel:+18882791283" className="underline">
            +1 (888) 279-1283
          </a>
        </p>
      </div>
    </div>
  );
}
