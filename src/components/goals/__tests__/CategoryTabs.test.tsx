import { render, screen, fireEvent } from '../../../test-utils/render';
import { CategoryTabs } from '../CategoryTabs';
import type { Category } from '../../../types';

const mockCategories: Category[] = [
  { id: 'work', name: 'Work & Career', emoji: '💼', section: 'head', isDefault: true },
  { id: 'skills', name: 'Skills & Learning', emoji: '📚', section: 'head', isDefault: true },
  { id: 'health', name: 'Health & Wellness', emoji: '🌱', section: 'body', isDefault: true },
];

describe('CategoryTabs', () => {
  // SR-26
  it('renders all category tabs with emoji', () => {
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="work"
        onCategoryChange={vi.fn()}
      />
    );
    expect(screen.getByText('Work & Career')).toBeInTheDocument();
    expect(screen.getByText('Skills & Learning')).toBeInTheDocument();
    expect(screen.getByText('Health & Wellness')).toBeInTheDocument();
    expect(screen.getByText('💼')).toBeInTheDocument();
  });

  // SR-27
  it('applies active styling to active category', () => {
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="work"
        onCategoryChange={vi.fn()}
      />
    );
    const activeTab = screen.getByText('Work & Career').closest('button');
    expect(activeTab).toHaveClass('bg-cozy-yellow');
  });

  it('does not apply active styling to inactive categories', () => {
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="work"
        onCategoryChange={vi.fn()}
      />
    );
    const inactiveTab = screen.getByText('Skills & Learning').closest('button');
    expect(inactiveTab).not.toHaveClass('bg-cozy-yellow');
  });

  it('calls onCategoryChange with category id when tab clicked', () => {
    const handleChange = vi.fn();
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="work"
        onCategoryChange={handleChange}
      />
    );
    fireEvent.click(screen.getByText('Skills & Learning'));
    expect(handleChange).toHaveBeenCalledWith('skills');
  });
});
