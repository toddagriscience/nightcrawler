// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, test, vitest } from 'vitest';
import PasswordChecklist from './password-checklist';

describe('PasswordChecklist', () => {
  test('should render with all checks failing when password is empty', () => {
    const setIsPasswordValid = vitest.fn();
    render(
      <PasswordChecklist
        password=""
        confirmationPassword=""
        setIsPasswordValid={setIsPasswordValid}
      />
    );

    expect(
      screen.getByText(
        'Please make sure to use a secure password matching the rules.'
      )
    ).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');

    expect(listItems[4]).toHaveTextContent('•');
    expect(listItems[4]).toHaveClass('italic');

    expect(setIsPasswordValid).toHaveBeenCalledWith(false);
  });

  test('should pass all checks and call setIsPasswordValid(true) for a valid password', () => {
    const validPassword = 'P@ssword1';
    const setIsPasswordValid = vitest.fn();

    render(
      <PasswordChecklist
        password={validPassword}
        confirmationPassword={validPassword}
        setIsPasswordValid={setIsPasswordValid}
      />
    );

    const listItems = screen.getAllByRole('listitem');

    listItems.forEach((item) => {
      expect(item).toHaveTextContent('✓');
      expect(item).toHaveClass('text-green-500');
    });

    expect(setIsPasswordValid).toHaveBeenCalledWith(true);
  });

  test('should fail the 8 characters check when password is too short', () => {
    const shortPassword = 'A1@b';
    const setIsPasswordValid = vitest.fn();

    render(
      <PasswordChecklist
        password={shortPassword}
        confirmationPassword={shortPassword}
        setIsPasswordValid={setIsPasswordValid}
      />
    );

    // Check the 'at least 8 characters' line
    const eightCharCheck = screen.getByText(/at least 8 characters/);
    expect(eightCharCheck).toHaveTextContent('•');
    expect(eightCharCheck).toHaveClass('italic');

    // Other checks should pass if applicable
    const specialCharCheck = screen.getByText(/contains a special character/);
    expect(specialCharCheck).toHaveTextContent('✓');
    expect(specialCharCheck).toHaveClass('text-green-500');

    expect(setIsPasswordValid).toHaveBeenCalledWith(false);
  });

  test('should fail the confirmation check when passwords do not match', () => {
    const password = 'ValidP@ss1';
    const confirmation = 'ValidP@ss2';
    const setIsPasswordValid = vitest.fn();

    render(
      <PasswordChecklist
        password={password}
        confirmationPassword={confirmation}
        setIsPasswordValid={setIsPasswordValid}
      />
    );

    // Check the 'passwords match' line
    const matchCheck = screen.getByText(/passwords match/);
    expect(matchCheck).toHaveTextContent('•');
    expect(matchCheck).toHaveClass('italic');

    // Other checks should pass
    const listItems = screen.getAllByRole('listitem');
    // Check that 4 out of 5 checks passed (the first 4 requirements)
    listItems.slice(0, 4).forEach((item) => {
      expect(item).toHaveTextContent('✓');
      expect(item).toHaveClass('text-green-500');
    });

    expect(setIsPasswordValid).toHaveBeenCalledWith(false);
  });

  test('should fail specific checks when number and uppercase letter are missing', () => {
    const weakPassword = 'password!'; // only special char and >= 8
    const setIsPasswordValid = vitest.fn();

    render(
      <PasswordChecklist
        password={weakPassword}
        confirmationPassword={weakPassword}
        setIsPasswordValid={setIsPasswordValid}
      />
    );

    // Check failed requirements (Number and Uppercase)
    expect(screen.getByText(/contains a number/)).toHaveTextContent('•');
    expect(screen.getByText(/contains a number/)).toHaveClass('italic');

    expect(screen.getByText(/contains an uppercase letter/)).toHaveTextContent(
      '•'
    );
    expect(screen.getByText(/contains an uppercase letter/)).toHaveClass(
      'italic'
    );

    // Check passed requirements
    expect(screen.getByText(/at least 8 characters/)).toHaveTextContent('✓');
    expect(screen.getByText(/contains a special character/)).toHaveTextContent(
      '✓'
    );
    expect(screen.getByText(/passwords match/)).toHaveTextContent('✓');

    expect(setIsPasswordValid).toHaveBeenCalledWith(false);
  });

  test('should not crash if setIsPasswordValid prop is not provided', () => {
    expect(() => {
      render(
        <PasswordChecklist
          password="P@ssword1"
          confirmationPassword="P@ssword1"
        />
      );
    }).not.toThrow();

    // Check if a requirement is still rendered correctly
    expect(screen.getByText(/at least 8 characters/)).toHaveTextContent('✓');
  });
});
