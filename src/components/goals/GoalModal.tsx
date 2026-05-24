import { useState } from 'react';
import type { Category, Goal, SubGoal } from '../../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  categories: Category[];
  initialGoal?: Goal;
}

const PERIODS = ['daily', 'weekly', 'monthly', 'yearly'] as const;

const emptyForm = (categories: Category[]) => ({
  name: '',
  description: '',
  categoryId: categories[0]?.id ?? '',
  period: 'monthly' as Goal['period'],
  deadline: '',
  repeats: false,
  subGoals: [] as SubGoal[],
});

export const GoalModal = ({ isOpen, onClose, onSave, categories, initialGoal }: GoalModalProps) => {
  const [form, setForm] = useState(() =>
    initialGoal
      ? {
          name: initialGoal.name,
          description: initialGoal.description ?? '',
          categoryId: initialGoal.categoryId,
          period: initialGoal.period,
          deadline: initialGoal.deadline ? initialGoal.deadline.toISOString().split('T')[0] : '',
          repeats: initialGoal.repeats,
          subGoals: initialGoal.subGoals,
        }
      : emptyForm(categories)
  );
  const [subGoalInput, setSubGoalInput] = useState('');
  const [nameError, setNameError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.name.trim()) {
      setNameError('Name is required');
      return;
    }
    const goal: Goal = {
      id: initialGoal?.id ?? crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description || undefined,
      categoryId: form.categoryId,
      period: form.period,
      deadline: form.deadline ? new Date(form.deadline) : undefined,
      repeats: form.repeats,
      subGoals: form.subGoals,
      status: initialGoal?.status ?? 'active',
      createdAt: initialGoal?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    onSave(goal);
    setForm(emptyForm(categories));
    setSubGoalInput('');
    setNameError('');
    onClose();
  };

  const addSubGoal = () => {
    if (!subGoalInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      subGoals: [
        ...prev.subGoals,
        { id: crypto.randomUUID(), text: subGoalInput.trim(), completed: false },
      ],
    }));
    setSubGoalInput('');
  };

  const removeSubGoal = (id: string) => {
    setForm((prev) => ({
      ...prev,
      subGoals: prev.subGoals.filter((sg) => sg.id !== id),
    }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-cozy-card rounded-xl p-6 w-full max-w-md mx-4 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-cozy-text-primary">
            {initialGoal ? 'Edit goal' : 'New goal'}
          </h2>
          <button
            onClick={onClose}
            className="text-cozy-text-secondary hover:text-cozy-text-primary"
            aria-label="close"
          >
            ✕
          </button>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label htmlFor="goal-name" className="text-sm font-medium text-cozy-text-secondary">
            Name
          </label>
          <input
            id="goal-name"
            type="text"
            value={form.name}
            onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setNameError(''); }}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          />
          {nameError && <p className="text-xs text-red-500">{nameError}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label htmlFor="goal-description" className="text-sm font-medium text-cozy-text-secondary">
            Description
          </label>
          <textarea
            id="goal-description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={2}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow resize-none"
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label htmlFor="goal-category" className="text-sm font-medium text-cozy-text-secondary">
            Category
          </label>
          <select
            id="goal-category"
            value={form.categoryId}
            onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Period */}
        <div className="space-y-1">
          <label htmlFor="goal-period" className="text-sm font-medium text-cozy-text-secondary">
            Period
          </label>
          <select
            id="goal-period"
            value={form.period}
            onChange={(e) => setForm((p) => ({ ...p, period: e.target.value as Goal['period'] }))}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Deadline */}
        <div className="space-y-1">
          <label htmlFor="goal-deadline" className="text-sm font-medium text-cozy-text-secondary">
            Deadline
          </label>
          <input
            id="goal-deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          />
        </div>

        {/* Repeats */}
        <div className="flex items-center gap-2">
          <input
            id="goal-repeats"
            type="checkbox"
            checked={form.repeats}
            onChange={(e) => setForm((p) => ({ ...p, repeats: e.target.checked }))}
            className="rounded border-cozy-border"
          />
          <label htmlFor="goal-repeats" className="text-sm text-cozy-text-secondary">
            Repeats
          </label>
        </div>

        {/* Sub-goals */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-cozy-text-secondary">Sub-goals</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Step..."
              value={subGoalInput}
              onChange={(e) => setSubGoalInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSubGoal()}
              className="flex-1 bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
            />
            <button
              onClick={addSubGoal}
              className="px-3 py-2 bg-cozy-hover text-cozy-text-primary text-sm rounded-lg hover:bg-cozy-border transition-colors"
            >
              Add
            </button>
          </div>
          {form.subGoals.map((sg) => (
            <div key={sg.id} className="flex items-center justify-between gap-2 text-sm text-cozy-text-secondary">
              <span>{sg.text}</span>
              <button
                aria-label="remove sub-goal"
                onClick={() => removeSubGoal(sg.id)}
                className="text-cozy-text-secondary hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-cozy-border text-sm text-cozy-text-secondary hover:bg-cozy-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-lg bg-cozy-yellow text-cozy-bg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Save goal
          </button>
        </div>
      </div>
    </div>
  );
};
