// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';

/** Shared account agreement legal copy for account acceptance flows. */
export default function AccountAgreementContent() {
  return (
    <>
      <h2 className="text-xl font-medium">Electronic Delivery of Documents</h2>
      <p>
        By tapping or clicking the “Agree” button below, you agree that you
        accept electronic delivery of the following documents, and that you have
        carefully reviewed and agree to the terms of each and will retain copies
        for your records:
      </p>

      <ul>
        <li className="underline">
          <Link href={'/account-agreement.pdf'} target="_blank">
            Statement of Additional Information
          </Link>
        </li>
        <li className="underline">
          <Link href={'/en/terms'}>Terms of Use</Link>
        </li>
        <li className="underline">
          <Link href={'/en/privacy'}>Privacy Policy</Link>
        </li>
      </ul>

      <p>
        The documents listed above, in addition to the Account Terms and
        Conditions below, constitute the “Application Agreement.” Capitalized,
        undefined terms in this Application Agreement have the meaning given in
        the
      </p>
      <h2 className="text-xl font-medium">Account Terms and Conditions.</h2>

      <h3 className="font-medium">You represent and warrant that:</h3>
      <p>
        You are the person identified in this Account Application, and all of
        the information you have provided in this Account Application is
        accurate; Todd can rely on such information; and you agree to notify
        Todd promptly regarding any change in such information or circumstances
        which may jeopardize Agreement compliance.
      </p>

      <h3 className="font-medium">You agree that:</h3>
      <ul className="flex flex-col gap-4">
        <li>
          You consent to electronic delivery of all future account information
          as described in the Client Agreement.
        </li>
        <li>
          You will establish and maintain complete and adequate records
          concerning all aspects of farm operations and make such records
          available to Todd immediately upon request; you will comply with
          audits; and you consent to allow Todd or its authorized agents to
          access all facilities and documents, including non-production areas
          and facilities, at any reasonable time without prior notice.
        </li>
        <li>
          You authorize Todd to verify, and re-verify as necessary, all
          information provided in this Account Application to comply with
          regulatory obligations.
        </li>
        <li>
          You will comply with all local, regional, state, and federal laws and
          standards governing farm management, processing operations, and food
          safety, and you will not hold Todd responsible in the event any crop
          is found to be uncertifiable or contains residue of prohibited
          materials or toxic agents.
        </li>
      </ul>

      <p>
        Tapping or clicking the “Agree” button below is equivalent to your own
        written signature, and you understand that you are entering into legal
        agreements.
      </p>
      <p className="mb-6 text-sm font-light">
        You are about to finalize your Account Application. By clicking or
        tapping the “Agree” button below, you agree that you have read the
        Account Agreement which contains a predispute arbitration clause
        (Section 39) and you agree in advance to arbitrate any controversies
        which may arise between you and Todd in accordance with such Section 39.
      </p>
    </>
  );
}
