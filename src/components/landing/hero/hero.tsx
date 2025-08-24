'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <div className="text-center justify-end mx-auto flex flex-col items-center h-[97vh] pb-32">
      <h3 className="text-2xl lg:text-4xl font-light max-w-lg my-5 select-none pointer-events-none">
        Creating the next-generation organic farms
      </h3>
      <span>
        <ArrowDown className="text-[#2A2727]" />
      </span>
    </div>
  );
};

export default Hero;
