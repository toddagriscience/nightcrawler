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
    question: 'This is a Test Firm Article',
    answer:
      'Since 2024, Todd has supported fresh produce so it never has to go to waste. In the US alone, 100 billion pounds of perfectly good food ends up in the landfills annually. This collaboration allows Todd to provide funds and raise awareness to combat food insecurity, prevent food waste and build sustainable food systems.',
  },
  {
    question: 'This is a really really long Test Article Title for Todd',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
  {
    question: 'This is a Test Firm Article',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui.',
  },
  {
    question: 'This is a Test Firm Article',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes.',
  },
  {
    question: 'This is a really really long Test Article Title for Todd',
    answer:
      'Since 2024, Todd has supported fresh produce so it never has to go to waste. In the US alone, 100 billion pounds of perfectly good food ends up in the landfills annually. This collaboration allows Todd to provide funds and raise awareness to combat food insecurity, prevent food waste and build sustainable food systems.',
  },
];

export default function Faq() {
  return (
    <section className="w-full bg-neutral-50 px-6 md:px-12 lg:px-24 py-16 md:py-24">
      <div className="px-10 md:px-12 lg:px-12 xl:px-24">
        <h2 className="text-3xl md:text-4xl lg:text-4xl leading-tight font-thin mb-16">
          FAQ
        </h2>
      </div>
      <div className="mx-auto max-w-[1150px]">
        <Accordion type="single" collapsible className="border-t">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="group text-left text-2xl lg:text-3xl font-thin tracking-normal hover:no-underline py-6 [&>svg:last-child]:hidden">
                <span className="flex-1 text-left">{item.question}</span>
                <LuPlus className="shrink-0 size-7 stroke-[1.5] group-data-[state=open]:hidden" />
                <LuMinus className="shrink-0 size-7 stroke-[1.5] group-data-[state=closed]:hidden" />
              </AccordionTrigger>
              <AccordionContent className="text-base lg:text-lg font-thin leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
