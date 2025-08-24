'use client';

import { useState, useEffect } from 'react';
import { App } from '@/lib/schemas';
import AppForm from './AppForm';

export default function AppList() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/apps');
      if (!response.ok) throw new Error('Failed to fetch apps');
      const data = await response.json();
      setApps(data.apps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('App wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/apps/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete app');
      
      await fetchApps(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete app');
    }
  };

  const handleEdit = (app: App) => {
    setEditingApp(app);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingApp(null);
    fetchApps(); // Refresh list after form closes
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800">Fehler: {error}</p>
        <button
          onClick={fetchApps}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Apps & Widgets</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Neue App
        </button>
      </div>

      {apps.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Keine Apps vorhanden
          </h3>
          <p className="text-gray-600 mb-6">
            Erstellen Sie Ihre erste App mit Widgets
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Erste App erstellen
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{app.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {app.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {app.widgets.length} Widget{app.widgets.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {app.widgets.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Widgets:</h4>
                  <div className="flex flex-wrap gap-2">
                    {app.widgets.map((widget) => (
                      <span
                        key={widget.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {widget.type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(app)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AppForm
          app={editingApp}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}