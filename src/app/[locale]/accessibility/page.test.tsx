import { screen, renderWithNextIntl } from '@/test/test-utils';
import AccessibilityPage from './page';
import '@testing-library/jest-dom';

describe('AccessibilityPage', () => {
  it('renders the page', () => {
    renderWithNextIntl(<AccessibilityPage />);
    expect(screen.getByText('Accessibility')).toBeInTheDocument();

    expect(
      screen.getByText(
        '• Text Equivalents: We provide alternative text details for appropriate images and other non-text elements.'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Please contact us if you have any feedback or questions regarding our website or mobile application.'
      )
    ).toBeInTheDocument();
  });
});
