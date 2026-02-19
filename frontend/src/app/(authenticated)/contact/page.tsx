// Copyright © Todd Agriscience, Inc. All rights reserved.

export default function InternalContactPage() {
  return (
    <div className="px-6 py-10 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>

      <p className="mb-2">Contact us at any time.</p>

      <p className="mb-2">
        Email:{' '}
        <a
          href="mailto:service.us@toddagriscience.com"
          className="text-blue-600 underline"
        >
          service.us@toddagriscience.com
        </a>
      </p>

      <p>
        Phone:{' '}
        <a href="tel:+18882791283" className="text-blue-600 underline">
          +1 (888) 279-1283
        </a>
      </p>
    </div>
  );
}
