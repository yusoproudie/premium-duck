import { render, screen } from '../test-utils/render';
import App from '../App';

test('renders without crashing', () => {
  render(<App />);
  expect(screen.getByText(/Premium Duck/i)).toBeInTheDocument();
});
