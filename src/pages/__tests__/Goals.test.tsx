import { render, screen } from '../../test-utils/render';
import userEvent from '@testing-library/user-event';
import Goals from '../Goals';

describe('Goals Page', () => {
  // SR-26
  it('renders category tabs', () => {
    render(<Goals />);
    expect(screen.getByText('Work & Career')).toBeInTheDocument();
    expect(screen.getByText('Skills & Learning')).toBeInTheDocument();
  });

  it('renders "New goal" button', () => {
    render(<Goals />);
    expect(screen.getByRole('button', { name: /new goal/i })).toBeInTheDocument();
  });

  // SR-35
  it('shows empty state initially', () => {
    render(<Goals />);
    expect(screen.getByText(/no.*goals yet/i)).toBeInTheDocument();
  });

  it('opens modal when "New goal" clicked', async () => {
    const user = userEvent.setup();
    render(<Goals />);
    await user.click(screen.getByRole('button', { name: /new goal/i }));
    expect(screen.getByText('New goal')).toBeInTheDocument();
  });

  // SR-34
  it('filters goals by active category tab', async () => {
    const user = userEvent.setup();
    render(<Goals />);

    // สร้าง goal ใน Skills category (default active + modal default)
    await user.click(screen.getByRole('button', { name: /new goal/i }));
    await user.type(screen.getByLabelText(/name/i), 'Learn TypeScript');
    await user.click(screen.getByRole('button', { name: /save goal/i }));

    // switch tab ไป Health — goal ไม่ควรเห็น
    await user.click(screen.getByText('Health & Wellness'));
    expect(screen.queryByText('Learn TypeScript')).not.toBeInTheDocument();

    // switch กลับ Skills — ควรเห็น
    await user.click(screen.getByText('Skills & Learning'));
    expect(screen.getByText('Learn TypeScript')).toBeInTheDocument();
  });
});
