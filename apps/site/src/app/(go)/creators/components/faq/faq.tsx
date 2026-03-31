// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LuMinus, LuPlus } from 'react-icons/lu';

const faqItems = [
  {
    question: 'What platform do you use for your affiliate program?',
    answer:
      "We use an internal system to track and pay out commissions. We'll send you an invite to join once accepted.",
  },
  {
    question: 'Is there a limit on how many videos I can create?',
    answer:
      'No, there is no cap on how much content (videos or posts) you can create. You can create and share as much as you want.',
  },
  {
    question: 'How long does it take to get paid?',
    answer:
      "We pay out commissions on a rolling basis. You'll start to receive payments once you've earned $50 in commissions (and locking and invoice periods have passed).",
  },
  {
    question: 'How do I get approved to join the program?',
    answer:
      'We carefully review each application individually through our team. We take many factors into account including your audience size, engagement, and overall reach.',
  },
  {
    question: 'Does Todd have an internship program for growth and content?',
    answer:
      'Yes, we have an internship program for growth, content, and marketing. Top creators in this cycle will have an opportunity to join our team as an intern. Due to US Labor Laws, we cannot guarentee financial compensation to potential interns. This offer is subject to terms and conditions.',
  },
];

export default function Faq() {
  return (
    <section className="w-full lg:px-24 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[95%] md:max-w-[80%] lg:max-w-[84%]">
        <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-thin mb-10 md:mb-16">
          FAQ
        </h2>
      </div>
      <div className="mx-auto w-full max-w-[95%] md:max-w-[80%] lg:max-w-[70%]">
        <Accordion type="single" collapsible className="border-t">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="group text-left text-lg md:text-xl lg:text-2xl font-thin tracking-normal hover:no-underline py-6 md:py-8 [&>svg:last-child]:hidden">
                <span className="mx-2 flex-1 text-left text-foreground max-w-[75%] lg:max-w-[90%]">
                  {item.question}
                </span>
                <LuPlus className="mx-2 shrink-0 size-7 stroke-[1.5] group-data-[state=open]:hidden" />
                <LuMinus className="mx-2 shrink-0 size-7 stroke-[1.5] group-data-[state=closed]:hidden" />
              </AccordionTrigger>
              <AccordionContent className="ml-2 text-sm md:text-normal lg:text-base text-foreground/80 font-light pb-8 max-w-[80%]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
