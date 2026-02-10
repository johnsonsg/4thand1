import type { GlobalConfig } from 'payload'

const ScheduleSettings: GlobalConfig = {
  slug: 'schedule-settings',
  label: 'Schedule Settings',
  fields: [
    { name: 'seasonLabel', label: 'Season Label', type: 'text' },
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'record', label: 'Record', type: 'text' },
    {
      name: 'games',
      label: 'Games',
      type: 'array',
      fields: [
        {
          name: 'dateTime',
          label: 'Date & Time',
          type: 'text',
          required: true,
          admin: {
            components: {
              Field: './src/components/admin/DateTimePickerField',
            },
          },
        },
        { name: 'opponent', label: 'Opponent', type: 'text', required: true },
        {
          name: 'location',
          label: 'Location',
          type: 'select',
          required: true,
          options: ['Home', 'Away'],
        },
        { name: 'status', label: 'Status', type: 'select', required: true, options: ['final', 'upcoming'] },
        { name: 'result', label: 'Score (ex: 42-0)', type: 'text' },
        {
          name: 'outcome',
          label: 'Outcome',
          type: 'select',
          options: ['W', 'L', 'T', 'BYE'],
        },
      ],
    },
  ],
}

export default ScheduleSettings
