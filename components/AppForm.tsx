'use client';

import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { App, Widget, CreateApp } from '@/lib/schemas';

interface AppFormProps {
  app?: App | null;
  onClose: () => void;
}

const WIDGET_TYPES = [
  { value: 'text', label: 'Text Widget' },
  { value: 'counter', label: 'Counter Widget' },
  { value: 'todo', label: 'Todo Widget' },
  { value: 'weather', label: 'Weather Widget' },
  { value: 'chart', label: 'Chart Widget' },
] as const;

const EMOJI_OPTIONS = [
  '📱', '💻', '🌐', '📊', '📝', '🎵', '🎮', '📷', '🗂️', '⚙️',
  '🚀', '💡', '🔧', '📚', '🎨', '🏠', '🛒', '💰', '🎯', '⭐'
];

export default function AppForm({ app, onClose }: AppFormProps) {
  const [formData, setFormData] = useState<CreateApp>({
    name: '',
    icon: '📱',
    widgets: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name,
        icon: app.icon,
        widgets: app.widgets,
      });
    }
  }, [app]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = app ? `/api/apps/${app.id}` : '/api/apps';
      const method = app ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save app');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addWidget = () => {
    const newWidget: Widget = {
      id: nanoid(),
      type: 'text',
      config: {},
    };
    setFormData(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }));
  };

  const updateWidget = (index: number, updates: Partial<Widget>) => {
    setFormData(prev => ({
      ...prev,
      widgets: prev.widgets.map((widget, i) =>
        i === index ? { ...widget, ...updates } : widget
      ),
    }));
  };

  const removeWidget = (index: number) => {
    setFormData(prev => ({
      ...prev,
      widgets: prev.widgets.filter((_, i) => i !== index),
    }));
  };

  const updateWidgetConfig = (index: number, key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      widgets: prev.widgets.map((widget, i) =>
        i === index
          ? { ...widget, config: { ...widget.config, [key]: value } }
          : widget
      ),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {app ? 'App bearbeiten' : 'Neue App erstellen'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-10 gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                    className={`p-2 text-xl border rounded-md hover:bg-gray-50 ${
                      formData.icon === emoji
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Widgets</h3>
              <button
                type="button"
                onClick={addWidget}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                Widget hinzufügen
              </button>
            </div>

            <div className="space-y-4">
              {formData.widgets.map((widget, index) => (
                <div key={widget.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Widget {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeWidget(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Entfernen
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Widget Typ
                      </label>
                      <select
                        value={widget.type}
                        onChange={(e) => updateWidget(index, { 
                          type: e.target.value as Widget['type'],
                          config: {} // Reset config when type changes
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {WIDGET_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Konfiguration
                      </label>
                      {widget.type === 'text' && (
                        <input
                          type="text"
                          placeholder="Text eingeben..."
                          value={widget.config.text || ''}
                          onChange={(e) => updateWidgetConfig(index, 'text', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      {widget.type === 'counter' && (
                        <input
                          type="number"
                          placeholder="Startwert..."
                          value={widget.config.initialValue || 0}
                          onChange={(e) => updateWidgetConfig(index, 'initialValue', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      {widget.type === 'weather' && (
                        <input
                          type="text"
                          placeholder="Stadt eingeben..."
                          value={widget.config.city || ''}
                          onChange={(e) => updateWidgetConfig(index, 'city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      {(widget.type === 'todo' || widget.type === 'chart') && (
                        <input
                          type="text"
                          placeholder="Titel eingeben..."
                          value={widget.config.title || ''}
                          onChange={(e) => updateWidgetConfig(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {formData.widgets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Noch keine Widgets hinzugefügt</p>
                  <p className="text-sm">Klicken Sie auf "Widget hinzufügen" um zu beginnen</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors"
            >
              {loading ? 'Speichern...' : (app ? 'Aktualisieren' : 'Erstellen')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}