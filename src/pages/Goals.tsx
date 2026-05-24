import { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { CategoryTabs } from '../components/goals/CategoryTabs';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalModal } from '../components/goals/GoalModal';
import { EmptyState } from '../components/common/EmptyState';
import type { Category, Goal } from '../types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'skills', name: 'Skills & Learning', emoji: '📚', section: 'head', isDefault: true },
  { id: 'work', name: 'Work & Career', emoji: '💼', section: 'head', isDefault: true },
  { id: 'health', name: 'Health & Wellness', emoji: '🌱', section: 'body', isDefault: true },
  { id: 'comm', name: 'Communication', emoji: '🗣️', section: 'body', isDefault: true },
  { id: 'finance', name: 'Finance', emoji: '💰', section: 'feet', isDefault: true },
  { id: 'relations', name: 'Relationships', emoji: '❤️', section: 'feet', isDefault: true },
];

const Goals = () => {
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORIES[0].id);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

  const filteredGoals = goals.filter((g) => g.categoryId === activeCategory);

  const handleSave = (goal: Goal) => {
    setGoals((prev) => {
      const exists = prev.find((g) => g.id === goal.id);
      return exists ? prev.map((g) => (g.id === goal.id ? goal : g)) : [...prev, goal];
    });
  };

  const handleDelete = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(undefined);
  };

  const getCategoryById = (id: string) =>
    DEFAULT_CATEGORIES.find((c) => c.id === id) ?? DEFAULT_CATEGORIES[0];

  return (
    <div>
      <PageHeader
        title="Goals"
        subtitle="Track your growth"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-cozy-yellow text-cozy-bg font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            + New goal
          </button>
        }
      />

      <CategoryTabs
        categories={DEFAULT_CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {filteredGoals.length === 0 ? (
        <EmptyState message="No goals yet. Add one to get started!" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              category={getCategoryById(goal.categoryId)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <GoalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        categories={DEFAULT_CATEGORIES}
        initialGoal={editingGoal}
      />
    </div>
  );
};

export default Goals;
