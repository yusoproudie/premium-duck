import { useState } from 'react';
import type { TaskTemplate } from '../../types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: TaskTemplate) => void;
}

export const TemplateModal = ({ isOpen, onClose, onSave }: TemplateModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TaskTemplate['type']>('fixed');
  const [coins, setCoins] = useState(5);
  const [version, setVersion] = useState('1.0');
  const [nameError, setNameError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    const template: TaskTemplate = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      coins,
      version,
      createdAt: new Date(),
    };
    onSave(template);
    setName('');
    setType('fixed');
    setCoins(5);
    setVersion('1.0');
    setNameError('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-cozy-card rounded-xl p-6 w-full max-w-md mx-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-cozy-text-primary">New template</h2>
          <button
            onClick={onClose}
            aria-label="close"
            className="text-cozy-text-secondary hover:text-cozy-text-primary"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1">
          <label htmlFor="tmpl-name" className="text-sm font-medium text-cozy-text-secondary">
            Name
          </label>
          <input
            id="tmpl-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError(''); }}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          />
          {nameError && <p className="text-xs text-red-500">{nameError}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="tmpl-type" className="text-sm font-medium text-cozy-text-secondary">
            Type
          </label>
          <select
            id="tmpl-type"
            value={type}
            onChange={(e) => setType(e.target.value as TaskTemplate['type'])}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          >
            <option value="fixed">Fixed</option>
            <option value="time-based">Time-based</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="tmpl-coins" className="text-sm font-medium text-cozy-text-secondary">
            Coins
          </label>
          <input
            id="tmpl-coins"
            type="number"
            min={1}
            value={coins}
            onChange={(e) => setCoins(Number(e.target.value))}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="tmpl-version" className="text-sm font-medium text-cozy-text-secondary">
            Version
          </label>
          <input
            id="tmpl-version"
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          />
        </div>

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
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
