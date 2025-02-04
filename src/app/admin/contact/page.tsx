'use client';

import CrudInterface from '@/components/admin/CrudInterface';

export default function ContactSection() {
  return (
    <CrudInterface
      title="Contact Information Management"
      endpoint="contact"
      fields={[
        {
          name: 'address',
          label: 'Address',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          label: 'Email',
          type: 'text',
          required: true,
        },
        {
          name: 'workingHours',
          label: 'Working Hours',
          type: 'textarea',
          required: true,
        },
        {
          name: 'googleMapsLink',
          label: 'Google Maps Link',
          type: 'text',
          required: false,
        },
        {
          name: 'facebookLink',
          label: 'Facebook Link',
          type: 'text',
          required: false,
        },
        {
          name: 'instagramLink',
          label: 'Instagram Link',
          type: 'text',
          required: false,
        },
        {
          name: 'twitterLink',
          label: 'Twitter Link',
          type: 'text',
          required: false,
        },
      ]}
    />
  );
}
