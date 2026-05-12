// Copyright © Todd Agriscience, Inc. All rights reserved.

const legalItems = [
  'Todd App Use Standards',
  'Todd Business Continuity Plan Summary',
  'Todd Platform Advisory Agreement',
  'Todd Platform Disclosure',
  'Todd Privacy Policy',
  'Todd Terms of Use',
  'Todd Third-Party Business Conduct Policy',
  'Todd User Account Agreement',
];

/**
   
  Legal library page displaying legal document titles.
  @returns {JSX.Element} The rendered legal page*/
export default function LegalPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-[146px] pb-20 sm:px-12 lg:px-0">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <h1 className="lg:ml-[216px] lg:-mt-[36px] text-[48px] font-normal leading-[56px]">
            Legal
            <br />
            Library
          </h1>

          <ul className="lg:ml-[170px] max-w-[385px] flex flex-col gap-[15px] text-[16px] font-normal leading-[18px]">
            {legalItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
