import { render, screen } from '../../../test-utils/render';
import userEvent from '@testing-library/user-event';
import { TemplateModal } from '../TemplateModal';

describe('TemplateModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.onClose.mockClear();
    defaultProps.onSave.mockClear();
  });

  // SR-47
  it('renders name input', () => {
    render(<TemplateModal {...defaultProps} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('renders type select with fixed and time-based options', () => {
    render(<TemplateModal {...defaultProps} />);
    expect(screen.getByRole('option', { name: /fixed/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /time-based/i })).toBeInTheDocument();
  });

  it('renders coins input', () => {
    render(<TemplateModal {...defaultProps} />);
    expect(screen.getByLabelText(/coins/i)).toBeInTheDocument();
  });

  it('calls onSave with correct data when submitted', async () => {
    const user = userEvent.setup();
    render(<TemplateModal {...defaultProps} />);
    await user.type(screen.getByLabelText(/name/i), 'Daily Standup');
    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(defaultProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Daily Standup' })
    );
  });

  it('does not call onSave when name is empty', async () => {
    const user = userEvent.setup();
    render(<TemplateModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });
});
