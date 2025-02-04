'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ContentItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  additionalInfo?: {
    price?: number;
    hours?: string;
    phone?: string;
    address?: string;
  };
}

interface ContentEditorProps {
  section: string;
  fields: {
    name: string;
    type: 'text' | 'textarea' | 'number' | 'image' | 'price';
    label: string;
    required?: boolean;
  }[];
}

export default function ContentEditor({ section, fields }: ContentEditorProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, [section]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/content/section/${section}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch items');

      const data = await res.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const url = editingItem
        ? `http://localhost:5000/api/content/${editingItem._id}`
        : 'http://localhost:5000/api/content';

      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          ...Object.fromEntries(formData),
          order: items.length + 1
        }),
      });

      if (!res.ok) throw new Error('Failed to save item');

      fetchItems();
      setEditingItem(null);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/content/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete item');

      fetchItems();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </h3>

        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                required={field.required}
                defaultValue={editingItem?.[field.name as keyof ContentItem] as string}
                className="w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                rows={4}
              />
            ) : field.type === 'image' ? (
              <input
                type="file"
                name={field.name}
                accept="image/*"
                required={field.required && !editingItem?.imageUrl}
                className="w-full"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                defaultValue={editingItem?.[field.name as keyof ContentItem] as string}
                className="w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-3">
          {editingItem && (
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            {editingItem ? 'Update' : 'Add'} Item
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded-lg shadow">
            {item.imageUrl && (
              <div className="relative h-48 mb-4">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <h4 className="font-semibold">{item.title}</h4>
            {item.description && (
              <p className="text-gray-600 text-sm mt-2">{item.description}</p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setEditingItem(item)}
                className="px-3 py-1 text-sm text-teal-600 hover:text-teal-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
