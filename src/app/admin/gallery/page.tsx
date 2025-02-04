'use client';

import CrudInterface from '@/components/admin/CrudInterface';

export default function GallerySection() {
  return (
    <CrudInterface
      title="Gallery Management"
      endpoint="gallery"
      fields={[
        {
          name: 'title',
          label: 'Image Title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          options: [
            { value: 'interior', label: 'Interior' },
            { value: 'food', label: 'Food' },
            { value: 'events', label: 'Events' },
            { value: 'staff', label: 'Staff' },
          ],
          required: true,
        },
        {
          name: 'image',
          label: 'Image',
          type: 'file',
          required: true,
        },
      ]}
    />
  );
}
