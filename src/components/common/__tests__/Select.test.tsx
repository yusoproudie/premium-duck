import { render, screen } from '../../../test-utils/render';
import { Select } from '../Select';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

describe('Select', () => {
  it('renders all options', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option B' })).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Select options={options} label="Category" />);
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Select options={options} error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('applies error styling when error prop provided', () => {
    render(<Select options={options} error="Error" />);
    expect(screen.getByRole('combobox')).toHaveClass('border-red-500');
  });
});
