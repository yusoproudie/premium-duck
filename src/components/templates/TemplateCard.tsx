import type { TaskTemplate } from '../../types';

interface TemplateCardProps {
  template: TaskTemplate;
  onDelete: (id: string) => void;
}

export const TemplateCard = ({ template, onDelete }: TemplateCardProps) => {
  const handleDelete = () => {
    if (window.confirm(`Delete template "${template.name}"?`)) {
      onDelete(template.id);
    }
  };

  return (
    <div className="bg-cozy-card rounded-xl border-2 border-cozy-border p-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-cozy-text-primary truncate">{template.name}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-cozy-text-secondary">
          <span className="capitalize">{template.type}</span>
          <span>🪙 {template.coins}</span>
          <span>v{template.version}</span>
        </div>
      </div>
      <button
        aria-label="Delete template"
        onClick={handleDelete}
        className="text-cozy-text-secondary hover:text-red-400 transition-colors p-1 shrink-0"
      >
        🗑
      </button>
    </div>
  );
};
