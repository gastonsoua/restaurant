'use client';

import CrudInterface from '@/components/admin/CrudInterface';

export default function AboutSection() {
  return (
    <CrudInterface
      title="About Section Management"
      endpoint="about"
      fields={[
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
          required: false,
        },
        {
          name: 'content',
          label: 'Content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          label: 'Image',
          type: 'file',
          required: true,
        },
        {
          name: 'mission',
          label: 'Mission Statement',
          type: 'textarea',
          required: false,
        },
        {
          name: 'vision',
          label: 'Vision Statement',
          type: 'textarea',
          required: false,
        },
      ]}
    />
  );
}
