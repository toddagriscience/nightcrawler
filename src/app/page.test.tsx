import { render } from '@testing-library/react';
import Home from './page';

jest.mock('next/font/local', () => ({
  __esModule: true,
  default: () => ({
    className: 'mocked-font',
  }),
}));

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(document.body).toBeInTheDocument();
  });
});
