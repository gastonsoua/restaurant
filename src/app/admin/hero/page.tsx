'use client';

import CrudInterface from '@/components/admin/CrudInterface';

const fields = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
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
    name: 'image',
    label: 'Background Image',
    type: 'file',
    required: true,
  },
  {
    name: 'active',
    label: 'Active',
    type: 'checkbox',
    required: false,
  }
];

export default function HeroPage() {
  return (
    <div>
      <CrudInterface
        title="Hero Section"
        endpoint="hero"
        fields={fields}
      />
    </div>
  );
}
