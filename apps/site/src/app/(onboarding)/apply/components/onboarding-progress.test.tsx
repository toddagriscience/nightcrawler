// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OnboardingProgress from '@/app/(onboarding)/apply/components/onboarding-progress';

describe('OnboardingProgress', () => {
  it('announces four ordered milestones and exactly one current step', () => {
    const { container } = render(<OnboardingProgress step="payment" />);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(container.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
    expect(container.querySelector('[aria-current="step"]')).toHaveTextContent(
      'Payment'
    );
    expect(
      screen.getByRole('list', { name: 'Account setup progress' })
    ).toBeInTheDocument();
  });

  it('provides no clickable tabs, links, or buttons for locked milestones', () => {
    render(<OnboardingProgress step="terms" />);
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Set password')).toHaveTextContent('completed');
  });
});
