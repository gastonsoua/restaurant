'use client';

import CrudInterface from '@/components/admin/CrudInterface';

const fields = [
  {
    name: 'name',
    label: 'Dish Name',
    type: 'text',
    required: true,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: true,
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    required: true,
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'entrée', label: 'Entrée' },
      { value: 'plat principal', label: 'Plat Principal' },
      { value: 'dessert', label: 'Dessert' },
      { value: 'boisson', label: 'Boisson' },
    ],
    required: true,
  },
  {
    name: 'image',
    label: 'Dish Image',
    type: 'file',
    required: true,
  },
  {
    name: 'isAvailable',
    label: 'Available',
    type: 'checkbox',
    required: false,
  },
];

export default function MenuPage() {
  return (
    <div>
      <CrudInterface
        title="Menu Management"
        endpoint="menu"
        fields={fields}
      />
    </div>
  );
}
