import type { GlobalConfig } from 'payload'

const ScheduleSettings: GlobalConfig = {
  slug: 'schedule-settings',
  label: 'Schedule Settings',
  fields: [
    { name: 'seasonLabel', type: 'text', label: 'Season Label' },
    { name: 'title', type: 'text', label: 'Section Title' },
    { name: 'record', type: 'text', label: 'Team Record' },
    {
      type: 'collapsible',
      label: 'Win Chip Styling',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'winChipBackgroundColor',
              type: 'text',
              label: 'Background Color',
              admin: {
                description: 'Background color for Win (W) outcome chips. Accepts hex or HSL.',
                components: { Field: '/src/components/ColorPickerField#default' },
                width: '50%',
              },
            },
            {
              name: 'winChipTextColor',
              type: 'text',
              label: 'Text Color',
              admin: {
                description: 'Text color for Win (W) outcome chips. Accepts hex or HSL.',
                components: { Field: '/src/components/ColorPickerField#default' },
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'games',
      type: 'array',
      label: 'Games',
      fields: [
        {
          name: 'dateTime',
          type: 'text',
          label: 'Date & Time',
          required: true,
          admin: {
            components: {
              Field: './src/components/admin/DateTimePickerField',
            },
          },
        },
        { name: 'opponent', type: 'text', required: true },
        {
          name: 'location',
          type: 'select',
          required: true,
          options: ['Home', 'Away'],
        },
        { name: 'status', type: 'select', required: true, options: ['final', 'upcoming'] },
        { name: 'result', type: 'text' },
        {
          name: 'outcome',
          type: 'select',
          options: ['W', 'L', 'T', 'BYE'],
        },
      ],
    },
  ],
}

export default ScheduleSettings
