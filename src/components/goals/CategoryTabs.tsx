import type { Category } from '../../types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryTabs = ({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => {
        const isActive = cat.id === activeCategory;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-cozy-yellow text-cozy-bg'
                : 'bg-cozy-card text-cozy-text-secondary border border-cozy-border hover:text-cozy-text-primary'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
