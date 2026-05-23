import { render, screen, fireEvent } from '../../../test-utils/render';
import { Modal } from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('renders title correctly', () => {
    render(<Modal {...defaultProps} title="My Modal" />);
    expect(screen.getByText('My Modal')).toBeInTheDocument();
  });

  it('calls onClose when X button is clicked', () => {
    const handleClose = vi.fn();
    render(<Modal {...defaultProps} onClose={handleClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders children content', () => {
    render(
      <Modal {...defaultProps}>
        <p>Custom content</p>
      </Modal>
    );
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });
});
