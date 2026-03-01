import { render, screen } from '@testing-library/react';
import Payment_front from './Payment_front';


test('renders payment header', () => {
  render(<Payment_front />);
  const header = screen.getByText(/Proceed to Payment/i);
  expect(header).toBeInTheDocument();
});
