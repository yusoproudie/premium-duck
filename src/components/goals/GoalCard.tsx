import { format } from 'date-fns';
import type { Goal, Category } from '../../types';

interface GoalCardProps {
  goal: Goal;
  category: Category;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

export const GoalCard = ({ goal, category, onEdit, onDelete }: GoalCardProps) => {
  const completedSubGoals = goal.subGoals.filter((sg) => sg.completed).length;
  const totalSubGoals = goal.subGoals.length;
  const progressPercent = totalSubGoals > 0 ? (completedSubGoals / totalSubGoals) * 100 : 0;

  const handleDelete = () => {
    if (window.confirm(`Delete "${goal.name}"?`)) {
      onDelete(goal.id);
    }
  };

  return (
    <div className="bg-cozy-card rounded-xl p-5 border border-cozy-border space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl">{category.emoji}</span>
          <h3 className="font-semibold text-cozy-text-primary truncate">{goal.name}</h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            aria-label="edit"
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-lg text-cozy-text-secondary hover:text-cozy-text-primary hover:bg-cozy-hover transition-colors"
          >
            ✏️
          </button>
          <button
            aria-label="delete"
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-cozy-text-secondary hover:text-red-400 hover:bg-cozy-hover transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="text-sm text-cozy-text-secondary">{goal.description}</p>
      )}

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-cozy-hover text-cozy-text-secondary px-2 py-1 rounded-full capitalize">
          {goal.period}
        </span>
        {goal.deadline && (
          <span className="bg-cozy-hover text-cozy-text-secondary px-2 py-1 rounded-full">
            Due {format(goal.deadline, 'MMM d, yyyy')}
          </span>
        )}
      </div>

      {totalSubGoals > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-cozy-text-secondary">
            <span>{completedSubGoals}/{totalSubGoals}</span>
          </div>
          <div className="h-1.5 bg-cozy-hover rounded-full overflow-hidden">
            <div
              className="h-full bg-cozy-yellow rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
