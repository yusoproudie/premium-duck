import { useState } from 'react';
import type { TaskTemplate } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { TemplateCard } from '../components/templates/TemplateCard';
import { TemplateModal } from '../components/templates/TemplateModal';

const Templates = () => {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (template: TaskTemplate) => {
    setTemplates((prev) => [...prev, template]);
  };

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <PageHeader title="Templates" subtitle="Reusable task patterns" />
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)}>+ New template</Button>
        </div>

        {templates.length === 0 ? (
          <EmptyState message="No templates yet — create one to reuse common tasks quickly" />
        ) : (
          <div className="space-y-3">
            {templates.map((t) => (
              <TemplateCard key={t.id} template={t} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Templates;
