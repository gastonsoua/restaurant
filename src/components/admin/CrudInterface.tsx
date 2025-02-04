'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface Props {
  title: string;
  endpoint: string;
  fields: Field[];
}

const initialFormState = (fields: Field[]) => {
  return fields.reduce((acc, field) => {
    if (field.type === 'checkbox') {
      acc[field.name] = false;
    } else if (field.type === 'number') {
      acc[field.name] = '';
    } else {
      acc[field.name] = '';
    }
    return acc;
  }, {} as Record<string, any>);
};

export default function CrudInterface({ title, endpoint, fields }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>(initialFormState(fields));
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchItems();
  }, []);

  useEffect(() => {
    // Reset form data when editing state changes
    if (!isEditing) {
      setFormData(initialFormState(fields));
      setImagePreview(null);
    }
  }, [isEditing, fields]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log(`Fetching from: http://localhost:5000/api/${endpoint}${endpoint === 'hero' ? '/all' : ''}`);
      
      const response = await fetch(`http://localhost:5000/api/${endpoint}${endpoint === 'hero' ? '/all' : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Server response:', text);
        throw new Error(`Failed to fetch items: ${response.status} ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Invalid content type:', contentType);
        console.error('Response text:', text);
        throw new Error('Server did not return JSON');
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
      toast.error(`Failed to load items: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/${endpoint}/${id}/activate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Failed to set active item');

      toast.success('Successfully set as active');
      fetchItems();
    } catch (err: any) {
      toast.error('Failed to set active item');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        setFormData(prev => ({ ...prev, [name]: fileInput.files![0] }));
        const previewUrl = URL.createObjectURL(fileInput.files[0]);
        setImagePreview(previewUrl);
      }
    } else if (type === 'checkbox') {
      const checkboxInput = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkboxInput.checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState(fields));
    setEditingItem(null);
    setIsEditing(false);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const form = new FormData();

      // Append all form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
          if (typeof formData[key] === 'boolean') {
            form.append(key, formData[key].toString());
          } else {
            form.append(key, formData[key]);
          }
        }
      });

      console.log('Submitting form data:', Object.fromEntries(form.entries()));

      const url = editingItem
        ? `http://localhost:5000/api/${endpoint}/${editingItem._id}`
        : `http://localhost:5000/api/${endpoint}`;

      const response = await fetch(url, {
        method: editingItem ? 'PATCH' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Failed to save item');
        } catch (e) {
          throw new Error(`Failed to save item: ${response.status} ${response.statusText}`);
        }
      }

      const result = await response.json();
      console.log('Save result:', result);

      toast.success(`Successfully ${editingItem ? 'updated' : 'created'} item`);
      resetForm();
      fetchItems();
    } catch (err: any) {
      console.error('Submit error:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    const editData = { ...item };
    delete editData._id;
    delete editData.__v;
    delete editData.createdAt;
    delete editData.updatedAt;
    editData.image = undefined; // Don't set the image in formData

    setEditingItem(item);
    setFormData(editData);
    setIsEditing(true);
    setImagePreview(`http://localhost:5000/${item.image}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log(`Deleting item with ID: ${id}`);

      const response = await fetch(`http://localhost:5000/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Failed to delete item');
        } catch (e) {
          throw new Error(`Failed to delete item: ${response.status} ${response.statusText}`);
        }
      }

      const result = await response.json();
      console.log('Delete result:', result);

      toast.success('Successfully deleted item');
      fetchItems();
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Add New
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit' : 'Create New'} {title}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={4}
                  />
                ) : field.type === 'file' ? (
                  <div>
                    <input
                      type="file"
                      name={field.name}
                      onChange={handleInputChange}
                      required={field.required && !editingItem}
                      accept="image/*"
                      className="mb-2"
                    />
                    {imagePreview && (
                      <div className="relative h-48 w-full mb-4">
                        <Image
                          src={imagePreview}
                          alt={`Preview of ${formData.name || 'uploaded image'}`}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={formData[field.name] || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    required={field.required}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                )}
              </div>
            ))}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No items found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {fields.map((field) => (
                  <th
                    key={field.name}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {field.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {fields.map((field) => (
                    <td key={field.name} className="px-6 py-4 whitespace-nowrap">
                      {field.type === 'file' ? (
                        item[field.name] && (
                          <div className="relative h-16 w-16">
                            <Image
                              src={`http://localhost:5000/${item[field.name]}`}
                              alt={`${field.label} for ${item.name || 'item'}`}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                        )
                      ) : field.type === 'checkbox' ? (
                        <span className={`px-2 py-1 text-sm rounded ${item[field.name] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item[field.name] ? 'Yes' : 'No'}
                        </span>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {typeof item[field.name] === 'boolean'
                            ? item[field.name]
                              ? 'Yes'
                              : 'No'
                            : item[field.name] || '-'}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        Edit
                      </button>
                      {endpoint === 'hero' && (
                        <button
                          onClick={() => handleSetActive(item._id)}
                          className={`${
                            item.active
                              ? 'text-green-600 hover:text-green-900'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {item.active ? 'Active' : 'Set Active'}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
